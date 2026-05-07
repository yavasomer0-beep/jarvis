export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",   // daha ucuz ve hızlı model
        messages: [
          { role: "system", content: "Sen Jarvis'sin. Kısa, net ve Türkçe cevap ver. Emoji kullanma." },
          { role: "user", content: prompt }
        ],
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter Error:", errorText);
      return res.status(500).json({ reply: "API hatası: " + response.status });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Üzgünüm, cevap alamadım.";

    res.status(200).json({ reply });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ reply: "Bağlantı hatası oluştu." });
  }
}
