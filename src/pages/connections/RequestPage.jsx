import { HiUserGroup, HiCheck, HiX } from "react-icons/hi";
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

  const [pendingAction, setPendingAction] = useState(null);

  const handleReview = (requestId, status) => {
    if (pendingAction) return;
    setPendingAction({ id: requestId, type: status });

    reviewRequestMutation.mutate(
      { status, requestId },
      {
        onSettled: () => setPendingAction(null),
        onError: () => alert("Something went wrong. Please try again."),
      },
    );
  };

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
        message="Failed to load requests"
        subMessage="Please refresh or try again later."
      />
    );
  }

  if (!requests?.length) {
    return (
      // CHANGED: wrapped icon in a soft circular badge instead of a bare icon.
      // A floating icon on its own looks unfinished; a contained badge reads
      // as an intentional "empty state illustration" rather than a placeholder.
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
          <HiUserGroup size={36} className="text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-base-content">
            No requests yet
          </h2>
          <p className="text-sm text-base-content/60 max-w-xs">
            When people send you connection requests, they'll show up here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* CHANGED: header now sits inside a bottom-border block instead of
          floating loose — gives the page a clear "section start" instead of
          the title feeling disconnected from the list below it. */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-base-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
            Requests
          </h1>
          <p className="text-sm text-base-content/50 mt-0.5">
            People who want to connect with you
          </p>
        </div>

        <span className="badge badge-primary badge-lg font-semibold">
          {requests.length}
        </span>
      </div>

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
    </div>
  );
};

export default RequestsPage;
