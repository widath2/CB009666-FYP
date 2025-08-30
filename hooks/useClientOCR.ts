"use client";

import { useState, useCallback } from 'react';

interface OCRResult {
  text: string;
  confidence: number;
}

interface OCRProgress {
  status: string;
  progress: number;
}

const extractPDFText = async (file: File, setProgress: (progress: OCRProgress) => void): Promise<string> => {
  setProgress({ status: 'Loading PDF...', progress: 10 });
  
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  
  const arrayBuffer = await file.arrayBuffer();
  setProgress({ status: 'Reading PDF structure...', progress: 30 });
  
  const pdf = await pdfjs.getDocument(arrayBuffer).promise;
  let fullText = '';
  
  // First try to extract text directly
  for (let i = 1; i <= pdf.numPages; i++) {
    setProgress({ status: `Extracting text from page ${i} of ${pdf.numPages}...`, progress: 30 + (i / pdf.numPages) * 40 });
    
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    
    fullText += pageText + '\n\n';
  }
  
  // If no meaningful text found, try OCR on rendered pages
  if (fullText.trim().length < 50) {
    setProgress({ status: 'PDF appears to be scanned. Using OCR...', progress: 70 });
    fullText = await extractPDFTextWithOCR(pdf, setProgress);
  }
  
  setProgress({ status: 'PDF text extraction complete!', progress: 100 });
  return fullText.trim();
};

const extractPDFTextWithOCR = async (pdf: any, setProgress: (progress: OCRProgress) => void): Promise<string> => {
  const Tesseract = (await import('tesseract.js')).default;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    setProgress({ status: `OCR processing page ${i} of ${pdf.numPages}...`, progress: 70 + (i / pdf.numPages) * 25 });
    
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
    
    // Create canvas to render PDF page
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Render PDF page to canvas
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    // Convert canvas to blob for Tesseract
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(resolve as BlobCallback, 'image/png');
    });
    
    if (blob) {
      const result = await Tesseract.recognize(blob, 'eng');
      fullText += result.data.text + '\n\n';
    }
  }
  
  return fullText;
};

export const useClientOCR = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<OCRProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractText = useCallback(async (file: File): Promise<OCRResult> => {
    setIsLoading(true);
    setError(null);
    setProgress({ status: 'Initializing...', progress: 0 });

    try {
      let extractedText: string;
      let confidence: number = 85; // Default confidence for PDF

      if (file.type === 'application/pdf') {
        // Handle PDF files
        extractedText = await extractPDFText(file, setProgress);
      } else {
        // Handle image files with Tesseract
        setProgress({ status: 'Initializing OCR...', progress: 0 });
        
        const Tesseract = (await import('tesseract.js')).default;

        const result = await Tesseract.recognize(
          file,
          'eng',
          {
            logger: (m) => {
              if (m.status && typeof m.progress === 'number') {
                setProgress({
                  status: m.status === 'recognizing text' 
                    ? 'Reading text from image...' 
                    : m.status.charAt(0).toUpperCase() + m.status.slice(1) + '...',
                  progress: Math.round(m.progress * 100)
                });
              }
            }
          }
        );

        extractedText = result.data.text;
        confidence = result.data.confidence;
        setProgress({ status: 'Text extraction complete!', progress: 100 });
      }

      const cleanedText = extractedText
        .replace(/\n\s*\n/g, '\n\n')
        .replace(/\s+/g, ' ')
        .replace(/\n /g, '\n')
        .trim();

      if (!cleanedText || cleanedText.length < 10) {
        throw new Error(`No readable text found in the ${file.type === 'application/pdf' ? 'PDF' : 'image'}. Please ensure the file contains clear, readable text.`);
      }

      return {
        text: cleanedText,
        confidence: confidence
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to extract text from ${file.type === 'application/pdf' ? 'PDF' : 'image'}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(null), 2000);
    }
  }, []);

  return {
    extractText,
    isLoading,
    progress,
    error,
    clearError: () => setError(null)
  };
};