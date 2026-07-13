import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import "./layout.css";

export default function Layout() {
  return (
    <>
      <Navbar />

      <main className="page">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}