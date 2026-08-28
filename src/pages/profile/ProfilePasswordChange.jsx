import { useEffect, useId, useRef } from "react";
import { Form, Formik } from "formik";
import { motion } from "framer-motion";
import { FiLock, FiX } from "react-icons/fi";
import PasswordInput from "../../components/common/PasswordInput";
import { useChangePasswordMutation } from "../../hooks/auth/useAuthMutation";
import { changePasswordSchema } from "../../utils/validation";

const Motion = motion;

const ProfilePasswordChange = ({ isOpen, onClose }) => {
  const passwordMutation = useChangePasswordMutation();
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const pendingRef = useRef(passwordMutation.isPending);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
    pendingRef.current = passwordMutation.isPending;
  }, [onClose, passwordMutation.isPending]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !pendingRef.current) {
        onCloseRef.current();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = ({ currentPassword, newPassword }) => {
    passwordMutation.mutate(
      { currentPassword, newPassword },
      { onSuccess: onClose },
    );
  };

  return (
    <Motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default bg-black/40 backdrop-blur-sm"
        aria-label="Close password dialog"
        onClick={onClose}
        disabled={passwordMutation.isPending}
      />
      <Motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-sm flex-col gap-5 overflow-y-auto rounded-2xl bg-base-100 p-5 shadow-2xl sm:p-6"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
      >
        <div className="flex items-center justify-between gap-3">
          <h2
            id={titleId}
            className="flex items-center gap-2 text-xl font-bold"
          >
            <FiLock aria-hidden="true" size={18} /> Change password
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="btn btn-circle btn-ghost btn-sm"
            aria-label="Close password dialog"
            onClick={onClose}
            disabled={passwordMutation.isPending}
          >
            <FiX aria-hidden="true" size={16} />
          </button>
        </div>
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={changePasswordSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex flex-col gap-4">
            <PasswordInput
              name="currentPassword"
              label="Current password"
              placeholder="Enter your current password"
              autoComplete="current-password"
            />
            <PasswordInput
              name="newPassword"
              label="New password"
              placeholder="Create a new password"
              autoComplete="new-password"
            />
            <PasswordInput
              name="confirmPassword"
              label="Confirm new password"
              placeholder="Repeat your new password"
              autoComplete="new-password"
            />
            <button
              type="submit"
              className="btn btn-warning w-full"
              disabled={passwordMutation.isPending}
            >
              {passwordMutation.isPending ? (
                <>
                  <span
                    role="status"
                    aria-label="Updating password"
                    className="loading loading-spinner loading-sm"
                  />{" "}
                  Updating...
                </>
              ) : (
                "Update password"
              )}
            </button>
          </Form>
        </Formik>
      </Motion.section>
    </Motion.div>
  );
};

export default ProfilePasswordChange;
