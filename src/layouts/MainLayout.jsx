import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-base-100">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
