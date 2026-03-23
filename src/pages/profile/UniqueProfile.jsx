import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useUniqueProfile } from "../../hooks/profile/useShowUniqueProfile";
import ErrorPage from "../../components/common/ErrorPage";
import { DEFAULT_AVATAR } from "../../utils/constants";
import { FiLock } from "react-icons/fi";

const UniqueProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useUniqueProfile(userId);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <div className="skeleton h-32 w-full rounded-xl" />
        <div className="flex gap-4 items-center">
          <div className="skeleton w-20 h-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-3 w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const status = error?.response?.status;

    if (status === 403) {
      return (
        <div className="text-center py-16">
          <FiLock className="mx-auto text-warning text-3xl mb-3" />
          <p className="text-sm text-base-content/60">
            This profile is private
          </p>
          <button className="btn btn-ghost mt-4" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      );
    }

    if (status === 404) {
      return (
        <p className="text-center mt-10 text-base-content/50">User not found</p>
      );
    }

    return <ErrorPage />;
  }

  if (!data) return null;

  const { _id, firstName, lastName, photoURL, age, gender, skills, about } =
    data;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-primary to-secondary" />

        {/* Profile Section */}
        <div className="p-6 relative">
          <div className="flex gap-4 items-start">
            {/* Avatar */}
            <div className="absolute -top-12 left-6">
              <div className="w-24 h-24 rounded-full ring-4 ring-base-100 overflow-hidden">
                <img
                  src={photoURL || DEFAULT_AVATAR}
                  alt="avatar"
                  onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                />
              </div>
            </div>

            <div className="ml-28 flex-1">
              <h2 className="text-xl font-bold">
                {firstName} {lastName}
              </h2>

              <div className="flex gap-3 text-sm text-base-content/60 mt-1">
                {age && <span>{age} yrs</span>}
                {gender && <span className="capitalize">{gender}</span>}
              </div>
            </div>
          </div>

          {/* About */}
          {about && (
            <div className="mt-6">
              <p className="text-xs uppercase text-base-content/40 mb-1">
                About
              </p>
              <p className="text-sm text-base-content/70">{about}</p>
            </div>
          )}

          {/* Skills */}
          {skills?.length > 0 && (
            <div className="mt-5">
              <p className="text-xs uppercase text-base-content/40 mb-2">
                Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between mt-6">
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
              Back
            </button>

            <Link to={`/chat/${_id}`} className="btn btn-primary">
              Message
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default UniqueProfile;
