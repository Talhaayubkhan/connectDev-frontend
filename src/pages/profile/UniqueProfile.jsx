// import { Link, useNavigate, useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useUniqueProfile } from "../../hooks/profile/useShowUniqueProfile";
// import ErrorPage from "../../components/common/ErrorPage";
// import { DEFAULT_AVATAR } from "../../utils/constants";
// import { FiLock } from "react-icons/fi";

// const UniqueProfile = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const { data, isLoading, error } = useUniqueProfile(userId);

//   if (isLoading) {
//     return (
//       <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
//         <div className="skeleton h-32 w-full rounded-xl" />
//         <div className="flex gap-4 items-center">
//           <div className="skeleton w-20 h-20 rounded-full" />
//           <div className="flex-1 space-y-2">
//             <div className="skeleton h-4 w-1/3" />
//             <div className="skeleton h-3 w-1/4" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     const status = error?.response?.status;

//     if (status === 403) {
//       return (
//         <div className="text-center py-16">
//           <FiLock className="mx-auto text-warning text-3xl mb-3" />
//           <p className="text-sm text-base-content/60">
//             This profile is private
//           </p>
//           <button className="btn btn-ghost mt-4" onClick={() => navigate(-1)}>
//             Go Back
//           </button>
//         </div>
//       );
//     }

//     if (status === 404) {
//       return (
//         <p className="text-center mt-10 text-base-content/50">User not found</p>
//       );
//     }

//     return <ErrorPage />;
//   }

//   if (!data) return null;

//   const { _id, firstName, lastName, photoURL, age, gender, skills, about } =
//     data;

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-10">
//       <motion.div
//         initial={{ opacity: 0, y: 15 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-base-100 rounded-2xl shadow-lg overflow-hidden"
//       >
//         {/* Cover */}
//         <div className="h-28 bg-gradient-to-r from-primary to-secondary" />

//         {/* Profile Section */}
//         <div className="p-6 relative">
//           <div className="flex gap-4 items-start">
//             {/* Avatar */}
//             <div className="absolute -top-12 left-6">
//               <div className="w-24 h-24 rounded-full ring-4 ring-base-100 overflow-hidden">
//                 <img
//                   src={photoURL || DEFAULT_AVATAR}
//                   alt="avatar"
//                   onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
//                 />
//               </div>
//             </div>

//             <div className="ml-28 flex-1">
//               <h2 className="text-xl font-bold">
//                 {firstName} {lastName}
//               </h2>

//               <div className="flex gap-3 text-sm text-base-content/60 mt-1">
//                 {age && <span>{age} yrs</span>}
//                 {gender && <span className="capitalize">{gender}</span>}
//               </div>
//             </div>
//           </div>

//           {/* About */}
//           {about && (
//             <div className="mt-6">
//               <p className="text-xs uppercase text-base-content/40 mb-1">
//                 About
//               </p>
//               <p className="text-sm text-base-content/70">{about}</p>
//             </div>
//           )}

//           {/* Skills */}
//           {skills?.length > 0 && (
//             <div className="mt-5">
//               <p className="text-xs uppercase text-base-content/40 mb-2">
//                 Skills
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {skills.map((skill) => (
//                   <span
//                     key={skill}
//                     className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Actions */}
//           <div className="flex justify-between mt-6">
//             <button className="btn btn-ghost" onClick={() => navigate(-1)}>
//               Back
//             </button>

//             <Link to={`/chat/${_id}`} className="btn btn-primary">
//               Message
//             </Link>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };
// export default UniqueProfile;

import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useUniqueProfile } from "../../hooks/profile/useShowUniqueProfile";
import ErrorPage from "../../components/common/ErrorPage";
import { DEFAULT_AVATAR } from "../../utils/constants";
import { FiLock, FiArrowLeft, FiMail, FiUser, FiTag } from "react-icons/fi";

const UniqueProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useUniqueProfile(userId);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <div className="skeleton h-32 w-full rounded-xl" />
        <div className="flex gap-4 items-center">
          <div className="skeleton w-20 h-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-3 w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const status = error?.response?.status;

    if (status === 403) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
              <FiLock className="text-warning text-3xl" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Profile Restricted</h3>
            <p className="text-sm text-base-content/60 max-w-sm mx-auto mb-6">
              You need to be connected with this user to view their full profile
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate("/connect")}
              >
                Browse People
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(-1)}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (status === 404) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
              <FiUser className="text-error text-3xl" />
            </div>
            <h3 className="text-lg font-semibold mb-2">User Not Found</h3>
            <p className="text-sm text-base-content/60 mb-6">
              This profile doesn't exist or may have been removed
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/connect")}
            >
              Back to Connect
            </button>
          </div>
        </div>
      );
    }

    return <ErrorPage />;
  }

  if (!data) return null;

  const { _id, firstName, lastName, photoURL, age, gender, skills, about } =
    data;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-base-100 rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Cover - Keep your gradient */}
        <div className="h-28 bg-gradient-to-r from-primary to-secondary relative">
          {/* Back button on cover for mobile */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 btn btn-circle btn-ghost btn-sm bg-base-100/20 backdrop-blur-sm text-white hover:bg-base-100/30"
            aria-label="Go back"
          >
            <FiArrowLeft className="text-lg" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-4 md:px-6 pb-6 md:pb-8 relative">
          {/* Avatar - Improved positioning for mobile */}
          <div className="relative -mt-12 mb-4 md:mb-6">
            <div className="w-24 h-24 rounded-full ring-4 ring-base-100 overflow-hidden bg-base-200 shadow-md">
              <img
                src={photoURL || DEFAULT_AVATAR}
                alt={`${firstName} ${lastName}`}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
              />
            </div>
          </div>

          {/* User Info - Better spacing */}
          <div className="mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold">
              {firstName} {lastName}
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-base-content/60 mt-1">
              {age && (
                <span className="flex items-center gap-1">
                  <span>🎂</span> {age} years
                </span>
              )}
              {gender && (
                <span className="flex items-center gap-1 capitalize">
                  <span>👤</span> {gender}
                </span>
              )}
            </div>
          </div>

          {/* About Section - Cleaner layout */}
          {about && (
            <div className="mb-5 md:mb-6">
              <h3 className="text-xs font-semibold uppercase text-base-content/40 mb-2 tracking-wider">
                About
              </h3>
              <p className="text-sm text-base-content/70 leading-relaxed">
                {about}
              </p>
            </div>
          )}

          {/* Skills Section - Better visual */}
          {skills?.length > 0 && (
            <div className="mb-6 md:mb-8">
              <h3 className="text-xs font-semibold uppercase text-base-content/40 mb-2 tracking-wider">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-xs rounded-full bg-primary/10 text-primary font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons - Better for mobile */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:gap-4 pt-4 border-t border-base-200">
            <button
              className="btn btn-ghost justify-center sm:justify-start"
              onClick={() => navigate(-1)}
            >
              <FiArrowLeft className="text-base" />
              Back
            </button>

            <Link
              to={`/chat/${_id}`}
              className="btn btn-primary flex-1 sm:flex-none"
            >
              <FiMail className="text-base" />
              Send Message
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UniqueProfile;
