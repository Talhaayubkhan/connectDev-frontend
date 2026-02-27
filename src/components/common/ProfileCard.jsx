import { DEFAULT_AVATAR } from "../../utils/constants";

// showActions=true  → feed mode (Connect / Ignore buttons visible)
// showActions=false → preview mode (no buttons, used in profile edit page)
const ProfileCard = ({
  profile,
  showActions = true,
  onAccept,
  onReject,
  pendingAction,
}) => {
  const { firstName, lastName, gender, about, photoURL, age, skills, _id } =
    profile;
  const isBusy = pendingAction !== null;
  return (
    <div className="card w-full max-w-sm bg-base-300 shadow-2xl overflow-hidden">
      <figure className="relative h-86">
        <img
          src={photoURL || DEFAULT_AVATAR}
          alt="profile"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_AVATAR;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">
            {firstName} {lastName}
          </h2>
          <p className="text-sm opacity-90">
            {age} · {gender}
          </p>
        </div>
      </figure>

      <div className="card-body space-y-4">
        <p className="text-sm text-base-content/60 leading-relaxed">
          {about || "No bio yet..."}
        </p>

        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="badge badge-primary badge-outline">
                {skill}
              </span>
            ))}
          </div>
        )}

        {showActions && (
          <div className="flex gap-4 justify-center">
            <button
              className="btn btn-outline btn-error flex-1"
              disabled={isBusy}
              onClick={() => onReject(_id, firstName)}
            >
              {/* ✅ spinner on reject button while loading */}
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
