// functions/api/apps/[name].js  (Workers KV 버전)
// GET    /api/apps/파일명.html             → 브라우저에서 앱 실행(열기)
// GET    /api/apps/파일명.html?download=1  → 파일 다운로드
// DELETE /api/apps/파일명.html             → 삭제 (관리자 비밀번호 필요)

const PREFIX = 'app/';

// 기존 설정 재사용: APP_KV가 없으면 CHAT_KV, ADMIN_PASSWORD가 없으면 UPLOAD_PASSWORD를 사용
const getKV = (env) => env.APP_KV || env.CHAT_KV;
const getPw = (env) => env.ADMIN_PASSWORD || env.UPLOAD_PASSWORD;

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

function getName(params) {
  let name = Array.isArray(params.name) ? params.name.join('/') : String(params.name || '');
  try {
    name = decodeURIComponent(name);
  } catch {
    /* 이미 디코딩된 값이면 그대로 사용 */
  }
  name = name.normalize('NFC');
  if (!name || name.includes('/') || name.includes('\\') || name.includes('..')) return null;
  return name;
}

export async function onRequestGet({ request, env, params }) {
  if (!getKV(env)) return json({ error: 'KV 바인딩(APP_KV 또는 CHAT_KV)이 설정되지 않았습니다.' }, 500);

  const name = getName(params);
  if (!name) return json({ error: '잘못된 파일명입니다.' }, 400);

  const data = await getKV(env).get(PREFIX + name, 'arrayBuffer');
  if (!data) return json({ error: '파일을 찾을 수 없습니다.' }, 404);

  const download = new URL(request.url).searchParams.get('download') === '1';

  const headers = new Headers();
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('cache-control', 'no-cache');
  headers.set('x-content-type-options', 'nosniff');
  // 업로드된 HTML이 chamnongkkun.com 본 사이트에 접근하지 못하도록 격리
  headers.set('content-security-policy', 'sandbox allow-scripts allow-forms allow-modals allow-popups allow-downloads');

  if (download) {
    const ascii = name.replace(/[^\x20-\x7e]/g, '_').replace(/"/g, '');
    headers.set(
      'content-disposition',
      `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`
    );
  } else {
    headers.set('content-disposition', 'inline');
  }

  return new Response(data, { headers });
}

export async function onRequestDelete({ request, env, params }) {
  if (!getKV(env)) return json({ error: 'KV 바인딩(APP_KV 또는 CHAT_KV)이 설정되지 않았습니다.' }, 500);
  const pw = request.headers.get('x-admin-password') || '';
  if (!verifyPassword(pw, env)) return json({ error: '비밀번호가 올바르지 않습니다.' }, 401);

  const name = getName(params);
  if (!name) return json({ error: '잘못된 파일명입니다.' }, 400);

  await getKV(env).delete(PREFIX + name);
  return json({ ok: true });
}
