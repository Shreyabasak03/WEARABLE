import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminLayout from "./components/AdminLayout";

import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Orders from "./pages/Orders.jsx";
import Users from "./pages/Users.jsx";
// import Settings from "./pages/Settings";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            ADMIN ROUTES
        ================================================= */}

        <Route path="/admin" element={<AdminLayout />}>

          {/* /admin → /admin/dashboard */}

          <Route
            index
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />

          {/* Dashboard */}

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          {/* Products */}

          <Route
            path="products"
            element={<Products />}
          />

          {/* =================================================
              FUTURE ROUTES
          ================================================= */}

          
          <Route
            path="orders"
            element={<Orders />}
          />

          <Route
            path="users"
            element={<Users />}
          />

          {/* <Route
            path="settings"
            element={<Settings />}
          /> */}
         

        </Route>


        {/* =================================================
            UNKNOWN ROUTES
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;