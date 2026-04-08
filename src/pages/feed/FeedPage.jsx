// import {
//   useFeedQuery,
//   useFeedRequestMutation,
// } from "../../hooks/feed/useFeedData";
// import { useState } from "react";
// import ProfileCard from "../../components/common/ProfileCard";
// import { HiUserGroup } from "react-icons/hi";
// import ErrorPage from "../../components/common/ErrorPage";

// const FeedPage = () => {
//   const { data, isLoading, error } = useFeedQuery();
//   const users = data?.users || [];

//   const requestsMutation = useFeedRequestMutation();
//   const [pendingAction, setPendingAction] = useState(null);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <span className="loading loading-spinner loading-lg text-primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <ErrorPage
//         code="500"
//         message="Something went wrong"
//         subMessage="Failed to load feed. Please try refreshing."
//       />
//     );
//   }

//   const currentProfile = users[0];

//   if (!currentProfile) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-base-content/50">
//         <HiUserGroup size={64} />
//         <p className="text-xl font-semibold">No Profiles Found</p>
//         <p className="text-sm">
//           Check back later for new people to connect with!
//         </p>
//       </div>
//     );
//   }

//   const handleAction = (id, name, status) => {
//     if (requestsMutation.isPending) return;
//     setPendingAction(status);
//     requestsMutation.mutate(
//       { status, requestId: id, name },
//       { onSettled: () => setPendingAction(null) },
//     );
//   };

//   return (
//     <>
//       <div className="min-h-screen flex flex-col items-center justify-center gap-4">
//         <p className="text-sm text-base-content/50">
//           {users.length} {users.length === 1 ? "profile" : "profiles"} remaining
//         </p>
//         <ProfileCard
//           profile={currentProfile}
//           showActions={true}
//           pendingAction={pendingAction}
//           onAccept={(id, name) => handleAction(id, name, "interested")}
//           onReject={(id, name) => handleAction(id, name, "ignored")}
//         />
//       </div>
//     </>
//   );
// };

// export default FeedPage;

import {
  useFeedQuery,
  useFeedRequestMutation,
} from "../../hooks/feed/useFeedData";
import { useState } from "react";
import ProfileCard from "../../components/common/ProfileCard";
import { HiUserGroup } from "react-icons/hi";
import ErrorPage from "../../components/common/ErrorPage";

const FeedPage = () => {
  const { data, isLoading, error } = useFeedQuery();
  const users = data?.users || [];

  const requestsMutation = useFeedRequestMutation();
  const [pendingAction, setPendingAction] = useState(null);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <ErrorPage
        code="500"
        message="Unable to load feed"
        subMessage="Please check your connection and try again"
      />
    );
  }

  // Show empty state
  if (!users.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 text-center px-4">
        <HiUserGroup size={64} className="text-base-content/30" />
        <div>
          <p className="text-xl font-semibold text-base-content/70">
            No more profiles
          </p>
          <p className="text-sm text-base-content/50 mt-1">
            You've seen everyone! Check back later for new connections.
          </p>
        </div>
      </div>
    );
  }

  const currentProfile = users[0];

  const handleAction = (id, name, status) => {
    if (requestsMutation.isPending) return;
    setPendingAction(status);
    requestsMutation.mutate(
      { status, requestId: id, name },
      { onSettled: () => setPendingAction(null) },
    );
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {/* Counter badge */}
      <div className="mb-6">
        <span className="px-4 py-1.5 bg-base-200 rounded-full text-sm font-medium text-base-content/70">
          {users.length} {users.length === 1 ? "profile" : "profiles"} left
        </span>
      </div>

      {/* Profile Card - UNCHANGED, still works perfectly */}
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
