import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth/userAuth";
import { clearUser } from "../../store/features/auth/authSlice";
import { toast } from "react-toastify";
import PopUp from "../common/PopUp";
import { useState } from "react";
import { DEFAULT_AVATAR } from "../../utils/constants";

const NavBar = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state?.auth?.user);

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Logout failed. Try again.";
      toast.error(message);
    },
  });

  const handleLogout = () => {
    // Just show the popup, don't call mutate yet
    setShowLogoutPopup(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutPopup(false);
    logoutMutation.mutate();
  };

  const handleCancelLogout = () => {
    setShowLogoutPopup(false);
  };
  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          ConnectDEV
        </Link>
      </div>

      <div className="flex gap-2 items-center">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              {/* ✅ Fallback to default avatar if photoURL missing */}
              <img
                alt={user?.firstName || "User avatar"}
                src={user?.photoURL || DEFAULT_AVATAR}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {/* ✅ Show user's name so they know whose account this is */}
            {user?.firstName && (
              <li className="px-3 py-1 text-sm font-semibold text-gray-500 cursor-default">
                {user.firstName} {user.lastName}
              </li>
            )}

            <li>
              <Link to="/profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>

            <li>
              <a>Settings</a>
            </li>

            <li>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="text-left text-red-500 hover:text-red-600"
              >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </button>
            </li>
          </ul>
        </div>
      </div>
      {showLogoutPopup && (
        <PopUp
          message="Are you sure you want to logout?"
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </div>
  );
};

export default NavBar;
