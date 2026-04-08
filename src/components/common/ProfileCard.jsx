// import { DEFAULT_AVATAR } from "../../utils/constants";

// const ProfileCard = ({
//   profile,
//   showActions = true,
//   onAccept,
//   onReject,
//   pendingAction,
// }) => {
//   const { firstName, lastName, gender, about, photoURL, age, skills, _id } =
//     profile;

//   const isBusy = pendingAction !== null;

//   return (
//     <div className="card w-full max-w-sm bg-base-300 shadow-2xl overflow-hidden">
//       {/* WHY taller image in feed, shorter in preview?
//           Feed = full card experience, user judges by photo.
//           Preview = just checking how profile looks, form is the focus. */}
//       <figure className={`relative ${showActions ? "h-80" : "h-56"}`}>
//         <img
//           src={photoURL || DEFAULT_AVATAR}
//           alt="profile"
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             e.currentTarget.src = DEFAULT_AVATAR;
//           }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

//         {/* WHY name overlaid on image?
//             Works for both contexts — clean, no wasted space. */}
//         <div className="absolute bottom-4 left-4 text-white">
//           <h2 className="text-2xl font-bold leading-tight">
//             {firstName || "First"} {lastName || "Last"}
//           </h2>
//           <p className="text-sm opacity-80 mt-0.5">
//             {age ? `${age} yrs` : "Age"} · {gender || "Gender"}
//           </p>
//         </div>
//       </figure>

//       <div className="card-body p-4 gap-3">
//         {/* About */}
//         <p className="text-sm text-base-content/60 leading-relaxed">
//           {about || "No bio yet..."}
//         </p>

//         {/* Skills */}
//         {skills?.length > 0 && (
//           <div className="flex flex-wrap gap-1.5">
//             {skills.map((skill, i) => (
//               <span
//                 key={i}
//                 className="badge badge-primary badge-outline badge-sm"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         )}

//         {!skills?.length && !showActions && (
//           <p className="text-xs text-base-content/30 italic">
//             Add skills to see them here...
//           </p>
//         )}

//         {/* Actions — feed mode only */}
//         {showActions && (
//           <div className="flex gap-3 justify-center pt-1">
//             <button
//               className="btn btn-outline btn-error flex-1"
//               disabled={isBusy}
//               onClick={() => onReject(_id, firstName)}
//             >
//               {pendingAction === "ignored" ? (
//                 <span className="loading loading-spinner loading-sm" />
//               ) : (
//                 "Ignore"
//               )}
//             </button>

//             <button
//               className="btn btn-primary flex-1"
//               disabled={isBusy}
//               onClick={() => onAccept(_id, firstName)}
//             >
//               {pendingAction === "interested" ? (
//                 <span className="loading loading-spinner loading-sm" />
//               ) : (
//                 "Connect"
//               )}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfileCard;

import { FiUserPlus, FiX, FiMapPin, FiBriefcase } from "react-icons/fi";
import { DEFAULT_AVATAR } from "../../utils/constants";

const ProfileCard = ({
  profile,
  showActions = true,
  onAccept,
  onReject,
  pendingAction,
}) => {
  const { firstName, lastName, gender, about, photoURL, age, skills, _id } =
    profile || {};

  const isBusy = pendingAction !== null;
  const fullName = `${firstName || "First"} ${lastName || "Last"}`.trim();

  return (
    <div className="card w-full max-w-sm bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200 overflow-hidden border border-base-300">
      {/* Image Section - height changes based on context */}
      <figure
        className={`relative ${showActions ? "h-72" : "h-48"} overflow-hidden`}
      >
        <img
          src={photoURL || DEFAULT_AVATAR}
          alt={fullName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_AVATAR;
          }}
        />
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Name overlay - works for both contexts */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-xl font-bold leading-tight">{fullName}</h2>
          <div className="flex items-center gap-3 text-sm opacity-90 mt-1">
            {age && <span>{age} years</span>}
            {gender && <span>• {gender}</span>}
          </div>
        </div>
      </figure>

      {/* Content Section */}
      <div className="card-body p-4 gap-2">
        {/* About/Bio */}
        {about && (
          <p className="text-sm text-base-content/70 line-clamp-2 leading-relaxed">
            {about}
          </p>
        )}

        {!about && !showActions && (
          <p className="text-sm text-base-content/40 italic">
            No bio added yet
          </p>
        )}

        {/* Skills Section */}
        {skills?.length > 0 && (
          <div className="mt-1">
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 3).map((skill, i) => (
                <span key={i} className="badge badge-primary badge-sm px-2">
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="badge badge-ghost badge-sm">
                  +{skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {!skills?.length && !showActions && (
          <p className="text-xs text-base-content/30 italic mt-1">
            Add skills to showcase your expertise
          </p>
        )}

        {/* Action Buttons - Feed Mode Only */}
        {showActions && (
          <div className="flex gap-2 mt-3 pt-1">
            <button
              className="btn btn-outline btn-error gap-2 flex-1"
              disabled={isBusy}
              onClick={() => onReject?.(_id, firstName)}
            >
              {pendingAction === "ignored" ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <FiX size={16} />
                  Pass
                </>
              )}
            </button>

            <button
              className="btn btn-primary gap-2 flex-1"
              disabled={isBusy}
              onClick={() => onAccept?.(_id, firstName)}
            >
              {pendingAction === "interested" ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <FiUserPlus size={16} />
                  Connect
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
