import { Outlet } from "react-router-dom";

import { Navbar } from "./Navbar.jsx";
import Footer from "./Footer.jsx";

import "./layout.css";


export default function Layout({
  location,
  setLocation,
  detectLocation
}) {

  console.log(
    "LAYOUT RECEIVED:",
    location
  );

  console.log(
    "SET LOCATION:",
    setLocation
  );

  console.log(
    "DETECT LOCATION:",
    detectLocation
  );


  return (
    <>

      <Navbar
        location={location}
        setLocation={setLocation}
        detectLocation={detectLocation}
      />


      <main className="page">

        <Outlet />

      </main>


      <Footer />

    </>
  );
}