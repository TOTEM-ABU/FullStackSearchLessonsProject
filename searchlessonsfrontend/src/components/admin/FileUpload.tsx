import React, { useState, useRef, useCallback } from "react";
import { fileAPI } from "../../services/api";
import {
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  File,
  Trash2,
  Eye,
  Download,
  Loader,
  Check,
  AlertCircle,
} from "lucide-react";

interface FileUploadProps {
  onFileUpload?: (fileUrl: string) => void;
  onFilesUpload?: (fileUrls: string[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  className?: string;
  disabled?: boolean;
  preview?: boolean;
  existingFiles?: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  status: "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  onFilesUpload,
  accept = "*/*",
  multiple = false,
  maxFiles = 5,
  maxFileSize = 10, // 10MB default
  className = "",
  disabled = false,
  preview = true,
  existingFiles = [],
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with existing files
  React.useEffect(() => {
    if (existingFiles.length > 0) {
      const existingFileObjects: UploadedFile[] = existingFiles.map(
        (url, index) => ({
          id: `existing-${index}`,
          name: url.split("/").pop() || `File ${index + 1}`,
          url,
          type: getFileTypeFromUrl(url),
          size: 0,
          status: "success" as const,
          progress: 100,
        })
      );
      setFiles(existingFileObjects);
    }
  }, [existingFiles]);

  const getFileTypeFromUrl = (url: string): string => {
    const extension = url.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return "image";
    }
    if (["mp4", "avi", "mov", "wmv"].includes(extension || "")) {
      return "video";
    }
    if (["mp3", "wav", "flac", "aac"].includes(extension || "")) {
      return "audio";
    }
    if (["pdf"].includes(extension || "")) {
      return "pdf";
    }
    return "file";
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-8 w-8 text-blue-500" />;
      case "video":
        return <Video className="h-8 w-8 text-purple-500" />;
      case "audio":
        return <Music className="h-8 w-8 text-green-500" />;
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }
    return null;
  };

  const uploadFile = async (file: File): Promise<string> => {
    try {
      const response = await fileAPI.uploadFile(file);
      return response.url;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Upload failed");
    }
  };

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      if (disabled) return;

      const newFiles = Array.from(fileList);
      const totalFiles = files.length + newFiles.length;

      if (totalFiles > maxFiles) {
        alert(`You can only upload up to ${maxFiles} files`);
        return;
      }

      const fileObjects: UploadedFile[] = newFiles.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        url: "",
        type: file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
          ? "video"
          : file.type.startsWith("audio/")
          ? "audio"
          : file.type === "application/pdf"
          ? "pdf"
          : "file",
        size: file.size,
        status: "uploading" as const,
        progress: 0,
      }));

      setFiles((prev) => [...prev, ...fileObjects]);

      // Upload files
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        const fileObj = fileObjects[i];

        // Validate file
        const error = validateFile(file);
        if (error) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id ? { ...f, status: "error", error } : f
            )
          );
          continue;
        }

        try {
          // Simulate progress for better UX
          const progressInterval = setInterval(() => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileObj.id && f.progress < 90
                  ? { ...f, progress: f.progress + 10 }
                  : f
              )
            );
          }, 200);

          const url = await uploadFile(file);

          clearInterval(progressInterval);

          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? { ...f, url, status: "success", progress: 100 }
                : f
            )
          );

          // Call callbacks
          if (onFileUpload && !multiple) {
            onFileUpload(url);
          }
        } catch (error: any) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? { ...f, status: "error", error: error.message }
                : f
            )
          );
        }
      }

      // Call onFilesUpload for multiple files
      if (onFilesUpload && multiple) {
        const successfulFiles = files
          .filter((f) => f.status === "success" && f.url)
          .map((f) => f.url);
        onFilesUpload(successfulFiles);
      }
    },
    [
      files,
      maxFiles,
      maxFileSize,
      disabled,
      multiple,
      onFileUpload,
      onFilesUpload,
    ]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));

    if (onFilesUpload && multiple) {
      const remainingFiles = files
        .filter((f) => f.id !== id && f.status === "success" && f.url)
        .map((f) => f.url);
      onFilesUpload(remainingFiles);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
        e.dataTransfer.clearData();
      }
    },
    [handleFiles]
  );

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`file-upload ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Click to upload or drag and drop
        </p>
        <p className="text-sm text-gray-500">
          {accept === "*/*" ? "Any file type" : accept} up to {maxFileSize}MB
        </p>
        {multiple && (
          <p className="text-xs text-gray-400 mt-1">Maximum {maxFiles} files</p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-900">
            Uploaded Files ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {file.type === "image" && file.url && preview ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    getFileIcon(file.type)
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {file.status === "uploading" && (
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <Loader className="h-4 w-4 animate-spin text-indigo-600" />
                    </div>
                  )}

                  {file.status === "success" && (
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      {file.url && (
                        <>
                          <button
                            onClick={() => window.open(file.url, "_blank")}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="View file"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <a
                            href={file.url}
                            download={file.name}
                            className="p-1 text-gray-600 hover:text-gray-800"
                            title="Download file"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </>
                      )}
                    </div>
                  )}

                  {file.status === "error" && (
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-xs text-red-600">{file.error}</span>
                    </div>
                  )}

                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Remove file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
