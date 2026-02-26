import { Link, useLocation } from "react-router-dom";
import PopUp from "../common/PopUp";
import { useState } from "react";
import { DEFAULT_AVATAR } from "../../utils/constants";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../hooks/auth/useAuthMutation";
import { FiUser, FiSettings } from "react-icons/fi";
import { TbLogout } from "react-icons/tb";

const NavBar = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const user = useSelector((state) => state?.auth?.user);
  const location = useLocation();
  const logoutMutation = useLogoutMutation();

  const handleConfirmLogout = () => {
    // ✅ one single place logout is called — no duplication
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
          </div>

          {/* Avatar dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar online"
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
              {/* User info header */}
              {user?.firstName && (
                <>
                  <li className="px-3 py-2 cursor-default">
                    <div className="flex flex-col gap-0 hover:bg-transparent focus:bg-transparent active:bg-transparent">
                      <span className="font-semibold text-base-content text-sm">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-base-content/50">
                        {user.email}
                      </span>
                    </div>
                  </li>
                  <div className="divider my-0" />
                </>
              )}

              <li>
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 ${location.pathname === "/profile" ? "active" : ""}`}
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

      {/* Popup rendered outside navbar to avoid z-index issues */}
      {showLogoutPopup && (
        <PopUp
          message="You'll need to sign in again."
          onConfirm={handleConfirmLogout}
          onCancel={() => setShowLogoutPopup(false)}
          isLoading={logoutMutation.isPending}
        />
      )}
    </>
  );
};

export default NavBar;
