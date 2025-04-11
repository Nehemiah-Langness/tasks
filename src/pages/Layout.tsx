import { Navbar } from "../components/Navbar";
import { Outlet } from "react-router";
import { Footer } from "../components/Footer";
import { OffCanvas } from "../components/OffCanvas";
import { OffCanvasProvider } from "../contexts/offcanvas/OffCanvasProvider";

export function Layout() {
  return (
    <OffCanvasProvider>
      <div className="h-100 d-flex flex-column">
        <OffCanvas />
        <Navbar />
        <div className="flex-grow-1 pt-5">
          <Outlet />
        </div>
        <Footer />
      </div>
    </OffCanvasProvider>
  );
}


