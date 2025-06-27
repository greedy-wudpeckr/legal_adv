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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-4">Loading Historical Figure...</h1>
          <p className="text-gray-600">Preparing your conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !figure) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/apni-history/explore" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Figures</span>
            </Link>
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-black" />
              <div>
                <h1 className="text-xl font-bold text-black">{figure.name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{figure.timeRange}</span>
                </div>
              </div>
            </div>
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* 3D Avatar Section */}
        <div className="w-1/3 bg-gradient-to-br from-white to-gray-50 border-r border-gray-200 flex flex-col">
          {/* Avatar Display */}
          <div className="flex-1 relative bg-white">
            <Canvas camera={{ position: [0, 1.5, 3] }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[2, 2, 5]} intensity={0.8} />
              <pointLight position={[-2, 2, 2]} intensity={0.5} />
              <HistoricalAvatar figureId={figure.id} speaking={isSpeaking} />
            </Canvas>
            
            {/* Speaking Indicator */}
            {isSpeaking && (
              <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Speaking...
              </div>
            )}
          </div>

          {/* Figure Info Panel */}
          <div className="p-6 bg-white border-t border-gray-200">
            <h3 className="font-bold text-black mb-2">{figure.name}</h3>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{figure.significance}</p>
            
            {/* Quick Facts */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{figure.timeRange}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <BookOpen className="w-3 h-3" />
                <span>{figure.achievements.length} major achievements</span>
              </div>
            </div>

            {/* Key Achievement Preview */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-xs font-semibold text-black mb-1 uppercase tracking-wide">
                Notable Achievement
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {figure.achievements[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          <HistoricalChatInterface 
            figure={figure} 
            onSpeakingChange={setIsSpeaking}
          />
        </div>
      </div>
    </div>
  );
}