const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || "";

export const analyzeFilesWithAI = async (files) => {
    if (!GROQ_API_KEY) {
        throw new Error("Groq API key not configured. Add EXPO_PUBLIC_GROQ_API_KEY to your .env file.");
    }

    try {
        const structuredInput = files.slice(0, 10).map((file, index) => ({
            id: index + 1,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.date || "Unknown"
        }));

        const prompt = `You are MemoraAI, a strict file optimization assistant.

Return ONLY valid JSON.
No markdown.
No extra text.
No explanations outside JSON.

Rules:

1. Be specific to the provided files.
2. Do NOT give generic advice.
3. Do NOT suggest tools, naming conventions, or abstract improvements.
4. Only suggest actions directly related to the given file names and metadata.
5. Keep titles under 8 words.
6. Keep reasons under 20 words.
7. Be direct and practical.

Return format:

{
  "duplicates": [
    {
      "id": number,
      "name": "file name",
      "size": "file size",
      "reason": "short reason"
    }
  ],
  "suggestions": [
    {
      "title": "short action",
      "reason": "short explanation"
    }
  ]
}

Guidelines:

- Only flag real duplicates (same or very similar names).
- If no duplicates exist, return an empty array.
- Suggestions must reference actual file names.
- Focus on delete, merge, archive, or resume-related improvements.
- No generic productivity advice.

Files: ${JSON.stringify(structuredInput)}`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "You are an intelligent file optimization assistant. You MUST respond with ONLY valid JSON." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Groq API error ${response.status}: ${errorBody}`);
        }

        const data = await response.json();

        if (!data?.choices?.[0]?.message?.content) {
            throw new Error("Groq returned an empty response.");
        }

        let content = data.choices[0].message.content;

        // Cleanup and extraction
        content = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            content = jsonMatch[0];
        }

        return JSON.parse(content);
    } catch (error) {
        console.error("Memora AI Service Error:", error.message || error);
        throw error;
    }
};
