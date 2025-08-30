"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface TextComparisonProps {
  originalText: string;
  simplifiedText: string;
  title?: string;
  className?: string;
}

// Function to identify changed words between original and simplified text
function findChangedWords(original: string, simplified: string) {
  const originalWords = original.toLowerCase().split(/\s+/);
  const simplifiedWords = simplified.toLowerCase().split(/\s+/);
  
  const changes: Array<{
    originalWord: string;
    simplifiedWord: string;
    position: number;
  }> = [];

  // Simple word matching - in production, you might want a more sophisticated algorithm
  let originalIndex = 0;
  let simplifiedIndex = 0;

  while (originalIndex < originalWords.length && simplifiedIndex < simplifiedWords.length) {
    const origWord = originalWords[originalIndex].replace(/[.,!?;:"]/g, '');
    const simpWord = simplifiedWords[simplifiedIndex].replace(/[.,!?;:"]/g, '');

    if (origWord === simpWord) {
      originalIndex++;
      simplifiedIndex++;
    } else {
      // Look ahead to see if we can find a match
      let foundMatch = false;
      for (let i = simplifiedIndex + 1; i < Math.min(simplifiedIndex + 5, simplifiedWords.length); i++) {
        const nextSimpWord = simplifiedWords[i].replace(/[.,!?;:"]/g, '');
        if (origWord === nextSimpWord) {
          // Found the original word later in simplified text - this means words were added
          simplifiedIndex = i + 1;
          originalIndex++;
          foundMatch = true;
          break;
        }
      }

      if (!foundMatch) {
        // Check if original word was replaced
        changes.push({
          originalWord: origWord,
          simplifiedWord: simpWord,
          position: simplifiedIndex
        });
        originalIndex++;
        simplifiedIndex++;
      }
    }
  }

  return changes;
}

// Function to highlight changed words in the simplified text
function highlightChanges(text: string, changes: Array<{originalWord: string; simplifiedWord: string; position: number}>) {
  const words = text.split(/(\s+)/);
  let wordIndex = 0;
  
  return words.map((word, index) => {
    if (word.trim() === '') {
      return word; // Keep whitespace as is
    }
    
    const cleanWord = word.replace(/[.,!?;:"]/g, '').toLowerCase();
    const change = changes.find(c => c.position === wordIndex && c.simplifiedWord === cleanWord);
    
    wordIndex++;
    
    if (change) {
      return (
        <span
          key={index}
          className="relative group"
        >
          <span className="bg-gradient-to-r from-green-200 to-emerald-200 px-1 py-0.5 rounded-md font-medium text-green-900 border border-green-300">
            {word}
          </span>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            was: "{change.originalWord}"
          </div>
        </span>
      );
    }
    
    return <span key={index}>{word}</span>;
  });
}

export default function TextComparison({
  originalText,
  simplifiedText,
  title,
  className = "",
}: TextComparisonProps) {
  const [copied, setCopied] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(simplifiedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const changes = findChangedWords(originalText, simplifiedText);
  const hasChanges = changes.length > 0;

  return (
    <div className={`relative ${className}`}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {showComparison ? "Hide Original" : "Compare Original"}
              </button>
            )}
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                copied
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Text
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {hasChanges && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            ✨ {changes.length} word{changes.length !== 1 ? 's' : ''} simplified! 
            <span className="ml-2 text-green-600">Hover over highlighted words to see the original.</span>
          </p>
        </div>
      )}

      {showComparison && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">Original Text:</h4>
          <p className="dyslexia-friendly text-gray-700 text-sm leading-relaxed">
            {originalText}
          </p>
        </div>
      )}

      <div className="dyslexia-bg rounded-xl p-8 shadow-inner">
        <div className="dyslexia-friendly leading-relaxed">
          {hasChanges ? highlightChanges(simplifiedText, changes) : simplifiedText}
        </div>
      </div>
    </div>
  );
}