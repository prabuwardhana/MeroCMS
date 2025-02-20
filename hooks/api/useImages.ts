import API, { CloudinaryClient } from "@/config/apiClient";
import { CloudinaryResponseType, ExtendedFile } from "@/lib/types";
import { useFileUploadStore } from "@/store/fileUploadStore";
import { useMutation, useQueryClient, useSuspenseInfiniteQuery } from "@tanstack/react-query";

export const useImages = (
  nextCursor: string | null,
  onClearSelectedImage?: () => void,
  setDeletion?: ({ state }: { state: string }) => void,
  onTabChange?: (value: string) => void,
) => {
  const queryClient = useQueryClient();

  const { updateUploadProgress, updateUploadStatus, appendFiles, removeFile } = useFileUploadStore((state) => state);

  const {
    data: { pages },
    fetchNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ["resources"],
    queryFn: async ({ pageParam }) => {
      return await API.get<CloudinaryResponseType>(`/api/media/resources/${pageParam}`);
    },
    initialPageParam: null,
    getNextPageParam: () => {
      return nextCursor;
    },
    staleTime: 60 * 60 * 1000,
  });

  const uploadMutation = useMutation({
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

  const deleteMutation = useMutation({
    mutationFn: async ({ publicId }: { publicId: string }) => {
      return API.post("/api/media/resources/delete", { publicId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["resources"] });
      if (onClearSelectedImage) onClearSelectedImage();
      if (setDeletion) setDeletion({ state: "idle" });
    },
  });

  return { pages, fetchNextPage, uploadMutation, deleteMutation };
};
