import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/config";

export default function useEditProfile() {
  const queryClient = useQueryClient();
  const { mutate: update, isPending: updating } = useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const res = await api.post("/user", data);
      if (res.status == 200) return res.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
      ]);
    },
  });
  return { update, updating };
}
