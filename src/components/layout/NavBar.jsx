import { Link, useLocation } from "react-router-dom";
import PopUp from "../common/PopUp";
import { useState } from "react";
import {
  DEFAULT_AVATAR,
  navLinks,
  formatLastSeen,
} from "../../utils/constants";
import { useLogoutMutation } from "../../hooks/auth/useAuthMutation";
import { AnimatePresence } from "framer-motion";
import { TbLogout } from "react-icons/tb";
import { HiCode } from "react-icons/hi";
import { FiUser, FiMenu, FiX, FiClock, FiWifi } from "react-icons/fi";
import { useShowProfile } from "../../hooks/profile/useShowProfile";

const NavBar = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: user } = useShowProfile();
  const location = useLocation();
  const logoutMutation = useLogoutMutation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="navbar bg-base-300 shadow-sm px-4 z-40 relative">
        {/* Brand */}
        <div className="flex-1">
          <Link to="/feed" className="btn btn-ghost text-lg font-bold gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <HiCode size={16} className="text-primary-content" />
            </div>
            Connect<span className="text-primary">_DEV</span>
          </Link>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 mr-2">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive(to)
                    ? "text-primary bg-primary/10"
                    : "text-base-content/60 hover:text-base-content hover:bg-base-200"
                }
              `}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop user menu */}
        <div className="flex items-center gap-2">
          <div className="dropdown dropdown-end hidden md:block">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-9 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-300 overflow-hidden">
                <img
                  alt={user?.firstName || "User avatar"}
                  src={user?.photoURL || DEFAULT_AVATAR}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />
              </div>
            </div>

            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-lg z-50 mt-3 w-56 p-2 shadow-md border border-base-200">
              {/* User info */}
              <li className="mb-2 pb-2 border-b border-base-200">
                <div className="flex items-center gap-3 px-2 py-1">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-base-300">
                    <img
                      src={user?.photoURL || DEFAULT_AVATAR}
                      alt={user?.firstName || "avatar"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-xs text-base-content/50 truncate max-w-[140px]">
                      {user?.email}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      {user?.isActive ? (
                        <>
                          <FiWifi size={10} className="text-success" />
                          <span className="text-xs text-success">Online</span>
                        </>
                      ) : (
                        <>
                          <FiClock size={10} className="text-base-content/40" />
                          <span className="text-xs text-base-content/40">
                            {formatLastSeen(user?.lastSeen)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <Link to="/profile" className="flex items-center gap-2">
                  <FiUser size={14} />
                  Profile
                </Link>
              </li>

              <li>
                <button
                  onClick={() => setShowLogoutPopup(true)}
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-2 text-error hover:bg-error/10 w-full"
                >
                  <TbLogout size={15} />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              className="btn btn-ghost btn-circle btn-sm"
              onClick={() => setMobileMenuOpen(true)}
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer - simplified */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed top-0 right-0 h-full w-64 bg-base-100 z-50 shadow-lg md:hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-base-200">
              <span className="font-semibold text-sm">Menu</span>
              <button
                className="btn btn-ghost btn-sm btn-circle"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* User info */}
            <div className="p-4 border-b border-base-200 bg-base-200/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={user?.photoURL || DEFAULT_AVATAR}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-base-content/50 truncate w-36">
                    {user?.email}
                  </p>
                  {user?.isActive ? (
                    <span className="text-xs text-success">Online</span>
                  ) : (
                    <span className="text-xs text-base-content/40">
                      {formatLastSeen(user?.lastSeen)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Nav links */}
            <div className="flex-1 py-2">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm transition-colors
                    ${
                      isActive(to)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-base-content/70 hover:bg-base-200"
                    }
                  `}
                >
                  {label}
                </Link>
              ))}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 text-sm transition-colors
                  ${
                    isActive("/profile")
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-base-content/70 hover:bg-base-200"
                  }
                `}
              >
                <FiUser size={14} className="mr-2" />
                Profile
              </Link>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-base-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutPopup(true);
                }}
                className="flex items-center gap-2 text-error w-full px-3 py-2 text-sm hover:bg-error/10 rounded-md transition-colors"
              >
                <TbLogout size={15} />
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {showLogoutPopup && (
          <PopUp
            message="You'll need to sign in again."
            onConfirm={() => logoutMutation.mutate()}
            onCancel={() => setShowLogoutPopup(false)}
            isLoading={logoutMutation.isPending}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
