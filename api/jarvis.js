export default async function handler(req, res) {
  const { prompt } = req.body;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o",
      messages: [
        { role: "system", content: "Sen Jarvis'sin. Kısa, esprili ve Türkçe cevap ver. Emoji kullanma." },
        { role: "user", content: prompt }
      ],
      max_tokens: 700
    })
  });

  const data = await response.json();
  res.json({ reply: data.choices[0].message.content });
}
