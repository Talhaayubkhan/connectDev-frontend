import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { setUser } from "../store/features/auth/authSlice";
import { useShowProfile } from "../hooks/profile/useShowProfile";
import { ROUTES } from "../utils/constants";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user);

  const { data, isLoading, error } = useShowProfile();

  useEffect(() => {
    if (data?.data) {
      dispatch(setUser(data.data));
    }
  }, [data, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!user && !data?.data) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
