import { Link, useLocation } from "react-router-dom";
import PopUp from "../common/PopUp";
import { useState } from "react";
import { DEFAULT_AVATAR, formatLastSeen } from "../../utils/constants";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../hooks/auth/useAuthMutation";
import { AnimatePresence } from "framer-motion";
import { FiUser, FiSettings } from "react-icons/fi";
import { TbLogout } from "react-icons/tb";

const NavBar = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const user = useSelector((state) => state?.auth?.user);
  const location = useLocation();
  const logoutMutation = useLogoutMutation();

  const handleConfirmLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <div className="navbar bg-base-300 shadow-sm px-4">
        {/* Brand */}
        <div className="flex-1">
          <Link
            to="/"
            className="btn btn-ghost text-lg font-bold tracking-tight"
          >
            Connect<span className="text-primary">DEV</span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              to="/"
              className={`btn btn-ghost btn-sm ${location.pathname === "/" ? "btn-active" : ""}`}
            >
              Feed
            </Link>
            <Link
              to="/connections"
              className={`btn btn-ghost btn-sm ${location.pathname === "/connections" ? "btn-active" : ""}`}
            >
              Connections
            </Link>
            <Link
              to="/requests"
              className={`btn btn-ghost btn-sm ${location.pathname === "/requests" ? "btn-active" : ""}`}
            >
              Requests
            </Link>
          </div>

          {/* Avatar dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              // WHY conditional online/offline class?
              // "online" = DaisyUI green dot, "offline" = grey dot.
              // Before: hardcoded "online" — always green even if user is inactive.
              // Now: reflects actual isActive value from backend.
              className={`btn btn-ghost btn-circle avatar ${
                user?.isActive ? "online" : "offline"
              }`}
            >
              <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
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
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-56 p-2 shadow-xl border border-base-300"
            >
              {/* User info */}
              {user?.firstName && (
                <>
                  <li className="px-3 py-2 cursor-default">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs opacity-60">{user.email}</span>

                      {/* WHY show isActive + lastSeen here?
                          User sees their own status in the dropdown.
                          If active → green "Online" text.
                          If inactive → "Last seen Xh ago" — like WhatsApp.
                          Much more informative than just a dot. */}
                      <span
                        className={`text-xs font-medium mt-0.5 ${
                          user?.isActive
                            ? "text-success"
                            : "text-base-content/40"
                        }`}
                      >
                        {user?.isActive
                          ? "● Online"
                          : `Last seen ${formatLastSeen(user?.lastSeen)}`}
                      </span>
                    </div>
                  </li>
                  <div className="divider my-0" />
                </>
              )}

              <li>
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 ${
                    location.pathname === "/profile" ? "active" : ""
                  }`}
                >
                  <FiUser size={14} /> Profile
                </Link>
              </li>

              <li>
                <Link to="/settings" className="flex items-center gap-2">
                  <FiSettings size={14} /> Settings
                </Link>
              </li>

              <div className="divider my-0" />

              <li>
                <button
                  onClick={() => setShowLogoutPopup(true)}
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-2 text-error hover:bg-error/10"
                >
                  <TbLogout size={15} />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* WHY AnimatePresence wrapping PopUp?
          This is what enables the exit animation on the popup.
          Without it — popup just disappears instantly when closed.
          With it — popup fades + scales out smoothly. */}
      <AnimatePresence>
        {showLogoutPopup && (
          <PopUp
            message="You'll need to sign in again."
            onConfirm={handleConfirmLogout}
            onCancel={() => setShowLogoutPopup(false)}
            isLoading={logoutMutation.isPending}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
