"use client";

import { memo } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadAreaProps {
  isDragOver: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onUploadClick: () => void;
}

const FileUploadArea = memo(({
  isDragOver,
  fileInputRef,
  onFileUpload,
  onDragOver,
  onDragLeave,
  onDrop,
  onUploadClick,
}: FileUploadAreaProps) => {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer group ${
        isDragOver
          ? "border-primary bg-primary/5 scale-105"
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
      }`}
      onClick={onUploadClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Upload
        className={`mx-auto h-12 w-12 mb-4 transition-colors ${
          isDragOver
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground"
        }`}
      />
      <h3
        className={`text-lg font-semibold mb-2 ${
          isDragOver ? "text-primary" : ""
        }`}
      >
        {isDragOver ? "Drop your PDF here" : "Choose PDF File"}
      </h3>
      <p className="text-muted-foreground mb-4">
        {isDragOver
          ? "Release to upload your PDF document"
          : "Drag and drop your PDF here, or click to browse"}
      </p>
      <Button variant="default" className="cursor-pointer">
        <FileText className="h-4 w-4" />
        Browse Files
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={onFileUpload}
        className="hidden"
      />
    </div>
  );
});

FileUploadArea.displayName = "FileUploadArea";

export default FileUploadArea; 