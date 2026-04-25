export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { messages } = await request.json();
    const userQuery = messages[messages.length - 1].content;

    // 1. 검색 인덱스 가져오기
    const baseUrl = new URL(request.url).origin;
    const searchIndexRes = await fetch(`${baseUrl}/data/search-index.json`);
    const searchIndex = await searchIndexRes.json();

    // 2. 간단한 키워드 매칭 (RAG)
    const keywords = userQuery.split(/\s+/).filter(k => k.length > 1);
    const scoredItems = searchIndex.map(item => {
      let score = 0;
      const searchText = `${item.title} ${item.summary} ${item.content}`.toLowerCase();
      keywords.forEach(kw => {
        if (searchText.includes(kw.toLowerCase())) score += 1;
      });
      return { ...item, score };
    });

    // 점수가 높은 상위 3개 항목 추출 (점수가 0보다 큰 것만)
    const topMatches = scoredItems
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const contextData = topMatches.length > 0 
      ? topMatches.map(m => `- ${m.title}: ${m.summary}`).join('\n')
      : "관련 정보 없음";

    // 3. AI 호출
    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for a Korean local information blog.
Answer ONLY in Korean. Keep answers to 2-3 sentences maximum.
Do NOT use any markdown symbols (**, *, #, -). Plain text only.
Base your answer ONLY on the following blog data. If not relevant, reply: 해당 내용은 블로그에서 확인이 어렵습니다. 다른 질문을 해주세요.

[블로그 데이터]
${contextData}`,
        },
        ...messages,
      ],
      max_tokens: 150,
    });

    // 4. 결과에서 마크다운 기호 제거
    function stripMarkdown(content) {
      return content
        .replace(/[#*`~_]/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/!\[(.*?)\]\(.*?\)/g, '')
        .replace(/\n+/g, ' ')
        .trim();
    }

    const cleanResponse = stripMarkdown(response.response || "");

    return new Response(JSON.stringify({ response: cleanResponse }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
