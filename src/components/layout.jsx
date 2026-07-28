import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import "./layout.css";

export default function Layout({ location, setLocation }) {

  console.log("LAYOUT RECEIVED:", location);
  console.log("SET LOCATION:", setLocation);

  return (
    <>
      <Navbar
        location={location}
        setLocation={setLocation}
      />

      <main className="page">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}