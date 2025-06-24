"use client";

import { Dispatch, SetStateAction, useRef, useState } from 'react';

import { Scale } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import AudioCaption from '@/components/audio-caption';

const caseQuerySchema = z.object({
  caseQuery: z.string().min(1, "Case query is required"),
});

type CaseQueryForm = z.infer<typeof caseQuerySchema>;

interface Props {
  setSpeaking: Dispatch<SetStateAction<boolean>>;
  setCurrentSubtitle?: Dispatch<SetStateAction<string>>;
  setSubtitleDuration?: Dispatch<SetStateAction<number>>;
}

export default function CaseQueryForm({ setSpeaking, setCurrentSubtitle, setSubtitleDuration }: Props) {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [showCaption, setShowCaption] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CaseQueryForm>({
    resolver: zodResolver(caseQuerySchema),
  });

  const calculateDuration = (text: string): number => {
    // Calculate duration based on text length
    // Roughly 150-200 words per minute for comfortable reading
    const words = text.trim().split(/\s+/).length;
    const wordsPerSecond = 2.5; // Comfortable reading pace
    return Math.max(2000, words * (1000 / wordsPerSecond)); // Minimum 2 seconds
  };

  const onSubmit = async (data: CaseQueryForm) => {
    try {
      // Update subtitle to show the user's question
      if (setCurrentSubtitle && setSubtitleDuration) {
        const questionText = `Question: ${data.caseQuery}`;
        setCurrentSubtitle(questionText);
        setSubtitleDuration(calculateDuration(questionText));
      }

      // Get Gemini response
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: data.caseQuery }),
      });

      const result = await res.json();
      const answer: string = result.text || "No response received.";

      // Set response text for captions
      setCurrentResponse(answer);

      // Update subtitle with the AI response
      if (setCurrentSubtitle && setSubtitleDuration) {
        setCurrentSubtitle(answer);
        setSubtitleDuration(calculateDuration(answer));
      }

      // Call ElevenLabs TTS API
      const audioRes = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: answer,
          voice: "pNInz6obpgDQGcFmaJgB",
        }),
      });

      const audata = await audioRes.json();
      const audio = new Audio(`data:audio/mpeg;base64,${audata.audio}`);
      audioRef.current = audio;

      // Show captions when audio is ready
      audio.onloadeddata = () => {
        setShowCaption(true);
      };

      audio.onplay = () => {
        setSpeaking(true);
      };

      audio.onended = () => {
        setSpeaking(false);
        setShowCaption(false);
        // Reset subtitle after speech ends
        if (setCurrentSubtitle && setSubtitleDuration) {
          setTimeout(() => {
            setCurrentSubtitle("Ask me another legal question...");
            setSubtitleDuration(2500);
          }, 1000);
        }
      };

      audio.onerror = () => {
        setSpeaking(false);
        setShowCaption(false);
        if (setCurrentSubtitle && setSubtitleDuration) {
          setCurrentSubtitle("Error playing audio response");
          setSubtitleDuration(2000);
        }
        toast({
          title: "Audio Error",
          description: "Failed to play audio, but response is shown in captions.",
          variant: "destructive",
        });
      };

      audio.onpause = () => {
        setSpeaking(false);
      };

      audio.onabort = () => {
        setSpeaking(false);
        setShowCaption(false);
      };

      try {
        await audio.play();
      } catch (playError) {
        console.error("Audio play failed:", playError);
        setSpeaking(false);
        setShowCaption(false);
        toast({
          title: "Playback Error",
          description: "Could not play audio. Response is shown in captions.",
          variant: "destructive",
        });
      }

      reset();

    } catch (error) {
      console.error("Submission error:", error);
      setSpeaking(false);
      setShowCaption(false);
      if (setCurrentSubtitle && setSubtitleDuration) {
        setCurrentSubtitle("Error: Failed to get response");
        setSubtitleDuration(2000);
      }
      toast({
        title: "Error",
        description: "Failed to get response from Gemini or TTS.",
        variant: "destructive",
      });
    }
  };

  const handleCaptionComplete = () => {
    // Caption animation completed
    setTimeout(() => {
      setShowCaption(false);
    }, 1000);
  };

  return (
    <>
      <div className="mx-auto max-w-2xl">
        <div className="bg-white/95 shadow-2xl backdrop-blur-sm p-6 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-6 h-6 text-amber-600" />
            <h2 className="font-bold text-gray-800 text-xl">Legal Query</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="caseQuery"
              type="text"
              placeholder="Enter your legal query..."
              className={`w-full px-4 py-3 border rounded-lg transition-all ${errors.caseQuery ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                } focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
              {...register("caseQuery")}
            />
            {errors.caseQuery && (
              <p className="mt-1 text-red-600 text-sm">
                {errors.caseQuery.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 px-6 py-3 rounded-lg w-full font-semibold text-white transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin" />
                  Submitting...
                </div>
              ) : (
                "Submit Query"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Audio-synchronized captions */}
      <AudioCaption
        responseText={currentResponse}
        audioElement={audioRef.current}
        isVisible={showCaption}
        onComplete={handleCaptionComplete}
      />
    </>
  );
}