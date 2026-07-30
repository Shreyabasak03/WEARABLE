import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import { Navbar } from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import Footer from "./Footer.jsx";

import "./layout.css";

export default function Layout({
  location,
  setLocation,
  detectLocation,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <Navbar
        location={location}
        setLocation={setLocation}
        detectLocation={detectLocation}
        onToggleSidebar={toggleSidebar}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <main className="page">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}