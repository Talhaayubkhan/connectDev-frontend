import { Link, useLocation } from "react-router-dom";
import PopUp from "../common/PopUp";
import { useState } from "react";
import { DEFAULT_AVATAR, formatLastSeen } from "../../utils/constants";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../hooks/auth/useAuthMutation";
import { AnimatePresence } from "framer-motion";
import { FiUser, FiSettings, FiMenu, FiX } from "react-icons/fi";
import { TbLogout } from "react-icons/tb";
import { HiCode } from "react-icons/hi";

const NavBar = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state) => state?.auth?.user);
  const location = useLocation();
  const logoutMutation = useLogoutMutation();

  const navLinks = [
    { to: "/", label: "Feed" },
    { to: "/connections", label: "Connections" },
    { to: "/requests", label: "Requests" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="navbar bg-base-300 shadow-sm px-4 z-40 relative">
        {/* Brand */}
        <div className="flex-1">
          <Link
            to="/"
            className="btn btn-ghost text-lg font-bold tracking-tight gap-2"
          >
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <HiCode size={16} className="text-primary-content" />
            </div>
            Connect<span className="text-primary">DEV</span>
          </Link>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 mr-2">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`btn btn-ghost btn-sm rounded-lg ${
                isActive(to)
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-base-content/70"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right — avatar + hamburger */}
        <div className="flex items-center gap-2">
          {/* Avatar dropdown — desktop only */}
          <div className="dropdown dropdown-end hidden md:block">
            <div
              tabIndex={0}
              role="button"
              className={`btn btn-ghost btn-circle avatar ${
                user?.isActive ? "online" : "offline"
              }`}
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

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-2xl z-50 mt-3 w-60 p-2 shadow-2xl border border-base-300"
            >
              {user?.firstName && (
                <>
                  <li className="px-3 py-3 cursor-default">
                    <div className="flex items-center gap-3 hover:bg-transparent">
                      <div
                        className={`avatar ${user?.isActive ? "online" : "offline"}`}
                      >
                        <div className="w-10 rounded-full">
                          <img
                            src={user?.photoURL || DEFAULT_AVATAR}
                            alt={user.firstName}
                            onError={(e) => {
                              e.currentTarget.src = DEFAULT_AVATAR;
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs text-base-content/50">
                          {user.email}
                        </span>
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
                    </div>
                  </li>
                  <div className="divider my-0" />
                </>
              )}

              <li>
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 rounded-lg ${isActive("/profile") ? "active" : ""}`}
                >
                  <FiUser size={14} /> Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className={`flex items-center gap-2 rounded-lg ${isActive("/settings") ? "active" : ""}`}
                >
                  <FiSettings size={14} /> Settings
                </Link>
              </li>
              <div className="divider my-0" />
              <li>
                <button
                  onClick={() => setShowLogoutPopup(true)}
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-2 text-error hover:bg-error/10 rounded-lg"
                >
                  <TbLogout size={15} />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile — avatar + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <div className={`avatar ${user?.isActive ? "online" : "offline"}`}>
              <div className="w-8 rounded-full ring-2 ring-primary ring-offset-1 ring-offset-base-300">
                <img
                  src={user?.photoURL || DEFAULT_AVATAR}
                  alt={user?.firstName || "avatar"}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
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

      {/* Mobile — full screen overlay menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-in panel from right */}
          <div className="fixed top-0 right-0 h-full w-72 bg-base-100 z-50 shadow-2xl md:hidden flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
              <span className="font-bold text-base-content">Menu</span>
              <button
                className="btn btn-ghost btn-circle btn-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* User info */}
            {user?.firstName && (
              <div className="flex items-center gap-3 px-5 py-4 border-b border-base-300">
                <div
                  className={`avatar ${user?.isActive ? "online" : "offline"}`}
                >
                  <div className="w-11 rounded-full">
                    <img
                      src={user?.photoURL || DEFAULT_AVATAR}
                      alt={user.firstName}
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                  <p
                    className={`text-xs ${user?.isActive ? "text-success" : "text-base-content/40"}`}
                  >
                    {user?.isActive
                      ? "● Online"
                      : `Last seen ${formatLastSeen(user?.lastSeen)}`}
                  </p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <div className="flex flex-col gap-1 px-3 py-3 flex-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive(to)
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-base-200 text-base-content/80"
                  }`}
                >
                  {label}
                </Link>
              ))}

              <div className="divider my-1" />

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive("/profile")
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-base-200 text-base-content/80"
                }`}
              >
                <FiUser size={15} /> Profile
              </Link>

              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive("/settings")
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-base-200 text-base-content/80"
                }`}
              >
                <FiSettings size={15} /> Settings
              </Link>
            </div>

            {/* Logout at bottom */}
            <div className="px-3 py-4 border-t border-base-300">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutPopup(true);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition w-full"
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
