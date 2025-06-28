"use client"

import { useState } from 'react';
import { Share2, Download, Twitter, Facebook, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialShareResultsProps {
  score: number;
  totalQuestions: number;
  category: string;
  difficulty: string;
  xpEarned: number;
  achievements: any[];
}

export default function SocialShareResults({ 
  score, 
  totalQuestions, 
  category, 
  difficulty, 
  xpEarned, 
  achievements 
}: SocialShareResultsProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);

  const accuracy = Math.round((score / totalQuestions) * 100);
  
  const shareText = `🏆 Just scored ${score}/${totalQuestions} (${accuracy}%) on the ${category.replace('-', ' ')} quiz! 
📚 Earned ${xpEarned} XP and ${achievements.length} new achievements
🎯 Difficulty: ${difficulty}
#ApniHistory #IndianHistory #LegalEducation`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank');
  };

  const generateSocialCard = async () => {
    setIsGeneratingCard(true);
    
    // Create a canvas element for the social media card
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = 1200;
    canvas.height = 630;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#3B82F6');
    gradient.addColorStop(1, '#8B5CF6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Quiz Results', canvas.width / 2, 120);
    
    // Score
    ctx.font = 'bold 72px Arial';
    ctx.fillText(`${score}/${totalQuestions}`, canvas.width / 2, 220);
    
    // Accuracy
    ctx.font = '36px Arial';
    ctx.fillText(`${accuracy}% Accuracy`, canvas.width / 2, 280);
    
    // Category and Difficulty
    ctx.font = '28px Arial';
    ctx.fillText(`${category.replace('-', ' ')} • ${difficulty}`, canvas.width / 2, 340);
    
    // XP and Achievements
    ctx.font = '24px Arial';
    ctx.fillText(`+${xpEarned} XP • ${achievements.length} Achievements`, canvas.width / 2, 400);
    
    // Footer
    ctx.font = '20px Arial';
    ctx.fillText('ApniHistory Quiz Challenge', canvas.width / 2, 550);
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quiz-results-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setIsGeneratingCard(false);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Share2 className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Share Your Results</h3>
      </div>

      {/* Preview Card */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
        <div className="text-center">
          <h4 className="text-2xl font-bold mb-2">Quiz Results</h4>
          <div className="text-4xl font-bold mb-2">{score}/{totalQuestions}</div>
          <div className="text-lg mb-2">{accuracy}% Accuracy</div>
          <div className="text-sm opacity-90">
            {category.replace('-', ' ')} • {difficulty} • +{xpEarned} XP
          </div>
          {achievements.length > 0 && (
            <div className="text-sm opacity-90 mt-2">
              🏆 {achievements.length} New Achievement{achievements.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Share Options */}
      <div className="space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <Button
            onClick={handleTwitterShare}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Twitter className="w-4 h-4 mr-2" />
            Share on Twitter
          </Button>
          
          <Button
            onClick={handleFacebookShare}
            className="bg-blue-700 hover:bg-blue-800 text-white"
          >
            <Facebook className="w-4 h-4 mr-2" />
            Share on Facebook
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="border-gray-300"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Text
              </>
            )}
          </Button>
          
          <Button
            onClick={generateSocialCard}
            disabled={isGeneratingCard}
            variant="outline"
            className="border-gray-300"
          >
            <Download className="w-4 h-4 mr-2" />
            {isGeneratingCard ? 'Generating...' : 'Download Card'}
          </Button>
        </div>
      </div>

      {/* Share Text Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Share Text:</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{shareText}</p>
      </div>
    </div>
  );
}