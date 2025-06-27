"use client"

import { useState } from 'react';
import { Settings, X, Volume2, Palette, Globe, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ToggleSwitch from '@/components/ui/toggle-switch';

interface SettingsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  theme?: 'amber' | 'monochrome';
}

export default function SettingsPanel({ 
  isVisible, 
  onClose,
  theme = 'monochrome' 
}: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    audioEnabled: true,
    notifications: true,
    autoSave: true,
    darkMode: false,
    language: 'en',
    volume: 70
  });

  if (!isVisible) return null;

  const accentColor = theme === 'amber' ? 'text-amber-600' : 'text-gray-600';
  const borderColor = theme === 'amber' ? 'border-amber-200' : 'border-gray-200';
  const dividerColor = theme === 'amber' ? 'border-amber-100' : 'border-gray-200';

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Save to localStorage
    localStorage.setItem(`setting_${key}`, JSON.stringify(value));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`bg-white border-b ${borderColor} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className={`w-8 h-8 ${accentColor}`} />
              <div>
                <h2 className="text-2xl font-bold text-black">Settings</h2>
                <p className="text-gray-600">Customize your experience</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-black hover:bg-gray-100">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-8">
            {/* Audio Settings */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Volume2 className={`w-5 h-5 ${accentColor}`} />
                <h3 className="text-lg font-semibold text-black">Audio Settings</h3>
              </div>
              <div className={`space-y-4 pl-7 border-l-2 ${dividerColor}`}>
                <ToggleSwitch
                  enabled={settings.audioEnabled}
                  onChange={(enabled) => updateSetting('audioEnabled', enabled)}
                  label="Enable Audio"
                  description="Play sound effects and voice responses"
                  theme={theme}
                />
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Volume: {settings.volume}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.volume}
                    onChange={(e) => updateSetting('volume', parseInt(e.target.value))}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                      theme === 'amber' ? 'bg-amber-200' : 'bg-gray-200'
                    }`}
                    style={{
                      background: `linear-gradient(to right, ${
                        theme === 'amber' ? '#d97706' : '#374151'
                      } 0%, ${
                        theme === 'amber' ? '#d97706' : '#374151'
                      } ${settings.volume}%, ${
                        theme === 'amber' ? '#fef3c7' : '#e5e7eb'
                      } ${settings.volume}%, ${
                        theme === 'amber' ? '#fef3c7' : '#e5e7eb'
                      } 100%)`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette className={`w-5 h-5 ${accentColor}`} />
                <h3 className="text-lg font-semibold text-black">Appearance</h3>
              </div>
              <div className={`space-y-4 pl-7 border-l-2 ${dividerColor}`}>
                <ToggleSwitch
                  enabled={settings.darkMode}
                  onChange={(enabled) => updateSetting('darkMode', enabled)}
                  label="Dark Mode"
                  description="Switch to dark theme (coming soon)"
                  theme={theme}
                />
              </div>
            </div>

            {/* Language Settings */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className={`w-5 h-5 ${accentColor}`} />
                <h3 className="text-lg font-semibold text-black">Language</h3>
              </div>
              <div className={`space-y-4 pl-7 border-l-2 ${dividerColor}`}>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Interface Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value)}
                    className={`w-full px-3 py-2 border ${borderColor} rounded-lg focus:outline-none focus:ring-2 ${
                      theme === 'amber' ? 'focus:ring-amber-500 focus:border-amber-500' : 'focus:ring-gray-500 focus:border-gray-500'
                    } bg-white text-black`}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="mr">मराठी (Marathi)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bell className={`w-5 h-5 ${accentColor}`} />
                <h3 className="text-lg font-semibold text-black">Notifications</h3>
              </div>
              <div className={`space-y-4 pl-7 border-l-2 ${dividerColor}`}>
                <ToggleSwitch
                  enabled={settings.notifications}
                  onChange={(enabled) => updateSetting('notifications', enabled)}
                  label="Push Notifications"
                  description="Receive updates about new features and content"
                  theme={theme}
                />
                
                <ToggleSwitch
                  enabled={settings.autoSave}
                  onChange={(enabled) => updateSetting('autoSave', enabled)}
                  label="Auto-save Progress"
                  description="Automatically save your learning progress"
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`border-t ${borderColor} p-6 bg-gray-50`}>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Settings are automatically saved to your browser.</p>
            </div>
            <Button 
              onClick={onClose} 
              className={`${
                theme === 'amber' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-black hover:bg-gray-800'
              } text-white`}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}