import fs from "fs";
import path from "path";
import ClientPage from "./ClientPage";

// 정적 사이트 배포(output: export)를 위해, 미리 어떤 일기 번호(id)들이 있는지 파악하는 함수입니다.
export function generateStaticParams() {
  try {
    const filePath = path.join(process.cwd(), "public/data/diaries.json");
    if (!fs.existsSync(filePath)) return [];
    
    const diaries = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    
    // 존재하는 모든 일기들의 id를 배열 형태로 추출해서 반환합니다.
    return diaries.map((d: any) => ({
      id: String(d.id)
    }));
  } catch (error) {
    console.error("generateStaticParams 에러:", error);
    return [];
  }
}

export default function DiaryDetailPage() {
  // 실제 화면 역할을 하는 ClientPage를 불러와서 뿌려줍니다.
  return <ClientPage />;
}
