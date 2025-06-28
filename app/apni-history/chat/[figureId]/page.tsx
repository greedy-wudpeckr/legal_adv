"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Crown,
  Calendar,
  BookOpen,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Canvas } from '@react-three/fiber';
import { historicalFigures } from '@/data/historical-data';
import { HistoricalFigure } from '@/types/history';
import HistoricalAvatar from '@/components/historical-avatar';
import HistoricalChatInterface from '@/components/historical-chat-interface';
import { HistoricalErrorMessage } from '@/components/historical-loading-states';
import { OrbitControls } from '@react-three/drei';

export default function ChatWithFigurePage() {
  const params = useParams();
  const figureId = params.figureId as string;

  const [figure, setFigure] = useState<HistoricalFigure | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const foundFigure = historicalFigures.find(f => f.id === figureId);
    if (foundFigure) {
      setFigure(foundFigure);
      setError(null);
    } else {
      setError('Historical figure not found');
    }
    setIsLoading(false);
  }, [figureId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-white min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 w-8 h-8 text-gray-400 animate-spin" />
          <h1 className="mb-4 font-bold text-black text-2xl">Loading Historical Figure...</h1>
          <p className="text-gray-600">Preparing your conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !figure) {
    return (
      <div className="flex justify-center items-center bg-white p-6 min-h-screen">
        <div className="w-full max-w-md">
          <HistoricalErrorMessage
            message={error || 'Historical figure not found'}
            onRetry={() => window.location.reload()}
          />
          <div className="mt-6 text-center">
            <Link href="/apni-history/explore">
              <Button variant="outline" className="border-gray-300">
                Back to Figures
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white h-screen overflow-hidden"> {/* Added overflow-hidden */}

      {/* Main Content */}
      <div className="flex flex-1 min-h-0"> {/* Added min-h-0 to prevent flex item growth */}
        {/* 3D Avatar Section */}
        <div className="flex flex-col bg-gradient-to-br from-white to-gray-50 border-gray-200 border-r w-1/3">
          {/* Avatar Display - Fixed Height */}
          <div className="relative flex-shrink-0 bg-white h-[400px]">
            <Canvas
              camera={{ position: [0, 1.5, 3] }}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={1.5} />
              <directionalLight position={[2, 2, 5]} intensity={0.8} />
              <pointLight position={[-2, 2, 2]} intensity={5} />
              <HistoricalAvatar figureId={figure.id} />
              <OrbitControls />
            </Canvas>

            {/* Speaking Indicator */}
            {isSpeaking && (
              <div className="bottom-4 left-4 absolute flex items-center gap-2 bg-black/80 px-3 py-1 rounded-full text-white text-sm">
                <div className="bg-green-400 rounded-full w-2 h-2 animate-pulse"></div>
                Speaking...
              </div>
            )}
          </div>

          {/* Figure Info Panel - Scrollable if needed */}
          <div className="flex-1 min-h-0 overflow-y-auto"> {/* Added min-h-0 */}
            <div className="bg-white p-6 border-gray-200 border-t">
              <h3 className="mb-2 font-bold text-black">{figure.name}</h3>
              <p className="mb-3 text-gray-600 text-sm leading-relaxed">{figure.significance}</p>

              {/* Quick Facts */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>{figure.timeRange}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <BookOpen className="w-3 h-3" />
                  <span>{figure.achievements.length} major achievements</span>
                </div>
              </div>

              {/* Key Achievement Preview */}
              <div className="bg-gray-50 mt-4 p-3 border border-gray-200 rounded-lg">
                <h4 className="mb-1 font-semibold text-black text-xs uppercase tracking-wide">
                  Notable Achievement
                </h4>
                <ul className='space-y-2 list-disc'>
                  {figure.achievements.map((achievement, idx) => {
                    return (
                      <li key={idx.toString()} className="flex flex-col text-gray-600 text-xs leading-relaxed">
                        {achievement}
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Quotes Preview */}
              <div className="bg-gray-50 mt-4 p-3 border border-gray-200 rounded-lg">
                <h4 className="mb-1 font-semibold text-black text-xs uppercase tracking-wide">
                  Famous Quotes
                </h4>
                <ul className='space-y-2 list-disc'>
                  {figure.quotes.map((quote, idx) => {
                    return (
                      <li key={idx.toString()} className="flex flex-col text-gray-600 text-xs leading-relaxed">
                        {quote}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex flex-col flex-1 min-h-0"> {/* Added min-h-0 */}
          <HistoricalChatInterface
            figure={figure}
            onSpeakingChange={setIsSpeaking}
          />
        </div>
      </div>
    </div>
  );
}