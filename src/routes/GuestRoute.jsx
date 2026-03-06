import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  const user = useSelector((state) => state?.auth?.user);

  // WHY redirect to "/" not ROUTES.FEED?
  // "/" is the index route = feed page.
  // If user is already logged in, send them home.
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default GuestRoute;
