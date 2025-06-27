"use client";

import { memo } from "react";
import type { PageRange } from "@/lib/utils/pdf-utils";

interface ExtractionSummaryProps {
  pageRange: PageRange | null;
}

const ExtractionSummary = memo(({ pageRange }: ExtractionSummaryProps) => {
  if (!pageRange) return null;

  const pageCount = pageRange.end - pageRange.start + 1;

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
        {pageCount} page{pageCount !== 1 ? 's' : ''} will be extracted
      </p>
      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
        From page {pageRange.start} to {pageRange.end}
      </p>
    </div>
  );
});

ExtractionSummary.displayName = "ExtractionSummary";

export default ExtractionSummary; 