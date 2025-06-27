"use client";

import { Dispatch, SetStateAction, useEffect, useState, useRef } from 'react';

import { Scale , Send , Loader2 , X, Square , Play , Pause , Volume2 , VolumeX, Mic, MicOff} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

function TypewriterEffect({ text, isPlaying }: { text: string; isPlaying: boolean }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const duration = 16000;

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
        <span className="inline-block bg-amber-500 ml-1 w-1 h-4 animate-pulse"></span>
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

// Speech recognition interface for TypeScript
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function CaseQueryForm({ setSpeaking }: Props) {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CaseQueryForm>({
    resolver: zodResolver(caseQuerySchema),
  });

  const currentQuery = watch('caseQuery');

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript('');
          setInterimTranscript('');
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              interimTranscript += result[0].transcript;
            }
          }

          setTranscript(prev => prev + finalTranscript);
          setInterimTranscript(interimTranscript);

          // Update the form field with the final transcript
          if (finalTranscript) {
            const currentValue = currentQuery || '';
            const newValue = currentValue + finalTranscript;
            setValue('caseQuery', newValue.trim());
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          let errorMessage = 'Speech recognition failed. Please try again.';
          
          switch (event.error) {
            case 'not-allowed':
              errorMessage = 'Microphone access denied. Please enable microphone permissions.';
              break;
            case 'no-speech':
              errorMessage = 'No speech detected. Please try speaking again.';
              break;
            case 'audio-capture':
              errorMessage = 'No microphone found. Please check your audio settings.';
              break;
            case 'network':
              errorMessage = 'Network error occurred. Please check your connection.';
              break;
          }

          toast({
            title: "Speech Recognition Error",
            description: errorMessage,
            variant: "destructive",
          });
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [setValue, currentQuery, toast]);

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (audioObj) {
        audioObj.pause();
        audioObj.src = '';
      }
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [audioObj, isListening]);

  // Update audio progress
  useEffect(() => {
    if (!audioObj) return;

    const updateProgress = () => {
      if (audioObj.duration) {
        const progress = (audioObj.currentTime / audioObj.duration) * 100;
        setAudioProgress(progress);
      }
    };

    const handleLoadedMetadata = () => {
      setAudioDuration(audioObj.duration || 0);
    };

    audioObj.addEventListener('timeupdate', updateProgress);
    audioObj.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audioObj.removeEventListener('timeupdate', updateProgress);
      audioObj.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioObj]);

  const startListening = () => {
    if (!speechSupported) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Error",
          description: "Failed to start speech recognition. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const onSubmit = async (data: CaseQueryForm) => {
    try {
      // Stop any currently playing audio and listening before starting new one
      stopAudio();
      if (isListening) {
        stopListening();
      }

      // Get Gemini response
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: data.caseQuery }),
      });

      const result = await res.json();
      const answer: string = result.text || "No response received.";

      setResponseText(answer);

      // Only generate audio if enabled
      if (audioEnabled) {
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
        if (audata) {
          setSpeaking(true);
          const audio = new Audio(`data:audio/mpeg;base64,${audata.audio}`);

          setAudioObj(audio);
          setIsPlaying(true);
          setIsPaused(false);
          setAudioProgress(0);

          audio.onended = () => {
            handleAudioEnd();
          };
          
          audio.onerror = () => {
            handleAudioError();
          };

          audio.onpause = () => {
            setIsPlaying(false);
            setIsPaused(true);
          };

          audio.onplay = () => {
            setIsPlaying(true);
            setIsPaused(false);
          };

          await audio.play();
        }
      }
      
      reset();
    } catch (error) {
      console.error("Submission error:", error);
      handleAudioError();
      toast({
        title: "Error",
        description: "Failed to get response from Gemini or TTS.",
        variant: "destructive",
      });
    }
  };

  // Complete stop - resets audio to beginning and clears everything
  const stopAudio = () => {
    if (audioObj) {
      audioObj.pause();
      audioObj.currentTime = 0;
      cleanup();
    }
  };

  // Toggle audio enabled/disabled
  const toggleAudioEnabled = () => {
    if (audioObj && !audioObj.paused) {
      stopAudio();
    }
    setAudioEnabled(!audioEnabled);
  };

  // Seek to specific position
  const seekTo = (percentage: number) => {
    if (audioObj && audioObj.duration) {
      audioObj.currentTime = (percentage / 100) * audioObj.duration;
    }
  };

  // Clean up all audio state
  const cleanup = () => {
    setSpeaking(false);
    setIsPlaying(false);
    setIsPaused(false);
    setAudioObj(null);
    setAudioProgress(0);
    setAudioDuration(0);
  };

  // Handle natural audio end
  const handleAudioEnd = () => {
    cleanup();
  };

  // Handle audio errors
  const handleAudioError = () => {
    cleanup();
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Clear response and stop audio
  const clearResponse = () => {
    stopAudio();
    setResponseText('');
  };

  const clearResponse1 = () => {
    setResponseText('');
  };

  return (
    <div className="flex flex-col h-full bg-white max-w-2xl mx-auto">
      {/* Audio Controls - Fixed Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAudioEnabled}
            className="border-gray-300 hover:bg-gray-50"
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4 text-black" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-500" />
            )}
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={clearResponse}
          className="border-gray-300 hover:bg-gray-50 text-black"
          disabled={!responseText}
        >
          Stop
        </Button>
      </div>

      {/* Audio Progress Bar */}
      {(isPlaying || isPaused) && (
        <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 min-w-[35px]">
              {formatTime(audioObj?.currentTime || 0)}
            </span>
            <div 
              className="flex-1 bg-gray-200 rounded-full h-2 cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percentage = ((e.clientX - rect.left) / rect.width) * 100;
                seekTo(percentage);
              }}
            >
              <div 
                className="bg-black h-full rounded-full transition-all duration-100"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 min-w-[35px]">
              {formatTime(audioDuration)}
            </span>
            <div className={`w-2 h-2 rounded-full ${
              isPlaying ? "bg-green-500 animate-pulse" : "bg-gray-400"
            }`} />
          </div>
        </div>
      )}

      {/* Query Form */}
      <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <Scale className="w-6 h-6 text-black" />
          <h2 className="font-bold text-black text-xl">Legal Query</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Input
              id="caseQuery"
              type="text"
              placeholder="Enter your legal query or use the microphone..."
              className={`w-full px-4 py-3 pr-12 border rounded-lg transition-all ${
                errors.caseQuery ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
              } focus:border-black focus:ring-black`}
              {...register("caseQuery")}
            />
            
            {/* Microphone Button */}
            {speechSupported && (
              <Button
                type="button"
                onClick={toggleListening}
                disabled={isSubmitting}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 h-8 w-8 rounded-full transition-all duration-200 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={isListening ? "Stop recording" : "Start voice input"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>

          {/* Speech Recognition Status */}
          {isListening && (
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Listening... {interimTranscript && `"${interimTranscript}"`}</span>
            </div>
          )}

          {/* Speech Recognition Not Supported Warning */}
          {!speechSupported && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
              Voice input not supported in this browser. Please use Chrome, Edge, or Safari for voice features.
            </div>
          )}

          {errors.caseQuery && (
            <p className="mt-1 text-red-600 text-sm">
              {errors.caseQuery.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || isListening}
            className="bg-black hover:bg-gray-800 disabled:opacity-50 px-6 py-3 rounded-lg w-full font-semibold text-white transition-colors duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </div>
            ) : isListening ? (
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 animate-pulse" />
                Listening...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Submit Query
              </div>
            )}
          </Button>
        </form>
      </div>

      {/* YouTube-Style Caption Overlay */}
      {responseText && isPlaying && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm pointer-events-none">
          <div className="bg-black/90 backdrop-blur-sm text-white rounded-lg shadow-2xl border border-white/10">
            {/* Caption Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/20">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  isPlaying ? "bg-green-400 animate-pulse" : 
                  isPaused ? "bg-yellow-400" : 
                  "bg-gray-400"
                }`} />
                <span className="text-xs font-medium text-gray-300">
                  {isPlaying ? "Speaking..." : isPaused ? "Paused" : "Legal Response"}
                </span>
              </div>
              <button
                onClick={clearResponse1}
                className="text-gray-400 hover:text-white transition-colors pointer-events-auto"
                aria-label="Close captions"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Caption Text */}
            <div className="px-4 py-3 max-h-40 overflow-y-auto">
              <div className="text-sm leading-relaxed text-white">
                {isPlaying ? (
                  <TypewriterEffect text={responseText} isPlaying={isPlaying} />
                ) : (
                  responseText
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}