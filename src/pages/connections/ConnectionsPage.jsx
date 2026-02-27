import { HiUserGroup } from "react-icons/hi";
import { useConnections } from "../../hooks/connections/useConnections";
import UserCard from "../../components/common/UserCard";
import ErrorPage from "../../components/common/ErrorPage";

const ConnectionsPage = () => {
  const { data: connections, isLoading, error } = useConnections();

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
        subMessage="Something went wrong. Please try again."
      />
    );
  }

  if (!connections?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-base-content/50">
        <HiUserGroup size={64} />
        <p className="text-xl font-semibold">No Connections Yet</p>
        <p className="text-sm">Start connecting with people on the feed!</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-base-content mb-8">
        Connections
        <span className="ml-2 badge badge-primary badge-lg">
          {connections.length}
        </span>
      </h1>
      <div className="flex flex-col gap-4">
        {connections.map((connection) => (
          <UserCard key={connection._id} data={connection} mode="connection" />
        ))}
      </div>
    </div>
  );
};

export default ConnectionsPage;
