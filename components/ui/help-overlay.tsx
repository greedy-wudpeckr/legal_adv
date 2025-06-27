"use client"

import { useState } from 'react';
import { X, HelpCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HelpSection {
  title: string;
  content: string;
  steps?: string[];
}

interface HelpOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  sections: HelpSection[];
  theme?: 'amber' | 'monochrome';
}

export default function HelpOverlay({ 
  isVisible, 
  onClose, 
  title, 
  sections,
  theme = 'monochrome' 
}: HelpOverlayProps) {
  const [activeSection, setActiveSection] = useState(0);

  if (!isVisible) return null;

  const accentColor = theme === 'amber' ? 'text-amber-600' : 'text-gray-600';
  const borderColor = theme === 'amber' ? 'border-amber-200' : 'border-gray-200';
  const buttonColor = theme === 'amber' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-black hover:bg-gray-800';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`bg-white border-b ${borderColor} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className={`w-8 h-8 ${accentColor}`} />
              <div>
                <h2 className="text-2xl font-bold text-black">{title}</h2>
                <p className="text-gray-600">Get help and learn how to use the platform</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-black hover:bg-gray-100">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex h-[60vh]">
          {/* Sidebar */}
          <div className={`w-1/3 border-r ${borderColor} p-6 overflow-y-auto`}>
            <h3 className="font-semibold text-black mb-4">Help Topics</h3>
            <div className="space-y-2">
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSection(index)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    activeSection === index
                      ? `${theme === 'amber' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-gray-100 text-black border border-gray-300'}`
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{section.title}</span>
                    <ChevronRight className={`w-4 h-4 ${
                      activeSection === index ? 'rotate-90' : ''
                    } transition-transform`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {sections[activeSection] && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    {sections[activeSection].title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {sections[activeSection].content}
                  </p>
                </div>

                {sections[activeSection].steps && (
                  <div>
                    <h4 className="font-semibold text-black mb-3">Step-by-step guide:</h4>
                    <ol className="space-y-3">
                      {sections[activeSection].steps!.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full ${
                            theme === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-black'
                          } flex items-center justify-center text-sm font-medium flex-shrink-0`}>
                            {index + 1}
                          </div>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`border-t ${borderColor} p-6 bg-gray-50`}>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Need more help? Contact our support team.</p>
            </div>
            <Button onClick={onClose} className={`${buttonColor} text-white`}>
              Got it, thanks!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}