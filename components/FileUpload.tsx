"use client";

import { useState, useRef, DragEvent } from "react";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing?: boolean;
}

export default function FileUpload({
  onFileUpload,
  isProcessing,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid file (JPEG, PNG, WebP, PDF)");
      return false;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      return false;
    }

    setError("");
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onFileUpload(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        <Upload
          className={`mx-auto h-12 w-12 ${
            isDragging ? "text-blue-500" : "text-gray-400"
          }`}
        />

        <p className="mt-4 text-lg font-medium text-gray-900">
          {isDragging ? "Drop your image here" : "Click or drag to upload"}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Upload a photo of your textbook page or a PDF document
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Supports: JPEG, PNG, WebP, PDF (max 10MB)
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 flex items-center justify-between">
          <p className="text-sm text-red-800">{error}</p>
          <button
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
