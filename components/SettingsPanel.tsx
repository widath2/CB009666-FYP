"use client";

import { useState, useEffect } from "react";
import { Settings, X, Palette, Type, Volume2, Eye } from "lucide-react";

interface SettingsConfig {
  theme: 'light' | 'dark' | 'high-contrast';
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  fontFamily: 'lexend' | 'comic' | 'opendyslexic' | 'arial';
  lineSpacing: 'normal' | 'relaxed' | 'loose';
  wordSpacing: 'normal' | 'wide' | 'wider';
  voiceRate: number;
  voicePitch: number;
  showWordHighlight: boolean;
  showCurrentWord: boolean;
}

const defaultSettings: SettingsConfig = {
  theme: 'light',
  fontSize: 'medium',
  fontFamily: 'lexend',
  lineSpacing: 'relaxed',
  wordSpacing: 'normal',
  voiceRate: 0.85,
  voicePitch: 1.3,
  showWordHighlight: true,
  showCurrentWord: true,
};

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsConfig;
  onSettingsChange: (settings: SettingsConfig) => void;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<SettingsConfig>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const updateSetting = (key: keyof SettingsConfig, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const resetToDefaults = () => {
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Reading Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Appearance Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-800">Appearance</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Theme
                </label>
                <select
                  value={localSettings.theme}
                  onChange={(e) => updateSetting('theme', e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base font-medium focus:border-purple-500 focus:outline-none"
                >
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme</option>
                  <option value="high-contrast">High Contrast</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <select
                  value={localSettings.fontSize}
                  onChange={(e) => updateSetting('fontSize', e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base font-medium focus:border-purple-500 focus:outline-none"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="xl">Extra Large</option>
                </select>
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-800">Typography</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={localSettings.fontFamily}
                  onChange={(e) => updateSetting('fontFamily', e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium focus:border-purple-500 focus:outline-none"
                >
                  <option value="lexend">Lexend (Recommended)</option>
                  <option value="comic">Comic Neue</option>
                  <option value="opendyslexic">OpenDyslexic</option>
                  <option value="arial">Arial</option>
                </select>
              </div>

              {/* Line Spacing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Line Spacing
                </label>
                <select
                  value={localSettings.lineSpacing}
                  onChange={(e) => updateSetting('lineSpacing', e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium focus:border-purple-500 focus:outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="relaxed">Relaxed</option>
                  <option value="loose">Loose</option>
                </select>
              </div>

              {/* Word Spacing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Word Spacing
                </label>
                <select
                  value={localSettings.wordSpacing}
                  onChange={(e) => updateSetting('wordSpacing', e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium focus:border-purple-500 focus:outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="wide">Wide</option>
                  <option value="wider">Wider</option>
                </select>
              </div>
            </div>
          </section>

          {/* Voice Settings Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-800">Voice Settings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Voice Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reading Speed: {localSettings.voiceRate.toFixed(2)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={localSettings.voiceRate}
                  onChange={(e) => updateSetting('voiceRate', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Voice Pitch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Pitch: {localSettings.voicePitch.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={localSettings.voicePitch}
                  onChange={(e) => updateSetting('voicePitch', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>
          </section>

          {/* Reading Features Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-800">Reading Features</h3>
            </div>

            <div className="space-y-4">
              {/* Show Word Highlight */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.showWordHighlight}
                  onChange={(e) => updateSetting('showWordHighlight', e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-base font-medium text-gray-800">
                  Highlight words while reading
                </span>
              </label>

              {/* Show Current Word */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.showCurrentWord}
                  onChange={(e) => updateSetting('showCurrentWord', e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-base font-medium text-gray-800">
                  Show current word being read
                </span>
              </label>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export { type SettingsConfig, defaultSettings };