// components/common/ConnectionCard.jsx
import { DEFAULT_AVATAR } from "../../utils/constants";
import { BsGenderAmbiguous } from "react-icons/bs";
import { FiCalendar } from "react-icons/fi";

// mode="connection" → shows Message button
// mode="request"    → shows Accept / Reject buttons
const ConnectionCard = ({ data, mode = "connection", onAccept, onReject }) => {
  const user = mode === "request" ? data?.senderUserId : data;
  const { firstName, lastName, photoURL, age, gender, about, skills } =
    user || {};

  return (
    <div className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
              <img
                src={photoURL || DEFAULT_AVATAR}
                alt={firstName || "User"}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base-content text-lg">
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

          {/* Actions — differ by mode */}
          <div className="flex flex-col gap-2">
            {mode === "connection" && (
              <button className="btn btn-primary btn-sm">Message</button>
            )}

            {mode === "request" && (
              <>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => onAccept(data._id)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-error btn-sm btn-outline"
                  onClick={() => onReject(data._id)}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
