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
  showCurrentWord = false,
}: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(0.85);
  const [pitch, setPitch] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentWord, setCurrentWord] = useState<string>("");

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      console.log("Loading voices. Total available:", availableVoices.length);
      console.log("Voice names:", availableVoices.map(v => `${v.name} (${v.lang})`));

      const englishVoices = availableVoices.filter((v) =>
        v.lang.startsWith("en")
      );
      
      console.log("English voices found:", englishVoices.length);
      
      // Look for female voices
      const femaleVoice = englishVoices.find(
        (v) =>
          v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("woman") ||
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("hazel") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("susan") ||
          v.name.toLowerCase().includes("karen") ||
          v.name.toLowerCase().includes("moira") ||
          v.name.toLowerCase().includes("tessa") ||
          v.name.toLowerCase().includes("veena") ||
          v.name.toLowerCase().includes("kate")
      );

      // Look for high-quality voices that tend to sound younger
      const qualityVoice = englishVoices.find(
        (v) =>
          v.name.includes("Google") ||
          v.name.includes("Microsoft") ||
          v.name.includes("Natural") ||
          v.name.includes("Enhanced") ||
          v.name.includes("Premium")
      );

      // Default selection priority
      const preferredVoice =
        femaleVoice ||
        qualityVoice ||
        englishVoices[0] ||
        availableVoices[0];

      console.log("Selected voice:", preferredVoice?.name || "None");
      setVoice(preferredVoice);
      
      // Set initial settings
      if (femaleVoice) {
        setPitch(1.1);
        setRate(0.9);
      }
    };

    // Multiple attempts to load voices since they load asynchronously
    loadVoices();
    setTimeout(loadVoices, 100);
    setTimeout(loadVoices, 500);

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
      setCurrentWord("");
      if (onWordHighlight) {
        onWordHighlight(-1, -1);
      }
    };

    utterance.onboundary = (event) => {
      if (event.name === "word" && onWordHighlight) {
        const wordStart = event.charIndex;
        const wordEnd = event.charIndex + (event.charLength || 0);
        const currentSpokenWord = text.substring(wordStart, wordEnd);
        
        setCurrentWord(currentSpokenWord);
        onWordHighlight(wordStart, wordEnd);
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
    setCurrentWord("");
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

      {/* Current Word Display */}
      {showCurrentWord && currentWord && (
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl border-2 border-blue-300">
            <Volume2 className="w-5 h-5 text-blue-600" />
            <span className="text-xl font-bold text-blue-800">
              {currentWord}
            </span>
          </div>
        </div>
      )}

      {/* Current Voice Info */}
      <div className="mb-6 flex flex-col items-center gap-3">
        {/* Show current voice info */}
        {voice && (
          <div className="text-xs text-gray-600 text-center bg-white/50 px-3 py-2 rounded-lg">
            <div className="font-semibold">{voice.name}</div>
            <div className="text-gray-500">
              Pitch: {pitch.toFixed(1)} | Speed: {rate.toFixed(1)}x
            </div>
          </div>
        )}
        
        {/* Voice debugging info */}
        <details className="text-xs text-gray-500 cursor-pointer">
          <summary className="hover:text-gray-700">
            {voices.filter(v => v.lang.startsWith("en")).length} English voices available
          </summary>
          <div className="mt-2 text-left bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
            {voices.filter(v => v.lang.startsWith("en")).map(v => (
              <div key={v.name} className="text-xs">
                {v.name} ({v.lang})
              </div>
            ))}
          </div>
        </details>
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
              {voices
                .filter(v => v.lang.startsWith("en"))
                .sort((a, b) => {
                  // Prioritize female voices
                  const aIsFemale = a.name.toLowerCase().includes("female") || 
                                   a.name.toLowerCase().includes("woman") ||
                                   a.name.toLowerCase().includes("zira") ||
                                   a.name.toLowerCase().includes("hazel") ||
                                   a.name.toLowerCase().includes("samantha");
                  const bIsFemale = b.name.toLowerCase().includes("female") || 
                                   b.name.toLowerCase().includes("woman") ||
                                   b.name.toLowerCase().includes("zira") ||
                                   b.name.toLowerCase().includes("hazel") ||
                                   b.name.toLowerCase().includes("samantha");
                  
                  if (aIsFemale && !bIsFemale) return -1;
                  if (!aIsFemale && bIsFemale) return 1;
                  
                  return a.name.localeCompare(b.name);
                })
                .map((v) => {
                  const isFemale = v.name.toLowerCase().includes("female") || 
                                  v.name.toLowerCase().includes("woman") ||
                                  v.name.toLowerCase().includes("zira") ||
                                  v.name.toLowerCase().includes("hazel") ||
                                  v.name.toLowerCase().includes("samantha");
                  
                  let label = v.name;
                  if (isFemale) label += " 👩";
                  
                  return (
                    <option key={v.name} value={v.name}>
                      {label} ({v.lang})
                    </option>
                  );
                })}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              👩 = Female voice
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
