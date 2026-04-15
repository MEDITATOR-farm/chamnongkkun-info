const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
?¤ëŠ˜ ? ì§œ ê¸°ì??¼ë¡œ ê±°ì œ??ì£¼ìš” ?„íŒŒ???¨ì?ë³?ë¶€?™ì‚° ?œì„¸ ?•ë³´ë¥?JSON?¼ë¡œ ?ì„±?´ì¤˜.
?¤ìŒ ?•ì‹??ë°˜ë“œ??ì§€ì¼œì¤˜. ë§ˆí¬?¤ìš´ ?†ì´ ?œìˆ˜ JSONë§?ì¶œë ¥??
{
  "updatedAt": "2026-04-15",
  "summary": "ê±°ì œ??ë¶€?™ì‚° ?œì¥ ?œì¤„ ?”ì•½",
  "areas": [
    {
      "name": "ê³ í˜„??,
      "avgPrice": "1??2ì²?1??8ì²?,
      "trend": "ë³´í•©",
      "trendIcon": "??,
      "highlight": "ë¡?°ìºìŠ¬ ?¸ê·¼ ?˜ìš” ê¾¸ì?"
    },
    {
      "name": "?¥ìŠ¹?¬ë™",
      "avgPrice": "8ì²?1??2ì²?,
      "trend": "?ìŠ¹",
      "trendIcon": "??,
      "highlight": "? ê·œ ë¶„ì–‘ ?í–¥?¼ë¡œ ê´€??ì¦ê?"
    },
    {
      "name": "?„ì£¼??,
      "avgPrice": "1??1??5ì²?,
      "trend": "?˜ë½",
      "trendIcon": "??,
      "highlight": "ê±°ë˜ ê°ì†Œ ì¶”ì„¸"
    },
    {
      "name": "?¥í¬??,
      "avgPrice": "9ì²?1??4ì²?,
      "trend": "ë³´í•©",
      "trendIcon": "??,
      "highlight": "ì¡°ì„ ??ê²½ê¸° ?Œë³µ ê¸°ë?ê°?
    },
    {
      "name": "ê±°ì œë©?,
      "avgPrice": "5ì²?9ì²?,
      "trend": "?ìŠ¹",
      "trendIcon": "??,
      "highlight": "ê·€?ê?ì´??˜ìš” ì¦ê?"
    }
  ],
  "tips": [
    "?¤ê±°?˜ê???êµ?† êµí†µë¶€ ?¤ê±°?˜ê? ê³µê°œ?œìŠ¤?œì—???•ì¸ ê°€??,
    "ì¡°ì„ ??ê²½ê¸°?€ ?°ë™??ê±°ì œ ë¶€?™ì‚° ?¹ì„±???€?°Â·ì‚¼???˜ì£¼ ?´ìŠ¤ ì£¼ëª©",
    "? ì? ë§¤ì… ???ì—…ì§„í¥êµ¬ì—­ ?¬ë? ë°˜ë“œ???•ì¸"
  ]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, "").trim();
  
  const outputPath = path.join(process.cwd(), "public/data/realestate.json");
  fs.writeFileSync(outputPath, text, "utf-8");
  console.log("??realestate.json ?…ë°?´íŠ¸ ?„ë£Œ");
}

main().catch(console.error);
