import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext } from "react";
import api from "../api/config";
import { User } from "../types/user.type";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: auth, isLoading } = useQuery<User>({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth/me", {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        if (res.status == 200) {
          return res.data;
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    },
  });

  return (
    <AuthContext.Provider value={{ auth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Must be with AuthProvider");
  return context;
};
