import { HiUserGroup } from "react-icons/hi";
import EmptyState from "../../components/common/EmptyState";
import ErrorPage from "../../components/common/ErrorPage";
import PageLoader from "../../components/common/PageLoader";
import UserCard from "../../components/common/UserCard";
import { useConnections } from "../../hooks/connections/useConnections";

const ConnectionsPage = () => {
  const { data: connections, isLoading, error, refetch } = useConnections();

  if (isLoading) return <PageLoader label="Loading connections" />;
  if (error) {
    return (
      <ErrorPage
        code="500"
        message="Failed to load connections"
        subMessage="Check your connection and try again."
        onRetry={refetch}
      />
    );
  }
  if (!connections?.length) {
    return (
      <EmptyState
        icon={HiUserGroup}
        title="No connections yet"
        description="People you connect with will appear here."
      />
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-1 py-6 sm:px-4 sm:py-10">
      <header className="mb-6 flex items-center justify-between gap-3 border-b border-base-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
            Connections
          </h1>
          <p className="mt-0.5 text-sm text-base-content/60">
            People in your network.
          </p>
        </div>
        <span className="badge badge-primary badge-lg font-semibold">
          {connections.length}
        </span>
      </header>
      <div className="flex flex-col gap-3">
        {connections.map((connection) => (
          <UserCard key={connection._id} data={connection} />
        ))}
      </div>
    </section>
  );
};

export default ConnectionsPage;
