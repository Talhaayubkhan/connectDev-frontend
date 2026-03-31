import { HiUserGroup } from "react-icons/hi";
import { useConnections } from "../../hooks/connections/useConnections";
import UserCard from "../../components/common/UserCard";
import ErrorPage from "../../components/common/ErrorPage";

const ConnectionsPage = () => {
  const { data: connections, isLoading, error } = useConnections();

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <ErrorPage
        code="500"
        message="Failed to load connections"
        subMessage="Please refresh or try again later."
      />
    );
  }

  // Empty State
  if (!connections?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] gap-3 text-base-content/60 text-center px-4">
        <HiUserGroup size={64} className="opacity-70" />
        <h2 className="text-xl font-semibold">No Connections Yet</h2>
        <p className="text-sm max-w-xs">
          When you connect with people, they will appear here.
        </p>
      </div>
    );
  }

  // Main UI
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
          Connections
        </h1>

        <span className="badge badge-primary sm:badge-lg">
          {connections.length}
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {connections.map((connection) => (
          <UserCard key={connection._id} data={connection} mode="connection" />
        ))}
      </div>
    </div>
  );
};

export default ConnectionsPage;
