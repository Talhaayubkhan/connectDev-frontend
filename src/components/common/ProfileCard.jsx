import { FiMapPin, FiBriefcase } from "react-icons/fi";
import { DEFAULT_AVATAR } from "../../utils/constants";

const ProfileCard = ({
  profile,
  showActions = true,
  onAccept,
  onReject,
  pendingAction,
}) => {
  const {
    firstName,
    lastName,
    gender,
    about,
    photoURL,
    age,
    skills,
    location,
    occupation,
    _id,
  } = profile;

  const isBusy = pendingAction !== null;

  return (
    <div className="card w-full max-w-sm bg-base-300 shadow-2xl overflow-hidden">
      {/* ── Photo + name overlay ── */}
      <figure className={`relative ${showActions ? "h-80" : "h-56"}`}>
        <img
          src={photoURL || DEFAULT_AVATAR}
          alt="profile"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_AVATAR;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold leading-tight">
            {firstName || "First"} {lastName || "Last"}
          </h2>
          <p className="text-sm opacity-70 mt-0.5">
            {age ? `${age} yrs` : "Age"} · {gender || "Gender"}
          </p>
        </div>
      </figure>

      {/* ── Card body ── */}
      <div className="card-body p-4 gap-3">
        {/* About */}
        {about ? (
          <p className="text-sm text-base-content/60 leading-relaxed">
            {about}
          </p>
        ) : (
          <p className="text-xs text-base-content/30 italic">No bio yet...</p>
        )}

        {/* Location & Occupation — icon rows */}
        {(location || occupation) && (
          <div className="flex flex-col gap-1.5 mt-0.5">
            {location && (
              <div className="flex items-center gap-1.5 text-sm text-base-content/50">
                <FiMapPin size={13} className="shrink-0 text-primary/70" />
                <span className="truncate">{location}</span>
              </div>
            )}
            {occupation && (
              <div className="flex items-center gap-1.5 text-sm text-base-content/50">
                <FiBriefcase size={13} className="shrink-0 text-primary/70" />
                <span className="truncate">{occupation}</span>
              </div>
            )}
          </div>
        )}

        {/* Placeholder rows when in preview mode and fields are empty */}
        {!showActions && !location && (
          <div className="flex items-center gap-1.5 text-xs text-base-content/25 italic">
            <FiMapPin size={12} className="shrink-0" />
            <span>No location specified...</span>
          </div>
        )}
        {!showActions && !occupation && (
          <div className="flex items-center gap-1.5 text-xs text-base-content/25 italic">
            <FiBriefcase size={12} className="shrink-0" />
            <span>No occupation specified...</span>
          </div>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="badge badge-primary badge-outline badge-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {!skills?.length && !showActions && (
          <p className="text-xs text-base-content/25 italic">
            Add skills to see them here...
          </p>
        )}

        {/* ── Actions: feed mode only ── */}
        {showActions && (
          <div className="flex gap-3 justify-center pt-2">
            <button
              className="btn btn-outline btn-error flex-1"
              disabled={isBusy}
              onClick={() => onReject(_id, firstName)}
            >
              {pendingAction === "ignored" ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Ignore"
              )}
            </button>

            <button
              className="btn btn-primary flex-1"
              disabled={isBusy}
              onClick={() => onAccept(_id, firstName)}
            >
              {pendingAction === "interested" ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Connect"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
