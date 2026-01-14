import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const analyzePaperText = async (text: string) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert research assistant. Analyze the following research paper text and provide a structured summary containing: 1. Main Objective, 2. Methodology, 3. Key Findings, 4. Limitations. Format the output in Markdown."
                },
                {
                    role: "user",
                    content: text,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1024,
        });

        return chatCompletion.choices[0]?.message?.content || "No analysis generated.";
    } catch (error) {
        console.error("Groq API Error:", error);
        throw new Error("Failed to analyze paper.");
    }
};
