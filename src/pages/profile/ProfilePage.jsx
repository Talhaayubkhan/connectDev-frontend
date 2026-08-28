import { useState } from "react";
import { Field, Form, Formik } from "formik";
import { AnimatePresence } from "framer-motion";
import { BsGenderAmbiguous } from "react-icons/bs";
import {
  FiBriefcase,
  FiCalendar,
  FiImage,
  FiInfo,
  FiLock,
  FiMapPin,
  FiPlus,
  FiSave,
  FiUser,
  FiX,
} from "react-icons/fi";
import ErrorPage from "../../components/common/ErrorPage";
import PageLoader from "../../components/common/PageLoader";
import ProfileCard from "../../components/common/ProfileCard";
import { useShowProfile } from "../../hooks/profile/useShowProfile";
import { useProfileUpdateMutation } from "../../hooks/profile/useUpdateMutation";
import { DEFAULT_AVATAR, GENDER_OPTIONS } from "../../utils/constants";
import { editProfileSchema } from "../../utils/validation";
import ProfilePasswordChange from "./ProfilePasswordChange";

const FieldGroup = ({ icon: Icon, id, label, children, error, optional }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="label py-0">
      <span className="label-text flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-base-content/60">
        {Icon && <Icon aria-hidden="true" size={12} />}
        {label}
        {optional && (
          <span className="ml-1 text-[10px] normal-case">(optional)</span>
        )}
      </span>
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} role="alert" className="pl-1 text-xs text-error">
        {error}
      </p>
    )}
  </div>
);

const Divider = ({ children }) => (
  <div className="relative my-1">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-base-300" />
    </div>
    <div className="relative flex justify-center">
      <span className="bg-base-200 px-3 text-[11px] uppercase tracking-wider text-base-content/50">
        {children}
      </span>
    </div>
  </div>
);

