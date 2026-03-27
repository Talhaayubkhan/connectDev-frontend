import {
  useFeedQuery,
  useFeedRequestMutation,
} from "../../hooks/feed/useFeedData";
import ProfileCard from "../../components/common/ProfileCard";
import { HiUserGroup } from "react-icons/hi";
import { RiRobot2Fill } from "react-icons/ri";

import ErrorPage from "../../components/common/ErrorPage";
import { useState } from "react";

const FeedPage = () => {
  const { data, isLoading, error } = useFeedQuery();
  const users = data?.users || [];

  const requestsMutation = useFeedRequestMutation();
  const [pendingAction, setPendingAction] = useState(null);

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

  const currentProfile = users[0];

  if (!currentProfile) {
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

  const handleAction = (id, name, status) => {
    if (requestsMutation.isPending) return;
    setPendingAction(status);
    requestsMutation.mutate(
      { status, requestId: id, name },
      { onSettled: () => setPendingAction(null) },
    );
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-base-content/50">
          {users.length} {users.length === 1 ? "profile" : "profiles"} remaining
        </p>
        <ProfileCard
          profile={currentProfile}
          showActions={true}
          pendingAction={pendingAction}
          onAccept={(id, name) => handleAction(id, name, "interested")}
          onReject={(id, name) => handleAction(id, name, "ignored")}
        />
      </div>

      <div className="flex justify-end items-end text-3xl px-10 cursor-pointer">
        <RiRobot2Fill />
      </div>
    </>
  );
};

export default FeedPage;
