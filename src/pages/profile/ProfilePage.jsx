// ProfilePage.jsx - Improved with subtle polish, original colors preserved
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
  FiSave,
} from "react-icons/fi";
import { BsGenderAmbiguous } from "react-icons/bs";
import ProfileCard from "../../components/common/ProfileCard";
import ProfilePasswordChange from "./ProfilePasswordChange";
import { useProfileUpdateMutation } from "../../hooks/profile/useUpdateMutation";
import { DEFAULT_AVATAR, GENDER_OPTIONS } from "../../utils/constants";
import { editProfileSchema } from "../../utils/validation";
import { AnimatePresence } from "framer-motion";

const FieldGroup = ({ icon: Icon, label, children, error, optional }) => (
  <div className="flex flex-col gap-1.5">
    <label className="label py-0">
      <span className="label-text flex items-center gap-1.5 text-xs font-medium text-base-content/60 uppercase tracking-wide">
        {Icon && <Icon size={12} />}
        {label}
        {optional && <span className="ml-1 text-[10px]">(optional)</span>}
      </span>
    </label>
    {children}
    {error && <p className="text-error text-xs mt-0.5 pl-1">{error}</p>}
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
    <div className="min-h-screen bg-base-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header - cleaner */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-base-content">Profile</h1>
          <div className="h-0.5 w-12 bg-primary/40 mt-2 rounded-full" />
          <p className="text-sm text-base-content/40 mt-3">
            Update your information
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
          {({ values, setFieldValue, errors, touched, isSubmitting }) => (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left: Edit Form */}
              <div className="flex-1 min-w-0">
                <div className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="card-body gap-6 p-6">
                    <Form className="flex flex-col gap-5">
                      {/* Name row */}
                      <div className="grid grid-cols-2 gap-4">
                        <FieldGroup
                          icon={FiUser}
                          label="First name"
                          error={touched.firstName && errors.firstName}
                        >
                          <Field
                            name="firstName"
                            placeholder="Your first name"
                            className="input input-bordered w-full focus:input-primary transition-all duration-200"
                          />
                        </FieldGroup>
                        <FieldGroup
                          icon={FiUser}
                          label="Last name"
                          error={touched.lastName && errors.lastName}
                        >
                          <Field
                            name="lastName"
                            placeholder="Your last name"
                            className="input input-bordered w-full focus:input-primary transition-all duration-200"
                          />
                        </FieldGroup>
                      </div>

                      {/* Details row */}
                      <div className="grid grid-cols-2 gap-4">
                        <FieldGroup icon={FiCalendar} label="Age" optional>
                          <Field
                            name="age"
                            type="number"
                            placeholder="e.g., 25"
                            className="input input-bordered w-full focus:input-primary transition-all duration-200"
                          />
                        </FieldGroup>
                        <FieldGroup
                          icon={BsGenderAmbiguous}
                          label="Gender"
                          optional
                        >
                          <Field
                            as="select"
                            name="gender"
                            className="select select-bordered w-full focus:select-primary transition-all duration-200"
                          >
                            {GENDER_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                        </FieldGroup>
                      </div>

                      {/* Photo URL */}
                      <FieldGroup icon={FiImage} label="Photo URL" optional>
                        <Field
                          name="photoURL"
                          placeholder={DEFAULT_AVATAR}
                          className="input input-bordered w-full focus:input-primary transition-all duration-200 font-mono text-sm"
                        />
                      </FieldGroup>

                      <div className="relative my-1">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-base-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-base-200 px-3 text-[11px] text-base-content/40 uppercase tracking-wider">
                            About you
                          </span>
                        </div>
                      </div>

                      {/* About */}
                      <FieldGroup icon={FiInfo} label="Bio" optional>
                        <Field
                          as="textarea"
                          name="about"
                          placeholder="Write a short bio..."
                          className="textarea textarea-bordered w-full resize-none focus:textarea-primary transition-all duration-200"
                          rows={3}
                        />
                      </FieldGroup>

                      {/* Location & Occupation - two column */}
                      <div className="grid grid-cols-2 gap-4">
                        <FieldGroup icon={FiMapPin} label="Location" optional>
                          <Field
                            name="location"
                            placeholder="City, Country"
                            className="input input-bordered w-full focus:input-primary transition-all duration-200"
                          />
                        </FieldGroup>
                        <FieldGroup
                          icon={FiBriefcase}
                          label="Occupation"
                          optional
                        >
                          <Field
                            name="occupation"
                            placeholder="Your role"
                            className="input input-bordered w-full focus:input-primary transition-all duration-200"
                          />
                        </FieldGroup>
                      </div>

                      <div className="relative my-1">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-base-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-base-200 px-3 text-[11px] text-base-content/40 uppercase tracking-wider">
                            Skills
                          </span>
                        </div>
                      </div>

                      {/* Skills section */}
                      <div className="flex flex-col gap-3">
                        {values.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {values.skills.map((skill, i) => (
                              <span
                                key={i}
                                className="badge badge-primary gap-1.5 py-3 px-3 text-xs font-normal"
                              >
                                {skill}
                                <button
                                  type="button"
                                  className="hover:bg-primary-focus/20 rounded-full p-0.5 transition-all"
                                  onClick={() =>
                                    setFieldValue(
                                      "skills",
                                      values.skills.filter(
                                        (_, idx) => idx !== i,
                                      ),
                                    )
                                  }
                                >
                                  <FiX size={12} />
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
                            placeholder="Type a skill and press Enter"
                            className="input input-bordered flex-1 focus:input-primary transition-all duration-200"
                          />
                          <button
                            type="button"
                            className="btn btn-outline btn-primary gap-1"
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
                            <FiPlus size={14} /> Add
                          </button>
                        </div>

                        {!values.skills.length && (
                          <p className="text-xs text-base-content/30 italic pl-1">
                            No skills added yet. Add your top skills.
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="mt-2 space-y-2">
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
                              <FiSave size={16} />
                              Save changes
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          className="btn btn-ghost w-full gap-2 text-base-content/60 hover:text-base-content"
                          onClick={() => setShowPasswordModal(true)}
                        >
                          <FiLock size={14} />
                          Change password
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>

              {/* Right: Live Preview */}
              <div className="lg:w-96 flex-shrink-0">
                <div className="sticky top-24">
                  <div className="text-center mb-4">
                    <p className="text-[10px] text-base-content/30 uppercase tracking-[0.2em] font-medium">
                      Live preview
                    </p>
                    <div className="h-px w-8 bg-base-300 mx-auto mt-1.5" />
                  </div>
                  <ProfileCard profile={values} showActions={false} />
                  <p className="text-[10px] text-base-content/25 text-center mt-3">
                    Changes appear instantly
                  </p>
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
