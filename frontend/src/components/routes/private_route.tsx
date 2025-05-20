import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth_context";
import Loader from "../loader/loader";

export default function PrivateRoute() {
  const { auth, isLoading } = useAuth();
  if (isLoading)
    return (
      <div className="flex h-dvh justify-center items-center">
        <Loader className="size-9" />
      </div>
    );
  return !!!auth ? <Navigate to={"/auth/login"} /> : <Outlet />;
}
