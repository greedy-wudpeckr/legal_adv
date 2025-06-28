"use client"

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Scale, 
  ArrowLeft, 
  Clock, 
  Target, 
  Users, 
  FileText, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCaseById } from '@/data/sample-cases';
import { CaseBriefing } from '@/types/case';

export default function CaseBriefingPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;
  
  const [selectedRole, setSelectedRole] = useState<'defense' | 'prosecution'>('defense');
  
  const caseData = getCaseById(caseId);
  
  if (!caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Case Not Found</h1>
          <Link href="/courtroom-battle">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Back to Courtroom Battle
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const briefing: CaseBriefing = {
    case: caseData,
    playerRole: selectedRole,
    objectives: selectedRole === 'defense' 
      ? [
          'Prove reasonable doubt exists',
          'Challenge prosecution evidence',
          'Present alternative theories',
          'Protect client\'s rights'
        ]
      : [
          'Prove guilt beyond reasonable doubt',
          'Present compelling evidence',
          'Establish motive and opportunity',
          'Counter defense arguments'
        ],
    tips: selectedRole === 'defense'
      ? [
          'Look for inconsistencies in witness testimony',
          'Question the reliability of evidence',
          'Consider alternative explanations',
          'Focus on burden of proof'
        ]
      : [
          'Build a clear timeline of events',
          'Establish strong motive',
          'Use physical evidence effectively',
          'Anticipate defense strategies'
        ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Case Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-amber-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{caseData.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{caseData.description}</p>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(caseData.difficulty)}`}>
                  {caseData.difficulty.charAt(0).toUpperCase() + caseData.difficulty.slice(1)}
                </span>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{caseData.timeLimit} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Target className="w-4 h-4" />
                  <span>{caseData.pointsAvailable} points</span>
                </div>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Choose Your Role</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedRole('defense')}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:scale-105 ${
                  selectedRole === 'defense'
                    ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <h4 className="font-semibold mb-2">Defense Attorney</h4>
                <p className="text-sm opacity-80">Defend the accused and prove reasonable doubt</p>
              </button>
              <button
                onClick={() => setSelectedRole('prosecution')}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:scale-105 ${
                  selectedRole === 'prosecution'
                    ? 'border-red-500 bg-red-50 text-red-800 shadow-md'
                    : 'border-gray-200 hover:border-red-300 hover:shadow-sm'
                }`}
              >
                <h4 className="font-semibold mb-2">Prosecutor</h4>
                <p className="text-sm opacity-80">Prove the defendant's guilt beyond reasonable doubt</p>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Prosecution Opening */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-semibold text-gray-800">Prosecution's Opening Statement</h3>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-gray-700 italic">"{caseData.prosecutionOpening}"</p>
            </div>
          </div>

          {/* Your Objectives */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-amber-600" />
              <h3 className="text-xl font-semibold text-gray-800">Your Objectives</h3>
            </div>
            <ul className="space-y-2">
              {briefing.objectives.map((objective, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Evidence Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">Evidence Available</h3>
            </div>
            <div className="space-y-3">
              {caseData.evidenceList.slice(0, 3).map((evidence) => (
                <div key={evidence.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div>
                    <h4 className="font-medium text-gray-800">{evidence.title}</h4>
                    <p className="text-sm text-gray-600">{evidence.type}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    evidence.reliability === 'high' ? 'bg-green-100 text-green-800' :
                    evidence.reliability === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {evidence.reliability}
                  </span>
                </div>
              ))}
              <p className="text-sm text-gray-600 text-center">
                +{caseData.evidenceList.length - 3} more pieces of evidence
              </p>
            </div>
          </div>

          {/* Witnesses Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-800">Key Witnesses</h3>
            </div>
            <div className="space-y-3">
              {caseData.witnesses.slice(0, 3).map((witness) => (
                <div key={witness.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div>
                    <h4 className="font-medium text-gray-800">{witness.name}</h4>
                    <p className="text-sm text-gray-600">{witness.role}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    witness.credibility === 'high' ? 'bg-green-100 text-green-800' :
                    witness.credibility === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {witness.credibility}
                  </span>
                </div>
              ))}
              <p className="text-sm text-gray-600 text-center">
                +{caseData.witnesses.length - 3} more witnesses
              </p>
            </div>
          </div>
        </div>

        {/* Strategy Tips */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8 border border-amber-200 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-semibold text-gray-800">Strategy Tips</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {briefing.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors duration-200">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                <span className="text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Start Battle Button */}
        <div className="text-center mt-8">
          <Button 
            size="lg"
            className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-4 text-xl font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => router.push(`/courtroom-battle/case/${caseId}/battle?role=${selectedRole}`)}
          >
            <Play className="w-6 h-6 mr-3" />
            Enter the Courtroom
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            You'll have {caseData.timeLimit} minutes to present your case
          </p>
        </div>
      </div>
    </div>
  );
}