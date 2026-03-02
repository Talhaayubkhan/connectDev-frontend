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
} from "react-icons/fi";
import { BsGenderAmbiguous } from "react-icons/bs";
import ProfileCard from "../../components/common/ProfileCard";
import ProfilePasswordChange from "./ProfilePasswordChange";
import { useProfileUpdateMutation } from "../../hooks/profile/useUpdateMutation";
import { DEFAULT_AVATAR, GENDER_OPTIONS } from "../../utils/constants";
import { validateEditProfileSchema } from "../../utils/validation";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen bg-base-100 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-base-content mb-4">
          My Profile
        </h1>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validateEditProfileSchema}
          onSubmit={(values) => updateMutation.mutate(values)}
        >
          {({ values, setFieldValue }) => (
            // WHY lg:grid-cols-[1fr_auto]?
            // Left = form takes flexible width.
            // Right = card stays fixed at max-w-sm, doesn't stretch.
            // On mobile: stacks vertically, card goes below form.
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
              {/* Left — edit form */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body gap-5">
                  <h2 className="card-title text-lg">Edit Profile</h2>

                  <Form className="flex flex-col gap-4">
                    {/* First & Last Name */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="label">
                          <span className="label-text flex items-center gap-1">
                            <FiUser size={13} /> First Name
                          </span>
                        </label>
                        <Field
                          name="firstName"
                          placeholder="First name"
                          className="input input-bordered w-full"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="text-error text-xs mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="label">
                          <span className="label-text flex items-center gap-1">
                            <FiUser size={13} /> Last Name
                          </span>
                        </label>
                        <Field
                          name="lastName"
                          placeholder="Last name"
                          className="input input-bordered w-full"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="text-error text-xs mt-1"
                        />
                      </div>
                    </div>

                    {/* Age & Gender */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="label">
                          <span className="label-text flex items-center gap-1">
                            <FiCalendar size={13} /> Age
                          </span>
                        </label>
                        <Field
                          name="age"
                          type="number"
                          placeholder="Age"
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="label">
                          <span className="label-text flex items-center gap-1">
                            <BsGenderAmbiguous size={13} /> Gender
                          </span>
                        </label>
                        <Field
                          as="select"
                          name="gender"
                          className="select select-bordered w-full"
                        >
                          {GENDER_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </div>

                    {/* Photo URL */}
                    <div>
                      <label className="label">
                        <span className="label-text flex items-center gap-1">
                          <FiImage size={13} /> Photo URL
                        </span>
                      </label>
                      <Field
                        name="photoURL"
                        placeholder={DEFAULT_AVATAR}
                        className="input input-bordered w-full"
                      />
                    </div>

                    {/* About */}
                    <div>
                      <label className="label">
                        <span className="label-text flex items-center gap-1">
                          <FiInfo size={13} /> About
                        </span>
                      </label>
                      <Field
                        as="textarea"
                        name="about"
                        placeholder="Tell something about yourself..."
                        className="textarea textarea-bordered w-full resize-none"
                        rows={3}
                      />
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="label">
                        <span className="label-text">Skills</span>
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {values.skills.map((skill, i) => (
                          <span key={i} className="badge badge-primary gap-1">
                            {skill}
                            <button
                              type="button"
                              onClick={() =>
                                setFieldValue(
                                  "skills",
                                  values.skills.filter((_, idx) => idx !== i),
                                )
                              }
                            >
                              <FiX size={11} />
                            </button>
                          </span>
                        ))}
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
                              if (trimmed && !values.skills.includes(trimmed)) {
                                setFieldValue("skills", [
                                  ...values.skills,
                                  trimmed,
                                ]);
                                setSkillInput("");
                              }
                            }
                          }}
                          placeholder="Type skill & press Enter"
                          className="input input-bordered input-sm flex-1"
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
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
                          <FiPlus size={15} />
                        </button>
                      </div>
                    </div>

                    {/* WHY divider before action buttons?
                      Clear separation between data fields and actions.
                      User knows form is done, actions are next. */}
                    <div className="divider my-0" />

                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? (
                        <>
                          <span className="loading loading-spinner loading-sm" />{" "}
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline w-full flex items-center gap-2"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      <FiLock size={15} /> Change Password
                    </button>
                  </Form>
                </div>
              </div>

              {/* Right — live preview */}
              {/* WHY sticky top-24?
                As user scrolls the form, card stays visible.
                They see live changes without scrolling back up. */}
              {/* WHY hidden on mobile, shown on lg?
                On small screens form + card side by side = too cramped.
                Mobile: card shows below form automatically via grid stacking. */}
              <div className="sticky top-24 w-full max-w-sm mx-auto">
                <p className="text-sm text-base-content/40 text-center mb-3">
                  Live Preview
                </p>
                <ProfileCard profile={values} showActions={false} />
              </div>
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
