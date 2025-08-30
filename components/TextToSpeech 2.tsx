"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Square,
  Volume2,
  Settings2,
  Zap,
  Turtle,
} from "lucide-react";

interface TextToSpeechProps {
  text: string;
  onWordHighlight?: (start: number, end: number) => void;
  showCurrentWord?: boolean;
}

export default function TextToSpeech({
  text,
  onWordHighlight,
}: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(0.85);
  const [pitch, setPitch] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      const englishVoices = availableVoices.filter((v) =>
        v.lang.startsWith("en")
      );
      const preferredVoice =
        englishVoices.find(
          (v) =>
            v.name.includes("Google") ||
            v.name.includes("Microsoft") ||
            v.name.includes("Natural")
        ) ||
        englishVoices[0] ||
        availableVoices[0];

      setVoice(preferredVoice);
    };

    loadVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const createUtterance = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.voice = voice;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (onWordHighlight) {
        onWordHighlight(-1, -1);
      }
    };

    utterance.onboundary = (event) => {
      if (event.name === "word" && onWordHighlight) {
        onWordHighlight(
          event.charIndex,
          event.charIndex + (event.charLength || 0)
        );
      }
    };

    return utterance;
  };

  const speak = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = createUtterance();
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    if (onWordHighlight) {
      onWordHighlight(-1, -1);
    }
  };

  return (
    <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Volume2 className="w-5 h-5 text-white" />
          </div>
          Listen to Your Text
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`rounded-xl p-3 transition-all ${
            showSettings
              ? "bg-purple-200 text-purple-700"
              : "bg-purple-100 text-purple-600 hover:bg-purple-200"
          }`}
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      {/* Play Controls */}
      <div className="flex items-center gap-4 mb-8">
        {!isPlaying || isPaused ? (
          <button
            onClick={speak}
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            <Play className="w-5 h-5" />
            {isPaused ? "Resume" : "Start Reading"}
          </button>
        ) : (
          <button
            onClick={pause}
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            <Pause className="w-5 h-5" />
            Pause
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            onClick={stop}
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            <Square className="w-5 h-5" />
            Stop
          </button>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="space-y-6 rounded-2xl bg-white/80 backdrop-blur p-6 animate-fade-in">
          {/* Speed Control */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-base font-semibold text-gray-800 flex items-center gap-2">
                {rate < 0.8 ? (
                  <Turtle className="w-4 h-4" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                Speed: {rate.toFixed(2)}x
              </label>
              <span className="text-sm text-gray-600 font-medium">
                {rate < 0.8 ? "Slow" : rate > 1.2 ? "Fast" : "Normal"}
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
              disabled={isPlaying}
            />
          </div>

          {/* Pitch Control */}
          <div>
            <label className="text-base font-semibold text-gray-800 block mb-3">
              Pitch: {pitch.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
              disabled={isPlaying}
            />
          </div>

          {/* Voice Selection */}
          <div>
            <label className="text-base font-semibold text-gray-800 block mb-3">
              Voice:
            </label>
            <select
              value={voice?.name || ""}
              onChange={(e) => {
                const selectedVoice = voices.find(
                  (v) => v.name === e.target.value
                );
                setVoice(selectedVoice || null);
              }}
              className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base font-medium focus:border-purple-500 focus:outline-none"
              disabled={isPlaying}
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
