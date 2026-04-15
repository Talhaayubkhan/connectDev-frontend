// import { HiUserGroup } from "react-icons/hi";
// import { useConnections } from "../../hooks/connections/useConnections";
// import UserCard from "../../components/common/UserCard";
// import ErrorPage from "../../components/common/ErrorPage";

// const ConnectionsPage = () => {
//   const { data: connections, isLoading, error } = useConnections();

//   // Loading State
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh]">
//         <span className="loading loading-spinner loading-lg text-primary" />
//       </div>
//     );
//   }

//   // Error State
//   if (error) {
//     return (
//       <ErrorPage
//         code="500"
//         message="Failed to load connections"
//         subMessage="Please refresh or try again later."
//       />
//     );
//   }

//   // Empty State
//   if (!connections?.length) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] gap-3 text-base-content/60 text-center px-4">
//         <HiUserGroup size={64} className="opacity-70" />
//         <h2 className="text-xl font-semibold">No Connections Yet</h2>
//         <p className="text-sm max-w-xs">
//           When you connect with people, they will appear here.
//         </p>
//       </div>
//     );
//   }

//   // Main UI
//   return (
//     <div className="max-w-3xl mx-auto py-10 px-4">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
//         <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
//           Connections
//         </h1>

//         <span className="badge badge-primary sm:badge-lg">
//           {connections.length}
//         </span>
//       </div>

//       {/* List */}
//       <div className="flex flex-col gap-4">
//         {connections.map((connection) => (
//           <UserCard key={connection._id} data={connection} mode="connection" />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ConnectionsPage;
import { HiUserGroup, HiUserAdd, HiSearch } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useConnections } from "../../hooks/connections/useConnections";
import UserCard from "../../components/common/UserCard";
import ErrorPage from "../../components/common/ErrorPage";
import { useState } from "react";
import { useSelector } from "react-redux";

const ConnectionsPage = () => {
  const { data: connections, isLoading, error } = useConnections();
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = useSelector((state) => state?.auth?.user);

  const filteredConnections = connections?.filter((connection) => {
    const user = connection;
    const fullName =
      `${user?.firstName || ""} ${user?.lastName || ""}`.toLowerCase();
    const skills = user?.skills?.join(" ").toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || skills.includes(search);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="text-base-content/60">Loading your connections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorPage
        code="500"
        message="Failed to load connections"
        subMessage="Please refresh or try again later."
      />
    );
  }

  if (!connections?.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="bg-base-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <HiUserGroup size={40} className="text-base-content/40" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-base-content">
              No Connections Yet
            </h2>
            <p className="text-sm text-base-content/60">
              When you connect with people, they will appear here.
            </p>
          </div>
          <Link to="/feed" className="btn btn-primary btn-sm gap-2">
            <HiUserAdd size={16} />
            Find People to Connect With
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-6 md:py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                Connections
              </h1>
              <p className="text-sm text-base-content/50 mt-1">
                {connections.length} people you've connected with
              </p>
            </div>

            <div className="badge badge-primary badge-lg gap-1 px-4 py-3">
              <HiUserGroup size={14} />
              {connections.length}{" "}
              {connections.length === 1 ? "Connection" : "Connections"}
            </div>
          </div>

          {/* Search */}
          <div className="mt-5">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-sm" />
              <input
                type="text"
                placeholder="Search by name or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-9 py-2"
              />
            </div>
          </div>
        </div>

        {/* Stats - simplified */}
        {filteredConnections?.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-base-100 rounded-lg p-3 text-center shadow-sm">
              <p className="text-xl font-bold text-primary">
                {filteredConnections.length}
              </p>
              <p className="text-xs text-base-content/50">Showing</p>
            </div>
            <div className="bg-base-100 rounded-lg p-3 text-center shadow-sm">
              <p className="text-xl font-bold">
                {
                  filteredConnections.filter((c) => c?.skills?.length > 0)
                    .length
                }
              </p>
              <p className="text-xs text-base-content/50">With skills</p>
            </div>
            <div className="bg-base-100 rounded-lg p-3 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${currentUser?.isActive ? "bg-success" : "bg-error"}`}
                />
                <p className="text-xl font-bold">
                  {currentUser?.isActive ? "Online" : "Offline"}
                </p>
              </div>
              <p className="text-xs text-base-content/50">Your status</p>
            </div>
          </div>
        )}

        {/* Connections List */}
        {filteredConnections?.length > 0 ? (
          <div className="space-y-3">
            {filteredConnections.map((connection) => (
              <UserCard
                key={connection._id}
                data={connection}
                mode="connection"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-base-100 rounded-lg">
            <p className="text-base-content/50">
              No connections found for "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;
