import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import FeedPage from "../pages/feed/FeedPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
      </Route>

      {/* Main App routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<FeedPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
