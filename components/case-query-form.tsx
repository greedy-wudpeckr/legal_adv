"use client";


import { Dispatch, SetStateAction, useState } from 'react';


import { Scale } from 'lucide-react';
import { set, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';


function TypewriterEffect({ text, isPlaying }: { text: string; isPlaying: boolean }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const duration = 6000; // Duration in ms - adjust based on typical response length
  
  // Reset and process text when it changes
  useEffect(() => {
    if (text?.trim()) {
      const wordArray = text.trim().split(/\s+/);
      setWords(wordArray);
      setCurrentWordIndex(0);
    }
  }, [text]);
  
  // Word-by-word display effect
  useEffect(() => {
    if (!isPlaying || !text || words.length === 0) return;
    
    // Calculate timing based on word count
    const wordInterval = duration / words.length;
    
    const timer = setInterval(() => {
      setCurrentWordIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= words.length) {
          clearInterval(timer);
          return words.length - 1;
        }
        return nextIndex;
      });
    }, wordInterval);
    
    return () => clearInterval(timer);
  }, [isPlaying, words, text]);
  
  if (!text?.trim()) {
    return null;
  }
  
  // Get words to display up to current word index
  const displayedWords = words.slice(0, currentWordIndex + 1);
  const displayText = displayedWords.join(' ');
  
  return (
    <>
      {displayText}
      {isPlaying && words.length > 0 && currentWordIndex < words.length - 1 && (
        <span className="inline-block w-1 h-4 ml-1 bg-amber-500 animate-pulse"></span>
      )}
    </>
  );
}


const caseQuerySchema = z.object({
 caseQuery: z.string().min(1, "Case query is required"),
});


type CaseQueryForm = z.infer<typeof caseQuerySchema>;


interface Props {
 setSpeaking: Dispatch<SetStateAction<boolean>>;
}


export default function CaseQueryForm({ setSpeaking }: Props) {
 const { toast } = useToast();
 const [isPlaying , setIsPlaying] = useState(false);
 const [responseText, setResponseText] = useState('');


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


   // Set speaking and playing state BEFORE setting the response text
   setIsPlaying(true);
  
   // Now set response text (after setting isPlaying)
   setResponseText(answer);


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
   if(audata){
     setSpeaking(true);
     const audio = new Audio(`data:audio/mpeg;base64,${audata.audio}`);


     audio.onended = () => {
       setSpeaking(false);
       setIsPlaying(false);
     };
     audio.onerror = () => {
       setSpeaking(false);
       setIsPlaying(false);
     };


     audio.play();
     reset();
   }
 }catch (error) {
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
    
     {/* Real-time transcript display */}
     {responseText && (
       <div className="mt-6 transition-all duration-300 ease-in-out">
         <div className="flex items-center gap-2 mb-2">
           <div className={`h-2 w-2 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
           <h3 className="text-sm font-medium text-gray-600">
             {isPlaying ? "Speaking..." : "Response"}
           </h3>
         </div>
        
         <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-lg border border-amber-200 p-4 shadow-inner">
           <p className="text-gray-800 leading-relaxed">
             {isPlaying ? (
               <TypewriterEffect text={responseText} isPlaying={isPlaying} />
             ) : (
               responseText
             )}
           </p>
         </div>
       </div>
     )}
   </div>
 </div>
);
}

