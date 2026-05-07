export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ reply: "Sadece POST isteği kabul edilir." });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ reply: "Komut boş olamaz." });
    }

    const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://jarvis-1e2hjnhet-yavasomer0-beeps-projects.vercel.app",
        "X-Title": "Personal Jarvis"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "Sen Jarvis'sin. Kısa, net, esprili ve Türkçe cevap ver. Emoji kullanma." },
          { role: "user", content: prompt }
        ],
        max_tokens: 600,
        temperature: 0.7
      })
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("OpenRouter Error:", errorText);
      return res.status(500).json({ reply: "API kredisi bitti veya hata oluştu." });
    }

    const data = await apiResponse.json();
    const reply = data.choices?.[0]?.message?.content || "Cevap alamadım patron.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ reply: "Sunucu tarafında hata oluştu." });
  }
}
