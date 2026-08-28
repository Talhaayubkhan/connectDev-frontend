import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FiClock, FiMenu, FiUser, FiWifi, FiX } from "react-icons/fi";
import { HiCode } from "react-icons/hi";
import { TbLogout } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { useLogoutMutation } from "../../hooks/auth/useAuthMutation";
import { useShowProfile } from "../../hooks/profile/useShowProfile";
import {
  DEFAULT_AVATAR,
  formatLastSeen,
  navLinks,
  ROUTES,
} from "../../utils/constants";
import PopUp from "../common/PopUp";

const Avatar = ({ user, className = "h-9 w-9" }) => (
  <div className={`${className} overflow-hidden rounded-full bg-base-200`}>
    <img
      alt={`${user?.firstName || "User"}'s avatar`}
      src={user?.photoURL || DEFAULT_AVATAR}
      className="h-full w-full object-cover"
      onError={(event) => {
        event.currentTarget.src = DEFAULT_AVATAR;
      }}
    />
  </div>
);

const Presence = ({ user }) => (
  <span
    className={`flex items-center gap-1 text-xs ${user?.isActive ? "text-success" : "text-base-content/50"}`}
  >
    {user?.isActive ? (
      <FiWifi aria-hidden="true" size={10} />
    ) : (
      <FiClock aria-hidden="true" size={10} />
    )}
    {user?.isActive ? "Online" : formatLastSeen(user?.lastSeen)}
  </span>
);

const NavBar = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuTriggerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const { data: user } = useShowProfile();
  const location = useLocation();
  const logoutMutation = useLogoutMutation();
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const menuTrigger = menuTriggerRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeMenu = (event) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", closeMenu);

    return () => {
      document.removeEventListener("keydown", closeMenu);
      document.body.style.overflow = previousOverflow;
      menuTrigger?.focus();
    };
  }, [mobileMenuOpen]);

  const openLogout = () => {
    setMobileMenuOpen(false);
    setShowLogoutPopup(true);
  };

  return (
    <>
      <header className="navbar relative z-40 bg-base-300 px-3 shadow-sm sm:px-4">
        <div className="flex-1">
          <Link
            to={ROUTES.FEED}
            className="btn btn-ghost gap-2 px-2 text-base font-bold sm:text-lg"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <HiCode
                aria-hidden="true"
                size={16}
                className="text-primary-content"
              />
            </span>
            Connect<span className="text-primary">_DEV</span>
          </Link>
        </div>

        <nav
          aria-label="Primary navigation"
          className="mr-2 hidden items-center gap-1 md:flex"
        >
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              aria-current={isActive(to) ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive(to) ? "bg-primary/10 text-primary" : "text-base-content/60 hover:bg-base-200 hover:text-base-content"}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="dropdown dropdown-end hidden md:block">
          <button
            type="button"
            tabIndex={0}
            className="btn btn-circle btn-ghost avatar"
            aria-label="Open account menu"
          >
            <span className="rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-300">
              <Avatar user={user} />
            </span>
          </button>
          <ul className="menu dropdown-content z-50 mt-3 w-60 rounded-lg border border-base-200 bg-base-100 p-2 shadow-lg">
            <li className="mb-2 border-b border-base-200 pb-2">
              <div className="flex items-center gap-3 px-2 py-1">
                <Avatar user={user} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="truncate text-xs text-base-content/50">
                    {user?.email}
                  </p>
                  <Presence user={user} />
                </div>
              </div>
            </li>
            <li>
              <Link to={ROUTES.PROFILE}>
                <FiUser aria-hidden="true" /> Profile
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="text-error"
                onClick={openLogout}
                disabled={logoutMutation.isPending}
              >
                <TbLogout aria-hidden="true" /> Log out
              </button>
            </li>
          </ul>
        </div>

        <button
          ref={menuTriggerRef}
          type="button"
          className="btn btn-circle btn-ghost btn-sm md:hidden"
          aria-label="Open navigation"
          aria-controls="mobile-navigation"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(true)}
        >
          <FiMenu aria-hidden="true" size={20} />
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default bg-black/50"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="absolute right-0 top-0 flex h-full w-[min(20rem,85vw)] flex-col bg-base-100 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-base-200 p-4">
              <span className="font-semibold">Menu</span>
              <button
                ref={closeButtonRef}
                type="button"
                className="btn btn-circle btn-ghost btn-sm"
                aria-label="Close navigation"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiX aria-hidden="true" size={18} />
              </button>
            </div>
            <div className="flex items-center gap-3 border-b border-base-200 bg-base-200/30 p-4">
              <Avatar user={user} className="h-11 w-11" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-base-content/50">
                  {user?.email}
                </p>
                <Presence user={user} />
              </div>
            </div>
            <nav aria-label="Mobile navigation" className="flex-1 py-2">
              {[...navLinks, { to: ROUTES.PROFILE, label: "Profile" }].map(
                ({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isActive(to) ? "page" : undefined}
                    className={`block px-4 py-3 text-sm ${isActive(to) ? "bg-primary/10 font-medium text-primary" : "text-base-content/70 hover:bg-base-200"}`}
                  >
                    {label}
                  </Link>
                ),
              )}
            </nav>
            <div className="border-t border-base-200 p-4">
              <button
                type="button"
                onClick={openLogout}
                className="btn btn-ghost w-full justify-start text-error"
              >
                <TbLogout aria-hidden="true" /> Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      <AnimatePresence>
        {showLogoutPopup && (
          <PopUp
            message="You will need to sign in again."
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
