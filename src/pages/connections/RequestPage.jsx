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
  const [pendingId, setPendingId] = useState(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorPage
        code="500"
        message="Failed to load connections"
        subMessage="Something went wrong. Please try again."
      />
    );
  }

  if (!requests?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-base-content/50">
        <HiUserGroup size={64} />
        <p className="text-xl font-semibold">No Requests Yet</p>
        <p className="text-sm">Start connecting with people on the feed!</p>
      </div>
    );
  }

  const handleReview = (requestId, status) => {
    // WHY guard with pendingId?
    // Prevents clicking another card while one is already loading.
    // One action at a time — clean and safe.
    if (pendingId) return;

    setPendingId({ id: requestId, status });

    reviewRequestMutation.mutate(
      { status, requestId },
      {
        // WHY onSettled not onSuccess?
        // onSettled fires on both success AND error.
        // pendingId always clears — button never gets stuck loading.
        onSettled: () => setPendingId(null),
      },
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-base-content mb-8">
        Requests
        <span className="ml-2 badge badge-primary badge-lg">
          {requests.length}
        </span>
      </h1>
      <div className="flex flex-col gap-4">
        {requests.map((request) => (
          <UserCard
            key={request._id}
            data={request}
            mode="request"
            // WHY pass pendingId down?
            // UserCard needs to know which button to spin.
            // It checks: is this card's id == pendingId.id?
            pendingId={pendingId}
            onAccept={(id) => handleReview(id, "accepted")}
            onReject={(id) => handleReview(id, "rejected")}
          />
        ))}
      </div>
    </div>
  );
};

export default RequestsPage;
