import { Routes, Route } from "react-router-dom";
import axios from 'axios';
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Children from "./pages/Children";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { useEffect } from "react";

function App() {

 const getLocation = async () => {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;
    console.log("Coordinates:", latitude, longitude);
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    
    const response = await axios.get(url);
    console.log("Location Data:", response.data);
    
    return response.data; 
  } catch (error) {
    console.error("Error getting location:", error.message || error);
  }
};

  useEffect(()=>{
    getLocation()
  },[])
  return (
    <>
    <Routes>
      {/* Landing Page */}
     

      {/* Pages with Navbar + Sidebar */}
      <Route element={<Layout />}>
       <Route path="/" element={<Home />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/children" element={<Children />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;