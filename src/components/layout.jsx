// import { Outlet } from "react-router-dom";

// import { Navbar } from "./Navbar.jsx";
// import Footer from "./Footer.jsx";

// import "./layout.css";


// export default function Layout({
//   location,
//   setLocation,
//   detectLocation
// }) {

//   console.log(
//     "LAYOUT RECEIVED:",
//     location
//   );

//   console.log(
//     "SET LOCATION:",
//     setLocation
//   );

//   console.log(
//     "DETECT LOCATION:",
//     detectLocation
//   );


//   return (
//     <>

//       <Navbar
//         location={location}
//         setLocation={setLocation}
//         detectLocation={detectLocation}
//       />


//       <main className="page">

//         <Outlet />

//       </main>


//       <Footer />

//     </>
//   );
// }

import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import { Navbar } from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import Footer from "./Footer.jsx";

import "./layout.css";

export default function Layout({
  location,
  setLocation,
  detectLocation
}) {
  // 1. ADD SIDEBAR STATE HERE
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    console.log("Toggling sidebar... previous state was:", isSidebarOpen);
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* 2. PASS TOGGLE FUNCTION TO NAVBAR */}
      <Navbar
        location={location}
        setLocation={setLocation}
        detectLocation={detectLocation}
        onToggleSidebar={toggleSidebar}
      />

      {/* 3. RENDER SIDEBAR COMPONENT */}
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