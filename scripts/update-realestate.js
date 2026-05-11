const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
오늘 날짜 기준으로 거제시 주요 아파트 단지별 부동산 시세 정보를 JSON으로 생성해줘.
다음 형식을 반드시 지켜줘. 마크다운 없이 순수 JSON만 출력해:
{
  "updatedAt": "2026-04-15",
  "summary": "거제시 부동산 시장 한줄 요약",
  "areas": [
    {
      "name": "고현동",
      "avgPrice": "1억 2천~1억 8천",
      "trend": "보합",
      "trendIcon": "→",
      "highlight": "롯데캐슬 인근 수요 꾸준"
    },
    {
      "name": "장승포동",
      "avgPrice": "8천~1억 2천",
      "trend": "상승",
      "trendIcon": "↑",
      "highlight": "신규 분양 영향으로 관심 증가"
    },
    {
      "name": "아주동",
      "avgPrice": "1억~1억 5천",
      "trend": "하락",
      "trendIcon": "↓",
      "highlight": "거래 감소 추세"
    },
    {
      "name": "옥포동",
      "avgPrice": "9천~1억 4천",
      "trend": "보합",
      "trendIcon": "→",
      "highlight": "조선업 경기 회복 기대감"
    },
    {
      "name": "거제면",
      "avgPrice": "5천~9천",
      "trend": "상승",
      "trendIcon": "↑",
      "highlight": "귀농귀촌 수요 증가"
    }
  ],
  "tips": [
    "실거래가는 국토교통부 실거래가 공개시스템에서 확인 가능",
    "조선업 경기와 연동된 거제 부동산 특성상 대우·삼성 수주 뉴스 주목",
    "토지 매입 시 농업진흥구역 여부 반드시 확인"
  ]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, "").trim();
  
  const outputPath = path.join(process.cwd(), "public/data/realestate.json");
  fs.writeFileSync(outputPath, text, "utf-8");
  console.log("✅ realestate.json 업데이트 완료");
}

main().catch(console.error);
