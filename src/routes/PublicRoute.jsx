import { Navigate, Outlet } from "react-router-dom";
import { useShowProfile } from "../hooks/profile/useShowProfile";

const PublicRoute = () => {
  const { data: user, isLoading } = useShowProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // Already logged in → block login page
  if (user) {
    return <Navigate to="/feed" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
