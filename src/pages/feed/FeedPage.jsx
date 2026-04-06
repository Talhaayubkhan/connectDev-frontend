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
import { useState, useEffect } from "react";
import ProfileCard from "../../components/common/ProfileCard";
import { HiUserGroup, HiTrendingUp, HiRefresh } from "react-icons/hi";
import ErrorPage from "../../components/common/ErrorPage";
import { motion } from "framer-motion";

const FeedPage = () => {
  const { data, isLoading, error, refetch } = useFeedQuery();
  const users = data?.users || [];

  const requestsMutation = useFeedRequestMutation();
  const [pendingAction, setPendingAction] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [users]);

  const handleAction = (id, name, status) => {
    if (requestsMutation.isPending) return;

    setPendingAction(status);
    requestsMutation.mutate(
      { status, requestId: id, name },
      {
        onSettled: () => {
          setPendingAction(null);
          if (currentIndex < users.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          }
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-base-200 to-base-100">
        <div className="text-center space-y-4">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="text-base-content/60">Finding matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorPage
        code="500"
        message="Something went wrong"
        subMessage="Failed to load feed. Please try refreshing."
      >
        <button
          onClick={() => refetch()}
          className="btn btn-primary btn-sm mt-4"
        >
          Try Again
        </button>
      </ErrorPage>
    );
  }

  if (!users.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-100">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="bg-base-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-lg">
            <HiUserGroup size={48} className="text-base-content/40" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">No Profiles Found</h2>
            <p className="text-base-content/60">
              Check back later for new people to connect with!
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="btn btn-primary btn-outline gap-2"
          >
            <HiRefresh size={16} />
            Refresh Feed
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = users[currentIndex];
  const progress = ((currentIndex + 1) / users.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-base-100/80 backdrop-blur-lg border-b border-base-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Discover
              </h1>
              <p className="text-xs text-base-content/60">
                Find your perfect connection
              </p>
            </div>
            <div className="badge badge-primary gap-1">
              <HiTrendingUp size={12} />
              {users.length - currentIndex - 1} left
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-base-content/50">
              <span>
                Profile {currentIndex + 1} of {users.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-base-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <div className="w-full max-w-md">
            <ProfileCard
              key={currentIndex}
              profile={currentProfile}
              showActions={true}
              pendingAction={pendingAction}
              onAccept={(id, name) => handleAction(id, name, "interested")}
              onReject={(id, name) => handleAction(id, name, "ignored")}
              variant="default"
            />

            {/* Hint */}
            <div className="mt-6 text-center">
              <p className="text-xs text-base-content/40">
                Click Connect or Ignore to continue
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
