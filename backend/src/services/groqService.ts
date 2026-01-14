import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PAPER_ANALYSIS_PROMPT = `You are an expert academic research analyst. Your task is to provide a comprehensive, structured analysis of the research paper text provided below.

<instructions>
Analyze the paper thoroughly and provide your response in the following structured format using proper Markdown:

## 📋 Executive Summary
A 2-3 sentence high-level overview of what this paper is about.

## 🎯 Research Objective
- **Primary Goal**: What is the main research question or hypothesis?
- **Scope**: What is the scope and boundaries of the research?

## 📊 Methodology
- **Approach**: Describe the research approach (qualitative, quantitative, mixed)
- **Methods**: List specific methods, tools, or frameworks used
- **Data**: Describe data sources, sample size, or experimental setup

## 💡 Key Findings
Present the main findings as a numbered list:
1. First major finding
2. Second major finding
3. (Continue as needed)

## 🔬 Technical Contributions
What are the novel technical or theoretical contributions?

## ⚠️ Limitations
What are the acknowledged or apparent limitations of this research?

## 🚀 Future Directions
What opportunities for future work does this research open up?

## 📈 Impact Assessment
Rate the potential impact (Low/Medium/High) and explain briefly.
</instructions>

<paper_text>
{TEXT}
</paper_text>

Provide your analysis now, ensuring proper Markdown formatting with headers, bullet points, and emphasis where appropriate.`;

export const analyzePaperText = async (text: string) => {
    try {
        const prompt = PAPER_ANALYSIS_PROMPT.replace('{TEXT}', text);

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 2048,
        });

        return chatCompletion.choices[0]?.message?.content || "No analysis generated.";
    } catch (error) {
        console.error("Groq API Error:", error);
        throw new Error("Failed to analyze paper.");
    }
};

// Concise plagiarism/AI detection analysis
export const checkPlagiarism = async (text: string) => {
    try {
        const prompt = `You are an academic integrity expert. Analyze this text and provide a CONCISE report.

<instructions>
Be brief and direct. Use this EXACT format with NO TABLES:

## 📊 Integrity Scores

- **Originality Score**: X/100 🟢/🟡/🔴
- **AI Content Likelihood**: X% 🟢/🟡/🔴
- **Citation Quality**: X/100 🟢/🟡/🔴

**Overall Verdict**: ✅ PASS / ⚠️ REVIEW / 🚫 FLAG

---

## 🔍 Quick Analysis

**AI Detection**: [1-2 sentences about AI patterns detected or "No significant AI patterns detected"]

**Originality Concerns**: [1-2 sentences or "None detected"]

**Citation Issues**: [1-2 sentences or "Citations appear adequate"]

---

## ✅ Recommendations
1. [First recommendation]
2. [Second recommendation]
</instructions>

<text>
${text}
</text>

Respond with the analysis now. Keep it SHORT. Do NOT use tables.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
            max_tokens: 800,
        });

        return chatCompletion.choices[0]?.message?.content || "No analysis generated.";
    } catch (error) {
        console.error("Groq API Error:", error);
        throw new Error("Failed to check plagiarism.");
    }
};

