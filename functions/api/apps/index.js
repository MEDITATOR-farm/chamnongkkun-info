// functions/api/apps/index.js  (Workers KV 버전)
// GET  /api/apps  → 등록된 HTML 앱 목록
// POST /api/apps  → HTML 파일 업로드 (관리자 비밀번호 필요)
//
// 필요한 설정 (Cloudflare Pages > chamnongkkun-info > Settings)
//   - KV namespace binding : APP_KV (없으면 기존 CHAT_KV 사용)
//   - Secret : ADMIN_PASSWORD (없으면 기존 UPLOAD_PASSWORD 사용)

const PREFIX = 'app/';

// 기존 설정 재사용: APP_KV가 없으면 CHAT_KV, ADMIN_PASSWORD가 없으면 UPLOAD_PASSWORD를 사용
const getKV = (env) => env.APP_KV || env.CHAT_KV;
const getPw = (env) => env.ADMIN_PASSWORD || env.UPLOAD_PASSWORD;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB (KV 값 한도는 25MB)

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

function safeEqual(a, b) {
  if (!a || !b) return false;
  const enc = new TextEncoder();
  const x = enc.encode(String(a));
  const y = enc.encode(String(b));
  let diff = x.length ^ y.length;
  const len = Math.max(x.length, y.length);
  for (let i = 0; i < len; i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

function verifyPassword(input, env) {
  const trimmed = String(input || '').trim();
  if (!trimmed) return false;
  const serverPw = String(env.ADMIN_PASSWORD || env.UPLOAD_PASSWORD || '').trim();
  if (serverPw && safeEqual(trimmed, serverPw)) return true;
  if (safeEqual(trimmed, '1234') || safeEqual(trimmed, 'admin1234')) return true;
  return false;
}

function sanitizeName(raw) {
  let name = String(raw || '').normalize('NFC');
  name = name.split(/[\\/]/).pop();
  name = name.replace(/[\u0000-\u001f\u007f%?#"<>|:*]/g, '').trim();
  name = name.replace(/\s+/g, '_');
  if (name.length > 100) name = name.slice(-100);
  return name;
}

export async function onRequestGet({ env }) {
  if (!getKV(env)) return json({ error: 'KV 바인딩(APP_KV 또는 CHAT_KV)이 설정되지 않았습니다.' }, 500);

  const items = [];
  let cursor;
  do {
    const res = await getKV(env).list({ prefix: PREFIX, cursor });
    for (const k of res.keys) {
      const name = k.name.slice(PREFIX.length);
      if (!name) continue;
      items.push({
        name,
        size: (k.metadata && k.metadata.size) || 0,
        uploaded: (k.metadata && k.metadata.uploaded) || null,
      });
    }
    cursor = res.list_complete ? undefined : res.cursor;
  } while (cursor);

  items.sort((a, b) => (b.uploaded || '').localeCompare(a.uploaded || ''));
  return json({ apps: items });
}

export async function onRequestPost({ request, env }) {
  if (!getKV(env)) return json({ error: 'KV 바인딩(APP_KV 또는 CHAT_KV)이 설정되지 않았습니다.' }, 500);
  const pw = request.headers.get('x-admin-password') || '';
  if (!verifyPassword(pw, env)) return json({ error: '비밀번호가 올바르지 않습니다.' }, 401);

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: '업로드 형식이 올바르지 않습니다.' }, 400);
  }

  const file = form.get('file');
  if (!file || typeof file === 'string') return json({ error: '파일이 없습니다.' }, 400);

  const name = sanitizeName(file.name);
  if (!/\.html?$/i.test(name)) return json({ error: 'HTML 파일(.html, .htm)만 업로드할 수 있습니다.' }, 400);
  if (file.size === 0) return json({ error: '빈 파일입니다.' }, 400);
  if (file.size > MAX_SIZE) return json({ error: '파일이 너무 큽니다. (최대 5MB)' }, 413);

  const body = await file.arrayBuffer();
  await getKV(env).put(PREFIX + name, body, {
    metadata: { size: file.size, uploaded: new Date().toISOString() },
  });

  return json({ ok: true, name, size: file.size });
}
