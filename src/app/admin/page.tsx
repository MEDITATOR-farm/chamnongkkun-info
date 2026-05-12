"use client";

import React, { useState, useEffect, useRef } from "react";

interface Message {
  sender: "user" | "admin";
  text: string;
  timestamp?: number;
}

// GitHub 기본 설정
const GITHUB_OWNER = 'MEDITATOR-farm';
const GITHUB_REPO = 'chamnongkkun-info';
const GITHUB_BRANCH = 'main';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"poem" | "diary" | "file" | "chat">("poem");

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && ["poem", "diary", "file", "chat"].includes(hash)) {
        setActiveTab(hash as any);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const [ghToken, setGhToken] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPath, setUploadPath] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // --- 시 등록 관련 상태 (걷는 독서 디자인 버전) ---
  const [poemForm, setPoemForm] = useState({
    title: "",
    content: "적게 소유하고\n깊게 사랑하라",
    author: "박노해 시인",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000",
    opacity: 35, // 0~100 (어둡기)
  });
  const [isPoemSubmitting, setIsPoemSubmitting] = useState(false);
  const [poemList, setPoemList] = useState<any[]>([]);
  const [diaryList, setDiaryList] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [editType, setEditType] = useState<'poems'|'diaries'|null>(null);
  const [editForm, setEditForm] = useState({title:'',content:'',author:''});
  const [editImage, setEditImage] = useState<File|null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const editImageRef = useRef<HTMLInputElement>(null);

  const [listLoading, setListLoading] = useState(false);

  const loadList = async (type: 'poems' | 'diaries') => {
    if (!ghToken) return;
    setListLoading(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public/data/${type}.json`, { headers: { 'Authorization': `token ${ghToken}` } });
      if (res.ok) {
        const d = await res.json();
        const items = JSON.parse(decodeURIComponent(escape(atob(d.content.replace(/\n/g,'')))));
        if (type === 'poems') setPoemList(items);
        else setDiaryList(items);
      }
    } catch (e: any) { console.error('불러오기 실패:', e.message); }
    finally { setListLoading(false); }
  };

  useEffect(() => {
    if (!ghToken) return;
    if (activeTab === 'poem') loadList('poems');
    if (activeTab === 'diary') loadList('diaries');
  }, [activeTab, ghToken]);

  const handleDelete = async (type: 'poems' | 'diaries', id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    if (!ghToken) return alert('토큰을 설정해주세요.');
    setIsDeleting(`${type}-${id}`);
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public/data/${type}.json`, { headers: { 'Authorization': `token ${ghToken}` } });
      if (!res.ok) throw new Error('파일을 찾을 수 없습니다.');
      const d = await res.json();
      const items = JSON.parse(decodeURIComponent(escape(atob(d.content.replace(/\n/g,'')))));
      const filtered = items.filter((v: any) => v.id !== id);
      await commitToGithub(`data/${type}.json`, JSON.stringify(filtered, null, 2), `관리자: ${type} 항목 삭제 (ID:${id})`, false);
      if (type === 'poems') setPoemList(filtered);
      else setDiaryList(filtered);
      alert('✅ 삭제되었습니다.');
    } catch (e: any) { alert('❌ 삭제 실패: ' + e.message); }
    finally { setIsDeleting(null); }
  };

  const openEdit = (type: 'poems'|'diaries', item: any) => {
    setEditType(type);
    setEditItem(item);
    setEditForm({ title: item.title||'', content: item.content||'', author: item.author||'' });
    setEditImage(null);
  };

  const handleEdit = async () => {
    if (!editItem || !editType || !ghToken) return;
    setIsEditing(true);
    try {
      let newImagePath = editItem.image || editItem.imageUrl || '';
      if (editImage) {
        const imgPath = `uploads/${editType}_edit_${Date.now()}_${editImage.name}`;
        await commitToGithub(imgPath, await fileToBase64(editImage), `관리자: 수정 이미지 업로드`);
        newImagePath = `/${imgPath}`;
      }
      const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public/data/${editType}.json`, { headers: { 'Authorization': `token ${ghToken}` } });
      if (!res.ok) throw new Error('파일을 찾을 수 없습니다.');
      const d = await res.json();
      const items = JSON.parse(decodeURIComponent(escape(atob(d.content.replace(/\n/g,'')))));
      const now = new Date().toLocaleString('ko-KR');
      const updated = items.map((v:any) => {
        if (v.id !== editItem.id) return v;
        const history = v.editHistory || [];
        history.push({ date: now, note: '관리자 수정' });
        if (editType === 'poems') return { ...v, title: editForm.title, content: editForm.content, author: editForm.author, imageUrl: newImagePath, editHistory: history };
        return { ...v, title: editForm.title, content: editForm.content, image: newImagePath, editHistory: history };
      });
      await commitToGithub(`data/${editType}.json`, JSON.stringify(updated, null, 2), `관리자: ${editType} 항목 수정 (ID:${editItem.id})`, false);
      if (editType === 'poems') setPoemList(updated);
      else setDiaryList(updated);
      alert('✅ 수정 완료!');
      setEditItem(null); setEditType(null);
    } catch (e:any) { alert('❌ 수정 실패: ' + e.message); }
    finally { setIsEditing(false); }
  };

  const POEM_PRESETS = [
    { name: "명상(선)", url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000" },
    { name: "물방울", url: "https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&q=80&w=1000" },
    { name: "고요한 숲", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000" },
    { name: "바다의 아침", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000" },
    { name: "밤하늘 은하수", url: "https://images.unsplash.com/photo-1506318137071-a8e063b4b47e?auto=format&fit=crop&q=80&w=1000" },
    { name: "봄 벚꽃", url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80&w=1000" },
    { name: "연꽃 만개", url: "https://images.unsplash.com/photo-1502675135487-e971002a6adb?auto=format&fit=crop&q=80&w=1000" },
    { name: "가을 단풍", url: "https://images.unsplash.com/photo-1507181382277-02455ca4c23a?auto=format&fit=crop&q=80&w=1000" },
  ];

  // --- 농부일기 올리기 관련 상태 ---
  const [diaryForm, setDiaryForm] = useState({ title: "", content: "" });
  const [diaryImages, setDiaryImages] = useState<FileList | null>(null);
  const [diaryVideo, setDiaryVideo] = useState<File | null>(null);
  const [isDiarySubmitting, setIsDiarySubmitting] = useState(false);

  const diaryImageInputRef = useRef<HTMLInputElement>(null);
  const diaryVideoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("CHAMNONG_GH_TOKEN") || "";
    setGhToken(savedToken);
    setTempToken(savedToken);
  }, []);

  const handleSaveToken = () => {
    localStorage.setItem("CHAMNONG_GH_TOKEN", tempToken);
    setGhToken(tempToken);
    setShowSettings(false);
    alert("✅ 토큰이 저장되었습니다.");
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const commitToGithub = async (path: string, content: string, message: string, isBase64 = true) => {
    if (!ghToken) throw new Error("토큰이 없습니다.");
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public/${path}`;
    const getRes = await fetch(url, { headers: { 'Authorization': `token ${ghToken}` } });
    let sha = "";
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Authorization': `token ${ghToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        content: isBase64 ? content : btoa(unescape(encodeURIComponent(content))),
        sha: sha || undefined,
        branch: GITHUB_BRANCH
      })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }
  };

  const handlePoemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ghToken) return alert("토큰을 설정해주세요.");
    setIsPoemSubmitting(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public/data/poems.json`, {
        headers: { 'Authorization': `token ${ghToken}` }
      });
      let poems = [];
      if (res.ok) {
        const fileData = await res.json();
        poems = JSON.parse(decodeURIComponent(escape(atob(fileData.content.replace(/\n/g,'')))));
      }
      const newPoem = {
        id: Date.now(),
        ...poemForm,
        date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
      };
      const updatedPoems = [newPoem, ...poems];
      await commitToGithub('data/poems.json', JSON.stringify(updatedPoems, null, 2), "관리자: 새 시 등록 (걷는 독서 디자인)", false);
      alert("✅ 시가 성공적으로 등록되었습니다!");
      setPoemForm({ ...poemForm, title: "" });
    } catch (e: any) {
      alert("❌ 오류: " + e.message);
    } finally {
      setIsPoemSubmitting(false);
    }
  };

  const handleDiarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ghToken) return alert("토큰을 설정해주세요.");
    setIsDiarySubmitting(true);
    try {
      let imagePath = "";
      if (diaryImages && diaryImages.length > 0) {
        const file = diaryImages[0];
        imagePath = `uploads/diary_${Date.now()}_${file.name}`;
        await commitToGithub(imagePath, await fileToBase64(file), `관리자: 일기 이미지 업로드`);
      }
      let videoPath = "";
      if (diaryVideo) {
        videoPath = `uploads/diary_vid_${Date.now()}_${diaryVideo.name}`;
        await commitToGithub(videoPath, await fileToBase64(diaryVideo), `관리자: 일기 비디오 업로드`);
      }
      const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public/data/diaries.json`, {
        headers: { 'Authorization': `token ${ghToken}` }
      });
      let diaries = [];
      if (res.ok) {
        const fileData = await res.json();
        diaries = JSON.parse(decodeURIComponent(escape(atob(fileData.content.replace(/\n/g,'')))));
      }
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        title: diaryForm.title,
        content: diaryForm.content,
        image: imagePath ? `/${imagePath}` : "",
        video: videoPath ? `/${videoPath}` : ""
      };
      await commitToGithub('data/diaries.json', JSON.stringify([newEntry, ...diaries], null, 2), "관리자: 새 농부일기 등록", false);
      alert("✅ 농부일기가 등록되었습니다!");
      setDiaryForm({ title: "", content: "" });
      setDiaryImages(null);
      setDiaryVideo(null);
      if (diaryImageInputRef.current) diaryImageInputRef.current.value = "";
      if (diaryVideoInputRef.current) diaryVideoInputRef.current.value = "";
    } catch (e: any) {
      alert("❌ 오류: " + e.message);
    } finally {
      setIsDiarySubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return alert("파일을 선택해주세요.");
    setIsUploading(true);
    setUploadMessage("전송 중...");
    try {
      const base64 = await fileToBase64(uploadFile);
      const path = uploadPath.trim() || uploadFile.name;
      await commitToGithub(path, base64, `관리자: 파일 직접 업로드 (${path})`);
      setUploadMessage(`✅ 성공: ${path} 업로드 완료`);
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      setUploadMessage(`❌ 실패: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setPoemForm({ ...poemForm, imageUrl: `data:${e.target.files[0].type};base64,${base64}` });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <form onSubmit={(e) => { e.preventDefault(); if (password === "admin1234") setIsAuthenticated(true); else alert("비밀번호가 틀렸습니다."); }} className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">참농꾼 마스터 센터</h1>
            <p className="text-gray-400 text-xs mt-2 font-bold uppercase tracking-widest">Administrator Login</p>
          </div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="PASSWORD" className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-orange-500 transition-all font-bold" autoFocus />
          <button type="submit" className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl hover:bg-orange-600 shadow-xl shadow-orange-200 transition-all">접속하기</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans">
      <header className="bg-white px-8 py-4 shadow-sm flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black">M</div>
          <h1 className="font-black text-lg text-gray-800 tracking-tighter uppercase">Master Center</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowSettings(true)} className="text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors">⚙️ SETTINGS</button>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm font-bold text-red-400 hover:text-red-600 transition-colors">LOGOUT</button>
        </div>
      </header>

      {showSettings && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-md space-y-6 border border-white/20">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-800">GitHub 연동 설정</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-300 hover:text-gray-600 text-2xl">✕</button>
            </div>
            <div className="space-y-4">
              <input type="password" value={tempToken} onChange={(e) => setTempToken(e.target.value)} placeholder="GITHUB TOKEN (ghp_...)" className="w-full border-2 border-gray-50 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all" />
              <button onClick={handleSaveToken} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">저장하기</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/60 backdrop-blur-xl border-b border-gray-100 px-8 py-2 flex gap-8 overflow-x-auto">
        {(["poem", "diary", "file", "chat"] as const).map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); window.location.hash = tab; }} className={`py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? "text-orange-600" : "text-gray-400 hover:text-gray-600"}`}>
            {tab === "poem" ? "Poem Design" : tab === "diary" ? "Chronicle" : tab === "file" ? "Files" : "Chat"}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-full" />}
          </button>
        ))}
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto p-8 space-y-12 pb-40">
        
        {activeTab === "poem" && (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* 설정 영역 */}
            <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 space-y-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-800 tracking-tighter">걷는 독서 디자인</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest italic">Walking Reading Poem Designer</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">오늘의 싯구</label>
                  <textarea value={poemForm.content} onChange={e => setPoemForm({...poemForm, content: e.target.value})} rows={5} className="w-full border-2 border-gray-50 rounded-[24px] px-6 py-5 bg-gray-50 focus:border-orange-500 focus:bg-white transition-all font-serif text-lg leading-relaxed outline-none" placeholder="적게 소유하고 깊게 사랑하라"></textarea>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">배경 테마 (사진)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {POEM_PRESETS.map(preset => (
                      <button key={preset.name} onClick={() => setPoemForm({...poemForm, imageUrl: preset.url})} className={`px-2 py-3 rounded-xl border text-[10px] font-bold transition-all ${poemForm.imageUrl === preset.url ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'}`}>
                        {preset.name}
                      </button>
                    ))}
                  </div>
                  <label className="mt-4 flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-xs font-bold hover:bg-gray-50 cursor-pointer transition-all">
                    <span>📤 내 PC에서 사진 불러오기</span>
                    <input type="file" onChange={handleLocalImageUpload} className="hidden" accept="image/*" />
                  </label>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">배경 어둡기 (글자 가독성)</label>
                    <span className="text-[10px] font-black text-orange-600">{poemForm.opacity}%</span>
                  </div>
                  <input type="range" min="0" max="90" value={poemForm.opacity} onChange={e => setPoemForm({...poemForm, opacity: parseInt(e.target.value)})} className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-600" />
                </div>

                <button onClick={handlePoemSubmit} disabled={isPoemSubmitting} className="w-full bg-gray-800 text-white font-black py-6 rounded-[24px] hover:bg-black shadow-2xl transition-all text-xl mt-4">
                  {isPoemSubmitting ? "전송 중..." : "🚀 시 등록하기"}
                </button>
              </div>
            </div>

            {/* 프리뷰 영역 */}
            <div className="sticky top-12 space-y-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time Preview</span>
              </div>
              <div className="aspect-square w-full rounded-[48px] overflow-hidden shadow-2xl relative border-8 border-white group">
                <img src={poemForm.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 transition-opacity duration-300" style={{ backgroundColor: `rgba(0,0,0,${poemForm.opacity / 100})` }}></div>
                
                <div className="absolute inset-0 p-16 flex flex-col justify-center text-center text-white">
                  <div className="absolute top-12 left-12 text-[10px] opacity-40 font-bold tracking-widest">{new Date().toLocaleDateString()}</div>
                  <div className="absolute top-12 right-12 text-[10px] opacity-40 font-bold tracking-widest">출처 : {poemForm.author}</div>
                  
                  <div className="space-y-6">
                    {(poemForm.content || "").split("\n").map((line, idx) => (
                      <p key={idx} className="text-2xl md:text-3xl font-serif font-bold leading-relaxed drop-shadow-xl animate-revealUp">{line}</p>
                    ))}
                  </div>

                  <div className="absolute bottom-12 right-12 text-[10px] opacity-40 font-bold tracking-[0.3em] uppercase">Design by Chamnongkkun</div>
                </div>
              </div>
              <p className="text-center text-[10px] text-gray-400 font-medium">※ 실제 메인 페이지에 위 디자인 그대로 반영됩니다.</p>
            </div>
          </div>

          {/* 시 목록 + 삭제 */}
          <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-800">📜 등록된 시 ({poemList.length}편)</h3>
              <button onClick={() => loadList('poems')} className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-black hover:bg-orange-100 transition-all">🔄 새로고침</button>
            </div>
            {listLoading ? <p className="text-orange-500 text-sm text-center py-8 animate-pulse">불러오는 중...</p> : poemList.length === 0 ? <p className="text-gray-300 text-sm text-center py-8">토큰 설정 후 새로고침 해주세요</p> : (
              <div className="space-y-4">
                {poemList.map((p: any) => (
                  <div key={p.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-start gap-4">
                      {p.imageUrl && !p.imageUrl.startsWith('data:') && <img src={p.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-200" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-base text-gray-800">{p.title || '(제목없음)'}</p>
                        <p className="text-xs text-gray-400 mt-1">{p.author} · {p.date}</p>
                        {p.editHistory && <p className="text-[10px] text-blue-400 mt-0.5">✏️ 마지막 수정: {p.editHistory[p.editHistory.length-1]?.date}</p>}
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button onClick={() => openEdit('poems', p)} className="px-4 py-2 bg-blue-500 text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-all">✏️ 수정</button>
                        <button onClick={() => handleDelete('poems', p.id)} disabled={isDeleting === `poems-${p.id}`} className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-black hover:bg-red-600 transition-all">
                          {isDeleting === `poems-${p.id}` ? '삭제중...' : '🗑 삭제'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </>
        )}

        {activeTab === "diary" && (
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 max-w-3xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-gray-800 tracking-tighter">농부의 크로니클 등록</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Add Farmer's Chronicle Entry</p>
            </div>
            <form onSubmit={handleDiarySubmit} className="space-y-8">
              <input type="text" value={diaryForm.title} onChange={e => setDiaryForm({...diaryForm, title: e.target.value})} placeholder="글 제목 (예: 감자 수확하는 날)" className="w-full border-2 border-gray-50 rounded-[20px] px-6 py-4 bg-gray-50 focus:border-green-600 focus:bg-white outline-none font-bold" />
              <textarea value={diaryForm.content} onChange={e => setDiaryForm({...diaryForm, content: e.target.value})} rows={6} placeholder="오늘의 기록을 남겨주세요." className="w-full border-2 border-gray-50 rounded-[20px] px-6 py-4 bg-gray-50 focus:border-green-600 focus:bg-white outline-none leading-relaxed"></textarea>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">📷 사진 선택</label>
                  <input type="file" multiple ref={diaryImageInputRef} onChange={e => setDiaryImages(e.target.files)} className="w-full text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">🎥 비디오 선택</label>
                  <input type="file" ref={diaryVideoInputRef} onChange={e => setDiaryVideo(e.target.files ? e.target.files[0] : null)} className="w-full text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
              </div>
              
              <button type="submit" disabled={isDiarySubmitting} className="w-full bg-green-600 text-white font-black py-6 rounded-[24px] hover:bg-green-700 shadow-xl shadow-green-100 transition-all text-xl">
                {isDiarySubmitting ? "전송 중..." : "🌿 기록 완료"}
              </button>
            </form>

            {/* 일기 목록 + 삭제 */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-800">📔 등록된 일기 ({diaryList.length}건)</h3>
                <button onClick={() => loadList('diaries')} className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-black hover:bg-green-100 transition-all">🔄 새로고침</button>
              </div>
              {listLoading ? <p className="text-green-500 text-sm text-center py-6 animate-pulse">불러오는 중...</p> : diaryList.length === 0 ? <p className="text-gray-300 text-sm text-center py-6">토큰 설정 후 새로고침 해주세요</p> : (
                <div className="space-y-4">
                  {diaryList.map((d: any) => (
                    <div key={d.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-start gap-4">
                        {d.image ? <img src={d.image} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-gray-200" /> : <div className="w-20 h-20 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 text-2xl flex-shrink-0">📷</div>}
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-base text-gray-800">{d.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{d.date}</p>
                          {d.content && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{d.content.slice(0,80)}{d.content.length > 80 ? '...' : ''}</p>}
                          {d.editHistory && <p className="text-[10px] text-blue-400 mt-1">✏️ 마지막 수정: {d.editHistory[d.editHistory.length-1]?.date}</p>}
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button onClick={() => openEdit('diaries', d)} className="px-4 py-2 bg-blue-500 text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-all">✏️ 수정</button>
                          <button onClick={() => handleDelete('diaries', d.id)} disabled={isDeleting === `diaries-${d.id}`} className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-black hover:bg-red-600 transition-all">
                            {isDeleting === `diaries-${d.id}` ? '삭제중...' : '🗑 삭제'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "file" && (
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-gray-800 mb-8 uppercase tracking-widest">File Management</h2>
            <form onSubmit={handleFileUpload} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">경로 설정</label>
                <input type="text" value={uploadPath} onChange={e => setUploadPath(e.target.value)} placeholder="data/images/photo.jpg" className="w-full border-2 border-gray-50 rounded-xl px-4 py-3 bg-gray-50 outline-none" />
              </div>
              <input type="file" ref={fileInputRef} onChange={e => setUploadFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
              <button type="submit" disabled={isUploading} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all">
                {isUploading ? "업로드 중..." : "📂 업로드 실행"}
              </button>
              {uploadMessage && <p className="text-xs text-center font-bold text-blue-600">{uploadMessage}</p>}
            </form>
          </div>
        )}

      </main>

      {/* 수정 모달 */}
      {editItem && editType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => {setEditItem(null);setEditType(null);}}>
          <div className="bg-white rounded-[32px] p-8 w-full max-w-lg space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-800">✏️ {editType === 'poems' ? '시' : '일기'} 수정</h3>
              <button onClick={() => {setEditItem(null);setEditType(null);}} className="text-gray-300 hover:text-gray-600 text-2xl">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">제목</label>
                <input type="text" value={editForm.title} onChange={e=>setEditForm({...editForm,title:e.target.value})} className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">내용</label>
                <textarea value={editForm.content} onChange={e=>setEditForm({...editForm,content:e.target.value})} rows={5} className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500 leading-relaxed" />
              </div>
              {editType === 'poems' && (
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">작가</label>
                  <input type="text" value={editForm.author} onChange={e=>setEditForm({...editForm,author:e.target.value})} className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500" />
                </div>
              )}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">📷 사진 변경 (선택)</label>
                <input type="file" ref={editImageRef} accept="image/*" onChange={e=>setEditImage(e.target.files?e.target.files[0]:null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-600" />
                {(editItem.image || editItem.imageUrl) && !editImage && (
                  <p className="text-[10px] text-gray-400 mt-2">현재 이미지가 있습니다. 새 사진을 선택하면 교체됩니다.</p>
                )}
              </div>
              {editItem.editHistory && editItem.editHistory.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">수정 이력</p>
                  {editItem.editHistory.map((h:any,i:number) => (
                    <p key={i} className="text-[10px] text-gray-500">{h.date} - {h.note}</p>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleEdit} disabled={isEditing} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all text-lg">
              {isEditing ? '저장 중...' : '💾 수정 저장'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
