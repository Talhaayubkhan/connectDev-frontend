import ConnectionsCard from "./ConnectionsCard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { HiUserGroup } from "react-icons/hi";
import { useShowConnections } from "../../hooks/connections/useShowConnections";

const ConnectionsPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useShowConnections();

  // ✅ proper error handling
  useEffect(() => {
    if (!error) return;
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      navigate("/login");
    } else {
      toast.error("Failed to load connections.");
    }
  }, [error, navigate]);

  // loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  const connections = data?.data;

  // ✅ safe empty check
  if (!connections || connections.length === 0) {
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
          <ConnectionsCard key={connection._id} data={connection} />
        ))}
      </div>
    </div>
  );
};

export default ConnectionsPage;
