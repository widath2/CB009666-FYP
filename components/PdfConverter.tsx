"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";

interface PdfConverterProps {
  imageFile: File | null;
}

export default function PdfConverter({ imageFile }: PdfConverterProps) {
  const [isConverting, setIsConverting] = useState(false);

  const convertToPdf = async () => {
    if (!imageFile) return;

    setIsConverting(true);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch("/api/convert-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to convert to PDF");
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `textbook-scan-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error("PDF conversion error:", error);
      alert("Failed to convert image to PDF. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  if (!imageFile) return null;

  return (
    <button
      onClick={convertToPdf}
      disabled={isConverting}
      className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {isConverting ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <FileDown className="w-5 h-5" />
      )}
      {isConverting ? "Converting..." : "Download as PDF"}
    </button>
  );
}