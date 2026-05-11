import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    let path = formData.get('path') as string | null;

    if (!file) {
      return NextResponse.json({ error: '업로드할 파일이 없습니다.' }, { status: 400 });
    }

    if (!path) {
      path = file.name; // 경로가 지정되지 않으면 파일 이름 그대로 루트에 저장
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json({ error: '서버에 GITHUB_TOKEN이 설정되지 않았습니다.' }, { status: 500 });
    }

    const owner = 'MEDITATOR-farm';
    const repo = 'chamnongkkun-info';
    const branch = 'main';

    // 파일을 Base64 문자열로 변환
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    // 너무 큰 파일은 이 방식에서 콜스택 에러가 날 수 있으나, 엑셀 파일 크기(수십 KB~수 MB)는 안전하게 처리 가능
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64Content = btoa(binary);

    // 1. 기존 파일이 있는지 확인하여 덮어쓰기 위해 SHA 값을 가져옴
    let sha = undefined;
    const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      }
    });

    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }

    // 2. GitHub에 파일 업로드 (Commit)
    const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `관리자 모드에서 자동 업로드: ${path}`,
        content: base64Content,
        branch: branch,
        sha: sha
      })
    });

    if (!putRes.ok) {
      const errorData = await putRes.json();
      throw new Error(errorData.message || 'GitHub API 전송 실패');
    }

    return NextResponse.json({ success: true, message: '파일이 성공적으로 업로드되었습니다!' });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
