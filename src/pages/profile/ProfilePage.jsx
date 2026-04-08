// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import {
//   FiUser,
//   FiCalendar,
//   FiInfo,
//   FiImage,
//   FiX,
//   FiPlus,
//   FiLock,
// } from "react-icons/fi";
// import { BsGenderAmbiguous } from "react-icons/bs";
// import ProfileCard from "../../components/common/ProfileCard";
// import ProfilePasswordChange from "./ProfilePasswordChange";
// import { useProfileUpdateMutation } from "../../hooks/profile/useUpdateMutation";
// import { DEFAULT_AVATAR, GENDER_OPTIONS } from "../../utils/constants";
// import { editProfileSchema } from "../../utils/validation";
// import { AnimatePresence } from "framer-motion";

// const ProfilePage = () => {
//   const user = useSelector((state) => state?.auth?.user);
//   const [skillInput, setSkillInput] = useState("");
//   const [showPasswordModal, setShowPasswordModal] = useState(false);

//   const updateMutation = useProfileUpdateMutation();

//   const initialValues = {
//     firstName: user?.firstName || "",
//     lastName: user?.lastName || "",
//     age: user?.age || "",
//     gender: user?.gender || "",
//     about: user?.about || "",
//     photoURL: user?.photoURL || "",
//     skills: user?.skills || [],
//   };

//   return (
//     <div className="min-h-screen bg-base-100 py-6 px-4">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-4xl font-bold text-base-content mb-4">
//           My Profile
//         </h1>

//         <Formik
//           initialValues={initialValues}
//           enableReinitialize
//           validationSchema={editProfileSchema}
//           onSubmit={(values) => updateMutation.mutate(values)}
//         >
//           {({ values, setFieldValue }) => (
//             // WHY lg:grid-cols-[1fr_auto]?
//             // Left = form takes flexible width.
//             // Right = card stays fixed at max-w-sm, doesn't stretch.
//             // On mobile: stacks vertically, card goes below form.
//             <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
//               {/* Left — edit form */}
//               <div className="card bg-base-200 shadow-xl">
//                 <div className="card-body gap-5">
//                   <h2 className="card-title text-lg">Edit Profile</h2>

//                   <Form className="flex flex-col gap-4">
//                     {/* First & Last Name */}
//                     <div className="flex gap-3">
//                       <div className="flex-1">
//                         <label className="label">
//                           <span className="label-text flex items-center gap-1">
//                             <FiUser size={13} /> First Name
//                           </span>
//                         </label>
//                         <Field
//                           name="firstName"
//                           placeholder="First name"
//                           className="input input-bordered w-full"
//                         />
//                         <ErrorMessage
//                           name="firstName"
//                           component="div"
//                           className="text-error text-xs mt-1"
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="label">
//                           <span className="label-text flex items-center gap-1">
//                             <FiUser size={13} /> Last Name
//                           </span>
//                         </label>
//                         <Field
//                           name="lastName"
//                           placeholder="Last name"
//                           className="input input-bordered w-full"
//                         />
//                         <ErrorMessage
//                           name="lastName"
//                           component="div"
//                           className="text-error text-xs mt-1"
//                         />
//                       </div>
//                     </div>

//                     {/* Age & Gender */}
//                     <div className="flex gap-3">
//                       <div className="flex-1">
//                         <label className="label">
//                           <span className="label-text flex items-center gap-1">
//                             <FiCalendar size={13} /> Age
//                           </span>
//                         </label>
//                         <Field
//                           name="age"
//                           type="number"
//                           placeholder="Age"
//                           className="input input-bordered w-full"
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <label className="label">
//                           <span className="label-text flex items-center gap-1">
//                             <BsGenderAmbiguous size={13} /> Gender
//                           </span>
//                         </label>
//                         <Field
//                           as="select"
//                           name="gender"
//                           className="select select-bordered w-full"
//                         >
//                           {GENDER_OPTIONS.map((option) => (
//                             <option key={option.value} value={option.value}>
//                               {option.label}
//                             </option>
//                           ))}
//                         </Field>
//                       </div>
//                     </div>

//                     {/* Photo URL */}
//                     <div>
//                       <label className="label">
//                         <span className="label-text flex items-center gap-1">
//                           <FiImage size={13} /> Photo URL
//                         </span>
//                       </label>
//                       <Field
//                         name="photoURL"
//                         placeholder={DEFAULT_AVATAR}
//                         className="input input-bordered w-full"
//                       />
//                     </div>

//                     {/* About */}
//                     <div>
//                       <label className="label">
//                         <span className="label-text flex items-center gap-1">
//                           <FiInfo size={13} /> About
//                         </span>
//                       </label>
//                       <Field
//                         as="textarea"
//                         name="about"
//                         placeholder="Tell something about yourself..."
//                         className="textarea textarea-bordered w-full resize-none"
//                         rows={3}
//                       />
//                     </div>

