import API from "@/config/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteImageMutation = (
  onClearSelectedImage: () => void,
  setDeletion: ({ state }: { state: string }) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ publicId }: { publicId: string }) => {
      return API.post("/api/media/resources/delete", { publicId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["resources"] });
      onClearSelectedImage();
      setDeletion({ state: "idle" });
    },
  });
};
