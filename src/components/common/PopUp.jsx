import { TbLogout } from "react-icons/tb";

const PopUp = ({ message, onConfirm, onCancel, isLoading }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-base-100 rounded-2xl shadow-2xl w-80 p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon + Text */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="bg-error/10 p-3 rounded-full">
            <TbLogout className="h-7 w-7 text-error" />
          </div>
          <div>
            <p className="font-bold text-base-content text-lg">Logout?</p>
            <p className="text-sm text-base-content/60 mt-1">{message}</p>
          </div>
        </div>

        <div className="divider my-0" />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            className="btn btn-ghost flex-1"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          {/* ✅ isLoading now actually used */}
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
    </div>
  );
};

export default PopUp;