//                     {/* Skills */}
//                     <div>
//                       <label className="label">
//                         <span className="label-text">Skills</span>
//                       </label>
//                       <div className="flex flex-wrap gap-2 mb-2">
//                         {values.skills.map((skill, i) => (
//                           <span key={i} className="badge badge-primary gap-1">
//                             {skill}
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 setFieldValue(
//                                   "skills",
//                                   values.skills.filter((_, idx) => idx !== i),
//                                 )
//                               }
//                             >
//                               <FiX size={11} />
//                             </button>
//                           </span>
//                         ))}
//                       </div>
//                       <div className="flex gap-2">
//                         <input
//                           type="text"
//                           value={skillInput}
//                           onChange={(e) => setSkillInput(e.target.value)}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                               e.preventDefault();
//                               const trimmed = skillInput.trim();
//                               if (trimmed && !values.skills.includes(trimmed)) {
//                                 setFieldValue("skills", [
//                                   ...values.skills,
//                                   trimmed,
//                                 ]);
//                                 setSkillInput("");
//                               }
//                             }
//                           }}
//                           placeholder="Type skill & press Enter"
//                           className="input input-bordered input-sm flex-1"
//                         />
//                         <button
//                           type="button"
//                           className="btn btn-sm btn-primary"
//                           onClick={() => {
//                             const trimmed = skillInput.trim();
//                             if (trimmed && !values.skills.includes(trimmed)) {
//                               setFieldValue("skills", [
//                                 ...values.skills,
//                                 trimmed,
//                               ]);
//                               setSkillInput("");
//                             }
//                           }}
//                         >
//                           <FiPlus size={15} />
//                         </button>
//                       </div>
//                     </div>

//                     {/* WHY divider before action buttons?
//                       Clear separation between data fields and actions.
//                       User knows form is done, actions are next. */}
//                     <div className="divider my-0" />

//                     <button
//                       type="submit"
//                       className="btn btn-primary w-full"
//                       disabled={updateMutation.isPending}
//                     >
//                       {updateMutation.isPending ? (
//                         <>
//                           <span className="loading loading-spinner loading-sm" />{" "}
//                           Saving...
//                         </>
//                       ) : (
//                         "Save Changes"
//                       )}
//                     </button>

//                     <button
//                       type="button"
//                       className="btn btn-outline w-full flex items-center gap-2"
//                       onClick={() => setShowPasswordModal(true)}
//                     >
//                       <FiLock size={15} /> Change Password
//                     </button>
//                   </Form>
//                 </div>
//               </div>

//               {/* Right — live preview */}
//               {/* WHY sticky top-24?
//                 As user scrolls the form, card stays visible.
//                 They see live changes without scrolling back up. */}
//               {/* WHY hidden on mobile, shown on lg?
//                 On small screens form + card side by side = too cramped.
//                 Mobile: card shows below form automatically via grid stacking. */}
//               <div className="sticky top-24 w-full max-w-sm mx-auto">
//                 <p className="text-sm text-base-content/40 text-center mb-3">
//                   Live Preview
//                 </p>
//                 <ProfileCard profile={values} showActions={false} />
//               </div>
//             </div>
//           )}
//         </Formik>
//       </div>

//       <AnimatePresence>
//         {showPasswordModal && (
//           <ProfilePasswordChange
//             isOpen={showPasswordModal}
//             onClose={() => setShowPasswordModal(false)}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default ProfilePage;

import { useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  FiUser,
  FiCalendar,
  FiInfo,
  FiImage,
  FiX,
  FiPlus,
  FiLock,
  FiSave,
  FiEye,
} from "react-icons/fi";
import { BsGenderAmbiguous } from "react-icons/bs";
import ProfileCard from "../../components/common/ProfileCard";
import ProfilePasswordChange from "./ProfilePasswordChange";
import { useProfileUpdateMutation } from "../../hooks/profile/useUpdateMutation";
import { DEFAULT_AVATAR, GENDER_OPTIONS } from "../../utils/constants";
import { editProfileSchema } from "../../utils/validation";
import { AnimatePresence, motion } from "framer-motion";

const ProfilePage = () => {
  const user = useSelector((state) => state?.auth?.user);
  const [skillInput, setSkillInput] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const updateMutation = useProfileUpdateMutation();

  const initialValues = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age || "",
    gender: user?.gender || "",
    about: user?.about || "",
    photoURL: user?.photoURL || "",
    skills: user?.skills || [],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-base-content/60 mt-2">
            Manage your personal information
          </p>
        </motion.div>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={editProfileSchema}
          onSubmit={(values) => updateMutation.mutate(values)}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
              {/* Left — Edit Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="card bg-base-100 shadow-2xl border border-base-300">
                  <div className="card-body p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FiUser className="text-primary" size={20} />
                      </div>
                      <h2 className="text-2xl font-semibold">Edit Profile</h2>
                    </div>

                    <p className="text-base-content/60 text-sm mb-6">
                      Update your photo and personal details
                    </p>

                    <Form className="flex flex-col gap-5">
                      {/* Name Section */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-base-content/70 flex items-center gap-2">
                          <FiUser size={14} /> Full Name
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Field
                              name="firstName"
                              placeholder="First name"
                              className="input input-bordered w-full focus:input-primary transition-all duration-200"
                            />
                            <ErrorMessage
                              name="firstName"
                              component="div"
                              className="text-error text-xs mt-1"
                            />
                          </div>
                          <div>
                            <Field
                              name="lastName"
                              placeholder="Last name"
                              className="input input-bordered w-full focus:input-primary transition-all duration-200"
                            />
                            <ErrorMessage
                              name="lastName"
                              component="div"
                              className="text-error text-xs mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Basic Info Row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-base-content/70 flex items-center gap-2">
                            <FiCalendar size={14} /> Age
                          </label>
                          <Field
                            name="age"
                            type="number"
                            placeholder="Age"
                            className="input input-bordered w-full focus:input-primary transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-base-content/70 flex items-center gap-2">
                            <BsGenderAmbiguous size={14} /> Gender
                          </label>
                          <Field
                            as="select"
                            name="gender"
                            className="select select-bordered w-full focus:select-primary transition-all duration-200"
                          >
                            <option value="">Select gender</option>
                            {GENDER_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                        </div>
                      </div>

                      {/* Photo URL */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-base-content/70 flex items-center gap-2">
                          <FiImage size={14} /> Photo URL
                        </label>
                        <Field
                          name="photoURL"
                          placeholder={DEFAULT_AVATAR}
                          className="input input-bordered w-full focus:input-primary transition-all duration-200"
                        />
                      </div>

                      {/* About */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-base-content/70 flex items-center gap-2">
                          <FiInfo size={14} /> About Me
                        </label>
                        <Field
                          as="textarea"
                          name="about"
                          placeholder="Tell something about yourself..."
                          className="textarea textarea-bordered w-full resize-none focus:textarea-primary transition-all duration-200"
                          rows={4}
                        />
                      </div>

                      {/* Skills */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-base-content/70">
                          Skills
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {values.skills.length === 0 ? (
                            <span className="text-base-content/40 text-sm italic">
                              No skills added yet
                            </span>
                          ) : (
                            values.skills.map((skill, i) => (
                              <motion.span
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="badge badge-primary badge-lg gap-2 px-3 py-3"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFieldValue(
                                      "skills",
                                      values.skills.filter(
                                        (_, idx) => idx !== i,
                                      ),
                                    )
                                  }
                                  className="hover:bg-primary-content/20 rounded-full p-0.5 transition-colors"
                                >
                                  <FiX size={12} />
                                </button>
                              </motion.span>
                            ))
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const trimmed = skillInput.trim();
                                if (
                                  trimmed &&
                                  !values.skills.includes(trimmed)
                                ) {
                                  setFieldValue("skills", [
                                    ...values.skills,
                                    trimmed,
                                  ]);
                                  setSkillInput("");
                                }
                              }
                            }}
                            placeholder="Type a skill and press Enter"
                            className="input input-bordered flex-1 focus:input-primary transition-all duration-200"
                          />
                          <button
                            type="button"
                            className="btn btn-primary btn-square"
                            onClick={() => {
                              const trimmed = skillInput.trim();
                              if (trimmed && !values.skills.includes(trimmed)) {
                                setFieldValue("skills", [
                                  ...values.skills,
                                  trimmed,
                                ]);
                                setSkillInput("");
                              }
                            }}
                          >
                            <FiPlus size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="divider my-2" />

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          type="submit"
                          className="btn btn-primary w-full gap-2"
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? (
                            <>
                              <span className="loading loading-spinner loading-sm" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <FiSave size={18} />
                              Save Changes
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline w-full gap-2"
                          onClick={() => setShowPasswordModal(true)}
                        >
                          <FiLock size={18} />
                          Change Password
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </motion.div>

              {/* Right — Live Preview Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sticky top-24"
              >
                <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-base-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiEye className="text-primary" size={18} />
                        <h3 className="font-semibold">Live Preview</h3>
                      </div>
                      <span className="text-xs text-base-content/50 bg-base-200 px-2 py-1 rounded-full">
                        Auto-updates
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:m-auto md:justify-center md:items-center">
                    <ProfileCard profile={values} showActions={false} />
                  </div>
                </div>

                {/* Quick tip */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-base-content/40">
                    Changes appear instantly as you type
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </Formik>
      </div>

      <AnimatePresence>
        {showPasswordModal && (
          <ProfilePasswordChange
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
