"use client";

import { useCallback, useEffect } from "react";
import { Scissors, Eye, AlertCircle, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFileUpload, usePageValidation, usePdfProcessor } from "@/lib/hooks";
import {
  FileUploadArea,
  FileDetails,
  PageRangeSelector,
  ExtractionSummary,
  PreviewDialog,
} from "./pdf";

const PDFPageExtractor = () => {
  const {
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
  } = useFileUpload();

  const {
    startPage,
    endPage,
    startPageError,
    endPageError,
    validatedPageRange,
    isValidRange,
    handleStartPageChange,
    handleEndPageChange,
    resetPages,
  } = usePageValidation(totalPages);

  const {
    isProcessing,
    showPreview,
    originalPdfUrl,
    extractedPdfUrl,
    processExtraction,
    handleDownload,
    closePreview,
  } = usePdfProcessor();

  useEffect(() => {
    if (file && totalPages > 0) {
      resetPages();
    }
  }, [file, totalPages, resetPages]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleExtractPages = useCallback(async () => {
    if (!file || !validatedPageRange) {
      setError("Please check your page range.");
      return;
    }

    setError("");

    try {
      await processExtraction(file, validatedPageRange);
    } catch {
      setError("Failed to extract pages. Please try again.");
    }
  }, [file, validatedPageRange, setError, processExtraction]);

  const handleDownloadClick = useCallback(() => {
    if (validatedPageRange) {
      handleDownload(validatedPageRange);
    }
  }, [validatedPageRange, handleDownload]);

  const resetApp = useCallback(() => {
    resetFile();
    resetPages();
  }, [resetFile, resetPages]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Scissors className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Page Picker</h1>
          <p className="text-muted-foreground">
            Extract specific pages from your PDF documents
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {!file ? "Upload Document" : "Document Details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!file ? (
              <FileUploadArea
                isDragOver={isDragOver}
                fileInputRef={fileInputRef}
                onFileUpload={handleFileUpload}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onUploadClick={handleUploadClick}
              />
            ) : (
              <div className="space-y-6">
                <FileDetails
                  fileName={file.name}
                  totalPages={totalPages}
                  onReset={resetApp}
                />

                <PageRangeSelector
                  startPage={startPage}
                  endPage={endPage}
                  startPageError={startPageError}
                  endPageError={endPageError}
                  totalPages={totalPages}
                  onStartPageChange={handleStartPageChange}
                  onEndPageChange={handleEndPageChange}
                />
                <ExtractionSummary pageRange={validatedPageRange} />
                <Button
                  onClick={handleExtractPages}
                  disabled={isProcessing || !isValidRange}
                  className="w-full cursor-pointer"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview & Extract
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          All processing happens locally in your browser. Your files never leave
          your device.
        </p>
      </div>

      <PreviewDialog
        isOpen={showPreview}
        onClose={closePreview}
        originalPdfUrl={originalPdfUrl}
        extractedPdfUrl={extractedPdfUrl}
        totalPages={totalPages}
        pageRange={validatedPageRange}
        onDownload={handleDownloadClick}
      />
    </div>
  );
};

export default PDFPageExtractor;
