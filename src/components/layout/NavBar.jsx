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

  // WHY useShowProfile here:
  // ProtectedRoute already called this. React Query returns
  // the cached result — zero extra API calls made.
  const { data: user } = useShowProfile();

  const location = useLocation();
  const logoutMutation = useLogoutMutation();

  const isActive = (path) => location.pathname === path;

  // WHY a separate helper:
  // We use this in both desktop dropdown and mobile menu.
  // One place to change if the design updates later.
  const UserInfoBlock = () => (
    <div className="flex items-center gap-3 px-3 py-3">
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/30">
          <img
            src={user?.photoURL || DEFAULT_AVATAR}
            alt={user?.firstName || "avatar"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
          />
        </div>
      </div>

      <div className="flex flex-col min-w-0 gap-0.5">
        {/* Name with icon */}
        <div className="flex items-center gap-1.5">
          <FiUser size={11} className="text-base-content/40 shrink-0" />
          <span className="font-semibold text-sm text-base-content leading-tight">
            {user?.firstName} {user?.lastName}
          </span>
        </div>

        {/* Email — no icon as you didn't select it, kept subtle */}
        <span className="text-xs text-base-content/50 truncate max-w-[160px] pl-4">
          {user?.email}
        </span>

        {/* Online / Last seen with icon */}
        {/* WHY conditional icon:
          FiWifi = actively online right now
          FiClock = was online X time ago
          The icon reinforces the meaning of the text at a glance */}
        <div className="flex items-center gap-1.5 mt-0.5">
          {user?.isActive ? (
            <>
              <FiWifi size={11} className="text-success shrink-0" />
              <span className="text-xs font-medium text-success">Online</span>
            </>
          ) : (
            <>
              <FiClock size={11} className="text-base-content/40 shrink-0" />
              <span className="text-xs font-medium text-base-content/40">
                {formatLastSeen(user?.lastSeen)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="navbar bg-base-300 shadow-sm px-4 z-40 relative">
        {/* ── Brand ── */}
        <div className="flex-1">
          <Link to="/feed" className="btn btn-ghost text-lg font-bold gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <HiCode size={16} className="text-primary-content" />
            </div>
            Connect<span className="text-primary">_DEV</span>
          </Link>
        </div>

        {/* ── Desktop nav links ── */}
        <div className="hidden md:flex items-center gap-1 mr-2">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`
                relative px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive(to)
                    ? "text-primary bg-primary/10"
                    : "text-base-content/60 hover:text-base-content hover:bg-base-200"
                }
              `}
            >
              {label}

              {/* WHY this underline bar:
                  A bottom border on the active link gives a clear
                  visual anchor without being heavy or distracting.
                  It works on top of the background tint. */}
              {isActive(to) && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </div>

        {/* ── Desktop avatar + dropdown ── */}
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

            {/* WHY w-64:
                Slightly wider than before (was w-60) so the email
                doesn't truncate too aggressively on longer addresses. */}
            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-xl z-50 mt-3 w-64 p-0 shadow-lg border border-base-200 overflow-hidden">
              {/* User info block — separated visually from nav items */}
              {user?.firstName && (
                <li className="bg-base-200/60 pointer-events-none">
                  <UserInfoBlock />
                </li>
              )}

              <div className="divider my-0 h-px" />

              <li className="px-1 py-0.5">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-lg text-sm py-2"
                >
                  <FiUser size={14} />
                  Profile
                </Link>
              </li>

              <li className="px-1 py-0.5 pb-1.5">
                <button
                  onClick={() => setShowLogoutPopup(true)}
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-2 rounded-lg text-sm py-2 text-error hover:bg-error/10 w-full"
                >
                  <TbLogout size={15} />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </button>
              </li>
            </ul>
          </div>

          {/* ── Mobile: avatar + hamburger ── */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary ring-offset-1 ring-offset-base-300">
              <img
                src={user?.photoURL || DEFAULT_AVATAR}
                alt={user?.firstName || "avatar"}
                className="w-full h-full object-cover"
              />
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

      {/* ── Mobile drawer ── */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed top-0 right-0 h-full w-72 bg-base-100 z-50 shadow-xl md:hidden flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-base-200">
              <span className="font-bold text-sm">Menu</span>
              <button
                className="btn btn-ghost btn-circle btn-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* User info — same component as dropdown */}
            {user?.firstName && (
              <div className="bg-base-200/50 border-b border-base-200">
                <UserInfoBlock />
              </div>
            )}

            {/* Nav links */}
            <div className="flex-1 py-2 overflow-y-auto">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center px-5 py-3 text-sm font-medium transition-colors
                    ${
                      isActive(to)
                        ? "bg-primary/10 text-primary border-r-2 border-primary"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                    }
                  `}
                >
                  {label}
                </Link>
              ))}

              {/* WHY border-r-2 on active mobile link:
                  On desktop we use a bottom underline.
                  On mobile the links are stacked vertically so a
                  right border makes more visual sense — it reads
                  as a sidebar-style active indicator. */}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors
                  ${
                    isActive("/profile")
                      ? "bg-primary/10 text-primary border-r-2 border-primary"
                      : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                  }
                `}
              >
                <FiUser size={15} />
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
                className="flex items-center gap-2 text-error w-full px-4 py-2.5 text-sm font-medium hover:bg-error/10 rounded-lg transition-colors"
              >
                <TbLogout size={16} />
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
