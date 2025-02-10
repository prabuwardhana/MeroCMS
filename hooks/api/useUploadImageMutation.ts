import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CloudinaryClient } from "@/config/apiClient";
import { ExtendedFile } from "@/lib/types";
import { useFileUploadStore } from "@/store/fileUploadStore";

export const useUploadImageMutation = (onTabChange?: (value: string) => void) => {
  const { updateUploadProgress, updateUploadStatus, appendFiles, removeFile } = useFileUploadStore((state) => state);

  const queryClient = useQueryClient();

  return useMutation({
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
      if (onTabChange) onTabChange("gallery");
    },
    onMutate: (variables) => {
      appendFiles(variables.map((item) => Object.assign(item.file, { preview: URL.createObjectURL(item.file) })));
    },
  });
};
