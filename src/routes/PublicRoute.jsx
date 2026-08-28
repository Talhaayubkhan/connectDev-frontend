import { Navigate, Outlet } from "react-router-dom";
import { useShowProfile } from "../hooks/profile/useShowProfile";
import PageLoader from "../components/common/PageLoader";
import { ROUTES } from "../utils/constants";

const PublicRoute = () => {
  const { data: user, isLoading } = useShowProfile();

  if (isLoading) {
    return <PageLoader label="Checking your session" fullPage />;
  }

  if (user) {
    return <Navigate to={ROUTES.FEED} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
