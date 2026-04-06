// import { Link, useLocation } from "react-router-dom";
// import PopUp from "../common/PopUp";
// import { useState } from "react";
// import {
//   DEFAULT_AVATAR,
//   formatLastSeen,
//   navLinks,
// } from "../../utils/constants";
// import { useSelector } from "react-redux";
// import { useLogoutMutation } from "../../hooks/auth/useAuthMutation";
// import { AnimatePresence } from "framer-motion";
// import { FiUser, FiMenu, FiX } from "react-icons/fi";
// import { TbLogout } from "react-icons/tb";
// import { HiCode } from "react-icons/hi";

// const NavBar = () => {
//   const [showLogoutPopup, setShowLogoutPopup] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const user = useSelector((state) => state?.auth?.user);
//   const location = useLocation();
//   const logoutMutation = useLogoutMutation();

//   const isActive = (path) => location.pathname === path;

//   return (
//     <>
//       <div className="navbar bg-base-300 shadow-sm px-4 z-40 relative">
//         {/* Brand */}
//         <div className="flex-1">
//           <Link
//             to="/"
//             className="btn btn-ghost text-lg font-bold tracking-tight gap-2"
//           >
//             <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
//               <HiCode size={16} className="text-primary-content" />
//             </div>
//             Connect<span className="text-primary">_DEV</span>
//           </Link>
//         </div>

//         {/* Desktop nav links */}
//         <div className="hidden md:flex items-center gap-1 mr-2">
//           {navLinks.map(({ to, label }) => (
//             <Link
//               key={to}
//               to={to}
//               className={`btn btn-ghost btn-sm rounded-lg ${
//                 isActive(to)
//                   ? "bg-primary/10 text-primary font-semibold"
//                   : "text-base-content/70"
//               }`}
//             >
//               {label}
//             </Link>
//           ))}
//         </div>

//         {/* Right — avatar + hamburger */}
//         <div className="flex items-center gap-2">
//           {/* Avatar dropdown — desktop only */}
//           <div className="dropdown dropdown-end hidden md:block">
//             <div
//               tabIndex={0}
//               role="button"
//               className={`btn btn-ghost btn-circle avatar ${
//                 user?.isActive ? "online" : "offline"
//               }`}
//             >
//               <div className="w-9 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-300">
//                 <img
//                   alt={user?.firstName || "User avatar"}
//                   src={user?.photoURL || DEFAULT_AVATAR}
//                   onError={(e) => {
//                     e.currentTarget.src = DEFAULT_AVATAR;
//                   }}
//                 />
//               </div>
//             </div>

//             <ul
//               tabIndex={0}
//               className="menu menu-sm dropdown-content bg-base-100 rounded-2xl z-50 mt-3 w-60 p-2 shadow-2xl border border-base-300"
//             >
//               {user?.firstName && (
//                 <>
//                   <li className="px-3 py-3 cursor-default">
//                     <div className="flex items-center gap-3 hover:bg-transparent">
//                       <div
//                         className={`avatar ${user?.isActive ? "online" : "offline"}`}
//                       >
//                         <div className="w-10 rounded-full">
//                           <img
//                             src={user?.photoURL || DEFAULT_AVATAR}
//                             alt={user.firstName}
//                             onError={(e) => {
//                               e.currentTarget.src = DEFAULT_AVATAR;
//                             }}
//                           />
//                         </div>
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="font-semibold text-sm">
//                           {user.firstName} {user.lastName}
//                         </span>
//                         <span className="text-xs text-base-content/50">
//                           {user.email}
//                         </span>
//                         <span
//                           className={`text-xs font-medium mt-0.5 ${
//                             user?.isActive
//                               ? "text-success"
//                               : "text-base-content/40"
//                           }`}
//                         >
//                           {user?.isActive
//                             ? "● Online"
//                             : `Last seen ${formatLastSeen(user?.lastSeen)}`}
//                         </span>
//                       </div>
//                     </div>
//                   </li>
//                   <div className="divider my-0" />
//                 </>
//               )}

