import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import FeedPage from "../pages/feed/FeedPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ErrorPage from "../components/common/ErrorPage";
import { ToastContainer } from "react-toastify";
import ConnectionsPage from "../pages/connections/ConnectionsPage";
import RequestPage from "../pages/connections/RequestPage";
import Chat from "../pages/connections/Chat";
import UniqueProfile from "../pages/profile/UniqueProfile";
import Delete from "../pages/DeleteAccount";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* WHY GuestRoute wraps auth routes?
            Logged in user visiting /auth/login → redirected to /
            Without this: logged in users see login page = confusing */}
        <Route element={<GuestRoute />}>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Route>

        {/* WHY ProtectedRoute wraps main routes?
            Logged out user visiting /profile → redirected to /auth/login
            Without this: anyone can access app without logging in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<FeedPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="connections" element={<ConnectionsPage />} />
            <Route path="requests" element={<RequestPage />} />
            <Route path="chat/:userId" element={<Chat />} />
            <Route path="profile/:userId" element={<UniqueProfile />} />
            <Route path="delete" element={<Delete />} />
          </Route>
        </Route>

        {/* Global 404 — catches everything else */}
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
