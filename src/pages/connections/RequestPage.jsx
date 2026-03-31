import { HiUserGroup } from "react-icons/hi";
import {
  useConnectionRequests,
  useReviewConnectionRequest,
} from "../../hooks/connections/useConnections";
import UserCard from "../../components/common/UserCard";
import ErrorPage from "../../components/common/ErrorPage";
import { useState } from "react";

const RequestsPage = () => {
  const { data: requests, isLoading, error } = useConnectionRequests();
  const reviewRequestMutation = useReviewConnectionRequest();

  // More explicit structure (clearer than raw object)
  const [pendingAction, setPendingAction] = useState(null);
  // { id: string, type: "accepted" | "rejected" }

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <ErrorPage
        code="500"
        message="Failed to load requests"
        subMessage="Please refresh or try again later."
      />
    );
  }

  // Empty State
  if (!requests?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-base-content/60 text-center px-4">
        <HiUserGroup size={64} className="opacity-70" />
        <h2 className="text-xl font-semibold">No Requests Yet</h2>
        <p className="text-sm max-w-xs">
          When people send you connection requests, they will appear here.
        </p>
      </div>
    );
  }

  // Handlers
  const handleReview = (requestId, status) => {
    // Prevent multiple simultaneous actions
    if (pendingAction) return;

    setPendingAction({ id: requestId, type: status });

    reviewRequestMutation.mutate(
      { status, requestId },
      {
        onSettled: () => setPendingAction(null),
      },
    );
  };

  // Main UI
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
          Requests
        </h1>

        <span className="badge badge-primary sm:badge-lg">
          {requests.length}
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
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
    </div>
  );
};

export default RequestsPage;
