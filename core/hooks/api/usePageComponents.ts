import API from "@/core/config/apiClient";
import type { PageWidgetMutationResponseType, PageWidgetType } from "@/core/lib/types";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePageWidgets = (id?: string) => {
  const queryClient = useQueryClient();

  const { data: pageWidgetQuery } = useSuspenseQuery({
    queryKey: ["page-widget", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<PageWidgetType>(`/api/page-widget/${id}`) : null;
    },
  });

  const { data: pageWidgetsQuery } = useSuspenseQuery({
    queryKey: ["page-widgets"],
    queryFn: async () => {
      return await API.get<PageWidgetType[]>(`/api/page-widget/`);
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (data: PageWidgetType) => {
      return API.post<PageWidgetMutationResponseType>("/api/page-widget/upsert", { ...data });
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["page-widgets"] });
      if (id) {
        await queryClient.invalidateQueries({ queryKey: ["page-widget", id] });
        toast(`Page Widget: "${response.data.pageWidget.title}" has been updated succesfully.`);
      } else {
        toast(`Page Widget: "${response.data.pageWidget.title}" has been created succesfully.`);
      }
    },
    onError: (error) => {
      toast(`Page Widget: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | null) => {
      return API.delete("/api/page-widget/", { data: { id } });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["page-widgets"] });
    },
  });

  return { pageWidgetQuery, pageWidgetsQuery, upsertMutation, deleteMutation };
};
