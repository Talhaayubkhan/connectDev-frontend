import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ErrorPage from "../components/common/ErrorPage";
import PageLoader from "../components/common/PageLoader";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import { ROUTES } from "../utils/constants";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const ForgotPasswordPage = lazy(
  () => import("../pages/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("../pages/auth/ResetPasswordPage"),
);
const FeedPage = lazy(() => import("../pages/feed/FeedPage"));
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
const ConnectionsPage = lazy(
  () => import("../pages/connections/ConnectionsPage"),
);
const RequestPage = lazy(
  () => import("../pages/connections/RequestPage"),
);
const UniqueProfile = lazy(
  () => import("../pages/profile/UniqueProfile"),
);

const AppRoutes = () => (
  <>
    <Suspense fallback={<PageLoader label="Loading page" fullPage />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.AUTH} element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route
              path={ROUTES.FORGOT_PASSWORD}
              element={<ForgotPasswordPage />}
            />
            <Route
              path={ROUTES.RESET_PASSWORD}
              element={<ResetPasswordPage />}
            />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.HOME} element={<MainLayout />}>
            <Route index element={<Navigate to={ROUTES.FEED} replace />} />
            <Route path={ROUTES.FEED} element={<FeedPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.CONNECTIONS} element={<ConnectionsPage />} />
            <Route path={ROUTES.REQUESTS} element={<RequestPage />} />
            <Route path={`${ROUTES.PROFILE}/:userId`} element={<UniqueProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<ErrorPage fullPage />} />
      </Routes>
    </Suspense>

    <ToastContainer
      position="top-center"
      autoClose={2500}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
    />
  </>
);

export default AppRoutes;