//               <li>
//                 <Link
//                   to="/profile"
//                   className={`flex items-center gap-2 rounded-lg ${isActive("/profile") ? "active" : ""}`}
//                 >
//                   <FiUser size={14} /> Profile
//                 </Link>
//               </li>

//               <li>
//                 <button
//                   onClick={() => setShowLogoutPopup(true)}
//                   disabled={logoutMutation.isPending}
//                   className="flex items-center gap-2 text-error hover:bg-error/10 rounded-lg"
//                 >
//                   <TbLogout size={15} />
//                   {logoutMutation.isPending ? "Logging out..." : "Logout"}
//                 </button>
//               </li>
//             </ul>
//           </div>

//           {/* Mobile — avatar + hamburger */}
//           <div className="flex items-center gap-2 md:hidden">
//             <div className={`avatar ${user?.isActive ? "online" : "offline"}`}>
//               <div className="w-8 rounded-full ring-2 ring-primary ring-offset-1 ring-offset-base-300">
//                 <img
//                   src={user?.photoURL || DEFAULT_AVATAR}
//                   alt={user?.firstName || "avatar"}
//                   onError={(e) => {
//                     e.currentTarget.src = DEFAULT_AVATAR;
//                   }}
//                 />
//               </div>
//             </div>
//             <button
//               className="btn btn-ghost btn-circle btn-sm"
//               onClick={() => setMobileMenuOpen(true)}
//             >
//               <FiMenu size={20} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile — full screen overlay menu */}
//       {mobileMenuOpen && (
//         <>
//           {/* Backdrop */}
//           <div
//             className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
//             onClick={() => setMobileMenuOpen(false)}
//           />

//           {/* Slide-in panel from right */}
//           <div className="fixed top-0 right-0 h-full w-72 bg-base-100 z-50 shadow-2xl md:hidden flex flex-col">
//             {/* Panel header */}
//             <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
//               <span className="font-bold text-base-content">Menu</span>
//               <button
//                 className="btn btn-ghost btn-circle btn-sm"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 <FiX size={18} />
//               </button>
//             </div>

//             {/* User info */}
//             {user?.firstName && (
//               <div className="flex items-center gap-3 px-5 py-4 border-b border-base-300">
//                 <div
//                   className={`avatar ${user?.isActive ? "online" : "offline"}`}
//                 >
//                   <div className="w-11 rounded-full">
//                     <img
//                       src={user?.photoURL || DEFAULT_AVATAR}
//                       alt={user.firstName}
//                       onError={(e) => {
//                         e.currentTarget.src = DEFAULT_AVATAR;
//                       }}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <p className="font-semibold text-sm">
//                     {user.firstName} {user.lastName}
//                   </p>
//                   <p
//                     className={`text-xs ${user?.isActive ? "text-success" : "text-base-content/40"}`}
//                   >
//                     {user?.isActive
//                       ? "● Online"
//                       : `Last seen ${formatLastSeen(user?.lastSeen)}`}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Nav links */}
//             <div className="flex flex-col gap-1 px-3 py-3 flex-1">
//               {navLinks.map(({ to, label }) => (
//                 <Link
//                   key={to}
//                   to={to}
//                   onClick={() => setMobileMenuOpen(false)}
//                   className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
//                     isActive(to)
//                       ? "bg-primary/10 text-primary"
//                       : "hover:bg-base-200 text-base-content/80"
//                   }`}
//                 >
//                   {label}
//                 </Link>
//               ))}

//               <div className="divider my-1" />

//               <Link
//                 to="/profile"
//                 onClick={() => setMobileMenuOpen(false)}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
//                   isActive("/profile")
//                     ? "bg-primary/10 text-primary"
//                     : "hover:bg-base-200 text-base-content/80"
//                 }`}
//               >
//                 <FiUser size={15} /> Profile
//               </Link>
//             </div>

