export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const filterSender = url.searchParams.get("sender");

    // 1. 모든 메시지 키 목록 가져오기
    const list = await env.CHAT_KV.list({ prefix: "msg_" });
    
    // 2. 각 키에 해당하는 값 가져오기
    const messages = await Promise.all(
      list.keys.map(async (key) => {
        const val = await env.CHAT_KV.get(key.name);
        return JSON.parse(val);
      })
    );

    // 3. 시간순 정렬 및 필터링
    let sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);

    if (filterSender) {
      sortedMessages = sortedMessages.filter(m => m.sender === filterSender);
    }

    return new Response(JSON.stringify({ messages: sortedMessages }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
