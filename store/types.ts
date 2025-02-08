type UploadStatus = "idle" | "uploading" | "success" | "error";

export type ExtendedFile = {
  file: File;
  id: string;
  uploadProgress: number;
  uploadStatus: UploadStatus;
};
