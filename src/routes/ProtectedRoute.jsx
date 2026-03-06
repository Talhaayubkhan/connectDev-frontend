import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../utils/constants";

const ProtectedRoute = () => {
  const user = useSelector((state) => state?.auth?.user);

  // WHY Navigate replace?
  // replace=true removes /profile from history.
  // So after login, back button doesn't go to /profile again.
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
