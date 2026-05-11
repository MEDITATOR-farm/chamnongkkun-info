const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `2026년 기준 거제시 주요 지역별 부동산 시세 정보를 아래 JSON 형식으로 생성해줘. 마크다운 없이 순수 JSON만 출력: {"updatedAt":"오늘날짜","summary":"거제 부동산 시장 한줄요약","areas":[{"name":"고현동","avgPrice":"가격범위","trend":"보합","trendIcon":"→","highlight":"특징"},{"name":"장승포동","avgPrice":"가격범위","trend":"상승","trendIcon":"↑","highlight":"특징"},{"name":"옥포동","avgPrice":"가격범위","trend":"보합","trendIcon":"→","highlight":"특징"},{"name":"아주동","avgPrice":"가격범위","trend":"하락","trendIcon":"↓","highlight":"특징"},{"name":"거제면","avgPrice":"가격범위","trend":"상승","trendIcon":"↑","highlight":"특징"}],"tips":["팁1","팁2","팁3"]}`;
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g,"").trim();
  fs.writeFileSync(path.join(process.cwd(),"public/data/realestate.json"),text,"utf-8");
  console.log("realestate.json 완료");
}
main().catch(console.error);
