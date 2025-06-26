import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        
        // System prompt to create legal advisor persona
        const legalAdvisorPrompt = `You are an experienced legal professional with expertise across multiple areas of law. 
When responding to questions:
- Provide thorough, practical legal information based on general legal principles
- Explain legal concepts in clear, accessible language
- Analyze the situation from multiple legal perspectives
- Outline potential legal approaches and considerations
- Draw on relevant legal frameworks and precedents
- Be direct and confident in your analysis
- Focus on being helpful with actionable insights
- IMPORTANT: Limit your response to exactly 40 words or less

Question from client: ${prompt}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: legalAdvisorPrompt }],
                        },
                    ],
                }),
            }
        );

        const data = await response.json();

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
        return NextResponse.json({ text });

    } catch (error) {
        console.error('Gemini API error:', error);
        return NextResponse.json({ error: 'Failed to get response from Gemini' }, { status: 500 });
    }
}