import { HiUserGroup } from "react-icons/hi";
import { useConnections } from "../../hooks/connections/useConnections";
import UserCard from "../../components/common/UserCard";
import ErrorPage from "../../components/common/ErrorPage";

const ConnectionsPage = () => {
  const { data: connections, isLoading, error } = useConnections();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] gap-4 text-center px-4">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
          <HiUserGroup size={36} className="text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-base-content">
            No connections yet
          </h2>
          <p className="text-sm text-base-content/60 max-w-xs">
            When you connect with people, they'll show up here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-base-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
            Connections
          </h1>
          <p className="text-sm text-base-content/50 mt-0.5">
            People in your network
          </p>
        </div>

        <span className="badge badge-primary badge-lg font-semibold">
          {connections.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {connections.map((connection) => (
          <UserCard key={connection._id} data={connection} mode="connection" />
        ))}
      </div>
    </div>
  );
};

export default ConnectionsPage;
