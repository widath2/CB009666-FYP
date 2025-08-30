"use client";

import { useEffect, useState } from "react";
import { Eye, Brain, Volume2, FileText } from "lucide-react";

interface EnhancedLoaderProps {
  step: "upload" | "extract" | "simplify" | "listen";
  progress?: number;
  status?: string;
  isVisible: boolean;
}

const stepConfig = {
  upload: {
    icon: FileText,
    color: "from-blue-400 to-blue-600",
    title: "Processing Upload",
    descriptions: [
      "Preparing your document...",
      "Validating file format...",
      "Optimizing image quality...",
    ]
  },
  extract: {
    icon: Eye,
    color: "from-purple-400 to-purple-600",
    title: "Reading Text",
    descriptions: [
      "Analyzing image structure...",
      "Detecting text regions...",
      "Extracting characters...",
      "Cleaning up text...",
    ]
  },
  simplify: {
    icon: Brain,
    color: "from-pink-400 to-pink-600",
    title: "Simplifying Text",
    descriptions: [
      "Analyzing text complexity...",
      "Finding simpler alternatives...",
      "Preserving meaning...",
      "Optimizing for dyslexic readers...",
    ]
  },
  listen: {
    icon: Volume2,
    color: "from-green-400 to-green-600",
    title: "Preparing Audio",
    descriptions: [
      "Loading voice model...",
      "Preparing pronunciation...",
      "Optimizing playback...",
    ]
  },
};

export default function EnhancedLoader({
  step,
  progress = 0,
  status,
  isVisible,
}: EnhancedLoaderProps) {
  const [currentDescription, setCurrentDescription] = useState(0);
  const [dots, setDots] = useState("");

  const config = stepConfig[step];
  const Icon = config.icon;

  // Cycle through descriptions
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentDescription(prev => 
        (prev + 1) % config.descriptions.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible, config.descriptions.length]);

  // Animated dots
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full mx-4 animate-fade-in">
        <div className="text-center">
          {/* Animated Icon */}
          <div className="relative mb-8">
            <div 
              className={`w-24 h-24 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center animate-pulse mx-auto`}
            >
              <Icon className="w-12 h-12 text-white" />
            </div>
            
            {/* Ripple Effect */}
            <div className="absolute inset-0 w-24 h-24 mx-auto">
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.color} opacity-25 animate-ping`} />
              <div className={`absolute inset-2 rounded-full bg-gradient-to-r ${config.color} opacity-20 animate-ping animation-delay-200`} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {config.title}
          </h3>

          {/* Status or Dynamic Description */}
          <p className="text-lg text-gray-600 mb-6 min-h-[1.5rem]">
            {status || config.descriptions[currentDescription]}{dots}
          </p>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="mb-6">
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${config.color} transition-all duration-500 ease-out`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% complete</p>
            </div>
          )}

          {/* Floating Particles */}
          <div className="relative">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${config.color} opacity-60`}
                style={{
                  left: `${20 + i * 10}%`,
                  animationDelay: `${i * 0.2}s`,
                  animation: 'float 3s ease-in-out infinite',
                }}
              />
            ))}
          </div>

          {/* Tips */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> For best results, use clear, high-contrast images with readable text.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}