// import { Outlet, useNavigate } from "react-router-dom";
// import Navbar from "../components/layout/NavBar";
// import Footer from "../components/layout/Footer";
// import { setUser } from "../store/features/auth/authSlice";
// import { useDispatch } from "react-redux";
// import { useEffect } from "react";
// import { toast } from "react-toastify";
// import { useShowProfile } from "../hooks/profile/useShowProfile";
// import ErrorPage from "../components/common/ErrorPage";
// import { ROUTES } from "../utils/constants";

// const MainLayout = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isLoading, error, data } = useShowProfile();

//   useEffect(() => {
//     // WHY null check before dispatch?
//     // If data is undefined on first render, dispatching null/undefined
//     // would wipe out existing Redux user state — causing flicker.
//     if (data?.data) {
//       dispatch(setUser(data.data));
//     }
//   }, [data, dispatch]);

//   useEffect(() => {
//     if (!error) return;

//     const status = error?.response?.status;

//     if (status === 401 || status === 403) {
//       // WHY not toast here?
//       // 401 = session expired — ProtectedRoute handles redirect.
//       // No need to show error toast for expected auth failures.
//       navigate(ROUTES.LOGIN, { replace: true });
//     } else if (status >= 500) {
//       toast.error("Server error. Please try again later.");
//     } else if (!status) {
//       toast.error("Network error. Please check your connection.");
//     } else {
//       toast.error("Something went wrong.");
//     }
//   }, [error, navigate]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <span className="loading loading-spinner loading-lg text-primary" />
//       </div>
//     );
//   }

//   // WHY removed the extra error check before return?
//   // ProtectedRoute already blocks unauthenticated users.
//   // 401/403 handled in useEffect above.
//   // Only show ErrorPage for non-auth errors.
//   if (error && error?.response?.status >= 500) {
//     return <ErrorPage />;
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       <header className="sticky top-0 z-50">
//         <Navbar />
//       </header>
//       <main className="flex-1 overflow-y-auto p-4">
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default MainLayout;

import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
