import { Navigate, Outlet } from "react-router-dom";
import { useShowProfile } from "../hooks/profile/useShowProfile";
import PageLoader from "../components/common/PageLoader";
import { ROUTES } from "../utils/constants";

const ProtectedRoute = () => {
  const { data: user, isLoading } = useShowProfile();

  if (isLoading) {
    return <PageLoader label="Checking your session" fullPage />;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
