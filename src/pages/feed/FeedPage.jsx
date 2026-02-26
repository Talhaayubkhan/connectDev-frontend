import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useFeedQuery } from "../../hooks/feed/useFeedQuery";
import ProfileCard from "../../components/common/ProfileCard";

const FeedPage = () => {
  const navigate = useNavigate();

  const { data: profiles, isLoading, error } = useFeedQuery();

  useEffect(() => {
    if (!error) return;

    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      navigate("/login");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error("Network error. Please check connection.");
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!profiles?.length) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold">
        No profiles found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ProfileCard profile={profiles[6]} />
    </div>
  );
};

export default FeedPage;
