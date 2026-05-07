export default async function handler(req, res) {
  // CORS izinleri
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  try {
    const { prompt } = req.body;

    const apiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "Sen Jarvis'sin. Kısa, esprili ve yardımcı cevaplar ver. Türkçe konuş. Emoji kullanma." 
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 700
      })
    });

    const data = await apiRes.json();
    const reply = data.choices?.[0]?.message?.content || "Cevap veremedim.";

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Sunucu hatası oluştu." });
  }
}
