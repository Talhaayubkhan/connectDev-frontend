import { TbLogout } from "react-icons/tb";
import { motion } from "framer-motion";

const Motion = motion;

const PopUp = ({ message, onConfirm, onCancel, isLoading }) => {
  return (
    // WHY AnimatePresence on overlay?
    // Backdrop fades in smoothly instead of appearing instantly.
    <Motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onCancel}
    >
      {/* WHY scale + y animation on card?
          Popup feels like it "pops" up naturally.
          scale from 0.95 = subtle grow effect, not dramatic.
          Same easeOut pattern as LoginPage card. */}
      <Motion.div
        className="bg-base-100 rounded-2xl shadow-2xl w-80 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* WHY top accent bar?
            Same pattern as LoginPage and ForgotPasswordPage.
            Consistent visual language across the whole app. */}
        <div className="h-1 w-full bg-gradient-to-r from-error to-orange-400" />

        <div className="p-6 flex flex-col gap-5">
          {/* WHY gradient background on icon instead of flat bg-error/10?
              Flat background looked washed out — no depth.
              Gradient matches the top bar color = cohesive. */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-error to-orange-400 flex items-center justify-center shadow-lg shadow-error/30">
              <TbLogout className="h-7 w-7 text-white" />
            </div>

            <div>
              <p className="font-bold text-base-content text-xl">Logout?</p>
              <p className="text-sm text-base-content/50 mt-1 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* WHY removed divider?
              Divider + gap was creating too much visual noise.
              Clean spacing between content and buttons is enough. */}

          <div className="flex gap-3">
            {/* WHY btn-outline on Cancel instead of btn-ghost?
                btn-ghost had no visible border — looked like plain text.
                btn-outline gives it proper button weight without stealing
                attention from the confirm action. */}
            <button
              className="btn btn-outline flex-1"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>

            {/* WHY whileTap on confirm button?
                Same press micro-interaction as LoginPage submit button.
                Consistent feel across the app. */}
            <Motion.button
              className="btn btn-error flex-1"
              onClick={onConfirm}
              disabled={isLoading}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.1 }}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Yes, Logout"
              )}
            </Motion.button>
          </div>
        </div>
      </Motion.div>
    </Motion.div>
  );
};

export default PopUp;
