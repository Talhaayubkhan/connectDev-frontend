import { HiUserGroup } from "react-icons/hi";
import {
  useConnectionRequests,
  useReviewConnectionRequest,
} from "../../hooks/connections/useConnections";
import UserCard from "../../components/common/UserCard";
import ErrorPage from "../../components/common/ErrorPage";

const RequestsPage = () => {
  // recevied request
  const { data: requests, isLoading, error } = useConnectionRequests();
  // for accept/reject -
  const reviewRequestMutation = useReviewConnectionRequest();

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

  // ✅ data is now clean array from hook — no more data?.data
  if (!requests?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-base-content/50">
        <HiUserGroup size={64} />
        <p className="text-xl font-semibold">No Requests Yet</p>
        <p className="text-sm">Start connecting with people on the feed!</p>
      </div>
    );
  }

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
            onAccept={(id) =>
              reviewRequestMutation.mutate({
                status: "accepted",
                requestId: id,
              })
            }
            onReject={(id) =>
              reviewRequestMutation.mutate({
                status: "rejected",
                requestId: id,
              })
            }
          />
        ))}
      </div>
    </div>
  );
};

export default RequestsPage;
