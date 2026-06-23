"use client";

import { useState, useRef } from "react";
import { Paperclip, X, Loader2, FileText, ScanSearch, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { FileAttachment } from "@/lib/types";

export interface OcrResult {
  storeName: string;
  date: string | null;
  totalAmount: number | null;
  items: { name: string; quantity: number | null; amount: number | null }[];
  documentType: string;
  summary: string;
}

interface FileUploadProps {
  attachments: FileAttachment[];
  onChange: (attachments: FileAttachment[]) => void;
  onOcrResult?: (result: OcrResult) => void;
  maxFiles?: number;
}

function formatSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function isImage(file: FileAttachment) {
  return file.type?.startsWith("image/");
}

export function FileUpload({ attachments, onChange, onOcrResult, maxFiles = 20 }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadingNames, setUploadingNames] = useState<string[]>([]);
  const [ocrLoading, setOcrLoading] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const images = attachments.filter(isImage);
  const nonImages = attachments.filter((f) => !isImage(f));

  async function handleOcr(index: number) {
    const file = attachments[index];
    if (!file?.type?.startsWith("image/")) return;
    setOcrLoading(index);
    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: file.url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onOcrResult?.(data);
      toast.success("영수증 인식 완료");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "인식 실패");
    } finally {
      setOcrLoading(null);
    }
  }

  async function uploadFiles(files: File[]) {
    const remaining = maxFiles - attachments.length;
    if (remaining <= 0) {
      toast.error(`최대 ${maxFiles}개까지 첨부할 수 있습니다.`);
      return;
    }

    const filesToUpload = files.slice(0, remaining);
    if (files.length > remaining) {
      toast.warning(`${remaining}개만 업로드됩니다 (최대 ${maxFiles}개)`);
    }

    setUploading(true);
    setUploadingNames(filesToUpload.map((f) => f.name));

    try {
      const results = await Promise.all(
        filesToUpload.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || `${file.name} 업로드 실패`);
          return data as FileAttachment;
        })
      );
      onChange([...attachments, ...results]);
      toast.success(`${results.length}개 파일 업로드 완료`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
      setUploadingNames([]);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    uploadFiles(Array.from(files));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) uploadFiles(files);
  }

  function removeFile(index: number) {
    onChange(attachments.filter((_, i) => i !== index));
  }

  const globalIdx = (imgIdx: number) => attachments.indexOf(images[imgIdx]);
  const nonImageGlobalIdx = (idx: number) => attachments.indexOf(nonImages[idx]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">첨부파일</label>
        <span className="text-xs text-muted-foreground">({attachments.length}/{maxFiles})</span>
      </div>

      {/* Image thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {images.map((file, imgIdx) => {
            const gi = globalIdx(imgIdx);
            return (
              <div key={imgIdx} className="group relative aspect-square rounded-lg overflow-hidden border bg-accent/30">
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </a>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onOcrResult && (
                    <button
                      type="button"
                      onClick={() => handleOcr(gi)}
                      disabled={ocrLoading === gi}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white transition-colors"
                      title="AI 영수증 인식"
                    >
                      {ocrLoading === gi ? (
                        <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                      ) : (
                        <ScanSearch className="h-3 w-3 text-blue-500" />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(gi)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 shadow hover:bg-red-50 transition-colors"
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </button>
                </div>
                <p className="absolute bottom-0 left-0 right-0 truncate bg-black/40 px-1.5 py-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {file.name}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Non-image file list */}
      {nonImages.length > 0 && (
        <div className="space-y-1.5">
          {nonImages.map((file, idx) => {
            const gi = nonImageGlobalIdx(idx);
            return (
              <div key={idx} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                <FileText className="h-4 w-4 shrink-0 text-orange-500" />
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 truncate hover:text-blue-600 hover:underline"
                >
                  {file.name}
                </a>
                {file.size && (
                  <span className="shrink-0 text-xs text-muted-foreground">{formatSize(file.size)}</span>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(gi)}
                  className="shrink-0 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload area */}
      {attachments.length < maxFiles && (
        <div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.xlsx,.xls,.docx,.doc"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 transition-all ${
              dragging
                ? "border-violet-400 bg-violet-50 dark:bg-violet-950/20"
                : "border-border hover:border-violet-300 hover:bg-accent/30"
            } ${uploading ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
                <p className="text-xs text-muted-foreground">
                  업로드 중... ({uploadingNames.length}개)
                </p>
                <div className="flex flex-wrap gap-1 justify-center max-w-xs">
                  {uploadingNames.map((name, i) => (
                    <span key={i} className="text-[10px] text-muted-foreground truncate max-w-[120px]">{name}</span>
                  ))}
                </div>
              </>
            ) : (
              <>
                <Upload className={`h-5 w-5 transition-colors ${dragging ? "text-violet-500" : "text-muted-foreground"}`} />
                <div className="text-center">
                  <p className="text-xs font-medium">클릭하거나 파일을 끌어다 놓으세요</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    이미지, PDF, Excel, Word · 파일당 최대 10MB · 최대 {maxFiles}개
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
