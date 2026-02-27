import {
  useFeedQuery,
  useFeedRequestMutation,
} from "../../hooks/feed/useFeedData";
import ProfileCard from "../../components/common/ProfileCard";
import { HiUserGroup } from "react-icons/hi";
import ErrorPage from "../../components/common/ErrorPage";
import { useState } from "react";

const FeedPage = () => {
  const { data: profiles, isLoading, error } = useFeedQuery();
  const requestsMutation = useFeedRequestMutation();
  const [pendingAction, setPendingAction] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // no profiles at all OR we've gone through all of them
  if (!profiles?.length || currentIndex >= profiles.length) {
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

  // current profile to show based on index
  const currentProfile = profiles[currentIndex];

  const handleAction = (id, name, status) => {
    setPendingAction(status);
    requestsMutation.mutate(
      { status, requestId: id, name },
      {
        onSettled: () => {
          setPendingAction(null);
          setCurrentIndex((prev) => prev + 1);
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      {/* Profile counter */}
      <p className="text-sm text-base-content/50">
        {currentIndex + 1} / {profiles.length}
      </p>

      <ProfileCard
        profile={currentProfile}
        showActions={true}
        pendingAction={pendingAction}
        onAccept={(id, name) => handleAction(id, name, "interested")}
        onReject={(id, name) => handleAction(id, name, "ignored")}
      />
    </div>
  );
};

export default FeedPage;
