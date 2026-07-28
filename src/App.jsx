// import { Routes, Route } from "react-router-dom";
// import axios from "axios";
// import { useEffect, useState } from "react";

// import Layout from "./components/Layout";

// import Home from "./pages/Home";
// import Men from "./pages/Men";
// import Women from "./pages/Women";
// import Children from "./pages/Children";
// import Cart from "./pages/Cart";
// import About from "./pages/About";
// import Contact from "./pages/Contact";

// function App() {
//   const [location, setLocation] = useState(null);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;

//         console.log("Coordinates:", latitude, longitude);

//         try {
//           const response = await axios.get(
//             "https://nominatim.openstreetmap.org/reverse",
//             {
//               params: {
//                 lat: latitude,
//                 lon: longitude,
//                 format: "json",
//               },
//             }
//           );

//           console.log("API address:", response.data.address);

//           setLocation(response.data.address);
//         } catch (error) {
//           console.error("Nominatim error:", error);
//         }
//       },
//       (error) => {
//         console.error("Browser location error:", error);
//       }
//     );
//   }, []);

//   return (

// <Routes>
//   <Route
//     element={
//       <Layout
//         location={location}
//         setLocation={setLocation}
//       />
//     }
//   >
//     <Route path="/" element={<Home />} />
//     <Route path="/men" element={<Men />} />
//     <Route path="/women" element={<Women />} />
//     <Route path="/children" element={<Children />} />
//     <Route path="/cart" element={<Cart />} />
//     <Route path="/about" element={<About />} />
//     <Route path="/contact" element={<Contact />} />
//   </Route>
// </Routes>
//   );
// }

// export default App;

import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Children from "./pages/Children";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  const [location, setLocation] = useState(() => {
  const savedLocation = localStorage.getItem("userLocation");

  return savedLocation
    ? JSON.parse(savedLocation)
    : null;
});

  useEffect(() => {
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported");
    return;
  }

navigator.geolocation.getCurrentPosition(
  async (position) => {
    const { latitude, longitude } = position.coords;

    console.log("Coordinates:", latitude, longitude);

    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: {
            lat: latitude,
            lon: longitude,
            format: "json",
          },
        }
      );

      console.log("API address:", response.data.address);

      setLocation(response.data.address);
    } catch (error) {
      console.error("Nominatim error:", error);
    }
  },
  (error) => {
    console.log("Location error:", error.message);
  },
  {
    enableHighAccuracy: false,
    timeout: 30000,
    maximumAge: 300000,
  }
);
}, []);

  return (
    <Routes>
      <Route
        element={
          <Layout
            location={location}
            setLocation={setLocation}
          />
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/children" element={<Children />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;