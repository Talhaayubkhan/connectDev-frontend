// import { HiUserGroup } from "react-icons/hi";
// import {
//   useConnectionRequests,
//   useReviewConnectionRequest,
// } from "../../hooks/connections/useConnections";
// import UserCard from "../../components/common/UserCard";
// import ErrorPage from "../../components/common/ErrorPage";
// import { useState } from "react";

// const RequestsPage = () => {
//   const { data: requests, isLoading, error } = useConnectionRequests();
//   const reviewRequestMutation = useReviewConnectionRequest();

//   // More explicit structure (clearer than raw object)
//   const [pendingAction, setPendingAction] = useState(null);
//   // { id: string, type: "accepted" | "rejected" }

//   // Loading State
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <span className="loading loading-spinner loading-lg text-primary" />
//       </div>
//     );
//   }

//   // Error State
//   if (error) {
//     return (
//       <ErrorPage
//         code="500"
//         message="Failed to load requests"
//         subMessage="Please refresh or try again later."
//       />
//     );
//   }

//   // Empty State
//   if (!requests?.length) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-base-content/60 text-center px-4">
//         <HiUserGroup size={64} className="opacity-70" />
//         <h2 className="text-xl font-semibold">No Requests Yet</h2>
//         <p className="text-sm max-w-xs">
//           When people send you connection requests, they will appear here.
//         </p>
//       </div>
//     );
//   }

//   // Handlers
//   const handleReview = (requestId, status) => {
//     // Prevent multiple simultaneous actions
//     if (pendingAction) return;

//     setPendingAction({ id: requestId, type: status });

//     reviewRequestMutation.mutate(
//       { status, requestId },
//       {
//         onSettled: () => setPendingAction(null),
//       },
//     );
//   };

//   // Main UI
//   return (
//     <div className="max-w-3xl mx-auto py-10 px-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
//         <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
//           Requests
//         </h1>

//         <span className="badge badge-primary sm:badge-lg">
//           {requests.length}
//         </span>
//       </div>

//       {/* List */}
//       <div className="flex flex-col gap-4">
//         {requests.map((request) => (
//           <UserCard
//             key={request._id}
//             data={request}
//             mode="request"
//             pendingId={pendingAction}
//             onAccept={(id) => handleReview(id, "accepted")}
//             onReject={(id) => handleReview(id, "rejected")}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RequestsPage;

import { HiUserGroup } from "react-icons/hi";
import { HiUserPlus, HiInbox } from "react-icons/hi2";
import {
  useConnectionRequests,
  useReviewConnectionRequest,
} from "../../hooks/connections/useConnections";
import UserCard from "../../components/common/UserCard";
import ErrorPage from "../../components/common/ErrorPage";
import { useState } from "react";
import { Link } from "react-router-dom";

const RequestsPage = () => {
  const { data: requests, isLoading, error, refetch } = useConnectionRequests();
  const reviewRequestMutation = useReviewConnectionRequest();
  const [pendingAction, setPendingAction] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, reviewed

  // Filter requests
  const filteredRequests = requests?.filter((request) => {
    if (filter === "all") return true;
    return true; // Add your filter logic based on request status
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="text-base-content/60">Loading requests...</p>
        </div>
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
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="bg-base-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <HiInbox size={40} className="text-base-content/40" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-base-content">
              No Pending Requests
            </h2>
            <p className="text-sm text-base-content/60">
              When people send you connection requests, they will appear here.
            </p>
          </div>
          <Link to="/feed" className="btn btn-primary btn-sm gap-2">
            <HiUserPlus size={16} />
            Discover People
          </Link>
        </div>
      </div>
    );
  }

  const handleReview = (requestId, status) => {
    if (pendingAction) return;
    setPendingAction({ id: requestId, type: status });
    reviewRequestMutation.mutate(
      { status, requestId },
      {
        onSuccess: () => {
          refetch(); // Refresh the list
        },
        onSettled: () => setPendingAction(null),
      },
    );
  };

  const acceptCount =
    requests?.filter((r) => r.status === "accepted").length || 0;
  const pendingCount =
    requests?.filter((r) => r.status === "pending").length ||
    requests?.length ||
    0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100">
      <div className="max-w-4xl mx-auto py-6 md:py-10 px-4">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                Connection Requests
              </h1>
              <p className="text-sm text-base-content/60 mt-1">
                Review and manage incoming requests
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="badge badge-warning badge-lg gap-1">
                <HiUserGroup size={14} />
                {pendingCount} Pending
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4 border-b border-base-200">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                filter === "all"
                  ? "text-primary"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              All Requests
              {filter === "all" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                filter === "pending"
                  ? "text-primary"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              Pending
              {filter === "pending" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg p-4">
            <p className="text-2xl font-bold text-warning">{pendingCount}</p>
            <p className="text-xs text-base-content/60">Pending Requests</p>
          </div>
          <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-lg p-4">
            <p className="text-2xl font-bold text-success">{acceptCount}</p>
            <p className="text-xs text-base-content/60">Accepted</p>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests?.map((request) => (
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

        {/* Tip Section */}
        <div className="mt-8 p-4 bg-base-200 rounded-lg">
          <p className="text-xs text-base-content/60 text-center">
            💡 Tip: Accepting requests helps you build your professional
            network. You can message your connections directly from the
            connections page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
