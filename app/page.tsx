"use client";

import { useState } from "react";
import { useClientOCR } from "@/hooks/useClientOCR";
import FileUpload from "@/components/FileUpload";
import TextDisplay from "@/components/TextDisplay";
import TextComparison from "@/components/TextComparison";
import TextToSpeech from "@/components/TextToSpeech";
import PdfConverter from "@/components/PdfConverter";
import {
  FileText,
  Volume2,
  BookOpen,
  Brain,
  Eye,
} from "lucide-react";

type ProcessStep = "upload" | "extract" | "simplify" | "listen";

const steps = [
  {
    id: "upload" as const,
    label: "Upload",
    icon: FileText,
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "extract" as const,
    label: "Extract",
    icon: Eye,
    color: "from-purple-400 to-purple-600",
  },
  {
    id: "simplify" as const,
    label: "Simplify",
    icon: Brain,
    color: "from-pink-400 to-pink-600",
  },
  {
    id: "listen" as const,
    label: "Listen",
    icon: Volume2,
    color: "from-green-400 to-green-600",
  },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState<ProcessStep>("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [extractedText, setExtractedText] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [highlightStart, setHighlightStart] = useState(-1);
  const [highlightEnd, setHighlightEnd] = useState(-1);
  
  const { extractText, isLoading: isOCRLoading, progress: ocrProgress, error: ocrError } = useClientOCR();

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setTimeout(() => processOCR(file), 500);
  };

  const processOCR = async (file?: File) => {
    const fileToProcess = file || uploadedFile;
    if (!fileToProcess) return;

    setCurrentStep("extract");

    try {
      const result = await extractText(fileToProcess);
      setExtractedText(result.text);
      setCurrentStep("simplify");
    } catch (error) {
      console.error("OCR error:", error);
      alert(error instanceof Error ? error.message : "Failed to extract text. Please try again.");
      setCurrentStep("upload");
    }
  };

  const simplifyText = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText }),
      });

      if (!response.ok) throw new Error("Simplification failed");

      const data = await response.json();
      setSimplifiedText(data.simplifiedText);
      setCurrentStep("listen");
    } catch (error) {
      console.error("Simplification error:", error);
      alert("Failed to simplify text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepIndex = (step: ProcessStep) =>
    steps.findIndex((s) => s.id === step);
  const currentStepIndex = getStepIndex(currentStep);

  const renderHighlightedText = () => {
    if (highlightStart === -1 || highlightEnd === -1) {
      return simplifiedText;
    }

    return (
      <>
        {simplifiedText.slice(0, highlightStart)}
        <span className="bg-yellow-300 px-2 py-1 rounded-md shadow-sm">
          {simplifiedText.slice(highlightStart, highlightEnd)}
        </span>
        {simplifiedText.slice(highlightEnd)}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-purple-100 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Word-Whisper
                </h1>
                <p className="text-sm text-gray-600 font-medium tracking-wide">
                  Making reading accessible for everyone
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`relative flex w-16 h-16 items-center justify-center rounded-2xl transition-all duration-500 ${
                        isActive
                          ? `bg-gradient-to-br ${step.color} text-white shadow-xl scale-110`
                          : isCompleted
                          ? "bg-green-100 text-green-600 shadow-md"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span
                      className={`mt-3 text-sm font-semibold transition-colors tracking-wide ${
                        isActive ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-4">
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            index < currentStepIndex
                              ? "bg-gradient-to-r from-green-400 to-green-500"
                              : ""
                          }`}
                          style={{
                            width: index < currentStepIndex ? "100%" : "0%",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-3xl bg-white/90 backdrop-blur shadow-2xl overflow-hidden animate-fade-in">
          {/* Upload Step */}
          {currentStep === "upload" && (
            <div className="p-10">
              <h2 className="mb-2 text-3xl font-bold text-gray-800">
                Upload Your Document
              </h2>
              <p className="mb-8 text-lg text-gray-600 font-medium">
                Take a photo, upload an image, or select a PDF of any text you want to read
              </p>
              <FileUpload
                onFileUpload={handleFileUpload}
                isProcessing={isProcessing}
              />
            </div>
          )}

          {/* Extract Step */}
          {currentStep === "extract" && (
            <div className="p-10">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative">
                  <div className="w-20 h-20 animate-spin rounded-full border-4 border-purple-200 border-t-purple-500" />
                  <Eye className="absolute inset-0 m-auto w-10 h-10 text-purple-500" />
                </div>
                <p className="mt-8 text-2xl font-semibold text-gray-800">
                  Reading your document...
                </p>
                <p className="mt-3 text-lg text-gray-600 font-medium">
                  {ocrProgress?.status || "Using AI to extract text from your image"}
                </p>
                
                {ocrProgress && (
                  <div className="mt-6 w-full max-w-md">
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${ocrProgress.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{ocrProgress.progress}% complete</p>
                  </div>
                )}
                
                {ocrError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {ocrError}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Simplify Step */}
          {currentStep === "simplify" && extractedText && (
            <div className="p-10">
              <h2 className="mb-2 text-3xl font-bold text-gray-800">
                Review & Simplify
              </h2>
              <p className="mb-8 text-lg text-gray-600 font-medium">
                We found this text in your document
              </p>

              <TextDisplay
                text={extractedText}
                title={extractedText.startsWith("Demo Text") ? "Demo Text (OCR Service Loading...)" : "Original Text"}
                className="mb-8"
              />
              
              {extractedText.startsWith("Demo Text") && (
                <div className="mb-6 rounded-xl bg-blue-50 border border-blue-200 p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> OCR service is being configured. Using demo text to demonstrate functionality. 
                    Upload an image or PDF to test text extraction once the service is ready.
                  </p>
                </div>
              )}

              <button
                onClick={simplifyText}
                disabled={isProcessing}
                className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 font-semibold text-white text-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <Brain className="w-6 h-6" />
                {isProcessing
                  ? "Making it easier to read..."
                  : "Make This Easier to Read"}
              </button>
            </div>
          )}

          {/* Listen Step */}
          {currentStep === "listen" && simplifiedText && (
            <div className="p-10">
              <h2 className="mb-2 text-3xl font-bold text-gray-800">
                Read & Listen
              </h2>
              <p className="mb-8 text-lg text-gray-600 font-medium">
                Your text is now easier to read!
              </p>

              <TextComparison
                originalText={extractedText}
                simplifiedText={simplifiedText}
                title="Simplified Text"
                className="mb-8"
              />

              <TextToSpeech
                text={simplifiedText}
                showCurrentWord={true}
                onWordHighlight={(start, end) => {
                  setHighlightStart(start);
                  setHighlightEnd(end);
                }}
              />

              <button
                onClick={() => {
                  setCurrentStep("upload");
                  setUploadedFile(null);
                  setImagePreview("");
                  setExtractedText("");
                  setSimplifiedText("");
                  setHighlightStart(-1);
                  setHighlightEnd(-1);
                }}
                className="mt-8 w-full rounded-2xl bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4 font-semibold text-white text-lg transition-all hover:shadow-xl"
              >
                Read Another Document
              </button>
            </div>
          )}
        </div>

        {/* Image Preview */}
        {imagePreview && currentStep !== "upload" && (
          <div className="mt-6 rounded-2xl bg-white/90 backdrop-blur p-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Your Uploaded {uploadedFile?.type === 'application/pdf' ? 'Document' : 'Image'}
              </h3>
              <PdfConverter imageFile={uploadedFile} />
            </div>
            <img
              src={imagePreview}
              alt="Uploaded textbook page"
              className="max-h-72 rounded-xl object-contain shadow-md"
            />
          </div>
        )}
      </main>
    </div>
  );
}
