export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 사용자가 요청한 필드명 { message, sender } 또는 { text, sender } 둘 다 대응하도록 유연하게 작성
    const data = await request.json();
    const message = data.message || data.text;
    const sender = data.sender || "user";

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const timestamp = Date.now();
    const key = `msg_${timestamp}`;
    const value = JSON.stringify({ 
      text: message, // 나중에 UI에서 text 필드를 사용하므로 text로 저장하거나 message와 함께 저장
      message: message,
      sender, 
      timestamp 
    });

    await env.CHAT_KV.put(key, value);

    return new Response(JSON.stringify({ success: true, key }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
