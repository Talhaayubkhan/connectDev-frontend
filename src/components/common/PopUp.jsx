import { useEffect, useId, useRef } from "react";
import { motion } from "framer-motion";
import { TbLogout } from "react-icons/tb";

const Motion = motion;

const PopUp = ({
  title = "Log out?",
  message,
  confirmLabel = "Log out",
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const cancelRef = useRef(null);
  const onCancelRef = useRef(onCancel);
  const loadingRef = useRef(isLoading);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    onCancelRef.current = onCancel;
    loadingRef.current = isLoading;
  }, [isLoading, onCancel]);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loadingRef.current) {
        onCancelRef.current();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

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
        aria-label="Close dialog"
        onClick={onCancel}
        disabled={isLoading}
      />
      <Motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-base-100 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
      >
        <div className="h-1.5 bg-gradient-to-r from-error to-orange-500" />
        <div className="p-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
            <TbLogout aria-hidden="true" className="h-8 w-8 text-error" />
          </div>
          <div className="mb-6 text-center">
            <h2 id={titleId} className="mb-2 text-xl font-bold">
              {title}
            </h2>
            <p id={descriptionId} className="text-sm text-base-content/60">
              {message}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              ref={cancelRef}
              type="button"
              className="btn btn-outline flex-1"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-error flex-1"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <span
                  role="status"
                  aria-label="Logging out"
                  className="loading loading-spinner loading-sm"
                />
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </Motion.section>
    </Motion.div>
  );
};

export default PopUp;
