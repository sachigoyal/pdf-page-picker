"use client"

import { useState, useRef } from "react";
import { Upload, Download, FileText, X, AlertCircle, Eye, Scissors, Layers } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFDocument } from "pdf-lib";
import type { PDFPage } from "pdf-lib";

const PDFPageExtractor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [originalPdfUrl, setOriginalPdfUrl] = useState<string>("");
  const [extractedPdfUrl, setExtractedPdfUrl] = useState<string>("");
  const [extractedPdfBytes, setExtractedPdfBytes] = useState<Uint8Array | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }

    setError("");
    setFile(uploadedFile);

    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();

      setTotalPages(pageCount);
      setStartPage(1);
      setEndPage(pageCount);
    } catch (err) {
      setError("Failed to load PDF. Please try another file.");
      console.error("PDF loading error:", err);
    }
  };

  const handleExtractPages = async () => {
    if (!file || startPage > endPage || startPage < 1 || endPage > totalPages) {
      setError("Please check your page range.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const pageIndices = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage - 1 + i
      );

      const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
      copiedPages.forEach((page: PDFPage) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();

      const originalBlob = new Blob([arrayBuffer], { type: "application/pdf" });
      const extractedBlob = new Blob([pdfBytes], { type: "application/pdf" });

      setOriginalPdfUrl(URL.createObjectURL(originalBlob));
      setExtractedPdfUrl(URL.createObjectURL(extractedBlob));
      setExtractedPdfBytes(pdfBytes);
      setShowPreview(true);
    } catch (err) {
      setError("Failed to extract pages. Please try again.");
      console.error("PDF extraction error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!extractedPdfBytes) return;

    const blob = new Blob([extractedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `extracted_pages_${startPage}-${endPage}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowPreview(false);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    if (originalPdfUrl) URL.revokeObjectURL(originalPdfUrl);
    if (extractedPdfUrl) URL.revokeObjectURL(extractedPdfUrl);
    setOriginalPdfUrl("");
    setExtractedPdfUrl("");
    setExtractedPdfBytes(null);
  };

  const resetApp = () => {
    setFile(null);
    setTotalPages(0);
    setStartPage(1);
    setEndPage(1);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
          <p className="text-muted-foreground">Extract specific pages from your PDF documents</p>
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
              <div 
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground group-hover:text-foreground transition-colors mb-4" />
                <h3 className="text-lg font-semibold mb-2">Choose PDF File</h3>
                <p className="text-muted-foreground mb-4">Drag and drop your PDF here, or click to browse</p>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">
                          <Layers className="mr-1 h-3 w-3" />
                          {totalPages} pages
                        </Badge>
                        <Badge variant="outline">PDF</Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetApp}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Select Page Range</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startPage">From Page</Label>
                      <Input
                        id="startPage"
                        type="number"
                        min="1"
                        max={totalPages}
                        value={startPage}
                        onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endPage">To Page</Label>
                      <Input
                        id="endPage"
                        type="number"
                        min="1"
                        max={totalPages}
                        value={endPage}
                        onChange={(e) => setEndPage(parseInt(e.target.value) || totalPages)}
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {endPage - startPage + 1} page{endPage - startPage + 1 !== 1 ? 's' : ''} will be extracted
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      From page {startPage} to {endPage}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleExtractPages}
                  disabled={
                    isProcessing ||
                    startPage > endPage ||
                    startPage < 1 ||
                    endPage > totalPages
                  }
                  className="w-full"
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
          All processing happens locally in your browser. Your files never leave your device.
        </p>

      </div>

      <Dialog open={showPreview} onOpenChange={handleClosePreview}>
        <DialogContent className="sm:max-w-7xl h-[95vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Eye className="h-6 w-6" />
              PDF Preview & Comparison
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
            {/* Original PDF Section */}
            <div className="flex flex-col min-h-0 border-r">
              <div className="px-6 py-4 bg-muted/30 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">Original Document</h3>
                  </div>
                  <Badge variant="outline">
                    {totalPages} pages
                  </Badge>
                </div>
              </div>
              <div className="flex-1 min-h-0 p-4">
                {originalPdfUrl ? (
                  <iframe
                    src={originalPdfUrl}
                    className="w-full h-full rounded-lg border"
                    title="Original PDF"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg border border-dashed flex items-center justify-center bg-muted/10">
                    <div className="text-center space-y-3">
                      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto" />
                      <div>
                        <p className="font-medium">Loading original PDF</p>
                        <p className="text-sm text-muted-foreground">Please wait...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col min-h-0">
              <div className="px-6 py-4 bg-primary/5 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scissors className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Extracted Pages</h3>
                  </div>
                  <Badge>
                    Pages {startPage}-{endPage} ({endPage - startPage + 1} page{endPage - startPage + 1 !== 1 ? 's' : ''})
                  </Badge>
                </div>
              </div>
              <div className="flex-1 min-h-0 p-4">
                {extractedPdfUrl ? (
                  <iframe
                    src={extractedPdfUrl}
                    className="w-full h-full rounded-lg border"
                    title="Extracted PDF"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg border border-dashed flex items-center justify-center bg-primary/5">
                    <div className="text-center space-y-3">
                      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto" />
                      <div>
                        <p className="font-medium">Creating extracted PDF</p>
                        <p className="text-sm text-muted-foreground">Processing pages {startPage} to {endPage}...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 border-t bg-muted/20">
            <div className="flex gap-3">
              <Button onClick={handleDownload} className="flex-1" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Download Extracted PDF
              </Button>
              <Button variant="outline" onClick={handleClosePreview} size="lg" className="px-8">
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PDFPageExtractor;
