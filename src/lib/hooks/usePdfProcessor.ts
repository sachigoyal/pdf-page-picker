import { useState, useCallback } from "react";
import { extractPdfPages, downloadPdf, type PageRange } from "@/lib/utils/pdf-utils";

export const usePdfProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [originalPdfUrl, setOriginalPdfUrl] = useState<string>("");
  const [extractedPdfUrl, setExtractedPdfUrl] = useState<string>("");
  const [extractedPdfBytes, setExtractedPdfBytes] = useState<Uint8Array | null>(null);

  const processExtraction = useCallback(async (file: File, pageRange: PageRange) => {
    setIsProcessing(true);
    
    try {
      const result = await extractPdfPages(file, pageRange);
      setOriginalPdfUrl(result.originalPdfUrl);
      setExtractedPdfUrl(result.extractedPdfUrl);
      setExtractedPdfBytes(result.extractedPdfBytes);
      setShowPreview(true);
    } catch (error) {
      console.error("PDF extraction error:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDownload = useCallback((pageRange: PageRange, filename?: string) => {
    if (!extractedPdfBytes) return;
    downloadPdf(extractedPdfBytes, pageRange, filename);
    setShowPreview(false);
  }, [extractedPdfBytes]);

  const closePreview = useCallback(() => {
    setShowPreview(false);
    if (originalPdfUrl) URL.revokeObjectURL(originalPdfUrl);
    if (extractedPdfUrl) URL.revokeObjectURL(extractedPdfUrl);
    setOriginalPdfUrl("");
    setExtractedPdfUrl("");
    setExtractedPdfBytes(null);
  }, [originalPdfUrl, extractedPdfUrl]);

  return {
    isProcessing,
    showPreview,
    originalPdfUrl,
    extractedPdfUrl,
    extractedPdfBytes,
    processExtraction,
    handleDownload,
    closePreview,
  };
}; 