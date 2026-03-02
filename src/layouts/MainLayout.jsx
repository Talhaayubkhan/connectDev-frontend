import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { setUser } from "../store/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useShowProfile } from "../hooks/profile/useShowProfile";
import ErrorPage from "../components/common/ErrorPage";
import { ROUTES } from "../utils/constants";

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, data } = useShowProfile();

  useEffect(() => {
    if (data) {
      dispatch(setUser(data?.data)); // verify this matches your API response shape
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!error) return;

    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      navigate(ROUTES.LOGIN);
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (!status) {
      // ✅ network error — don't kick user to login
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("Something went wrong.");
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error && error?.response?.status !== 401) {
    return <ErrorPage />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
