import { Link, useLocation } from "react-router-dom";
import PopUp from "../common/PopUp";
import { useState } from "react";
import { DEFAULT_AVATAR, navLinks } from "../../utils/constants";
import { useLogoutMutation } from "../../hooks/auth/useAuthMutation";
import { AnimatePresence } from "framer-motion";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { TbLogout } from "react-icons/tb";
import { HiCode } from "react-icons/hi";
import { useShowProfile } from "../../hooks/profile/useShowProfile";

const NavBar = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // WHY useShowProfile instead of useSelector?
  // React Query cache survives the render cycle and is rehydrated
  // from the server on refresh. Redux dies on refresh.
  // Since useShowProfile is already called in ProtectedRoute,
  // React Query returns the CACHED result here — zero extra API calls.
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
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(to)
                  ? "bg-primary/10 text-primary"
                  : "text-base-content/70 hover:text-base-content hover:bg-base-200"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Desktop avatar */}
          <div className="dropdown dropdown-end hidden md:block">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-9 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-300">
                <img
                  alt={user?.firstName || "User avatar"}
                  src={user?.photoURL || DEFAULT_AVATAR}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />
              </div>
            </div>

            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-xl z-50 mt-3 w-60 p-2 shadow-lg border border-base-200">
              {user?.firstName && (
                <>
                  <li className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`avatar ${user?.isActive ? "online" : "offline"}`}
                      >
                        <div className="w-10 rounded-full">
                          <img
                            src={user?.photoURL || DEFAULT_AVATAR}
                            alt={user.firstName}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs text-base-content/50 truncate max-w-[150px]">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </li>
                  <div className="divider my-0" />
                </>
              )}

              <li>
                <Link to="/profile" className="flex items-center gap-2">
                  <FiUser size={14} /> Profile
                </Link>
              </li>

              <li>
                <button
                  onClick={() => setShowLogoutPopup(true)}
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-2 text-error"
                >
                  <TbLogout size={15} />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <div className={`avatar ${user?.isActive ? "online" : "offline"}`}>
              <div className="w-8 rounded-full ring-2 ring-primary ring-offset-1 ring-offset-base-300">
                <img
                  src={user?.photoURL || DEFAULT_AVATAR}
                  alt={user?.firstName || "avatar"}
                />
              </div>
            </div>
            <button
              className="btn btn-ghost btn-circle btn-sm"
              onClick={() => setMobileMenuOpen(true)}
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-72 bg-base-100 z-50 shadow-xl md:hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <span className="font-bold">Menu</span>
              <button
                className="btn btn-ghost btn-circle btn-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiX size={18} />
              </button>
            </div>

            {user?.firstName && (
              <div className="flex items-center gap-3 px-5 py-4 border-b">
                <div
                  className={`avatar ${user?.isActive ? "online" : "offline"}`}
                >
                  <div className="w-11 rounded-full">
                    <img
                      src={user?.photoURL || DEFAULT_AVATAR}
                      alt={user.firstName}
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-base-content/50">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex-1 py-4">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex px-5 py-3 text-sm font-medium ${
                    isActive(to)
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-base-200"
                  }`}
                >
                  {label}
                </Link>
              ))}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex px-5 py-3 text-sm font-medium ${
                  isActive("/profile")
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-base-200"
                }`}
              >
                <FiUser size={15} className="mr-2" /> Profile
              </Link>
            </div>

            <div className="p-4 border-t">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutPopup(true);
                }}
                className="flex items-center gap-2 text-error w-full px-5 py-3 text-sm font-medium hover:bg-error/10 rounded-lg"
              >
                <TbLogout size={16} /> Logout
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
