import { DEFAULT_AVATAR } from "../../utils/constants";

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
      {/* WHY taller image in feed, shorter in preview?
          Feed = full card experience, user judges by photo.
          Preview = just checking how profile looks, form is the focus. */}
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

        {/* WHY name overlaid on image?
            Works for both contexts — clean, no wasted space. */}
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold leading-tight">
            {firstName || "First"} {lastName || "Last"}
          </h2>
          <p className="text-sm opacity-80 mt-0.5">
            {age ? `${age} yrs` : "Age"} · {gender || "Gender"}
          </p>
        </div>
      </figure>

      <div className="card-body p-4 gap-3">
        {/* About */}
        <p className="text-sm text-base-content/60 leading-relaxed">
          {about || "No bio yet..."}
        </p>

        {/* Skills */}
        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
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
          <p className="text-xs text-base-content/30 italic">
            Add skills to see them here...
          </p>
        )}

        {/* Actions — feed mode only */}
        {showActions && (
          <div className="flex gap-3 justify-center pt-1">
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
