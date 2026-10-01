import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, Loader2, AlertCircle, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useResumes } from "@/hooks/useResumes";

export function UploadDropzone({
  onComplete,
  autoUpload = true,
  onFileSelect,
  selectedFile: externalSelectedFile = null,
  disabled = false,
}) {
  const [internalSelectedFile, setInternalSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const { uploadResume, isUploading } = useResumes();
  const navigate = useNavigate();

  const currentSelectedFile = externalSelectedFile !== null ? externalSelectedFile : internalSelectedFile;

  const handleSelectFile = (file) => {
    setInternalSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setInternalSelectedFile(null);
    onFileSelect?.(null);
  };

  const onDrop = async (acceptedFiles, fileRejections) => {
    setErrorMsg("");
    if (fileRejections && fileRejections.length > 0) {
      const rej = fileRejections[0];
      if (rej.file.size > 5 * 1024 * 1024) {
        setErrorMsg("File size exceeds maximum limit of 5MB.");
      } else {
        setErrorMsg("Only PDF files are supported.");
      }
      return;
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    if (!autoUpload) {
      handleSelectFile(file);
      return;
    }

    try {
      setProgress(10);
      const res = await uploadResume({
        file,
        onProgress: (p) => setProgress(p),
      });

      const resumeId = res?.data?.resume?._id || res?.resume?._id || res?.data?._id || res?._id;
      if (resumeId) {
        onComplete?.();
        navigate(`/resumes/${resumeId}`);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to process PDF resume.");
    } finally {
      setProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: disabled || isUploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all duration-200 cursor-pointer select-none min-h-[220px] flex flex-col items-center justify-center ${
          currentSelectedFile
            ? "border-accent/60 bg-accent-soft/20"
            : isDragActive
            ? "border-accent bg-accent-soft/50 scale-[1.01]"
            : "border-border bg-surface hover:border-accent/40 hover:bg-surface-2/40"
        } ${disabled || isUploading ? "pointer-events-none opacity-80" : ""}`}
      >
        <input {...getInputProps()} />

        {currentSelectedFile && !autoUpload ? (
          <div className="flex flex-col items-center justify-center space-y-3 w-full">
            {/* Pill Chip Container */}
            <div className="inline-flex items-center gap-3 bg-surface-2 border border-border/80 rounded-full p-2 pl-2.5 pr-1.5 shadow-xs max-w-full">
              {/* Icon box + check badge */}
              <div className="relative w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-surface-2 shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>

              {/* File Info */}
              <div className="flex flex-col text-left min-w-0 pr-1">
                <span className="font-display font-bold text-xs text-ink truncate max-w-[150px] md:max-w-[260px]">
                  {currentSelectedFile.name}
                </span>
                <span className="text-[11px] text-ink-muted">
                  {(currentSelectedFile.size / (1024 * 1024)).toFixed(2)} MB • PDF
                </span>
              </div>

              {/* Remove button */}
              {!disabled && !isUploading && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  aria-label="Remove file"
                  className="w-11 h-11 flex items-center justify-center text-ink-muted hover:text-danger hover:bg-surface rounded-full transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Change File button */}
            {!disabled && !isUploading && (
              <span className="text-xs font-semibold text-ink-muted hover:text-accent transition-colors cursor-pointer min-h-[44px] px-3 flex items-center justify-center">
                Change file
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-accent-soft text-accent flex items-center justify-center shadow-sm">
              {isUploading ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : (
                <UploadCloud className="w-7 h-7" />
              )}
            </div>

            <div className="space-y-1 max-w-sm">
              <p className="font-display font-bold text-base text-ink">
                {isDragActive
                  ? "Drop your PDF resume here..."
                  : isUploading
                  ? "Parsing & processing resume..."
                  : "Upload your PDF resume"}
              </p>
              <p className="text-xs text-ink-muted leading-relaxed">
                Drag & drop your file here, or{" "}
                <span className="text-accent font-semibold underline">browse files</span>. PDF format only, max 5MB.
              </p>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="w-full max-w-xs space-y-1.5 pt-2">
                <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-accent block text-center tabular-nums">
                  {progress}% uploaded
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

export default UploadDropzone;
