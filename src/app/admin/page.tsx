"use client";

import React, { useState, useEffect, useRef } from "react";
import exifr from 'exifr';

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
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"poem" | "diary" | "file" | "photo">("poem");

  useEffect(() => {
    // ✅ 세션 자동 로그인 체크 (30일 유효)
    const session = localStorage.getItem("CHAMNONG_ADMIN_SESSION");
    if (session) {
      const { expires } = JSON.parse(session);
      if (Date.now() < expires) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("CHAMNONG_ADMIN_SESSION"); // 만료 세션 삭제
      }
    }

    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && ["poem", "diary", "file", "photo"].includes(hash)) {
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
  const [showToken, setShowToken] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPath, setUploadPath] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // --- 시 등록 관련 상태 (걷는 독서 디자인 버전) ---
  const [poemForm, setPoemForm] = useState({
    content: "적게 소유하고\n깊게 사랑하라",
    author: "박노해 시인",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000",
    opacity: 40, // 0~100 (어둡기)
    fontSize: 24, // 기본 폰트 크기
    fontColor: "#ffffff", // 기본 폰트 색상
    fontFamily: "var(--font-nanum-myeongjo), serif", // 기본 폰트
  });
  const [isPoemSubmitting, setIsPoemSubmitting] = useState(false);
  const [poemList, setPoemList] = useState<any[]>([]);
  const [diaryList, setDiaryList] = useState<any[]>([]);
  const [photoList, setPhotoList] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [editType, setEditType] = useState<'poems'|'diaries'|'photos'|null>(null);
  const [editForm, setEditForm] = useState({content:'',author:'',title:'',location:''});
  const [editImage, setEditImage] = useState<File|null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const editImageRef = useRef<HTMLInputElement>(null);
  const [imageInfo, setImageInfo] = useState<{original: string, resized: string, w: number, h: number} | null>(null);

  const [listLoading, setListLoading] = useState(false);

  // --- 완성 이미지 파일 업로드 모드 ---
  const [poemMode, setPoemMode] = useState<'design' | 'upload'>('design');
  const [imageUploadForm, setImageUploadForm] = useState({ author: '박노해 시인' });
  const [imageUploadFile, setImageUploadFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isImageUploading, setIsImageUploading] = useState(false);
  const imageUploadInputRef = useRef<HTMLInputElement>(null);

  // --- 일상 사진 올리기 관련 상태 ---
  const [photoForm, setPhotoForm] = useState({ title: "", location: "" });
  const [photoImageFiles, setPhotoImageFiles] = useState<FileList | null>(null);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const photoImageInputRef = useRef<HTMLInputElement>(null);

  const loadList = async (type: 'poems' | 'diaries' | 'photos') => {
    if (!ghToken) return;
    setListLoading(true);
    try {
      const items = await fetchGithubJson(`data/${type}.json`);
      if (type === 'poems') setPoemList(items);
      else if (type === 'diaries') setDiaryList(items);
      else if (type === 'photos') setPhotoList(items);
    } catch (e: any) { console.error('불러오기 실패:', e.message); }
    finally { setListLoading(false); }
  };

  useEffect(() => {
    if (!ghToken) return;
    if (activeTab === 'poem') loadList('poems');
    if (activeTab === 'diary') loadList('diaries');
    if (activeTab === 'photo') loadList('photos');
  }, [activeTab, ghToken]);

  const handleDelete = async (type: 'poems' | 'diaries' | 'photos', id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    if (!ghToken) return alert('토큰을 설정해주세요.');
    setIsDeleting(`${type}-${id}`);
    try {
      const items = await fetchGithubJson(`data/${type}.json`);
      if (!items.length) throw new Error('파일을 불러올 수 없습니다.');
      const filtered = items.filter((v: any) => v.id !== id);
      await commitToGithub(`data/${type}.json`, JSON.stringify(filtered, null, 2), `관리자: ${type} 항목 삭제 (ID:${id})`, false);
      if (type === 'poems') setPoemList(filtered);
      else if (type === 'diaries') setDiaryList(filtered);
      else if (type === 'photos') setPhotoList(filtered);
      alert('✅ 삭제되었습니다.');
    } catch (e: any) { alert('❌ 삭제 실패: ' + e.message); }
    finally { setIsDeleting(null); }
  };

  const openEdit = (type: 'poems'|'diaries'|'photos', item: any) => {
    setEditType(type);
    setEditItem(item);
    setEditForm({ 
      title: item.title || '', 
      content: item.content || '', 
      author: item.author || '',
      location: item.location || ''
    } as any);
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
        newImagePath = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public/${imgPath}`;
      }
      const items = await fetchGithubJson(`data/${editType}.json`);
      if (!items.length) throw new Error('파일을 불러올 수 없습니다.');
      const now = new Date().toLocaleString('ko-KR');
      const updated = items.map((v:any) => {
        if (v.id !== editItem.id) return v;
        const history = v.editHistory || [];
        history.push({ date: now, note: '관리자 수정' });
        
        const updatedItem = { 
          ...v, 
          title: (editForm as any).title, 
          content: editForm.content, 
          author: editForm.author,
          location: editForm.location,
          editHistory: history 
        };

        if (editType === 'poems' || editType === 'photos') {
          updatedItem.imageUrl = newImagePath;
        } else {
          updatedItem.image = newImagePath;
        }
        return updatedItem;
      });
      await commitToGithub(`data/${editType}.json`, JSON.stringify(updated, null, 2), `관리자: ${editType} 항목 수정 (ID:${editItem.id})`, false);
      if (editType === 'poems') setPoemList(updated);
      else if (editType === 'diaries') setDiaryList(updated);
      else if (editType === 'photos') setPhotoList(updated);
      alert('✅ 수정 완료!');
      setEditItem(null); setEditType(null);
    } catch (e:any) { alert('❌ 수정 실패: ' + e.message); }
    finally { setIsEditing(false); }
  };

  const handleDownloadImage = () => {
    if (!poemForm.imageUrl) {
      alert("이미지가 없습니다.");
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = poemForm.imageUrl;

    img.onload = () => {
      // 1:1 고해상도 비율 (1200x1200)
      canvas.width = 1200;
      canvas.height = 1200;

      // 1. 배경 이미지 그리기 (비율에 맞춰 채우기)
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // 2. 어둡기 오버레이 적용
      ctx.fillStyle = `rgba(0, 0, 0, ${poemForm.opacity / 100})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. 텍스트 설정
      ctx.fillStyle = poemForm.fontColor || "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // 줄바꿈 처리
      const lines = poemForm.content.split('\n');
      const baseFontSize = poemForm.fontSize || 24;
      const fontSize = baseFontSize * 1.5; // 캔버스 1200 크기에 맞게 스케일업
      const lineHeight = fontSize * 1.6;
      const totalHeight = lines.length * lineHeight;
      let startY = (canvas.height - totalHeight) / 2;

      let fontName = "Noto Serif KR, serif";
      if (poemForm.fontFamily?.includes("nanum-myeongjo")) fontName = "Nanum Myeongjo, serif";
      else if (poemForm.fontFamily?.includes("geist-sans") || poemForm.fontFamily?.includes("sans-serif")) fontName = "sans-serif";

      ctx.font = `500 ${fontSize}px ${fontName}`;
      lines.forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, startY + (i * lineHeight) + (lineHeight / 2));
      });

      // 4. 작가 정보 (하단)
      if (poemForm.author) {
        ctx.font = `300 24px "Noto Serif KR", serif`;
        ctx.fillText(`${poemForm.author}`, canvas.width / 2, canvas.height - 100);
      }

      // 5. 다운로드 실행
      const link = document.createElement('a');
      link.download = `chamnongkkun_poem_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.onerror = () => {
      alert("이미지를 불러오는 데 실패했습니다. 외부 이미지의 경우 보안 정책에 의해 다운로드가 제한될 수 있습니다.");
    };
  };

  const POEM_PRESETS = [
    { name: "물방울", url: "https://images.unsplash.com/photo-1444090542259-0af8fa96557e?auto=format&fit=crop&q=80&w=1000" },
    { name: "고요한 숲", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000" },
    { name: "바다의 아침", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000" },
    { name: "밤하늘 은하수", url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1000" },
    { name: "봄 벚꽃", url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80&w=1000" },
    { name: "연꽃 만개", url: "https://images.unsplash.com/photo-1502675135487-e971002a6adb?auto=format&fit=crop&q=80&w=1000" },
    { name: "들꽃 벌판", url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=1000" },
  ];

  // --- 농부일기 올리기 관련 상태 ---
  const [diaryForm, setDiaryForm] = useState({ title: "", content: "" });
  const [diaryImages, setDiaryImages] = useState<FileList | null>(null);
  const [diaryVideo, setDiaryVideo] = useState<File | null>(null);
  const [diaryPreviewImages, setDiaryPreviewImages] = useState<string[]>([]);
  const [diaryPreviewVideo, setDiaryPreviewVideo] = useState<string>("");
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

  // ✅ 공통 함수: GitHub에서 JSON 파일 읽기 (1MB 초과 자동 처리)
  const fetchGithubJson = async (path: string): Promise<any[]> => {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public/${path}`;
    const res = await fetch(url, { headers: { 'Authorization': `token ${ghToken}` } });
    if (!res.ok) return [];
    const d = await res.json();
    if (d.content) {
      // 1MB 이하: GitHub가 base64로 직접 줌
      return JSON.parse(decodeURIComponent(escape(atob(d.content.replace(/\n/g,'')))));
    } else if (d.download_url) {
      // 1MB 초과: 별도 URL로 직접 다운로드
      const raw = await fetch(d.download_url);
      return await raw.json();
    }
    return [];
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
      let finalImageUrl = poemForm.imageUrl;
      
      // 로컬 PC에서 업로드한 이미지(Base64)인 경우 GitHub에 실제 이미지로 업로드
      if (finalImageUrl && finalImageUrl.startsWith("data:image")) {
        const base64Data = finalImageUrl.split(',')[1];
        const imgPath = `uploads/poem_bg_${Date.now()}.jpg`;
        await commitToGithub(imgPath, base64Data, `관리자: 시 배경 이미지 업로드`);
        finalImageUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public/${imgPath}`;
      }

      const poems = await fetchGithubJson('data/poems.json');
      const newPoem = {
        id: Date.now(),
        ...poemForm,
        imageUrl: finalImageUrl,
        date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
      };
      const updatedPoems = [newPoem, ...poems];
      await commitToGithub('data/poems.json', JSON.stringify(updatedPoems, null, 2), "관리자: 새 시 등록 (디자인)", false);
      alert("✅ 시가 성공적으로 등록되었습니다!");
      setPoemForm({ ...poemForm });
    } catch (e: any) {
      alert("❌ 오류: " + e.message);
    } finally {
      setIsPoemSubmitting(false);
    }
  };

  // ✅ 완성 이미지 파일 시 등록 핸들러
  const handleImagePoemSubmit = async () => {
    if (!ghToken) return alert('토큰을 설정해주세요.');
    if (!imageUploadFile) return alert('이미지 파일을 선택해주세요.');
    setIsImageUploading(true);
    try {
      // 1) 이미지 리사이즈 후 GitHub에 업로드
      const resized = await resizeImage(imageUploadFile, 1200);
      const base64 = resized.dataUrl.split(',')[1];
      const imgPath = `uploads/poem_img_${Date.now()}_${imageUploadFile.name.replace(/\s/g, '_')}`;
      await commitToGithub(imgPath, base64, `관리자: 완성 시 이미지 업로드`);
      // 2) poems.json에 항목 추가
      const poems = await fetchGithubJson('data/poems.json');
      const newPoem = {
        id: Date.now(),
        author: imageUploadForm.author,
        imageUrl: `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public/${imgPath}`,
        opacity: 0,
        date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        type: 'image',
      };
      await commitToGithub('data/poems.json', JSON.stringify([newPoem, ...poems], null, 2), '관리자: 완성 이미지 시 등록', false);
      alert('✅ 완성 이미지 시가 등록되었습니다!');
      setImageUploadForm({ author: '박노해 시인' });
      setImageUploadFile(null);
      setImagePreview('');
      if (imageUploadInputRef.current) imageUploadInputRef.current.value = '';
      await loadList('poems');
    } catch (e: any) {
      alert('❌ 오류: ' + e.message);
    } finally {
      setIsImageUploading(false);
    }
  };

  const handlePhotoSubmit = async () => {
    if (!ghToken) return alert('토큰을 설정해주세요.');
    if (!photoImageFiles || photoImageFiles.length === 0) return alert('사진 파일을 선택해주세요.');
    setIsPhotoUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < photoImageFiles.length; i++) {
        const file = photoImageFiles[i];
        const resized = await resizeImage(file, 1200);
        const base64 = resized.dataUrl.split(',')[1];
        const imgPath = `uploads/photo_${Date.now()}_${i}_${file.name.replace(/\s/g, '_')}`;
        await commitToGithub(imgPath, base64, `관리자: 일상 사진 ${i+1} 업로드`);
        uploadedUrls.push(`https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public/${imgPath}`);
      }

      const photos = await fetchGithubJson('data/photos.json');
      const newPhoto = {
        id: Date.now(),
        title: photoForm.title,
        imageUrl: uploadedUrls[0],
        imageUrls: uploadedUrls,
        date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        location: photoForm.location || ""
      };
      await commitToGithub('data/photos.json', JSON.stringify([newPhoto, ...photos], null, 2), '관리자: 일상 사진 등록', false);
      alert('✅ 일상 사진이 등록되었습니다!');
      setPhotoForm({ title: "", location: "" });
      setPhotoImageFiles(null);
      photoPreviews.forEach(url => URL.revokeObjectURL(url));
      setPhotoPreviews([]);
      if (photoImageInputRef.current) photoImageInputRef.current.value = "";
    } catch (e: any) {
      alert('❌ 오류: ' + e.message);
    } finally {
      setIsPhotoUploading(false);
    }
  };

  const handleDiaryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDiaryImages(e.target.files);
      const urls = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setDiaryPreviewImages(urls);
    }
  };

  const handleDiaryVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDiaryVideo(file);
      setDiaryPreviewVideo(URL.createObjectURL(file));
    }
  };

  const handleDiarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ghToken) return alert("토큰을 설정해주세요.");
    setIsDiarySubmitting(true);
    try {
      let imagePath = "";
      const uploadedImagePaths: string[] = [];
      if (diaryImages && diaryImages.length > 0) {
        for (let i = 0; i < diaryImages.length; i++) {
          const file = diaryImages[i];
          const path = `uploads/diary_${Date.now()}_${i}_${file.name.replace(/\s/g, '_')}`;
          await commitToGithub(path, await fileToBase64(file), `관리자: 일기 이미지 ${i+1} 업로드`);
          const fullPath = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public/${path}`;
          uploadedImagePaths.push(fullPath);
          if (i === 0) imagePath = fullPath;
        }
      }
      let videoPath = "";
      if (diaryVideo) {
        videoPath = `uploads/diary_vid_${Date.now()}_${diaryVideo.name}`;
        await commitToGithub(videoPath, await fileToBase64(diaryVideo), `관리자: 일기 비디오 업로드`);
      }
      const diaries = await fetchGithubJson('data/diaries.json');
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        title: diaryForm.title,
        content: diaryForm.content,
        image: imagePath,
        images: uploadedImagePaths,
        video: videoPath ? `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public/${videoPath}` : ""
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
      // 프리뷰 URL 정리
      diaryPreviewImages.forEach(url => URL.revokeObjectURL(url));
      if (diaryPreviewVideo) URL.revokeObjectURL(diaryPreviewVideo);
      setDiaryPreviewImages([]);
      setDiaryPreviewVideo("");
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

  // 이미지를 최대 maxWidth 픽셀로 리사이즈해서 dataURL로 반환
  const resizeImage = (file: File, maxWidth: number): Promise<{dataUrl: string, size: number, width: number, height: number}> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        URL.revokeObjectURL(url);
        resolve({ dataUrl, size: Math.round(dataUrl.length * 0.75), width: w, height: h });
      };
      img.src = url;
    });
  };

  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const originalKB = (file.size / 1024).toFixed(0);
      const resized = await resizeImage(file, 1200);
      setPoemForm({ ...poemForm, imageUrl: resized.dataUrl });
      setImageInfo({
        original: `${originalKB}KB`,
        resized: `${(resized.size / 1024).toFixed(0)}KB`,
        w: resized.width,
        h: resized.height,
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (password === "admin1234") {
            // ✅ 30일짜리 세션 저장
            localStorage.setItem("CHAMNONG_ADMIN_SESSION", JSON.stringify({
              expires: Date.now() + 30 * 24 * 60 * 60 * 1000
            }));
            setIsAuthenticated(true);
          } else {
            alert("비밀번호가 틀렸습니다.");
          }
        }} className="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">참농꾼 마스터 센터</h1>
            <p className="text-gray-400 text-xs mt-2 font-bold uppercase tracking-widest">Administrator Login</p>
          </div>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="PASSWORD" className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 pr-14 outline-none focus:border-orange-500 transition-all font-bold" autoFocus />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors text-xl select-none" tabIndex={-1}>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl hover:bg-orange-600 shadow-xl shadow-orange-200 transition-all">접속하기</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans">
      <header className="bg-white px-4 md:px-8 py-3 shadow-sm flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black">M</div>
          <h1 className="font-black text-base md:text-lg text-gray-800 tracking-tighter uppercase">Master Center</h1>
        </div>
        <div className="flex gap-2 md:gap-4">
          <button onClick={() => setShowSettings(true)} className="text-xs md:text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors px-2 py-1">⚙️ 설정</button>
          <button onClick={() => {
            localStorage.removeItem("CHAMNONG_ADMIN_SESSION");
            setIsAuthenticated(false);
          }} className="text-xs md:text-sm font-bold text-red-400 hover:text-red-600 transition-colors px-2 py-1">로그아웃</button>
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
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  value={tempToken}
                  onChange={(e) => setTempToken(e.target.value)}
                  placeholder="GITHUB TOKEN (ghp_...)"
                  className="w-full border-2 border-gray-50 rounded-2xl px-6 py-4 pr-14 outline-none focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors text-xl select-none"
                  tabIndex={-1}
                  title={showToken ? "토큰 숨기기" : "토큰 보기"}
                >
                  {showToken ? "🙈" : "👁️"}
                </button>
              </div>
              <button onClick={handleSaveToken} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">저장하기</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/60 backdrop-blur-xl border-b border-gray-100 px-2 md:px-8 py-0 flex overflow-x-auto">
        {(["poem", "diary", "photo", "file"] as const).map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); window.location.hash = tab; }} className={`py-3 px-3 md:px-0 md:mr-8 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab ? "text-orange-600" : "text-gray-400 hover:text-gray-600"}`}>
            {tab === "poem" ? "📝 시 등록" : tab === "diary" ? "📔 일기" : tab === "photo" ? "📸 나의 일상" : "📂 파일"}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-full" />}
          </button>
        ))}
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto p-3 md:p-8 space-y-6 md:space-y-12 pb-24">
        
        {activeTab === "poem" && (
          <>
          {/* 모드 전환 탭 */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setPoemMode('design')}
              className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${
                poemMode === 'design'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                  : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              🎨 직접 디자인하기
            </button>
            <button
              onClick={() => setPoemMode('upload')}
              className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${
                poemMode === 'upload'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                  : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              🖼️ 완성 이미지 올리기
            </button>
          </div>

          {/* ===== 완성 이미지 업로드 폼 ===== */}
          {poemMode === 'upload' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-xl border border-gray-100 space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-gray-800 tracking-tighter">완성 이미지 등록</h2>
                      <p className="text-gray-400 text-xs font-bold mt-1">밖에서 만든 시 카드 이미지를 그대로 올릴 수 있어요</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">작가 / 출처</label>
                        <input
                          type="text"
                          value={imageUploadForm.author}
                          onChange={e => setImageUploadForm({...imageUploadForm, author: e.target.value})}
                          placeholder="박노해 시인"
                          className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">이미지 파일 선택 (필수)</label>
                        <input
                          type="file"
                          accept="image/*"
                          ref={imageUploadInputRef}
                          className="w-full text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setImageUploadFile(file);
                            const url = URL.createObjectURL(file);
                            setImagePreview(url);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 완성 이미지 프리뷰 + 등록 버튼 */}
                  <div className="sticky top-12 space-y-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">완성 이미지 미리보기</span>
                    </div>
                    
                    <div className="bg-white p-6 rounded-[32px] shadow-2xl border border-gray-100 font-serif">
                      <div className="mb-4 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <span>{new Date().toLocaleDateString('ko-KR')}</span>
                        <span>출처: {imageUploadForm.author || "작가 미상"}</span>
                      </div>
                      
                      <div className="relative w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 aspect-square sm:aspect-auto sm:min-h-[400px]">
                        {imagePreview ? (
                          <img src={imagePreview} alt="미리보기" className="w-full h-full object-contain" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                            <span className="text-4xl mb-2">🖼️</span>
                            <p className="text-xs font-bold">이미지를 선택하면 여기에 표시됩니다</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleImagePoemSubmit}
                      disabled={isImageUploading || !imageUploadFile}
                      className="w-full bg-purple-600 text-white font-black py-5 rounded-[24px] hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isImageUploading ? '업로드 중... ⏳' : '🚀 완성 이미지 등록하기'}
                    </button>
                    
                    <p className="text-center text-[10px] text-gray-400 font-medium italic">※ 실제 사이트에서는 위 이미지가 크게 노출됩니다.</p>
                  </div>
              </div>
          )}

          {/* ===== 디자인 모드 폼 ===== */}
          {poemMode === 'design' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* 설정 영역 (1~4번) */}
            <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-xl border border-gray-100 space-y-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-800 tracking-tighter">🎨 시 디자인하기</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest italic">Walking Reading Poem Designer</p>
              </div>

              <div className="space-y-10">
                {/* 1. 오늘의 싯구 */}
                <div>
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px]">1</span> 
                    오늘의 싯구
                  </label>
                  <textarea value={poemForm.content} onChange={e => setPoemForm({...poemForm, content: e.target.value})} rows={5} className="w-full border-2 border-gray-50 rounded-[24px] px-6 py-5 bg-gray-50 focus:border-orange-500 focus:bg-white transition-all font-serif text-lg leading-relaxed outline-none" placeholder="적게 소유하고 깊게 사랑하라"></textarea>
                </div>

                {/* 2. 배경 테마 */}
                <div>
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px]">2</span> 
                    배경 테마 선택
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {POEM_PRESETS.map(preset => (
                      <button key={preset.name} onClick={() => setPoemForm({...poemForm, imageUrl: preset.url})} className={`px-2 py-3 rounded-xl border text-[10px] font-bold transition-all ${poemForm.imageUrl === preset.url ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'}`}>
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. 내 PC에서 사진 불러오기 */}
                <div>
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px]">3</span> 
                    나만의 배경 업로드
                  </label>
                  <label className="flex items-center justify-center gap-2 w-full py-5 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 text-xs font-black hover:border-orange-300 hover:bg-orange-50/30 cursor-pointer transition-all">
                    <span className="text-lg">📤</span> 내 PC에서 사진 불러오기
                    <input type="file" onChange={handleLocalImageUpload} className="hidden" accept="image/*" />
                  </label>
                </div>

                {/* 4. 글꼴, 색상, 크기 선택 추가 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px]">4</span> 
                      글꼴 선택
                    </label>
                    <select value={poemForm.fontFamily} onChange={e => setPoemForm({...poemForm, fontFamily: e.target.value})} className="w-full border-2 border-gray-50 rounded-xl px-4 py-3 bg-gray-50 outline-none focus:border-orange-500 transition-all text-xs font-bold">
                      <option value="var(--font-nanum-myeongjo), serif">명조체 (감성적인 느낌)</option>
                      <option value="var(--font-geist-sans), sans-serif">고딕체 (깔끔한 느낌)</option>
                      <option value="system-ui, sans-serif">기본체 (모던한 느낌)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px]">5</span> 
                      글자 크기 ({poemForm.fontSize}px)
                    </label>
                    <input type="range" min="16" max="60" value={poemForm.fontSize} onChange={e => setPoemForm({...poemForm, fontSize: parseInt(e.target.value)})} className="w-full h-2 mt-4 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-600" />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px]">6</span> 
                      글자 색상
                    </label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={poemForm.fontColor} onChange={e => setPoemForm({...poemForm, fontColor: e.target.value})} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                      <span className="text-xs font-bold text-gray-500 uppercase">{poemForm.fontColor}</span>
                    </div>
                  </div>
                </div>

                {/* 5. 배경 어둡기 */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px]">7</span> 
                      배경 어둡기 (가독성 조절)
                    </label>
                    <span className="text-[11px] font-black text-orange-600">{poemForm.opacity}%</span>
                  </div>
                  <input type="range" min="0" max="90" value={poemForm.opacity} onChange={e => setPoemForm({...poemForm, opacity: parseInt(e.target.value)})} className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-600" />
                </div>
              </div>
            </div>

            {/* 프리뷰 + 등록 버튼 영역 (5~6번) */}
            <div className="sticky top-12 space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-bold">8</span> 
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">실제 사이트 미리보기 (최종 확인)</span>
              </div>

              {/* 미리보기 카드 */}
              <div
                className="relative w-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                style={{
                  borderRadius: "24px",
                  minHeight: 500,
                  background: poemForm.imageUrl ? undefined : "#1a1a1a",
                }}
              >
                {poemForm.imageUrl && (
                  <img
                    src={poemForm.imageUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{ backgroundColor: `rgba(0,0,0,${poemForm.opacity / 100})` }}
                />
                <div className="absolute top-6 left-6 text-[10px] text-white/50 font-bold tracking-widest">{new Date().toLocaleDateString('ko-KR')}</div>
                <div className="absolute top-6 right-6 text-[10px] text-white/50 font-bold tracking-widest">출처 : {poemForm.author}</div>
                
                <div className="relative z-10 flex flex-col items-center justify-center px-10 py-16 text-center text-white min-h-[500px]">
                  <div className="space-y-4 w-full">
                    {(poemForm.content || "").split("\n").map((line, idx) => (
                      <p key={idx} className="font-bold leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]" style={{ wordBreak: "keep-all", fontSize: `${poemForm.fontSize || 24}px`, color: poemForm.fontColor || "#ffffff", fontFamily: poemForm.fontFamily || "var(--font-nanum-myeongjo), serif" }}>
                        {line || "\u00A0"}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* 6. 시 등록하기 버튼 */}
              <div className="pt-4">
                <button 
                  onClick={handlePoemSubmit} 
                  disabled={isPoemSubmitting} 
                  className="group relative w-full overflow-hidden bg-orange-600 text-white font-black py-4 rounded-[28px] hover:bg-orange-700 shadow-2xl shadow-orange-200 transition-all active:scale-95"
                >
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <span className="text-2xl">{isPoemSubmitting ? "⏳" : "🚀"}</span>
                    <span className="text-xl tracking-tighter">{isPoemSubmitting ? "전송 중..." : "위 디자인으로 시 등록하기"}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button 
                  onClick={handleDownloadImage} 
                  className="w-full bg-slate-800 text-white font-black py-4 rounded-[28px] hover:bg-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <span className="text-xl">💾</span>
                  <span className="text-base">이 디자인을 이미지로 저장하기</span>
                </button>
              </div>

              {/* 이미지 리사이즈 정보 */}
              {imageInfo && (
                <div className="bg-orange-50/50 rounded-2xl p-4 text-xs border border-orange-100 flex items-center justify-between">
                  <span className="font-bold text-orange-600 uppercase tracking-widest text-[9px]">Optimized: {imageInfo.resized}</span>
                  <span className="text-gray-400 italic">Original: {imageInfo.original}</span>
                </div>
              )}
            </div>
          </div>
          )}

          {/* 시 목록 + 삭제 */}
          <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 mt-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-base font-serif font-black text-gray-800 tracking-tighter italic">📜 등록된 시 (총 {poemList.length}편)</h3>
              <button onClick={() => loadList('poems')} className="px-6 py-2.5 bg-orange-50 text-orange-600 rounded-2xl text-[11px] font-black hover:bg-orange-100 transition-all shadow-sm">🔄 목록 새로고침</button>
            </div>
            {listLoading ? <p className="text-orange-500 text-sm text-center py-8 animate-pulse">불러오는 중...</p> : poemList.length === 0 ? <p className="text-gray-300 text-sm text-center py-8">토큰 설정 후 새로고침 해주세요</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {poemList.map((p: any) => (
                  <div key={p.id} className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    {/* 1. 제목 (있을 때만 표시) */}
                    <div className="px-5 py-3 h-12 flex items-center border-b border-gray-50">
                      <p className="font-black text-sm text-gray-800 truncate">
                        {p.title || ''}
                      </p>
                    </div>

                    {/* 2. 내용 (배경과 함께 미리보기) */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-900">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <p className="text-white text-[10px] md:text-xs font-serif leading-relaxed text-center line-clamp-4 drop-shadow-md">
                          {p.content}
                        </p>
                      </div>
                    </div>

                    {/* 3. 정보 (시인 : 등록일) */}
                    <div className="p-4 bg-white space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="text-[11px] font-bold text-gray-400">
                          {p.author} : {p.date}
                        </p>
                        {p.editHistory && <span className="text-[9px] text-blue-400 bg-blue-50 px-2 py-0.5 rounded-full font-bold">✏️ 수정됨</span>}
                      </div>

                      {/* 4. 수정 / 삭제 버튼 */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEdit('poems', p)} 
                          className="flex-1 py-3 bg-gray-50 text-gray-700 text-[11px] font-black rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                        >
                          수정하기
                        </button>
                        <button 
                          onClick={() => handleDelete('poems', p.id)} 
                          disabled={isDeleting === `poems-${p.id}`} 
                          className="flex-1 py-3 bg-gray-50 text-red-400 text-[11px] font-black rounded-2xl hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                        >
                          {isDeleting === `poems-${p.id}` ? '삭제중...' : '삭제'}
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
          <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* 설정 영역 */}
            <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-xl border border-gray-100 space-y-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-800 tracking-tighter">농부의 크로니클 등록</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest italic">Farmer's Chronicle Entry</p>
              </div>

              <form onSubmit={handleDiarySubmit} className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">글 제목</label>
                  <input type="text" value={diaryForm.title} onChange={e => setDiaryForm({...diaryForm, title: e.target.value})} placeholder="예: 감자 수확하는 날" className="w-full border-2 border-gray-50 rounded-[20px] px-6 py-4 bg-gray-50 focus:border-green-600 focus:bg-white outline-none font-bold transition-all" />
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">오늘의 기록</label>
                  <textarea value={diaryForm.content} onChange={e => setDiaryForm({...diaryForm, content: e.target.value})} rows={10} placeholder="오늘의 기록을 남겨주세요." className="w-full border-2 border-gray-50 rounded-[20px] px-6 py-4 bg-gray-50 focus:border-green-600 focus:bg-white outline-none leading-relaxed transition-all"></textarea>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">📷 사진 선택</label>
                    <input type="file" multiple ref={diaryImageInputRef} onChange={handleDiaryImagesChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">🎥 비디오 선택</label>
                    <input type="file" ref={diaryVideoInputRef} onChange={handleDiaryVideoChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                  </div>
                </div>
                
                <button type="submit" disabled={isDiarySubmitting} className="w-full bg-green-600 text-white font-black py-6 rounded-[24px] hover:bg-green-700 shadow-2xl shadow-green-100 transition-all text-xl mt-4">
                  {isDiarySubmitting ? "전송 중..." : "🌿 기록 완료"}
                </button>
              </form>
            </div>

            {/* 프리뷰 영역 */}
            <div className="sticky top-12 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">실제 사이트 미리보기</span>
              </div>

              <div 
                className="bg-white p-8 md:p-10 rounded-[32px] shadow-2xl border border-[#f0eee0] relative font-serif"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                <div className="text-[14px] text-[#8b4513] opacity-60 mb-3">{new Date().toLocaleDateString('ko-KR')}</div>
                <h3 className="text-2xl font-bold text-[#3d3228] mb-6">{diaryForm.title || "제목을 입력해 주세요"}</h3>

                {diaryPreviewImages.length > 0 && (
                  <div className="mb-6 rounded-2xl overflow-hidden border border-[#f0eee0]">
                    <img src={diaryPreviewImages[0]} alt="미리보기" className="w-full h-auto max-h-[500px] object-contain block bg-gray-50" />
                    {diaryPreviewImages.length > 1 && (
                      <div className="bg-black/60 text-white text-[10px] font-black px-3 py-1 absolute top-12 right-12 rounded-full">
                        +{diaryPreviewImages.length - 1}장 더보기
                      </div>
                    )}
                  </div>
                )}

                {diaryPreviewVideo && (
                  <div className="mb-6 rounded-2xl overflow-hidden border border-[#f0eee0]">
                    <video src={diaryPreviewVideo} controls className="w-full h-auto max-h-[500px] bg-black block" />
                  </div>
                )}

                <p className="text-[17px] leading-[1.9] text-[#5d5248] whitespace-pre-wrap">
                  {diaryForm.content || "내용을 입력하면 여기에 실시간으로 표시됩니다."}
                </p>
              </div>
              <p className="text-center text-[10px] text-gray-400 font-medium italic">※ 실제 사이트에서는 위 디자인대로 방문자에게 보여집니다.</p>
            </div>
          </div>

            {/* 일기 목록 + 삭제 */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-800">📔 등록된 일기 ({diaryList.length}건)</h3>
                <button onClick={() => loadList('diaries')} className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-black hover:bg-green-100 transition-all">🔄 새로고침</button>
              </div>
              {listLoading ? <p className="text-green-500 text-sm text-center py-6 animate-pulse">불러오는 중...</p> : diaryList.length === 0 ? <p className="text-gray-300 text-sm text-center py-6">토큰 설정 후 새로고침 해주세요</p> : (
                <div className="space-y-3">
                  {diaryList.map((d: any) => (
                    <div key={d.id} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                      {/* 윗줄: 이미지 + 텍스트 */}
                      <div className="flex items-center gap-3 p-3">
                        {d.image
                          ? <img src={d.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-gray-200" />
                          : <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 text-xl flex-shrink-0">📷</div>
                        }
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-sm text-gray-800 truncate">{d.title}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{d.date}</p>
                          {d.content && <p className="text-[11px] text-gray-500 mt-0.5 truncate">{d.content.slice(0,40)}{d.content.length > 40 ? '...' : ''}</p>}
                          {d.editHistory && <p className="text-[10px] text-blue-400 mt-0.5 truncate">✏️ {d.editHistory[d.editHistory.length-1]?.date}</p>}
                        </div>
                      </div>
                      {/* 아랫줄: 버튼 */}
                      <div className="flex border-t border-gray-100">
                        <button onClick={() => openEdit('diaries', d)} className="flex-1 py-2.5 text-xs font-black text-blue-500 hover:bg-blue-50 transition-all border-r border-gray-100">✏️ 수정</button>
                        <button onClick={() => handleDelete('diaries', d.id)} disabled={isDeleting === `diaries-${d.id}`} className="flex-1 py-2.5 text-xs font-black text-red-400 hover:bg-red-50 transition-all">
                          {isDeleting === `diaries-${d.id}` ? '삭제중...' : '🗑 삭제'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "photo" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-xl border border-gray-100 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tighter">📸 나의 일상 올리기</h2>
                <p className="text-gray-400 text-xs font-bold mt-1">간단하게 평상시 사진과 제목을 올려보세요</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">제목 (선택)</label>
                  <input
                    type="text"
                    value={photoForm.title}
                    onChange={e => setPhotoForm({...photoForm, title: e.target.value})}
                    placeholder="아름다운 거제도의 아침"
                    className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none focus:border-green-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">사진이 찍힌 위치 (선택)</label>
                  <input
                    type="text"
                    value={photoForm.location}
                    onChange={e => setPhotoForm({...photoForm, location: e.target.value})}
                    placeholder="예: 거제도 동부면"
                    className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none focus:border-green-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">사진 선택 (필수)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={photoImageInputRef}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;
                      setPhotoImageFiles(files);
                      const urls = Array.from(files).map(file => URL.createObjectURL(file));
                      setPhotoPreviews(urls);
                      
                      // 사진에서 위치 정보 자동 추출 (첫번째 이미지 기준)
                      try {
                        const gps = await exifr.gps(files[0]);
                        if (gps && gps.latitude && gps.longitude) {
                          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${gps.latitude}&lon=${gps.longitude}&zoom=14&addressdetails=1`);
                          const data = await res.json();
                          if (data && data.address) {
                            const province = data.address.province || data.address.state || '';
                            const city = data.address.city || data.address.town || data.address.county || '';
                            const suburb = data.address.suburb || data.address.village || data.address.neighbourhood || '';
                            const locationStr = `${province} ${city} ${suburb}`.trim().replace(/\s+/g, ' ');
                            if (locationStr) {
                              setPhotoForm(prev => ({ ...prev, location: locationStr }));
                            }
                          }
                        }
                      } catch (err) {
                        console.error('EXIF 추출 실패:', err);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="sticky top-12 space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">사진 미리보기</span>
              </div>
              
              <div className="bg-white p-6 rounded-[32px] shadow-2xl border border-gray-100">
                <div className="mb-4 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <span>{new Date().toLocaleDateString('ko-KR')}</span>
                  <span>{photoForm.location || "위치 지정 안됨"}</span>
                </div>
                
                <div className="relative w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 aspect-square sm:aspect-auto sm:min-h-[400px] group/slider">
                  {photoPreviews.length > 1 && (
                    <>
                      <button 
                        onClick={(e) => {
                          const container = e.currentTarget.parentElement?.querySelector('.scroll-container');
                          if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 text-white w-8 h-8 rounded-full z-20 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/60 shadow-lg pointer-events-auto"
                      >
                        ❮
                      </button>
                      <button 
                        onClick={(e) => {
                          const container = e.currentTarget.parentElement?.querySelector('.scroll-container');
                          if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 text-white w-8 h-8 rounded-full z-20 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/60 shadow-lg pointer-events-auto"
                      >
                        ❯
                      </button>
                    </>
                  )}
                  {photoPreviews.length > 0 ? (
                    <div className="scroll-container flex overflow-x-auto snap-x snap-mandatory h-full w-full scrollbar-hide">
                      {photoPreviews.map((url, idx) => (
                        <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                          <img src={url} alt={`미리보기 ${idx+1}`} className="w-full h-full object-cover" />
                          {photoPreviews.length > 1 && (
                            <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] font-black px-3 py-1.5 rounded-full backdrop-blur-sm z-10 shadow-lg border border-white/20">
                              {idx + 1} / {photoPreviews.length}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                      <span className="text-4xl mb-2">📸</span>
                      <p className="text-xs font-bold">사진을 선택하면 표시됩니다</p>
                    </div>
                  )}
                  {/* 하단 정보 오버레이 (미리보기 용) */}
                  {photoPreviews.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white z-10 pointer-events-none">
                      {photoForm.title && <h3 className="font-bold text-lg mb-1">{photoForm.title}</h3>}
                      <p className="text-xs opacity-80 flex items-center gap-1">
                        {photoForm.location ? `📍 ${photoForm.location} · ` : ""}{new Date().toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handlePhotoSubmit}
                disabled={isPhotoUploading || !photoImageFiles}
                className="w-full bg-green-500 text-white font-black py-5 rounded-[24px] hover:bg-green-600 shadow-xl shadow-green-100 transition-all text-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPhotoUploading ? '업로드 중... ⏳' : '🚀 사진 등록하기'}
              </button>
            </div>

            {/* 사진 목록 + 삭제 */}
            <div className="mt-10 pt-8 border-t border-gray-100 col-span-1 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-800">📸 등록된 일상 ({photoList.length}건)</h3>
                <button onClick={() => loadList('photos')} className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-black hover:bg-green-100 transition-all">🔄 새로고침</button>
              </div>
              {listLoading ? <p className="text-green-500 text-sm text-center py-6 animate-pulse">불러오는 중...</p> : photoList.length === 0 ? <p className="text-gray-300 text-sm text-center py-6">토큰 설정 후 새로고침 해주세요</p> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {photoList.map((p: any) => (
                    <div key={p.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                      <div className="aspect-square relative overflow-hidden bg-gray-50 border-b border-gray-100">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-300 text-3xl">📸</div>
                        )}
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                          {p.date}
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-black text-sm text-gray-800 mb-1 line-clamp-1">{p.title || "제목 없음"}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">📍 {p.location || "위치 없음"}</p>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                          <button onClick={() => openEdit('photos', p)} className="flex-1 py-2 text-[11px] font-black bg-gray-50 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">수정</button>
                          <button onClick={() => handleDelete('photos', p.id)} disabled={isDeleting === `photos-${p.id}`} className="flex-1 py-2 text-[11px] font-black bg-gray-50 text-red-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
                            {isDeleting === `photos-${p.id}` ? '삭제중' : '삭제'}
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
              <h3 className="text-xl font-black text-gray-800">✏️ {editType === 'poems' ? '시' : editType === 'diaries' ? '일기' : '일상'} 수정</h3>
              <button onClick={() => {setEditItem(null);setEditType(null);}} className="text-gray-300 hover:text-gray-600 text-2xl">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">제목</label>
                <input type="text" value={(editForm as any).title} onChange={e=>setEditForm({...editForm,title:e.target.value} as any)} className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500" placeholder="제목을 입력하세요 (선택사항)" />
              </div>
              {editType === 'photos' && (
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">위치</label>
                  <input type="text" value={editForm.location} onChange={e=>setEditForm({...editForm,location:e.target.value})} className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500" placeholder="위치를 입력하세요" />
                </div>
              )}
              {/* 내용 필드: 일기거나, 시 중에서 내용이 있는 경우(디자인 모드)만 표시 */}
              {!(editType === 'poems' && !editItem.content) && editType !== 'photos' && (
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">내용</label>
                  <textarea value={editForm.content} onChange={e=>setEditForm({...editForm,content:e.target.value})} rows={5} className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500 leading-relaxed" />
                </div>
              )}
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
