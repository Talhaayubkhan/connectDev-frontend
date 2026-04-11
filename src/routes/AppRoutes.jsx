import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import FeedPage from "../pages/feed/FeedPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ErrorPage from "../components/common/ErrorPage";
import { ToastContainer } from "react-toastify";
import ConnectionsPage from "../pages/connections/ConnectionsPage";
import RequestPage from "../pages/connections/RequestPage";
import UniqueProfile from "../pages/profile/UniqueProfile";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// ── NEW: Split Chat into Layout + Window ──
import ChatLayout from "../layouts/ChatLayout";
import ChatWindow from "../pages/connections/Chat";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* PUBLIC ROUTES (only when NOT logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Route>

        {/* PROTECTED ROUTES (only when logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route path="feed" element={<FeedPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="connections" element={<ConnectionsPage />} />
            <Route path="requests" element={<RequestPage />} />
            <Route path="profile/:userId" element={<UniqueProfile />} />

            <Route path="chat" element={<ChatLayout />}>
              <Route path=":userId" element={<ChatWindow />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="light"
      />
    </>
  );
};

export default AppRoutes;
