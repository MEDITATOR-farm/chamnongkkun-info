const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `2026년 농업직불금 및 귀농귀촌 지원금 정보를 JSON으로 생성해줘. 마크다운 없이 순수 JSON만 출력: {"updatedAt":"오늘날짜","summary":"한줄요약","supports":[{"title":"사업명","amount":"금액","target":"대상","deadline":"기한","how":"방법","link":"URL","tag":"직불금"}],"tips":["팁1","팁2","팁3"]} 실제 사업 6개 이상`;
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g,"").trim();
  fs.writeFileSync(path.join(process.cwd(),"public/data/farm-support.json"),text,"utf-8");
  console.log("farm-support.json 완료");
}
main().catch(console.error);
