"use client";

import { Dispatch, SetStateAction } from 'react';

import { Scale } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CaseQueryForm>({
    resolver: zodResolver(caseQuerySchema),
  });

  const calculateAudioDuration = (text: string): number => {
    // Estimate audio duration based on text length
    // Average speaking rate: ~150-200 words per minute
    const words = text.trim().split(/\s+/).length;
    const wordsPerSecond = 2.5; // Conservative estimate for clear speech
    return Math.max(3000, words * (1000 / wordsPerSecond)); // Minimum 3 seconds
  };

  const onSubmit = async (data: CaseQueryForm) => {
    try {
      // Show user's question first
      if (setCurrentSubtitle && setSubtitleDuration) {
        const questionText = `Question: ${data.caseQuery}`;
        setCurrentSubtitle(questionText);
        setSubtitleDuration(3000); // Fixed 3 seconds for question display
      }

      // Get Gemini response
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: data.caseQuery }),
      });

      const result = await res.json();
      const answer: string = result.text || "No response received.";

      // Calculate expected audio duration
      const estimatedDuration = calculateAudioDuration(answer);

      // Set subtitle text and duration BEFORE starting audio
      if (setCurrentSubtitle && setSubtitleDuration) {
        setCurrentSubtitle(answer);
        setSubtitleDuration(estimatedDuration);
      }

      // Get audio from ElevenLabs
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

      // Set up audio event handlers BEFORE playing
      audio.onloadedmetadata = () => {
        // Update duration with actual audio duration if available
        if (setSubtitleDuration && audio.duration && !isNaN(audio.duration)) {
          const actualDuration = audio.duration * 1000; // Convert to milliseconds
          setSubtitleDuration(actualDuration);
        }
      };

      audio.onplay = () => {
        setSpeaking(true);
        // Subtitle should already be set and animating at this point
      };

      audio.onended = () => {
        setSpeaking(false);
        // Clear subtitle after a brief delay
        setTimeout(() => {
          if (setCurrentSubtitle && setSubtitleDuration) {
            setCurrentSubtitle("Ask me another legal question...");
            setSubtitleDuration(2500);
          }
        }, 1000);
      };

      audio.onerror = (error) => {
        console.error("Audio playback error:", error);
        setSpeaking(false);
        
        // Show error message and display full text immediately
        if (setCurrentSubtitle && setSubtitleDuration) {
          setCurrentSubtitle(`Audio Error: ${answer}`);
          setSubtitleDuration(1000); // Show immediately for 1 second, then clear
          
          // Clear after showing error
          setTimeout(() => {
            setCurrentSubtitle("Audio playback failed. Please try again.");
            setSubtitleDuration(3000);
          }, 5000);
        }
        
        toast({
          title: "Audio Error",
          description: "Failed to play audio response, but text is displayed.",
          variant: "destructive",
        });
      };

      audio.onpause = () => {
        setSpeaking(false);
      };

      audio.onabort = () => {
        setSpeaking(false);
        if (setCurrentSubtitle && setSubtitleDuration) {
          setCurrentSubtitle("Audio playback was interrupted.");
          setSubtitleDuration(2000);
        }
      };

      // Start playing audio - subtitle should already be animating
      try {
        await audio.play();
      } catch (playError) {
        console.error("Audio play failed:", playError);
        setSpeaking(false);
        
        // Fallback: show full text immediately if audio fails to play
        if (setCurrentSubtitle && setSubtitleDuration) {
          setCurrentSubtitle(answer);
          setSubtitleDuration(1); // Show all text immediately
        }
        
        toast({
          title: "Playback Error",
          description: "Could not play audio. Text response is shown instead.",
          variant: "destructive",
        });
      }

      reset();

    } catch (error) {
      console.error("Submission error:", error);
      setSpeaking(false);
      
      if (setCurrentSubtitle && setSubtitleDuration) {
        setCurrentSubtitle("Error: Failed to get response from AI");
        setSubtitleDuration(3000);
      }
      
      toast({
        title: "Error",
        description: "Failed to get response from Gemini or TTS.",
        variant: "destructive",
      });
    }
  };

  return (
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
                Processing...
              </div>
            ) : (
              "Submit Query"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}