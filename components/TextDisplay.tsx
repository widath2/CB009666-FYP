"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface TextDisplayProps {
  text: string;
  title?: string;
  className?: string;
}

export default function TextDisplay({
  text,
  title,
  className = "",
}: TextDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
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
      )}

      <div className="dyslexia-bg rounded-xl p-8 max-h-80 overflow-y-auto shadow-inner">
        <p className="dyslexia-friendly whitespace-pre-wrap">
          {text}
        </p>
      </div>
    </div>
  );
}
