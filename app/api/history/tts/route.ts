import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { text, figureId } = await req.json();

        // Voice mappings for different historical figures
        const voiceMapping = {
            'ashoka': 'pNInz6obpgDQGcFmaJgB', // Deep, wise voice
            'akbar': 'EXAVITQu4vr4xnSDxMaL', // Regal, authoritative voice  
            'rani-lakshmibai': 'ThT5KcBeYPX3keUQqHPh', // Strong, determined female voice
            'subhas-chandra-bose': 'pNInz6obpgDQGcFmaJgB' // Passionate, revolutionary voice
        };

        const voiceId = voiceMapping[figureId as keyof typeof voiceMapping] || voiceMapping['ashoka'];

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'xi-api-key': process.env.ELEVENLABS_API_KEY!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.6,
                    similarity_boost: 0.8,
                    style: 0.2,
                    use_speaker_boost: true
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`TTS API error: ${response.status}`);
        }

        const audioBuffer = await response.arrayBuffer();
        const audioBase64 = Buffer.from(audioBuffer).toString("base64");
        
        return NextResponse.json({ audio: audioBase64 });
    } catch (error) {
        console.error('TTS API error:', error);
        return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
    }
}