import { useState } from "react";
import { HiUserGroup } from "react-icons/hi";
import EmptyState from "../../components/common/EmptyState";
import ErrorPage from "../../components/common/ErrorPage";
import PageLoader from "../../components/common/PageLoader";
import UserCard from "../../components/common/UserCard";
import {
  useConnectionRequests,
  useReviewConnectionRequest,
} from "../../hooks/connections/useConnections";

const RequestsPage = () => {
  const { data: requests, isLoading, error, refetch } = useConnectionRequests();
  const reviewRequestMutation = useReviewConnectionRequest();
  const [pendingAction, setPendingAction] = useState(null);

  const handleReview = (requestId, status) => {
    if (pendingAction) return;
    setPendingAction({ id: requestId, status });
    reviewRequestMutation.mutate(
      { status, requestId },
      { onSettled: () => setPendingAction(null) },
    );
  };

  if (isLoading) return <PageLoader label="Loading connection requests" />;
  if (error) {
    return (
      <ErrorPage
        code="500"
        message="Failed to load requests"
        subMessage="Check your connection and try again."
        onRetry={refetch}
      />
    );
  }
  if (!requests?.length) {
    return (
      <EmptyState
        icon={HiUserGroup}
        title="No requests yet"
        description="New connection requests will appear here."
      />
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-1 py-6 sm:px-4 sm:py-10">
      <header className="mb-6 flex items-center justify-between gap-3 border-b border-base-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
            Requests
          </h1>
          <p className="mt-0.5 text-sm text-base-content/60">
            Review people who want to connect with you.
          </p>
        </div>
        <span className="badge badge-primary badge-lg font-semibold">
          {requests.length}
        </span>
      </header>
      <div className="flex flex-col gap-3">
        {requests.map((request) => (
          <UserCard
            key={request._id}
            data={request}
            mode="request"
            pendingId={pendingAction}
            onAccept={(id) => handleReview(id, "accepted")}
            onReject={(id) => handleReview(id, "rejected")}
          />
        ))}
      </div>
    </section>
  );
};

export default RequestsPage;
