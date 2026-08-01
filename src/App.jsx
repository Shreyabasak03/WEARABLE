import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

import Layout from "./components/layout.jsx";

import Home from "./pages/Home.jsx";
import Men from "./pages/Men.jsx";
import Women from "./pages/Women.jsx";
import Kids from "./pages/Kids.jsx";
import Cart from "./pages/Cart.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderHistory from "./pages/OrderHistory";

function App() {

  const [location, setLocation] = useState(() => {
    const savedLocation = localStorage.getItem("userLocation");

    return savedLocation
      ? JSON.parse(savedLocation)
      : null;
  });



  const detectLocation = () => {
  return new Promise((resolve, reject) => {

    console.log("detectLocation function called");

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      reject(new Error("Geolocation not supported"));
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

          const address = response.data.address;

          console.log("API address:", address);

          setLocation(address);

          localStorage.setItem(
            "userLocation",
            JSON.stringify(address)
          );

          resolve(address);

        } catch (error) {

          console.error("Nominatim error:", error);

          reject(error);
        }
      },

      (error) => {

        console.error(
          "Location error code:",
          error.code
        );

        console.error(
          "Location error message:",
          error.message
        );

        reject(error);
      },

      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 300000,
      }
    );
  });
};

  // AUTO DETECT ON FIRST VISIT


  useEffect(() => {

    const savedLocation =
      localStorage.getItem(
        "userLocation"
      );


    if (!savedLocation) {

      detectLocation();

    }

  }, []);


  return (

    <Routes>

      <Route
        element={
          <Layout
            location={location}
            setLocation={setLocation}
            detectLocation={detectLocation}
          />
        }
      >

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/men"
          element={<Men />}
        />

        <Route
          path="/women"
          element={<Women />}
        />

        <Route
          path="/kids"
          element={<Kids />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />
        <Route
    path="/checkout"
    element={<Checkout />}
  />
  <Route
  path="/orders"
  element={<OrderHistory />}
/>

      </Route>

    </Routes>

  );
}

export default App;