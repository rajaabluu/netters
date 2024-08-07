import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/config";

export default function useFollow(id: string | number) {
  const queryClient = useQueryClient();
  const { mutate: follow, isPending: following } = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/user/${id}/follow`);
      if (res.status == 200) return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return { follow, following };
}
