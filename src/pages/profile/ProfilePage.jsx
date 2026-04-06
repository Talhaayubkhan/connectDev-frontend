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
  FiMapPin,
  FiBriefcase,
  FiGlobe,
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  const updateMutation = useProfileUpdateMutation();

  const initialValues = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age || "",
    gender: user?.gender || "",
    about: user?.about || "",
    photoURL: user?.photoURL || "",
    skills: user?.skills || [],
    location: user?.location || "",
    occupation: user?.occupation || "",
    website: user?.website || "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateMutation.mutateAsync(values);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const sections = [
    { id: "basic", label: "Basic Info", icon: <FiUser size={16} /> },
    {
      id: "professional",
      label: "Professional",
      icon: <FiBriefcase size={16} />,
    },
    { id: "bio", label: "Bio & Skills", icon: <FiInfo size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100">
      <div className="max-w-6xl mx-auto py-6 md:py-10 px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Edit Profile
              </h1>
              <p className="text-sm text-base-content/60 mt-1">
                Manage your personal information and preferences
              </p>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {showSuccessMessage && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="alert alert-success shadow-lg max-w-xs"
                >
                  <FiCheckCircle className="text-success-content" />
                  <span>Profile updated successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={editProfileSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 md:gap-8">
              {/* Left Column - Edit Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body p-5 md:p-7">
                    {/* Section Tabs - Mobile */}
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 lg:hidden">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                            activeSection === section.id
                              ? "bg-primary/10 text-primary"
                              : "text-base-content/60 hover:bg-base-200"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {section.icon}
                            {section.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <Form className="flex flex-col gap-5">
                      {/* Basic Information Section */}
                      <div
                        className={
                          activeSection === "basic"
                            ? "block"
                            : "hidden lg:block"
                        }
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-2 bg-primary/10 rounded-lg hidden lg:block">
                            <FiUser className="text-primary" size={18} />
                          </div>
                          <h2 className="text-lg font-semibold">
                            Basic Information
                          </h2>
                        </div>

                        <div className="space-y-4">
                          {/* Name Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="label">
                                <span className="label-text font-medium flex items-center gap-1">
                                  <FiUser size={14} /> First Name{" "}
                                  <span className="text-error">*</span>
                                </span>
                              </label>
                              <Field
                                name="firstName"
                                placeholder="Enter your first name"
                                className={`input input-bordered w-full focus:input-primary transition-all ${
                                  errors.firstName && touched.firstName
                                    ? "input-error"
                                    : ""
                                }`}
                              />
                              <ErrorMessage
                                name="firstName"
                                component="div"
                                className="text-error text-xs mt-1 flex items-center gap-1"
                              >
                                {(msg) => (
                                  <>
                                    <FiAlertCircle size={12} /> {msg}
                                  </>
                                )}
                              </ErrorMessage>
                            </div>
                            <div>
                              <label className="label">
                                <span className="label-text font-medium flex items-center gap-1">
                                  <FiUser size={14} /> Last Name{" "}
                                  <span className="text-error">*</span>
                                </span>
                              </label>
                              <Field
                                name="lastName"
                                placeholder="Enter your last name"
                                className={`input input-bordered w-full focus:input-primary transition-all ${
                                  errors.lastName && touched.lastName
                                    ? "input-error"
                                    : ""
                                }`}
                              />
                              <ErrorMessage
                                name="lastName"
                                component="div"
                                className="text-error text-xs mt-1 flex items-center gap-1"
                              >
                                {(msg) => (
                                  <>
                                    <FiAlertCircle size={12} /> {msg}
                                  </>
                                )}
                              </ErrorMessage>
                            </div>
                          </div>

                          {/* Age & Gender */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="label">
                                <span className="label-text font-medium flex items-center gap-1">
                                  <FiCalendar size={14} /> Age
                                </span>
                              </label>
                              <Field
                                name="age"
                                type="number"
                                placeholder="Your age"
                                className="input input-bordered w-full"
                              />
                            </div>
                            <div>
                              <label className="label">
                                <span className="label-text font-medium flex items-center gap-1">
                                  <BsGenderAmbiguous size={14} /> Gender
                                </span>
                              </label>
                              <Field
                                as="select"
                                name="gender"
                                className="select select-bordered w-full"
                              >
                                {GENDER_OPTIONS.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </Field>
                            </div>
                          </div>

                          {/* Photo URL */}
                          <div>
                            <label className="label">
                              <span className="label-text font-medium flex items-center gap-1">
                                <FiImage size={14} /> Profile Photo URL
                              </span>
                            </label>
                            <Field
                              name="photoURL"
                              placeholder={DEFAULT_AVATAR}
                              className="input input-bordered w-full"
                            />
                            <p className="text-xs text-base-content/40 mt-1">
                              Enter a valid image URL for your profile picture
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Professional Information Section */}
                      <div
                        className={
                          activeSection === "professional"
                            ? "block"
                            : "hidden lg:block"
                        }
                      >
                        <div className="divider my-2 lg:my-4" />
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-2 bg-primary/10 rounded-lg hidden lg:block">
                            <FiBriefcase className="text-primary" size={18} />
                          </div>
                          <h2 className="text-lg font-semibold">
                            Professional Information
                          </h2>
                        </div>

                        <div className="space-y-4">
                          {/* Location & Occupation */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="label">
                                <span className="label-text font-medium flex items-center gap-1">
                                  <FiMapPin size={14} /> Location
                                </span>
                              </label>
                              <Field
                                name="location"
                                placeholder="City, Country"
                                className="input input-bordered w-full"
                              />
                            </div>
                            <div>
                              <label className="label">
                                <span className="label-text font-medium flex items-center gap-1">
                                  <FiBriefcase size={14} /> Occupation
                                </span>
                              </label>
                              <Field
                                name="occupation"
                                placeholder="Your profession"
                                className="input input-bordered w-full"
                              />
                            </div>
                          </div>

                          {/* Website */}
                          <div>
                            <label className="label">
                              <span className="label-text font-medium flex items-center gap-1">
                                <FiGlobe size={14} /> Website / Portfolio
                              </span>
                            </label>
                            <Field
                              name="website"
                              placeholder="https://your-website.com"
                              className="input input-bordered w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bio & Skills Section */}
                      <div
                        className={
                          activeSection === "bio" ? "block" : "hidden lg:block"
                        }
                      >
                        <div className="divider my-2 lg:my-4" />
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-2 bg-primary/10 rounded-lg hidden lg:block">
                            <FiInfo className="text-primary" size={18} />
                          </div>
                          <h2 className="text-lg font-semibold">
                            Bio & Skills
                          </h2>
                        </div>

                        <div className="space-y-4">
                          {/* About */}
                          <div>
                            <label className="label">
                              <span className="label-text font-medium flex items-center gap-1">
                                <FiInfo size={14} /> About Me
                              </span>
                            </label>
                            <Field
                              as="textarea"
                              name="about"
                              placeholder="Tell others about yourself, your interests, and what you're looking for..."
                              className="textarea textarea-bordered w-full resize-none h-28"
                              rows={4}
                            />
                            <p className="text-xs text-base-content/40 mt-1">
                              Share your background, interests, and what you're
                              passionate about
                            </p>
                          </div>

                          {/* Skills */}
                          <div>
                            <label className="label">
                              <span className="label-text font-medium">
                                Skills & Interests
                              </span>
                            </label>

                            {/* Skills Display */}
                            {values.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3 p-3 bg-base-200 rounded-lg">
                                {values.skills.map((skill, i) => (
                                  <span
                                    key={i}
                                    className="badge badge-primary badge-lg gap-2 px-3 py-3 text-sm"
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
                                      className="hover:text-error transition-colors"
                                    >
                                      <FiX size={12} />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Add Skill Input */}
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
                                className="input input-bordered flex-1"
                              />
                              <button
                                type="button"
                                className="btn btn-primary gap-2"
                                onClick={() => {
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
                                }}
                              >
                                <FiPlus size={16} /> Add
                              </button>
                            </div>
                            <p className="text-xs text-base-content/40 mt-1">
                              Add your technical skills, programming languages,
                              or professional interests
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="divider my-2 lg:my-4" />

                      <div className="flex flex-col gap-3">
                        <button
                          type="submit"
                          className="btn btn-primary gap-2 h-11"
                          disabled={isSubmitting || updateMutation.isPending}
                        >
                          {isSubmitting || updateMutation.isPending ? (
                            <>
                              <span className="loading loading-spinner loading-sm" />
                              Saving Changes...
                            </>
                          ) : (
                            <>
                              <FiSave size={16} />
                              Save All Changes
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline gap-2"
                          onClick={() => setShowPasswordModal(true)}
                        >
                          <FiLock size={16} />
                          Change Password
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Live Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="lg:sticky lg:top-24"
              >
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-12 h-0.5 bg-primary/30 rounded-full" />
                      <p className="text-sm font-medium text-base-content/60">
                        Live Preview
                      </p>
                      <div className="w-12 h-0.5 bg-primary/30 rounded-full" />
                    </div>
                    <p className="text-xs text-base-content/40">
                      See how your profile appears to others
                    </p>
                  </div>

                  <ProfileCard
                    profile={values}
                    showActions={false}
                    variant="preview"
                  />

                  {/* Tips Card */}
                  <div className="bg-base-200 rounded-lg p-4 mt-4">
                    <h4 className="text-sm font-semibold mb-2">
                      💡 Profile Tips
                    </h4>
                    <ul className="text-xs text-base-content/70 space-y-1">
                      <li>• Add a professional profile photo</li>
                      <li>• List your key skills and technologies</li>
                      <li>• Write a compelling bio about yourself</li>
                      <li>• Keep your information up to date</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </Formik>
      </div>

      {/* Password Change Modal */}
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
