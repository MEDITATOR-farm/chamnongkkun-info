'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type AppItem = {
  name: string;
  size: number;
  uploaded: string | null;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const formatDate = (iso: string | null) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AppsPage() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await fetch('/api/apps', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '앱 목록을 불러오지 못했습니다.');
      setApps(data.apps || []);
    } catch (e) {
      setLoadError(
        e instanceof Error
          ? `${e.message} (로컬 개발 환경에서는 Cloudflare KV API가 연결되지 않을 수 있습니다. 실제 배포 사이트에서 확인해 주세요.)`
          : '앱 목록을 불러오지 못했습니다.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async () => {
    if (!file) return setMessage({ type: 'err', text: '업로드할 HTML 파일(.html)을 선택해주세요.' });
    if (!password) return setMessage({ type: 'err', text: '관리자 비밀번호를 입력해주세요.' });

    setBusy(true);
    setMessage(null);
    try {
      const form = new FormData();
      form.append('file', file, file.name);
      form.append('name', file.name);
      const res = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '업로드에 실패했습니다.');
      setMessage({ type: 'ok', text: `🎉 업로드 완료: ${data.name}` });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await load();
    } catch (e) {
      setMessage({ type: 'err', text: e instanceof Error ? e.message : '업로드에 실패했습니다.' });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (name: string) => {
    if (!password) return setMessage({ type: 'err', text: '삭제하려면 위의 관리자 비밀번호를 먼저 입력해주세요.' });
    if (!window.confirm(`"${name}" 어플을 정말 삭제하시겠습니까?`)) return;

    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/apps/${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '삭제에 실패했습니다.');
      setMessage({ type: 'ok', text: `🗑️ 삭제 완료: ${name}` });
      await load();
    } catch (e) {
      setMessage({ type: 'err', text: e instanceof Error ? e.message : '삭제에 실패했습니다.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
      {/* ── 상단 네비게이션 ── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-20 px-6 md:px-12 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b border-primary/5">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="참농꾼 로고"
            className="h-10 w-auto object-contain transition-transform group-hover:scale-110 duration-300"
          />
          <span className="text-xl font-serif font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
            참농꾼
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-foreground/60 hover:text-primary transition-colors flex items-center gap-1"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </nav>

      {/* ── 본문 영역 ── */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-40">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-widest mb-4 uppercase">
            PLAYGROUND & REPOSITORY
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight mb-4">
            🧩 참농꾼 앱 놀이터
          </h1>
          <p className="text-base text-foreground/60 max-w-xl mx-auto leading-relaxed">
            직접 만든 웹 게임이나 유용한 미니 HTML 어플을 올리고, 브라우저에서 바로 실행하거나 내려받을 수 있는 자료실입니다.
          </p>
        </div>

        {/* 🌟 추천 공식 웹앱 카드 */}
        <section className="glass-nature rounded-3xl p-6 md:p-8 mb-10 border border-primary/10 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🌟</span>
            <h2 className="text-lg md:text-xl font-bold font-serif">추천 웹앱</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
              Official
            </span>
          </div>

          <div className="p-4 md:p-5 rounded-2xl bg-primary/[0.03] border border-primary/15 hover:border-primary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-serif font-black text-2xl flex items-center justify-center shrink-0">
                篆
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-foreground">해서 → 소전 변환기 (楷書 to 小篆)</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500">
                    웹앱 / 설치 지원
                  </span>
                </div>
                <p className="text-xs text-foreground/60 mt-1 leading-relaxed">
                  해서체 한자를 입력하면 유니코드 소전(小篆) 글자로 변환해주는 유용한 서예·한자 변환기입니다.
                </p>
                <div className="text-[11px] text-foreground/40 mt-1.5 font-mono">
                  meditator-farm.github.io/sojeon
                </div>
              </div>
            </div>

            <a
              href="https://meditator-farm.github.io/sojeon/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
            >
              <span>▶ 바로 실행하기</span>
              <span className="text-[10px]">↗</span>
            </a>
          </div>
        </section>

        {/* ① 업로드 카드 (관리자용) */}
        <section className="glass-nature rounded-3xl p-6 md:p-8 mb-10 border border-primary/10 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📤</span>
            <h2 className="text-lg md:text-xl font-bold font-serif">어플 업로드 (관리자)</h2>
          </div>
          <p className="text-xs text-foreground/50 mb-6">
            HTML 파일(.html, .htm)을 선택하고 관리자 비밀번호를 입력하여 웹사이트에 바로 등록하세요. (최대 5MB)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-foreground/70 mb-2">
                🔒 관리자 비밀번호
              </label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요 (1234 또는 관리자 암호)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background/50 focus:outline-none focus:border-primary text-sm transition-all"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground/70 mb-2">
                📄 HTML 어플 파일
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.htm,text/html"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full px-4 py-2.5 rounded-xl border border-primary/20 bg-background/50 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <span className="text-xs text-foreground/40">
              * 동일한 파일명으로 업로드하면 최신 파일로 자동 갱신됩니다.
            </span>
            <button
              onClick={upload}
              disabled={busy}
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              {busy ? '업로드 처리 중…' : '🚀 어플 업로드'}
            </button>
          </div>

          {message && (
            <div
              className={`mt-4 p-3 rounded-xl text-sm font-medium ${
                message.type === 'ok'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {message.text}
            </div>
          )}
        </section>

        {/* ② 등록된 어플 목록 카드 */}
        <section className="glass-nature rounded-3xl p-6 md:p-8 border border-primary/10 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">📦</span>
              <h2 className="text-lg md:text-xl font-bold font-serif">등록된 어플 목록</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {apps.length}개
              </span>
            </div>
            <button
              onClick={load}
              disabled={loading}
              className="text-xs text-foreground/60 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
            >
              🔄 새로고침
            </button>
          </div>

          {loading && (
            <div className="py-12 text-center text-foreground/40 text-sm">
              목록을 불러오는 중입니다...
            </div>
          )}

          {!loading && loadError && (
            <div className="py-8 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm leading-relaxed text-center">
              {loadError}
            </div>
          )}

          {!loading && !loadError && apps.length === 0 && (
            <div className="py-16 text-center text-foreground/40 text-sm">
              <p className="text-3xl mb-3">🎮</p>
              아직 등록된 어플이 없습니다. 위의 업로드 폼을 통해 첫 번째 어플을 등록해 보세요!
            </div>
          )}

          {!loading && apps.length > 0 && (
            <div className="divide-y divide-primary/10">
              {apps.map((app) => {
                const appUrl = `/api/apps/${encodeURIComponent(app.name)}`;
                return (
                  <div
                    key={app.name}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-primary/[0.02] transition-colors rounded-xl px-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-bold text-foreground break-all flex items-center gap-2">
                        <span>🕹️</span>
                        <span>{app.name}</span>
                      </div>
                      <div className="text-xs text-foreground/40 mt-1 flex items-center gap-2">
                        <span>용량: {formatSize(app.size)}</span>
                        <span>•</span>
                        <span>등록일: {formatDate(app.uploaded)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={appUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
                      >
                        ▶ 바로 실행
                      </a>
                      <a
                        href={`${appUrl}?download=1`}
                        className="px-3 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground/70 text-xs font-semibold transition-all flex items-center gap-1 active:scale-95"
                      >
                        ⬇ 다운로드
                      </a>
                      <button
                        onClick={() => remove(app.name)}
                        disabled={busy}
                        className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                      >
                        🗑 삭제
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
