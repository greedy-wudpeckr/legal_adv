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
}

export default function CaseQueryForm({ setSpeaking }: Props) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CaseQueryForm>({
    resolver: zodResolver(caseQuerySchema),
  });

  const onSubmit = async (data: CaseQueryForm) => {
    try {
      // Get Gemini response
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: data.caseQuery }),
      });

      const result = await res.json();
      const answer: string = result.text || "No response received.";

      // Call ElevenLabs TTS API
      setSpeaking(true);

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

      audio.onended = () => setSpeaking(false);
      audio.onerror = () => setSpeaking(false);

      audio.play();
      reset();

    } catch (error) {
      console.error("Submission error:", error);
      setSpeaking(false);
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
                Submitting...
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