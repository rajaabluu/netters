import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth_context";
import Loader from "../loader/loader";

export default function GuestRoute() {
  const { auth, isLoading } = useAuth();
  if (isLoading)
    return (
      <div className="h-dvh flex items-center justify-center">
        <Loader className="size-8" />
      </div>
    );
  return !!auth ? <Navigate to={"/"} /> : <Outlet />;
}
