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
