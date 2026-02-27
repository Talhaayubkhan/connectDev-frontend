import { useFeedQuery } from "../../hooks/feed/useFeedQuery";
import ProfileCard from "../../components/common/ProfileCard";
import { HiUserGroup } from "react-icons/hi";
import ErrorPage from "../../components/common/ErrorPage";

const FeedPage = () => {
  const { data: profiles, isLoading, error } = useFeedQuery();

  // loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorPage
        code="500"
        message="Something went wrong"
        subMessage="Failed to load feed. Please try refreshing."
      />
    );
  }

  if (!profiles?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-base-content/50">
        <HiUserGroup size={64} />
        <p className="text-xl font-semibold">No Profiles Found</p>
        <p className="text-sm">
          Check back later for new people to connect with!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ProfileCard profile={profiles[6]} showActions={true} />
    </div>
  );
};

export default FeedPage;
