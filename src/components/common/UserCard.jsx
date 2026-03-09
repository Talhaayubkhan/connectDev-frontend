import { DEFAULT_AVATAR } from "../../utils/constants";
import { BsGenderAmbiguous } from "react-icons/bs";
import { FiCalendar } from "react-icons/fi";
import { Link } from "react-router-dom";

// mode="connection" → View Profile button (navigate to /profile)
// mode="request"    → Accept / Reject buttons with spinner logic
const UserCard = ({
  data,
  mode = "connection",
  onAccept,
  onReject,
  pendingId,
}) => {
  const user = mode === "request" ? data?.senderUserId : data;
  const { _id, firstName, lastName, photoURL, age, gender, about, skills } =
    user || {};

  // WHY only for request mode?
  // connection mode has no async action — just navigation.
  // No mutation = no loading state needed.
  const isAcceptLoading =
    pendingId?.id === data._id && pendingId?.status === "accepted";
  const isRejectLoading =
    pendingId?.id === data._id && pendingId?.status === "rejected";
  const isAnyPending = !!pendingId;

  return (
    <div className="card bg-base-200 shadow-md hover:shadow-lg hover:ring-1 hover:ring-primary/20 transition-all duration-200">
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full ring-2 ring-primary/30 ring-offset-base-100 ring-offset-1 shrink-0">
              <img
                src={photoURL || DEFAULT_AVATAR}
                alt={firstName || "User"}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base-content text-lg leading-tight">
              {firstName} {lastName}
            </h2>

            <div className="flex items-center gap-3 text-base-content/50 text-sm mt-0.5">
              {age && (
                <span className="flex items-center gap-1">
                  <FiCalendar size={12} /> {age} yrs
                </span>
              )}
              {gender && (
                <span className="flex items-center gap-1">
                  <BsGenderAmbiguous size={12} /> {gender}
                </span>
              )}
            </div>

            {about && (
              <p className="text-sm text-base-content/60 mt-1 truncate">
                {about}
              </p>
            )}

            {skills?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {skills.slice(0, 4).map((skill, i) => (
                  <span key={i} className="badge badge-outline badge-sm">
                    {skill}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="badge badge-outline badge-sm">
                    +{skills.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            {/* WHY navigate("/profile") not /profile/:id?
                Individual profile pages not built yet.
                Navigates to logged in user's own profile for now.
                Easy to update later: navigate(`/profile/${data._id}`) */}
            {mode === "connection" && (
              <Link to={`/chat/${_id}`}>
                <button className="btn btn-primary btn-sm min-w-[80px]">
                  Message
                </button>
              </Link>
            )}

            {mode === "request" && (
              <>
                <button
                  className="btn btn-success btn-sm min-w-[80px]"
                  disabled={isAnyPending}
                  onClick={() => onAccept(data._id)}
                >
                  {isAcceptLoading ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    "Accept"
                  )}
                </button>

                <button
                  className="btn btn-error btn-sm btn-outline min-w-[80px]"
                  disabled={isAnyPending}
                  onClick={() => onReject(data._id)}
                >
                  {isRejectLoading ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    "Reject"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
