import { DEFAULT_AVATAR } from "../../utils/constants";

// showActions=true  → feed mode (Connect / Ignore buttons visible)
// showActions=false → preview mode (no buttons, used in profile edit page)
const ProfileCard = ({ profile, showActions = true }) => {
  const { firstName, lastName, gender, about, photoURL, age, skills } = profile;

  return (
    <div className="card w-full max-w-sm bg-base-300 shadow-2xl overflow-hidden">
      {/* IMAGE SECTION */}
      <figure className="relative h-86">
        <img
          src={photoURL || DEFAULT_AVATAR}
          alt="profile"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_AVATAR;
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Name overlay */}
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">
            {firstName} {lastName}
          </h2>
          <p className="text-sm opacity-90">
            {age} · {gender}
          </p>
        </div>
      </figure>

      {/* CONTENT */}
      <div className="card-body space-y-4">
        <p className="text-sm text-base-content/60 leading-relaxed">
          {about || "No bio yet..."}
        </p>

        {/* Skills */}
        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="badge badge-primary badge-outline">
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* ACTION BUTTONS — only in feed mode */}
        {showActions && (
          <div className="flex gap-4 justify-center">
            <button className="btn btn-outline btn-error flex-1">Ignore</button>
            <button className="btn btn-primary flex-1">Connect</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
