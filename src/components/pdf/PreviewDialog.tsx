"use client";

import { memo } from "react";
import { Eye, FileText, Scissors, Download, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PageRange } from "@/lib/utils/pdf-utils";

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  originalPdfUrl: string;
  extractedPdfUrl: string;
  totalPages: number;
  pageRange: PageRange | null;
  onDownload: () => void;
}

const PreviewDialog = memo(({
  isOpen,
  onClose,
  originalPdfUrl,
  extractedPdfUrl,
  totalPages,
  pageRange,
  onDownload,
}: PreviewDialogProps) => {
  const getPageRangeDisplay = () => {
    if (!pageRange) return "Pages";
    const pageCount = pageRange.end - pageRange.start + 1;
    return `Pages ${pageRange.start}-${pageRange.end} (${pageCount} page${pageCount !== 1 ? 's' : ''})`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-7xl h-[95vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Eye className="h-6 w-6" />
            PDF Preview & Comparison
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
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
                  {getPageRangeDisplay()}
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
                      <p className="text-sm text-muted-foreground">
                        Processing pages {pageRange?.start} to {pageRange?.end}...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t bg-muted/20">
          <div className="flex gap-3">
            <Button onClick={onDownload} className="flex-1 cursor-pointer" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Download Extracted PDF
            </Button>
            <Button variant="outline" onClick={onClose} size="lg" className="px-8 cursor-pointer">
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

PreviewDialog.displayName = "PreviewDialog";

export default PreviewDialog; 