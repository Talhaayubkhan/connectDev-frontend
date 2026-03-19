// import { Link, useNavigate, useParams } from "react-router-dom";
// import { useUniqueProfile } from "../../hooks/profile/useShowUniqueProfile";
// import ErrorPage from "../../components/common/ErrorPage";
// import { DEFAULT_AVATAR } from "../../utils/constants";
// import { FiCalendar } from "react-icons/fi";
// import { BsGenderAmbiguous } from "react-icons/bs";
// import { IoMdArrowBack } from "react-icons/io";

// const UniqueProfile = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();

//   const { data, isLoading, error } = useUniqueProfile(userId);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <span className="loading loading-spinner loading-lg text-primary"></span>
//       </div>
//     );
//   }
//   if (error) {
//     return <ErrorPage />;
//   }

//   if (!data) {
//     return <p className="text-center mt-10">No user found</p>;
//   }

//   const { _id, firstName, lastName, photoURL, age, gender, skills, about } =
//     data;

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-10">
//       <div className="card bg-base-200 shadow-lg p-6">
//         {/* Top Section */}
//         <div className="flex items-center gap-6">
//           <div className="avatar">
//             <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
//               <img
//                 src={photoURL || DEFAULT_AVATAR}
//                 alt={firstName}
//                 onError={(e) => {
//                   e.currentTarget.src = DEFAULT_AVATAR;
//                 }}
//               />
//             </div>
//           </div>

//           <div>
//             <h2 className="text-2xl font-bold">
//               {firstName} {lastName}
//             </h2>

//             <div className="flex items-center gap-4 text-sm text-base-content/60 mt-1">
//               {age && (
//                 <span className="flex items-center gap-1">
//                   <FiCalendar size={14} /> {age} yrs
//                 </span>
//               )}
//               {gender && (
//                 <span className="flex items-center gap-1">
//                   <BsGenderAmbiguous size={14} /> {gender}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* About Section */}
//         {about && (
//           <div className="mt-6">
//             <h3 className="font-semibold text-lg mb-1">About</h3>
//             <p className="text-base-content/70">{about}</p>
//           </div>
//         )}

//         {/* Skills Section */}
//         {skills?.length > 0 && (
//           <div className="mt-6">
//             <h3 className="font-semibold text-lg mb-2">Skills</h3>
//             <div className="flex flex-wrap gap-2">
//               {skills.map((skill, i) => (
//                 <span key={i} className="badge badge-outline badge-md">
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Actions */}
//         <div className="flex justify-between items-center mt-4">
//           <button
//             className="btn btn-ghost"
//             onClick={() => navigate("/connections")}
//           >
//             <IoMdArrowBack />
//             Back
//           </button>

//           <div className="flex">
//             <Link to={`/chat/${_id}`}>
//               <button className="btn btn-primary">Message</button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UniqueProfile;
// pages/profile/UniqueProfile.jsx

import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useUniqueProfile } from "../../hooks/profile/useShowUniqueProfile";
import ErrorPage from "../../components/common/ErrorPage";
import { DEFAULT_AVATAR } from "../../utils/constants";
import {
  FiCalendar,
  FiMessageCircle,
  FiArrowLeft,
  FiLock,
} from "react-icons/fi";
import { BsGenderAmbiguous } from "react-icons/bs";

// ─── Component ────────────────────────────────────────────────────────────────
const UniqueProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useUniqueProfile(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    const status = error?.response?.status;

    if (status === 403) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="card bg-base-100 shadow-lg overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary" />
            <div className="p-10 flex flex-col items-center text-center gap-3">
              <div className="bg-warning/10 p-4 rounded-full">
                <FiLock size={28} className="text-warning" />
              </div>
              <h2 className="text-lg font-bold">Profile Restricted</h2>
              <p className="text-sm text-base-content/55 max-w-xs">
                You can only view profiles of people you're connected with.
              </p>
              <button
                className="btn btn-ghost btn-sm gap-1 mt-2"
                onClick={() => navigate(-1)}
              >
                <FiArrowLeft size={14} /> Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (status === 404) {
      return (
        <p className="text-center mt-10 text-base-content/50">
          This user doesn't exist.
        </p>
      );
    }

    return <ErrorPage />;
  }

  if (!data)
    return (
      <p className="text-center mt-10 text-base-content/50">No user found.</p>
    );

  const { _id, firstName, lastName, photoURL, age, gender, skills, about } =
    data;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="card bg-base-100 shadow-lg overflow-hidden"
      >
        <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary" />

        <div className="p-6 flex flex-col gap-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-20 h-20 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={photoURL || DEFAULT_AVATAR}
                  alt={`${firstName} ${lastName}`}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {firstName} {lastName}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-base-content/55">
                {age && (
                  <span className="flex items-center gap-1">
                    <FiCalendar size={13} /> {age} yrs
                  </span>
                )}
                {gender && (
                  <span className="flex items-center gap-1 capitalize">
                    <BsGenderAmbiguous size={13} /> {gender}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="divider my-0" />

          {/* About */}
          {about && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-1.5">
                About
              </p>
              <p className="text-base-content/70 leading-relaxed text-sm whitespace-pre-line">
                {about}
              </p>
            </div>
          )}

          {/* Skills */}
          {skills?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-2">
                Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="badge badge-outline badge-md">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="divider my-0" />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              className="btn btn-ghost btn-sm gap-1"
              onClick={() => navigate(-1)}
            >
              <FiArrowLeft size={15} /> Back
            </button>
            <Link to={`/chat/${_id}`} className="btn btn-primary btn-sm gap-2">
              <FiMessageCircle size={15} /> Message
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UniqueProfile;
