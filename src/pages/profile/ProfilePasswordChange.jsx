import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik"; // ✅ added ErrorMessage
import { toast } from "react-toastify";
import { FiLock, FiX } from "react-icons/fi";
import { confirmPasswordSchema } from "../../utils/validation";

// import { changePassword } from "../../services/auth/userAuth";

const ProfilePasswordChange = ({ isOpen, onClose }) => {
  const passwordMutation = useMutation({
    mutationFn: async (data) => {
      // replace with: return await changePassword(data);
      return new Promise((res) => setTimeout(() => res(data), 800));
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      onClose();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Password change failed.";
      toast.error(message);
    },
  });

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  // ✅ resetForm added so fields clear after success
  const handleConfirmPassword = (values, { resetForm }) => {
    const { currentPassword, newPassword } = values;
    passwordMutation.mutate(
      { currentPassword, newPassword },
      { onSuccess: () => resetForm() },
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FiLock size={18} /> Change Password
          </h2>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>
            <FiX size={16} />
          </button>
        </div>

        <div className="divider my-0" />

        <Formik
          initialValues={initialValues}
          validationSchema={confirmPasswordSchema}
          onSubmit={handleConfirmPassword}
        >
          {() => (
            <Form className="flex flex-col gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Current Password</span>
                </label>
                <Field
                  name="currentPassword"
                  type="password"
                  placeholder="Current password"
                  className="input input-bordered w-full"
                />
                {/* ✅ now errors actually show */}
                <ErrorMessage
                  name="currentPassword"
                  component="div"
                  className="text-error text-xs mt-1"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <Field
                  name="newPassword"
                  type="password"
                  placeholder="New password"
                  className="input input-bordered w-full"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-error text-xs mt-1"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Confirm New Password</span>
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="input input-bordered w-full"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-error text-xs mt-1"
                />
              </div>

              <button
                type="submit"
                className="btn btn-warning w-full"
                disabled={passwordMutation.isPending}
              >
                {passwordMutation.isPending ? "Updating..." : "Update Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProfilePasswordChange;
