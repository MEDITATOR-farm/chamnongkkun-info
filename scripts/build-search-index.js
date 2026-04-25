const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts');
const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const OUTPUT_PATH = path.join(DATA_DIR, 'search-index.json');

// 마크다운 기호 제거 함수
function stripMarkdown(content) {
  return content
    .replace(/[#*`~_]/g, '') // 기본 기호 제거
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 링크 텍스트만 추출
    .replace(/!\[(.*?)\]\(.*?\)/g, '') // 이미지는 제거
    .replace(/\n+/g, ' ') // 줄바꿈을 공백으로
    .trim();
}

async function buildIndex() {
  const index = [];

  // 1. JSON 데이터 읽기 (사용자가 요청한 local-info.json 대신 존재하는 chamnongkkun-info.json 사용)
  const localInfoPath = path.join(DATA_DIR, 'chamnongkkun-info.json');
  if (fs.existsSync(localInfoPath)) {
    const data = JSON.parse(fs.readFileSync(localInfoPath, 'utf-8'));
    
    // events, benefits 등 배열 형태의 데이터를 모두 인덱싱
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        data[key].forEach(item => {
          index.push({
            type: 'data',
            category: key,
            title: item.name || item.title || '',
            summary: item.summary || '',
            content: stripMarkdown(item.detailContent || ''),
            link: item.link || '#'
          });
        });
      }
    });
  }

  // 2. 마크다운 포스트 읽기
  if (fs.existsSync(POSTS_DIR)) {
    const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
    
    files.forEach(file => {
      const filePath = path.join(POSTS_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      const plainText = stripMarkdown(content).substring(0, 500);
      
      index.push({
        type: 'post',
        title: data.title || '',
        summary: data.summary || '',
        content: plainText,
        date: data.date || '',
        slug: file.replace('.md', ''),
        link: `/posts/${file.replace('.md', '')}`
      });
    });
  }

  // 3. 결과 저장
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2));
  console.log(`Search index built: ${index.length} entries`);
}

buildIndex().catch(err => {
  console.error('Failed to build search index:', err);
  process.exit(1);
});
