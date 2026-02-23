import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto p-4">
        {/* Outlet renders dynamic page content */}
        <Outlet />
      </main>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
};

export default MainLayout;
