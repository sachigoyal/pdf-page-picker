import { PDFDocument } from "pdf-lib";
import type { PDFPage } from "pdf-lib";

export interface PageRange {
  start: number;
  end: number;
}

export interface PdfProcessingResult {
  originalPdfUrl: string;
  extractedPdfUrl: string;
  extractedPdfBytes: Uint8Array;
}

export const loadPdfDocument = async (file: File): Promise<{ pdfDoc: PDFDocument; pageCount: number }> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();
  
  return { pdfDoc, pageCount };
};

export const extractPdfPages = async (
  file: File,
  pageRange: PageRange
): Promise<PdfProcessingResult> => {
  const arrayBuffer = await file.arrayBuffer();
  const originalPdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();

  const pageIndices = Array.from(
    { length: pageRange.end - pageRange.start + 1 },
    (_, i) => pageRange.start - 1 + i
  );

  console.log("Page extraction debug:", {
    startPage: pageRange.start,
    endPage: pageRange.end,
    pageIndices,
    totalPages: originalPdf.getPageCount(),
  });

  const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
  copiedPages.forEach((page: PDFPage) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();

  const originalBlob = new Blob([arrayBuffer], { type: "application/pdf" });
  const extractedBlob = new Blob([pdfBytes], { type: "application/pdf" });

  return {
    originalPdfUrl: URL.createObjectURL(originalBlob),
    extractedPdfUrl: URL.createObjectURL(extractedBlob),
    extractedPdfBytes: pdfBytes,
  };
};

export const downloadPdf = (
  pdfBytes: Uint8Array,
  pageRange: PageRange,
  filename?: string
): void => {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `extracted_pages_${pageRange.start}-${pageRange.end}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 