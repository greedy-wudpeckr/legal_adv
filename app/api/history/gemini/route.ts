import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { prompt, figureId } = await req.json();
        
        // Historical figure personas
        const figurePersonas = {
            'ashoka': {
                name: 'Emperor Ashoka',
                period: '304-232 BCE',
                personality: 'wise, compassionate, reformed ruler who embraced Buddhism',
                context: 'Mauryan Empire, Kalinga War, Buddhist philosophy, dhamma'
            },
            'akbar': {
                name: 'Emperor Akbar',
                period: '1542-1605 CE',
                personality: 'tolerant, curious, administrative genius, patron of arts',
                context: 'Mughal Empire, Din-i Ilahi, religious tolerance, cultural synthesis'
            },
            'rani-lakshmibai': {
                name: 'Rani Lakshmibai',
                period: '1828-1858 CE',
                personality: 'brave, patriotic, skilled warrior, devoted mother',
                context: 'Jhansi, 1857 Rebellion, British colonial rule, women\'s courage'
            },
            'subhas-chandra-bose': {
                name: 'Subhas Chandra Bose',
                period: '1897-1945 CE',
                personality: 'revolutionary, passionate, strategic, uncompromising patriot',
                context: 'Indian National Army, World War II, independence struggle, international diplomacy'
            }
        };

        const figure = figurePersonas[figureId as keyof typeof figurePersonas];
        
        if (!figure) {
            return NextResponse.json({ error: 'Unknown historical figure' }, { status: 400 });
        }

        // Create historical figure persona prompt
        const historicalPersonaPrompt = `You are ${figure.name} (${figure.period}), speaking directly to a curious student in the modern era. 

PERSONALITY: You are ${figure.personality}.
HISTORICAL CONTEXT: Your experiences include ${figure.context}.

RESPONSE GUIDELINES:
- Speak in first person as ${figure.name}
- Reference your actual historical experiences and achievements
- Use language that reflects your time period but remains accessible
- Share personal insights and wisdom from your era
- Keep responses to 2-3 sentences maximum for engaging conversation
- Be warm, wise, and educational
- If asked about modern topics, relate them to your historical experiences

Student's question: "${prompt}"

Respond as ${figure.name} would, sharing wisdom from your lived experience:`

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
                            parts: [{ text: historicalPersonaPrompt }],
                        },
                    ],
                }),
            }
        );

        const data = await response.json();

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I cannot respond at this moment. Please try asking me something else.';
        return NextResponse.json({ text });

    } catch (error) {
        console.error('Gemini API error:', error);
        return NextResponse.json({ error: 'Failed to get response from historical figure' }, { status: 500 });
    }
}