"use client"

import { useState } from 'react';
import { Download, Award, Calendar, User, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFCertificateGeneratorProps {
  playerName: string;
  score: number;
  totalQuestions: number;
  category: string;
  difficulty: string;
  completedAt: Date;
  xpEarned: number;
}

export default function PDFCertificateGenerator({
  playerName,
  score,
  totalQuestions,
  category,
  difficulty,
  completedAt,
  xpEarned
}: PDFCertificateGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const accuracy = Math.round((score / totalQuestions) * 100);

  const generateCertificate = async () => {
    setIsGenerating(true);

    try {
      // Create a canvas for the certificate
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Set canvas size (A4 landscape proportions)
      canvas.width = 1200;
      canvas.height = 850;

      // Background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      // Inner border
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

      // Header
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CERTIFICATE OF ACHIEVEMENT', canvas.width / 2, 150);

      // Subtitle
      ctx.fillStyle = '#64748b';
      ctx.font = '24px Arial';
      ctx.fillText('ApniHistory Quiz Challenge', canvas.width / 2, 190);

      // Award text
      ctx.fillStyle = '#374151';
      ctx.font = '28px Arial';
      ctx.fillText('This is to certify that', canvas.width / 2, 280);

      // Player name
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 56px Arial';
      ctx.fillText(playerName || 'Quiz Champion', canvas.width / 2, 350);

      // Achievement text
      ctx.fillStyle = '#374151';
      ctx.font = '28px Arial';
      ctx.fillText('has successfully completed the', canvas.width / 2, 420);

      // Category and difficulty
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 36px Arial';
      const categoryText = `${category.replace('-', ' ').toUpperCase()} (${difficulty.toUpperCase()})`;
      ctx.fillText(categoryText, canvas.width / 2, 470);

      // Score details
      ctx.fillStyle = '#374151';
      ctx.font = '24px Arial';
      ctx.fillText(`with a score of ${score}/${totalQuestions} (${accuracy}% accuracy)`, canvas.width / 2, 520);

      // XP earned
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 28px Arial';
      ctx.fillText(`Earning ${xpEarned} Experience Points`, canvas.width / 2, 570);

      // Date
      ctx.fillStyle = '#6b7280';
      ctx.font = '20px Arial';
      ctx.fillText(`Completed on ${completedAt.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, canvas.width / 2, 650);

      // Footer
      ctx.fillStyle = '#9ca3af';
      ctx.font = '18px Arial';
      ctx.fillText('Powered by ApniHistory - Interactive Learning Platform', canvas.width / 2, 750);

      // Decorative elements
      // Left decoration
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(150, 350, 30, 0, 2  * Math.PI);
      ctx.fill();

      // Right decoration
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(canvas.width - 150, 350, 30, 0, 2 * Math.PI);
      ctx.fill();

      // Convert to PDF and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${playerName.replace(/\s+/g, '-')}-quiz-certificate.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        setIsGenerating(false);
      });
    } catch (error) {
      console.error('Error generating certificate:', error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Award className="w-6 h-6 text-yellow-600" />
        <h3 className="text-xl font-semibold text-gray-800">Certificate of Achievement</h3>
      </div>

      {/* Certificate Preview */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-6 border-2 border-blue-200">
        <div className="text-center">
          <div className="text-blue-800 font-bold text-2xl mb-2">CERTIFICATE OF ACHIEVEMENT</div>
          <div className="text-gray-600 mb-6">ApniHistory Quiz Challenge</div>
          
          <div className="text-gray-700 mb-2">This is to certify that</div>
          <div className="text-blue-700 font-bold text-3xl mb-2">{playerName || 'Quiz Champion'}</div>
          <div className="text-gray-700 mb-2">has successfully completed the</div>
          <div className="text-blue-700 font-bold text-xl mb-2">
            {category.replace('-', ' ').toUpperCase()} ({difficulty.toUpperCase()})
          </div>
          <div className="text-gray-700 mb-2">
            with a score of {score}/{totalQuestions} ({accuracy}% accuracy)
          </div>
          <div className="text-green-700 font-bold mb-6">
            Earning {xpEarned} Experience Points
          </div>
          
          <div className="text-gray-500 text-sm">
            Completed on {completedAt.toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Certificate Details */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-gray-600" />
          <div>
            <div className="text-sm text-gray-500">Name</div>
            <div className="font-medium text-gray-800">{playerName || 'Quiz Champion'}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Trophy className="w-5 h-5 text-gray-600" />
          <div>
            <div className="text-sm text-gray-500">Score</div>
            <div className="font-medium text-gray-800">{score}/{totalQuestions} ({accuracy}%)</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-600" />
          <div>
            <div className="text-sm text-gray-500">Date</div>
            <div className="font-medium text-gray-800">
              {completedAt.toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Award className="w-5 h-5 text-gray-600" />
          <div>
            <div className="text-sm text-gray-500">XP Earned</div>
            <div className="font-medium text-gray-800">{xpEarned} points</div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="text-center">
        <Button
          onClick={generateCertificate}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generating Certificate...' : 'Download Certificate'}
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          Generate a PDF certificate to celebrate your achievement
        </p>
      </div>
    </div>
  );
}