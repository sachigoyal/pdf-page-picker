"use client";

import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PageRangeSelectorProps {
  startPage: string;
  endPage: string;
  startPageError: string;
  endPageError: string;
  totalPages: number;
  onStartPageChange: (value: string) => void;
  onEndPageChange: (value: string) => void;
}

const PageRangeSelector = memo(({
  startPage,
  endPage,
  startPageError,
  endPageError,
  totalPages,
  onStartPageChange,
  onEndPageChange,
}: PageRangeSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Select Page Range</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startPage">From Page</Label>
          <Input
            id="startPage"
            type="text"
            placeholder="1"
            value={startPage}
            onChange={(e) => onStartPageChange(e.target.value)}
            className={startPageError ? "border-red-500" : ""}
          />
          {startPageError && (
            <p className="text-xs text-red-500">{startPageError}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endPage">To Page</Label>
          <Input
            id="endPage"
            type="text"
            placeholder={totalPages.toString()}
            value={endPage}
            onChange={(e) => onEndPageChange(e.target.value)}
            className={endPageError ? "border-red-500" : ""}
          />
          {endPageError && (
            <p className="text-xs text-red-500">{endPageError}</p>
          )}
        </div>
      </div>
    </div>
  );
});

PageRangeSelector.displayName = "PageRangeSelector";

export default PageRangeSelector; 