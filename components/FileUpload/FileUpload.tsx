import React, { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { CloudUpload } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { opacityVariants } from "@/constants/framerMotion";
import { CloudinaryClient } from "@/config/apiClient";
import { useAppStore } from "@/store/store";
import { ExtendedFile } from "@/store/types";

import UploadProgressCard from "@/components/UploadProgressCard";
import Container from "@/components/Container";

interface FileUploadProps {
  onTabChange: (value: string) => void;
}

const FileUpload = ({ onTabChange }: FileUploadProps) => {
  const files = useAppStore((state) => state.files);
  const updateUploadProgress = useAppStore((state) => state.updateUploadProgress);
  const updateUploadStatus = useAppStore((state) => state.updateUploadStatus);
  const appendFiles = useAppStore((state) => state.appendFiles);
  const removeFile = useAppStore((state) => state.removeFile);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (files: ExtendedFile[]) => {
      const uploadPromises = files.map(async (file) => {
        if (file.uploadStatus === "idle") {
          updateUploadStatus(file.id, "uploading");

          const formData = new FormData();
          formData.append("file", file.file);
          formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
          formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

          return await CloudinaryClient.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                const progress = progressEvent.total
                  ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                  : 0;
                updateUploadProgress(file.id, progress);
              },
            },
          )
            .then(() => {
              updateUploadStatus(file.id, "success");
              removeFile(file.id);
            })
            .catch(() => {
              updateUploadStatus(file.id, "error");
            });
        }

        return Promise.resolve();
      });

      await Promise.all(uploadPromises);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["resources"] });
      onTabChange("gallery");
    },
    onMutate: (variables) => {
      appendFiles(variables.map((item) => Object.assign(item.file, { preview: URL.createObjectURL(item.file) })));
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      console.log(acceptedFiles);

      mutation.mutate(
        acceptedFiles.map((item) => ({
          file: item,
          id: `${item.name}${item.size}`,
          uploadProgress: 0,
          uploadStatus: "idle",
        })),
      );
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 4,
    maxSize: 4 * 1024 * 1024,
    onDrop,
  });

  return (
    <Container className="h-[460px] overflow-y-auto">
      <div {...getRootProps()} className="h-full">
        {files.length ? (
          <UploadProgressCard files={files} />
        ) : (
          <>
            <input {...getInputProps()} />
            <label htmlFor="file_upload_btn" className="cursor-pointer">
              <AnimatePresence>
                <motion.div
                  key="drop-zone"
                  variants={opacityVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="border-2 border-dotted border-primary bg-primary/10 w-full h-full flex flex-col gap-2 items-center justify-center p-4 rounded-md"
                >
                  <CloudUpload size={96} className="text-primary" />
                  {isDragActive ? (
                    <p className="text-primary text-center">Drop the files here ...</p>
                  ) : (
                    <>
                      <p className="text-primary text-center">
                        <strong>Choose a file,</strong> or drag it here.
                      </p>
                      <p className="text-xs text-primary text-center">(Max file size: 1MB)</p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </label>
          </>
        )}
      </div>
    </Container>
  );
};

export default FileUpload;
