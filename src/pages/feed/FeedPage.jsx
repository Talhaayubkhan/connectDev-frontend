import { useState } from "react";
import { HiUserGroup } from "react-icons/hi";
import EmptyState from "../../components/common/EmptyState";
import ErrorPage from "../../components/common/ErrorPage";
import PageLoader from "../../components/common/PageLoader";
import ProfileCard from "../../components/common/ProfileCard";
import {
  useFeedQuery,
  useFeedRequestMutation,
} from "../../hooks/feed/useFeedData";

const FeedPage = () => {
  const { data, isLoading, error, refetch } = useFeedQuery();
  const requestsMutation = useFeedRequestMutation();
  const [pendingAction, setPendingAction] = useState(null);
  const users = data?.users || [];

  if (isLoading) return <PageLoader label="Loading developer feed" />;
  if (error) {
    return (
      <ErrorPage
        code="500"
        message="Failed to load the feed"
        subMessage="Check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  const currentProfile = users[0];
  if (!currentProfile) {
    return (
      <EmptyState
        icon={HiUserGroup}
        title="No profiles available"
        description="You are all caught up. Check back later for new developers."
      />
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
    <section className="flex min-h-[calc(100dvh-10rem)] flex-col items-center justify-center gap-4 py-6 sm:py-10">
      <p className="text-sm text-base-content/60" aria-live="polite">
        {users.length} {users.length === 1 ? "profile" : "profiles"} remaining
      </p>
      <ProfileCard
        profile={currentProfile}
        pendingAction={pendingAction}
        onAccept={(id, name) => handleAction(id, name, "interested")}
        onReject={(id, name) => handleAction(id, name, "ignored")}
      />
    </section>
  );
};

export default FeedPage;
