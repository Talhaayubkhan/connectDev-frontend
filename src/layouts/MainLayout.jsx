import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { setUser } from "../store/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../services/profile/fetchProfile";
import { useEffect } from "react";
import { toast } from "react-toastify";

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  // Sync fetched user into Redux store
  useEffect(() => {
    if (data) {
      dispatch(setUser(data.data));
    }
  }, [data, dispatch]);

  // Handle errors with proper distinction
  useEffect(() => {
    if (!error) return;

    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      // Token missing or expired — silently redirect, no need to alarm user
      navigate("/login");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      // Network error, timeout, etc.
      toast.error("Something went wrong. Please check your connection.");
      navigate("/login");
    }
  }, [error, navigate]);

  // Show loading screen while checking auth on refresh
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // Don't render layout if there's an auth error (avoids flash of protected content)
  if (error) return null;

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
