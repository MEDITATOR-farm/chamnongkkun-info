import { redirect } from "next/navigation";

// 블로그 섹션은 제거되었습니다. 메인 페이지로 이동합니다.
export default function BlogPage() {
  redirect("/");
}