const ProfilePage = () => {
  const { data: user, isLoading, error, refetch } = useShowProfile();
  const [skillInput, setSkillInput] = useState("");
  const [skillMessage, setSkillMessage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const updateMutation = useProfileUpdateMutation();

  if (isLoading) return <PageLoader label="Loading your profile" />;
  if (error)
    return (
      <ErrorPage
        code="500"
        message="Failed to load profile"
        subMessage="Check your connection and try again."
        onRetry={refetch}
      />
    );
  if (!user) return null;

  const initialValues = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    age: user.age || "",
    gender: user.gender || "",
    about: user.about || "",
    photoURL: user.photoURL || "",
    skills: user.skills || [],
    location: user.location || "",
    occupation: user.occupation || "",
  };

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-base-100 px-1 py-6 sm:px-4">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="mt-2 h-0.5 w-12 rounded-full bg-primary/40" />
          <p className="mt-3 text-sm text-base-content/60">
            Keep your developer profile accurate and useful.
          </p>
        </header>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={editProfileSchema}
          onSubmit={(values) => updateMutation.mutate(values)}
        >
          {({ values, setFieldValue, errors, touched }) => {
            const fieldError = (name) => touched[name] && errors[name];
            const addSkill = () => {
              const trimmed = skillInput.trim();
              if (!trimmed) return;
              if (values.skills.length >= 15) {
                setSkillMessage("You can add up to 15 skills.");
                return;
              }
              if (
                values.skills.some(
                  (skill) => skill.toLowerCase() === trimmed.toLowerCase(),
                )
              ) {
                setSkillMessage("That skill is already listed.");
                return;
              }
              setFieldValue("skills", [...values.skills, trimmed]);
              setSkillInput("");
              setSkillMessage("");
            };

            return (
              <div className="flex flex-col items-start gap-8 lg:flex-row">
                <section
                  aria-labelledby="edit-profile-heading"
                  className="min-w-0 flex-1"
                >
                  <div className="card bg-base-200 shadow-md">
                    <div className="card-body gap-6 p-4 sm:p-6">
                      <h2 id="edit-profile-heading" className="sr-only">
                        Edit profile
                      </h2>
                      <Form className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FieldGroup
                            icon={FiUser}
                            id="firstName"
                            label="First name"
                            error={fieldError("firstName")}
                          >
                            <Field
                              id="firstName"
                              name="firstName"
                              autoComplete="given-name"
                              aria-describedby={
                                fieldError("firstName")
                                  ? "firstName-error"
                                  : undefined
                              }
                              className="input input-bordered w-full"
                            />
                          </FieldGroup>
                          <FieldGroup
                            icon={FiUser}
                            id="lastName"
                            label="Last name"
                            error={fieldError("lastName")}
                          >
                            <Field
                              id="lastName"
                              name="lastName"
                              autoComplete="family-name"
                              aria-describedby={
                                fieldError("lastName")
                                  ? "lastName-error"
                                  : undefined
                              }
                              className="input input-bordered w-full"
                            />
                          </FieldGroup>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FieldGroup
                            icon={FiCalendar}
                            id="age"
                            label="Age"
                            optional
                            error={fieldError("age")}
                          >
                            <Field
                              id="age"
                              name="age"
                              type="number"
                              min="18"
                              max="100"
                              inputMode="numeric"
                              aria-describedby={
                                fieldError("age") ? "age-error" : undefined
                              }
                              className="input input-bordered w-full"
                            />
                          </FieldGroup>
                          <FieldGroup
                            icon={BsGenderAmbiguous}
                            id="gender"
                            label="Gender"
                            optional
                            error={fieldError("gender")}
                          >
                            <Field
                              id="gender"
                              as="select"
                              name="gender"
                              aria-describedby={
                                fieldError("gender")
                                  ? "gender-error"
                                  : undefined
                              }
                              className="select select-bordered w-full"
                            >
                              {GENDER_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Field>
                          </FieldGroup>
                        </div>

                        <FieldGroup
                          icon={FiImage}
                          id="photoURL"
                          label="Photo URL"
                          optional
                          error={fieldError("photoURL")}
                        >
                          <Field
                            id="photoURL"
                            name="photoURL"
                            type="url"
                            placeholder={DEFAULT_AVATAR}
                            aria-describedby={
                              fieldError("photoURL")
                                ? "photoURL-error"
                                : undefined
                            }
                            className="input input-bordered w-full font-mono text-sm"
                          />
                        </FieldGroup>

                        <Divider>About you</Divider>
                        <FieldGroup
                          icon={FiInfo}
                          id="about"
                          label="Bio"
                          optional
                          error={fieldError("about")}
                        >
                          <Field
                            id="about"
                            as="textarea"
                            name="about"
                            rows={3}
                            placeholder="Write a short bio"
                            aria-describedby={
                              fieldError("about") ? "about-error" : undefined
                            }
                            className="textarea textarea-bordered w-full resize-none"
                          />
                        </FieldGroup>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FieldGroup
                            icon={FiMapPin}
                            id="location"
                            label="Location"
                            optional
                            error={fieldError("location")}
                          >
                            <Field
                              id="location"
                              name="location"
                              autoComplete="address-level2"
                              placeholder="City, Country"
                              aria-describedby={
                                fieldError("location")
                                  ? "location-error"
                                  : undefined
                              }
                              className="input input-bordered w-full"
                            />
                          </FieldGroup>
                          <FieldGroup
                            icon={FiBriefcase}
                            id="occupation"
                            label="Occupation"
                            optional
                            error={fieldError("occupation")}
                          >
                            <Field
                              id="occupation"
                              name="occupation"
                              autoComplete="organization-title"
                              placeholder="Your role"
                              aria-describedby={
                                fieldError("occupation")
                                  ? "occupation-error"
                                  : undefined
                              }
                              className="input input-bordered w-full"
                            />
                          </FieldGroup>
                        </div>

                        <Divider>Skills</Divider>
                        <div className="flex flex-col gap-3">
                          {values.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {values.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="badge badge-primary gap-1.5 px-3 py-3 text-xs font-normal"
                                >
                                  {skill}
                                  <button
                                    type="button"
                                    aria-label={`Remove ${skill}`}
                                    className="rounded-full p-0.5"
                                    onClick={() =>
                                      setFieldValue(
                                        "skills",
                                        values.skills.filter(
                                          (item) => item !== skill,
                                        ),
                                      )
                                    }
                                  >
                                    <FiX aria-hidden="true" size={12} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                          <label htmlFor="skillInput" className="sr-only">
                            Add a skill
                          </label>
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                              id="skillInput"
                              value={skillInput}
                              onChange={(event) => {
                                setSkillInput(event.target.value);
                                setSkillMessage("");
                              }}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  addSkill();
                                }
                              }}
                              placeholder="Type a skill and press Enter"
                              maxLength={30}
                              className="input input-bordered min-w-0 flex-1"
                            />
                            <button
                              type="button"
                              className="btn btn-outline btn-primary"
                              disabled={values.skills.length >= 15}
                              onClick={addSkill}
                            >
                              <FiPlus aria-hidden="true" /> Add
                            </button>
                          </div>
                          {(skillMessage || fieldError("skills")) && (
                            <p role="alert" className="text-xs text-error">
                              {skillMessage || errors.skills}
                            </p>
                          )}
                          <p className="text-xs text-base-content/50">
                            {values.skills.length}/15 skills
                          </p>
                        </div>

                        <div className="mt-2 space-y-2">
                          <button
                            type="submit"
                            className="btn btn-primary w-full gap-2"
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending ? (
                              <>
                                <span
                                  role="status"
                                  aria-label="Saving profile"
                                  className="loading loading-spinner loading-sm"
                                />{" "}
                                Saving...
                              </>
                            ) : (
                              <>
                                <FiSave aria-hidden="true" /> Save changes
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost w-full gap-2"
                            onClick={() => setShowPasswordModal(true)}
                          >
                            <FiLock aria-hidden="true" /> Change password
                          </button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </section>

                <aside
                  aria-label="Live profile preview"
                  className="w-full lg:w-96 lg:flex-shrink-0"
                >
                  <div className="lg:sticky lg:top-24">
                    <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-base-content/50">
                      Live preview
                    </p>
                    <ProfileCard profile={values} showActions={false} />
                  </div>
                </aside>
              </div>
            );
          }}
        </Formik>
      </div>

      <AnimatePresence>
        {showPasswordModal && (
          <ProfilePasswordChange
            isOpen
            onClose={() => setShowPasswordModal(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default ProfilePage;
