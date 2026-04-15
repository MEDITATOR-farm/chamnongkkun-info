const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `2026년 경남 거제시 청년(만19~39세) 지원금 정보를 JSON으로 생성해줘. 마크다운 없이 순수 JSON만 출력: {"updatedAt":"오늘날짜","summary":"한줄요약","supports":[{"title":"지원금명","amount":"금액","target":"대상","deadline":"기한","how":"신청방법","link":"URL","tag":"주거"},{"title":"지원금명2","amount":"금액","target":"대상","deadline":"기한","how":"신청방법","link":"URL","tag":"창업"}],"tips":["팁1","팁2","팁3"]} 실제 정부 사업 6개 이상 작성`;
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g,"").trim();
  fs.writeFileSync(path.join(process.cwd(),"public/data/youth-support.json"),text,"utf-8");
  console.log("youth-support.json 완료");
}
main().catch(console.error);
