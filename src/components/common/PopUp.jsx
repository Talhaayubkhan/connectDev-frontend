import { TbLogout } from "react-icons/tb";
import { motion } from "framer-motion";

const Motion = motion;

const PopUp = ({ message, onConfirm, onCancel, isLoading }) => {
  return (
    <Motion.div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onCancel}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Popup Card */}
      <Motion.div
        className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-error to-orange-500" />

        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
              <TbLogout className="h-8 w-8 text-error" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-base-content mb-2">
              Logout?
            </h3>
            <p className="text-sm text-base-content/60">{message}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              className="btn btn-outline flex-1"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              className="btn btn-error flex-1"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Yes, Logout"
              )}
            </button>
          </div>
        </div>
      </Motion.div>
    </Motion.div>
  );
};

export default PopUp;
