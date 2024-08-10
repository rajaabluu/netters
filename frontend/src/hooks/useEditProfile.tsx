import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth_context";

export default function useEditProfile(
  callback?: (data: any, err: any) => void
) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: update, isPending: updating } = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put("/user", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status == 200) return res.data;
    },
    onSuccess: async (data) => {
      let username = auth.username;
      if (username !== data.username) navigate("/" + data.username);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
        queryClient.invalidateQueries({ queryKey: ["posts", data.username] }),
      ]);
      if (callback) {
        callback(data, null);
      }
    },
  });
  return { update, updating };
}
