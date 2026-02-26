import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { setUser } from "../../store/features/auth/authSlice";
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

// import { updateProfile } from "../../services/profile/updateProfile";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user);
  const [skillInput, setSkillInput] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      // replace with: return await updateProfile(data);
      return new Promise((res) => setTimeout(() => res({ data }), 800));
    },
    onSuccess: (res) => {
      dispatch(setUser(res.data));
      toast.success("Profile updated!");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Update failed. Try again.";
      toast.error(message);
    },
  });

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
    <div className="min-h-screen bg-base-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-base-content mb-8">
          My Profile
        </h1>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={(values) => updateMutation.mutate(values)}
        >
          {({ values, setFieldValue }) => (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left — edit form */}
              <div className="flex flex-col gap-6">
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
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
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
                          placeholder="https://..."
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

                      {/* Save Changes */}
                      <button
                        type="submit"
                        className="btn btn-primary w-full mt-2"
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending
                          ? "Saving..."
                          : "Save Changes"}
                      </button>

                      {/* Change Password — type="button" so it does NOT submit the form */}
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
              </div>

              {/* Right — live preview reusing ProfileCard with showActions=false */}
              <div className="sticky top-24 h-fit">
                <ProfileCard profile={values} showActions={false} />
              </div>
            </div>
          )}
        </Formik>
      </div>

      {/* Password modal — shown/hidden via state */}
      <ProfilePasswordChange
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default ProfilePage;
