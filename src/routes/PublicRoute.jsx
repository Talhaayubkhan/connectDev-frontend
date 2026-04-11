import { Navigate, Outlet } from "react-router-dom";
import { useShowProfile } from "../hooks/profile/useShowProfile";

const PublicRoute = () => {
  const { data: user, isLoading } = useShowProfile();

  if (isLoading) return null;

  // Already logged in → block login page
  if (user) {
    return <Navigate to="/feed" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
