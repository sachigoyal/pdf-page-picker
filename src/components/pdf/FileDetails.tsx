"use client";

import { memo } from "react";
import { FileText, Layers, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FileDetailsProps {
  fileName: string;
  totalPages: number;
  onReset: () => void;
}

const FileDetails = memo(({ fileName, totalPages, onReset }: FileDetailsProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-md">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium">{fileName}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">
              <Layers className="mr-1 h-3 w-3" />
              {totalPages} pages
            </Badge>
            <Badge variant="outline">PDF</Badge>
          </div>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onReset} className="cursor-pointer">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
});

FileDetails.displayName = "FileDetails";

export default FileDetails; 