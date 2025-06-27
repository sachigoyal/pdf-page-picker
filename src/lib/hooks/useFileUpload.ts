import { useState, useRef, useCallback } from "react";
import { loadPdfDocument } from "@/lib/utils/pdf-utils";

export const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (uploadedFile: File) => {
    if (uploadedFile.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }

    setError("");
    setFile(uploadedFile);

    try {
      const { pageCount } = await loadPdfDocument(uploadedFile);
      setTotalPages(pageCount);
    } catch (err) {
      setError("Failed to load PDF. Please try another file.");
      console.error("PDF loading error:", err);
    }
  }, []);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const uploadedFile = event.target.files?.[0];
      if (!uploadedFile) return;
      await processFile(uploadedFile);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const droppedFile = files[0];
        processFile(droppedFile);
      }
    },
    [processFile]
  );

  const resetFile = useCallback(() => {
    setFile(null);
    setTotalPages(0);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return {
    file,
    totalPages,
    error,
    isDragOver,
    fileInputRef,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    resetFile,
    setError,
  };
}; 