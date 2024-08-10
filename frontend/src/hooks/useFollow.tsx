import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/config";

export default function useFollow() {
  const queryClient = useQueryClient();
  const { mutate: follow, isPending: following } = useMutation({
    mutationFn: async ({ id }: { id: string | number }) => {
      const res = await api.post(`/user/${id}/follow`);
      if (res.status == 200) return res.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggested-users"] }),
        queryClient.invalidateQueries({ queryKey: ["auth"] }),
      ]);
    },
  });

  return { follow, following };
}
