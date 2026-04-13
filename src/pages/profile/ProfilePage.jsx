// ProfilePage.jsx - Fixed width only, original colors preserved
import { useState } from "react";
import { useShowProfile } from "../../hooks/profile/useShowProfile";
import { Formik, Form, Field } from "formik";
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
} from "react-icons/fi";
import { BsGenderAmbiguous } from "react-icons/bs";
import ProfileCard from "../../components/common/ProfileCard";
import ProfilePasswordChange from "./ProfilePasswordChange";
import { useProfileUpdateMutation } from "../../hooks/profile/useUpdateMutation";
import { DEFAULT_AVATAR, GENDER_OPTIONS } from "../../utils/constants";
import { editProfileSchema } from "../../utils/validation";
import { AnimatePresence } from "framer-motion";

const FieldGroup = ({ icon: Icon, label, children, error }) => (
  <div className="flex flex-col gap-1">
    <label className="label py-0">
      <span className="label-text flex items-center gap-1.5 font-medium text-base-content/70">
        {Icon && <Icon size={13} />}
        {label}
      </span>
    </label>
    {children}
    {error && <p className="text-error text-xs mt-0.5">{error}</p>}
  </div>
);

const ProfilePage = () => {
  const { data: user, isLoading } = useShowProfile();
  const [skillInput, setSkillInput] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const updateMutation = useProfileUpdateMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) return null;

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
  };

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-base-content">My Profile</h1>
          <p className="text-sm text-base-content/40 mt-1">
            Keep your profile up to date so others can connect with you.
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={editProfileSchema}
          onSubmit={(values) => {
            updateMutation.mutate(values);
          }}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left: Edit Form - Takes remaining space */}
              <div className="flex-1 min-w-0">
                <div className="card bg-base-200 shadow-xl">
                  <div className="card-body gap-6 p-6">
                    <h2 className="text-base font-semibold text-base-content/60 uppercase tracking-wider">
                      Edit Profile
                    </h2>

                    <Form className="flex flex-col gap-5">
                      <div className="grid grid-cols-2 gap-3">
                        <FieldGroup
                          icon={FiUser}
                          label="First Name"
                          error={touched.firstName && errors.firstName}
                        >
                          <Field
                            name="firstName"
                            placeholder="First name"
                            className="input input-bordered input-sm w-full"
                          />
                        </FieldGroup>
                        <FieldGroup
                          icon={FiUser}
                          label="Last Name"
                          error={touched.lastName && errors.lastName}
                        >
                          <Field
                            name="lastName"
                            placeholder="Last name"
                            className="input input-bordered input-sm w-full"
                          />
                        </FieldGroup>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <FieldGroup icon={FiCalendar} label="Age">
                          <Field
                            name="age"
                            type="number"
                            placeholder="e.g. 25"
                            className="input input-bordered input-sm w-full"
                          />
                        </FieldGroup>
                        <FieldGroup icon={BsGenderAmbiguous} label="Gender">
                          <Field
                            as="select"
                            name="gender"
                            className="select select-bordered select-sm w-full"
                          >
                            {GENDER_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                        </FieldGroup>
                      </div>

                      <FieldGroup icon={FiImage} label="Photo URL">
                        <Field
                          name="photoURL"
                          placeholder={DEFAULT_AVATAR}
                          className="input input-bordered input-sm w-full"
                        />
                      </FieldGroup>

                      <div className="divider text-xs text-base-content/30 my-0">
                        About You
                      </div>

                      <FieldGroup icon={FiInfo} label="About">
                        <Field
                          as="textarea"
                          name="about"
                          placeholder="Tell something about yourself..."
                          className="textarea textarea-bordered w-full resize-none text-sm"
                          rows={3}
                        />
                      </FieldGroup>

                      <FieldGroup icon={FiMapPin} label="Location">
                        <Field
                          name="location"
                          placeholder="e.g. Karachi, Pakistan"
                          className="input input-bordered input-sm w-full"
                        />
                      </FieldGroup>

                      <FieldGroup icon={FiBriefcase} label="Occupation">
                        <Field
                          name="occupation"
                          placeholder="e.g. Full Stack Developer"
                          className="input input-bordered input-sm w-full"
                        />
                      </FieldGroup>

                      <div className="divider text-xs text-base-content/30 my-0">
                        Skills
                      </div>

                      <div className="flex flex-col gap-2">
                        {values.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {values.skills.map((skill, i) => (
                              <span
                                key={i}
                                className="badge badge-primary gap-1 pr-1"
                              >
                                {skill}
                                <button
                                  type="button"
                                  className="hover:opacity-60 transition-opacity"
                                  onClick={() =>
                                    setFieldValue(
                                      "skills",
                                      values.skills.filter(
                                        (_, idx) => idx !== i,
                                      ),
                                    )
                                  }
                                >
                                  <FiX size={11} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

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
                            placeholder="Type a skill & press Enter"
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

                        {!values.skills.length && (
                          <p className="text-xs text-base-content/30 italic">
                            No skills added yet.
                          </p>
                        )}
                      </div>

                      <div className="divider my-0" />

                      <div className="flex flex-col gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary w-full"
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? (
                            <>
                              <span className="loading loading-spinner loading-sm" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </button>

                        <button
                          type="button"
                          className="btn btn-ghost btn-sm w-full flex items-center gap-2 text-base-content/50 hover:text-base-content"
                          onClick={() => setShowPasswordModal(true)}
                        >
                          <FiLock size={13} /> Change Password
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>

              {/* Right: Live Preview - Fixed width */}
              <div className="lg:w-96 flex-shrink-0">
                <div className="sticky top-24">
                  <p className="text-xs text-base-content/30 text-center mb-3 uppercase tracking-widest">
                    Live Preview
                  </p>
                  <ProfileCard profile={values} showActions={false} />
                </div>
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
