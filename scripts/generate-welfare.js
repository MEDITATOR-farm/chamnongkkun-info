const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `2026년 거제시 복지혜택과 건강보험료 절감방법을 JSON으로 생성해줘. 마크다운 없이 순수 JSON만 출력: {"updatedAt":"오늘날짜","summary":"한줄요약","welfare":[{"title":"혜택명","desc":"설명","target":"대상","amount":"지원내용","how":"방법","tag":"의료"}],"insuranceTips":[{"title":"절감방법","desc":"설명","savings":"절감액"}],"tips":["팁1","팁2"]} 복지혜택 6개이상, 보험절감 3개이상`;
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g,"").trim();
  fs.writeFileSync(path.join(process.cwd(),"public/data/welfare.json"),text,"utf-8");
  console.log("welfare.json 완료");
}
main().catch(console.error);
