import { useMutation } from "@tanstack/react-query";
import api from "../api/config";

export default function useLike() {
  const { mutate: like, isPending: liking } = useMutation({
    mutationFn: async (id: string | number) => {
      const res = await api.post(`/post/${id}/like`);
      if (res.status == 200) return id;
    },
  });
  return { like, liking };
}
