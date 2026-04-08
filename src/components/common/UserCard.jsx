// import { DEFAULT_AVATAR } from "../../utils/constants";
// import { BsGenderAmbiguous } from "react-icons/bs";
// import { FiCalendar } from "react-icons/fi";
// import { Link } from "react-router-dom";

// // mode="connection" → View Profile button (navigate to /profile)
// // mode="request"    → Accept / Reject buttons with spinner logic
// const UserCard = ({
//   data,
//   mode = "connection",
//   onAccept,
//   onReject,
//   pendingId,
// }) => {
//   const user = mode === "request" ? data?.senderUserId : data;
//   const { _id, firstName, lastName, photoURL, age, gender, about, skills } =
//     user || {};

//   // WHY only for request mode?
//   // connection mode has no async action — just navigation.
//   // No mutation = no loading state needed.
//   const isAcceptLoading =
//     pendingId?.id === data._id && pendingId?.status === "accepted";
//   const isRejectLoading =
//     pendingId?.id === data._id && pendingId?.status === "rejected";
//   const isAnyPending = !!pendingId;

//   return (
//     <div className="card bg-base-200 shadow-md hover:shadow-lg hover:ring-1 hover:ring-primary/20 transition-all duration-200">
//       <div className="card-body p-4">
//         <div className="flex items-center gap-4">
//           <div className="avatar">
//             <div className="w-16 h-16 rounded-full ring-2 ring-primary/30 ring-offset-base-100 ring-offset-1 shrink-0">
//               <img
//                 src={photoURL || DEFAULT_AVATAR}
//                 alt={firstName || "User"}
//                 onError={(e) => {
//                   e.currentTarget.src = DEFAULT_AVATAR;
//                 }}
//               />
//             </div>
//           </div>

//           <div className="flex-1 min-w-0">
//             <h2 className="font-bold text-base-content text-lg leading-tight">
//               {firstName} {lastName}
//             </h2>

//             <div className="flex items-center gap-3 text-base-content/50 text-sm mt-0.5">
//               {age && (
//                 <span className="flex items-center gap-1">
//                   <FiCalendar size={12} /> {age} yrs
//                 </span>
//               )}
//               {gender && (
//                 <span className="flex items-center gap-1">
//                   <BsGenderAmbiguous size={12} /> {gender}
//                 </span>
//               )}
//             </div>

//             {about && (
//               <p className="text-sm text-base-content/60 mt-1 truncate">
//                 {about}
//               </p>
//             )}

//             {skills?.length > 0 && (
//               <div className="flex flex-wrap gap-1 mt-2">
//                 {skills.slice(0, 4).map((skill, i) => (
//                   <span key={i} className="badge badge-outline badge-sm">
//                     {skill}
//                   </span>
//                 ))}
//                 {skills.length > 4 && (
//                   <span className="badge badge-outline badge-sm">
//                     +{skills.length - 4}
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col gap-2 shrink-0">
//             {/* WHY navigate("/profile") not /profile/:id?
//                 Individual profile pages not built yet.
//                 Navigates to logged in user's own profile for now.
//                 Easy to update later: navigate(`/profile/${data._id}`) */}
//             {mode === "connection" && (
//               <>
//                 <Link to={`/chat/${_id}`}>
//                   <button className="btn btn-primary btn-sm min-w-[80px]">
//                     Message
//                   </button>
//                 </Link>
//                 <Link to={`/profile/${_id}`}>
//                   <button className="btn btn-primary btn-sm min-w-[80px]">
//                     Profile
//                   </button>
//                 </Link>
//               </>
//             )}

//             {mode === "request" && (
//               <>
//                 <button
//                   className="btn btn-success btn-sm min-w-[80px]"
//                   disabled={isAnyPending}
//                   onClick={() => onAccept(data._id)}
//                 >
//                   {isAcceptLoading ? (
//                     <span className="loading loading-spinner loading-xs" />
//                   ) : (
//                     "Accept"
//                   )}
//                 </button>

//                 <button
//                   className="btn btn-error btn-sm btn-outline min-w-[80px]"
//                   disabled={isAnyPending}
//                   onClick={() => onReject(data._id)}
//                 >
//                   {isRejectLoading ? (
//                     <span className="loading loading-spinner loading-xs" />
//                   ) : (
//                     "Reject"
//                   )}
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserCard;

import { DEFAULT_AVATAR } from "../../utils/constants";
import { BsGenderAmbiguous } from "react-icons/bs";
import {
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiMessageCircle,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";

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

  const isAcceptLoading =
    pendingId?.id === data._id && pendingId?.status === "accepted";
  const isRejectLoading =
    pendingId?.id === data._id && pendingId?.status === "rejected";
  const isAnyPending = !!pendingId;

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 border border-base-200 hover:border-primary/20">
      <div className="card-body p-4 md:p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Avatar Section */}
          <div className="flex justify-center sm:justify-start">
            <div className="avatar">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100">
                <img
                  src={photoURL || DEFAULT_AVATAR}
                  alt={firstName || "User"}
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />
              </div>
            </div>
          </div>

          {/* User Info Section */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="font-bold text-base-content text-lg md:text-xl leading-tight">
                  {firstName} {lastName}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-base-content/50 text-xs md:text-sm mt-1">
                  {age && (
                    <span className="flex items-center gap-1">
                      <FiCalendar size={12} /> {age} years
                    </span>
                  )}
                  {gender && (
                    <span className="flex items-center gap-1 capitalize">
                      <BsGenderAmbiguous size={12} /> {gender}
                    </span>
                  )}
                  {location && (
                    <span className="flex items-center gap-1">
                      <FiMapPin size={12} /> {location}
                    </span>
                  )}
                  {occupation && (
                    <span className="flex items-center gap-1">
                      <FiBriefcase size={12} /> {occupation}
                    </span>
                  )}
                </div>
              </div>

              {/* Mutual Connections Badge */}
              {mutualConnections > 0 && mode === "connection" && (
                <div className="badge badge-outline badge-sm gap-1">
                  <FiUser size={10} />
                  {mutualConnections} mutual connections
                </div>
              )}
            </div>

            {/* About Section */}
            {about && (
              <p className="text-sm text-base-content/70 mt-2 line-clamp-2">
                {about}
              </p>
            )}

            {/* Skills Section */}
            {skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {skills.slice(0, 5).map((skill, i) => (
                  <span
                    key={i}
                    className="badge badge-primary badge-outline badge-sm px-2 py-1 text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 5 && (
                  <span className="badge badge-sm text-xs">
                    +{skills.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row sm:flex-col gap-6 justify-center sm:justify-start">
            {mode === "connection" && (
              <>
                <Link to={`/chat/${_id}`} className="flex-1 sm:flex-none">
                  <button className="btn btn-primary btn-sm w-full gap-2">
                    <FiMessageCircle size={14} />
                    Message
                  </button>
                </Link>
                <Link to={`/profile/${_id}`} className="flex-1 sm:flex-none">
                  <button className="btn btn-outline btn-sm w-full gap-2">
                    <FiUser size={14} />
                    View Profile
                  </button>
                </Link>
              </>
            )}

            {mode === "request" && (
              <>
                <button
                  className="btn btn-success btn-sm flex-1 sm:flex-none min-w-[90px] gap-2"
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
                  className="btn btn-error btn-sm btn-outline flex-1 sm:flex-none min-w-[90px] gap-2"
                  disabled={isAnyPending}
                  onClick={() => onReject(data._id)}
                >
                  {isRejectLoading ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    "Decline"
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
