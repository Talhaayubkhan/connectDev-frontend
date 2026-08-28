import { BsGenderAmbiguous } from "react-icons/bs";
import { FiBriefcase, FiCalendar, FiMapPin, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { DEFAULT_AVATAR } from "../../utils/constants";

const UserCard = ({
  data,
  mode = "connection",
  onAccept,
  onReject,
  pendingId,
}) => {
  const user = mode === "request" ? data?.senderUserId : data;
  const {
    _id,
    firstName,
    lastName,
    photoURL,
    age,
    gender,
    about,
    skills,
    location,
    occupation,
    mutualConnections = 0,
  } = user || {};
  const requestId = data?._id;
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "User";
  const isAcceptLoading =
    pendingId?.id === requestId && pendingId?.status === "accepted";
  const isRejectLoading =
    pendingId?.id === requestId && pendingId?.status === "rejected";

  return (
    <article className="card border border-base-200 bg-base-100 shadow-md transition-shadow hover:shadow-xl">
      <div className="card-body p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex justify-center sm:justify-start">
            <div className="avatar">
              <div className="h-20 w-20 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100 sm:h-24 sm:w-24">
                <img
                  src={photoURL || DEFAULT_AVATAR}
                  alt={`${fullName}'s profile`}
                  className="object-cover"
                  onError={(event) => {
                    event.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-bold leading-tight text-base-content sm:text-xl">
                  {fullName}
                </h2>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-3 text-xs text-base-content/60 sm:justify-start sm:text-sm">
                  {age && (
                    <span className="flex items-center gap-1">
                      <FiCalendar aria-hidden="true" size={12} /> {age} years
                    </span>
                  )}
                  {gender && (
                    <span className="flex items-center gap-1 capitalize">
                      <BsGenderAmbiguous aria-hidden="true" size={12} />{" "}
                      {gender}
                    </span>
                  )}
                  {location && (
                    <span className="flex items-center gap-1">
                      <FiMapPin aria-hidden="true" size={12} /> {location}
                    </span>
                  )}
                  {occupation && (
                    <span className="flex items-center gap-1">
                      <FiBriefcase aria-hidden="true" size={12} /> {occupation}
                    </span>
                  )}
                </div>
              </div>
              {mutualConnections > 0 && mode === "connection" && (
                <span className="badge badge-outline badge-sm mx-auto gap-1 sm:mx-0">
                  <FiUser aria-hidden="true" size={10} /> {mutualConnections}{" "}
                  mutual
                </span>
              )}
            </div>

            {about && (
              <p className="mt-2 line-clamp-2 text-sm text-base-content/70">
                {about}
              </p>
            )}
            {skills?.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                {skills.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="badge badge-primary badge-outline badge-sm"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 5 && (
                  <span className="badge badge-sm">+{skills.length - 5}</span>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-center gap-2 sm:flex-col sm:justify-start">
            {mode === "connection" && _id && (
              <Link
                to={`/profile/${_id}`}
                aria-label={`View ${fullName}'s profile`}
                className="btn btn-outline btn-sm w-full gap-2 sm:w-auto"
              >
                <FiUser aria-hidden="true" size={14} /> View profile
              </Link>
            )}
            {mode === "request" && (
              <>
                <button
                  type="button"
                  className="btn btn-success btn-sm min-w-24 flex-1 sm:flex-none"
                  disabled={Boolean(pendingId)}
                  onClick={() => onAccept(requestId)}
                >
                  {isAcceptLoading ? (
                    <span
                      role="status"
                      aria-label="Accepting request"
                      className="loading loading-spinner loading-xs"
                    />
                  ) : (
                    "Accept"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-error btn-outline btn-sm min-w-24 flex-1 sm:flex-none"
                  disabled={Boolean(pendingId)}
                  onClick={() => onReject(requestId)}
                >
                  {isRejectLoading ? (
                    <span
                      role="status"
                      aria-label="Declining request"
                      className="loading loading-spinner loading-xs"
                    />
                  ) : (
                    "Decline"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default UserCard;