//             {/* Logout at bottom */}
//             <div className="px-3 py-4 border-t border-base-300">
//               <button
//                 onClick={() => {
//                   setMobileMenuOpen(false);
//                   setShowLogoutPopup(true);
//                 }}
//                 className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition w-full"
//               >
//                 <TbLogout size={16} /> Logout
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       <AnimatePresence>
//         {showLogoutPopup && (
//           <PopUp
//             message="You'll need to sign in again."
//             onConfirm={() => logoutMutation.mutate()}
//             onCancel={() => setShowLogoutPopup(false)}
//             isLoading={logoutMutation.isPending}
//           />
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default NavBar;

import { Link, useLocation } from "react-router-dom";
import PopUp from "../common/PopUp";
import { useState, useEffect } from "react";
import {
  DEFAULT_AVATAR,
  formatLastSeen,
  navLinks,
} from "../../utils/constants";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../hooks/auth/useAuthMutation";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiUser,
  FiMenu,
  FiX,
  FiHome,
  FiUsers,
  FiBell,
  FiSettings,
  FiChevronDown,
  FiHeart,
  FiCompass,
} from "react-icons/fi";
import { TbLogout } from "react-icons/tb";
import { HiCode } from "react-icons/hi";

const NavBar = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state) => state?.auth?.user);
  const location = useLocation();
  const logoutMutation = useLogoutMutation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  // Icon mapping for nav links
  const getNavIcon = (label) => {
    switch (label) {
      case "Home":
        return <FiHome size={18} />;
      case "Feed":
        return <FiCompass size={18} />;
      case "Connections":
        return <FiUsers size={18} />;
      default:
        return null;
    }
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-base-100/95 backdrop-blur-lg shadow-lg"
            : "bg-base-100 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Brand Logo - Left */}
            <Link
              to="/"
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <HiCode size={18} className="text-white" />
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="font-bold text-lg md:text-xl tracking-tight">
                  Connect
                </span>
                <span className="font-bold text-lg md:text-xl text-primary ml-0.5">
                  DEV
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links - Center */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive(to)
                      ? "text-primary"
                      : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {getNavIcon(label)}
                    {label}
                  </span>
                  {isActive(to) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Section - Desktop */}
            <div className="flex items-center gap-3">
              {/* Notification Bell - Optional */}
              <button className="hidden md:flex btn btn-ghost btn-circle relative">
                <FiBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse" />
              </button>

              {/* User Dropdown - Desktop */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                    dropdownOpen ? "bg-base-200" : "hover:bg-base-200"
                  }`}
                >
                  <div
                    className={`avatar ${user?.isActive ? "online" : "offline"}`}
                  >
                    <div className="w-9 h-9 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                      <img
                        alt={user?.firstName || "User avatar"}
                        src={user?.photoURL || DEFAULT_AVATAR}
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_AVATAR;
                        }}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold leading-tight">
                      {user?.firstName || "User"}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {user?.isActive ? "Online" : "Offline"}
                    </p>
                  </div>
                  <FiChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-72 bg-base-100 rounded-2xl shadow-2xl border border-base-200 z-50 overflow-hidden"
                      >
                        {/* User Info Header */}
                        <div className="px-4 py-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-base-200">
                          <div className="flex items-center gap-3">
                            <div
                              className={`avatar ${user?.isActive ? "online" : "offline"}`}
                            >
                              <div className="w-12 h-12 rounded-full ring-2 ring-primary ring-offset-2">
                                <img
                                  src={user?.photoURL || DEFAULT_AVATAR}
                                  alt={user?.firstName}
                                  onError={(e) => {
                                    e.currentTarget.src = DEFAULT_AVATAR;
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-base">
                                {user?.firstName} {user?.lastName}
                              </p>
                              <p className="text-xs text-base-content/60 truncate">
                                {user?.email}
                              </p>
                              <p
                                className={`text-xs font-medium mt-1 ${
                                  user?.isActive
                                    ? "text-success"
                                    : "text-base-content/40"
                                }`}
                              >
                                {user?.isActive
                                  ? "● Active now"
                                  : `Last seen ${formatLastSeen(user?.lastSeen)}`}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-base-200 transition-colors"
                          >
                            <FiUser size={18} className="text-primary" />
                            <span className="text-sm font-medium">
                              My Profile
                            </span>
                          </Link>

                          <Link
                            to="/settings"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-base-200 transition-colors"
                          >
                            <FiSettings
                              size={18}
                              className="text-base-content/60"
                            />
                            <span className="text-sm font-medium">
                              Settings
                            </span>
                          </Link>
                        </div>

                        <div className="border-t border-base-200 py-2">
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              setShowLogoutPopup(true);
                            }}
                            disabled={logoutMutation.isPending}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-error/10 transition-colors w-full text-error"
                          >
                            <TbLogout size={18} />
                            <span className="text-sm font-medium">
                              {logoutMutation.isPending
                                ? "Logging out..."
                                : "Logout"}
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden btn btn-ghost btn-circle"
                onClick={() => setMobileMenuOpen(true)}
              >
                <FiMenu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-base-100 z-50 md:hidden flex flex-col shadow-2xl"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-base-200 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <HiCode size={16} className="text-white" />
                  </div>
                  <span className="font-bold">Menu</span>
                </div>
                <button
                  className="btn btn-ghost btn-circle btn-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* User Profile Section */}
              {user?.firstName && (
                <div className="px-5 py-5 border-b border-base-200 bg-base-200/30">
                  <div className="flex items-center gap-3">
                    <div
                      className={`avatar ${user?.isActive ? "online" : "offline"}`}
                    >
                      <div className="w-14 h-14 rounded-full ring-2 ring-primary ring-offset-2">
                        <img
                          src={user?.photoURL || DEFAULT_AVATAR}
                          alt={user.firstName}
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_AVATAR;
                          }}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-base">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-base-content/60 truncate">
                        {user.email}
                      </p>
                      <p
                        className={`text-xs font-medium mt-1 flex items-center gap-1 ${
                          user?.isActive
                            ? "text-success"
                            : "text-base-content/40"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${user?.isActive ? "bg-success animate-pulse" : "bg-base-content/40"}`}
                        />
                        {user?.isActive
                          ? "Active now"
                          : `Last seen ${formatLastSeen(user?.lastSeen)}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-3 space-y-1">
                  {navLinks.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                        isActive(to)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-base-200 text-base-content/80"
                      }`}
                    >
                      {getNavIcon(label)}
                      {label}
                      {isActive(to) && (
                        <motion.div
                          layoutId="mobileActive"
                          className="ml-auto w-1 h-6 bg-primary rounded-full"
                        />
                      )}
                    </Link>
                  ))}
                </div>

                <div className="divider px-5 my-4" />

                <div className="px-3 space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      isActive("/profile")
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-base-200 text-base-content/80"
                    }`}
                  >
                    <FiUser size={18} />
                    My Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium hover:bg-base-200 text-base-content/80 transition-all duration-200"
                  >
                    <FiSettings size={18} />
                    Settings
                  </Link>
                </div>
              </div>

              {/* Logout Button */}
              <div className="px-3 py-4 border-t border-base-200 bg-base-200/30">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLogoutPopup(true);
                  }}
                  disabled={logoutMutation.isPending}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-medium text-error hover:bg-error/10 transition-all duration-200 w-full"
                >
                  {logoutMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <TbLogout size={18} />
                      Logout
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Popup */}
      <AnimatePresence>
        {showLogoutPopup && (
          <PopUp
            title="Logout Confirmation"
            message="Are you sure you want to logout? You'll need to sign in again to access your account."
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
