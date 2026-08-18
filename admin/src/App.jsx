import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminLayout from "./components/AdminLayout";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import Login from "./pages/Login.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Orders from "./pages/Orders.jsx";
import Users from "./pages/Users.jsx";
import Settings from "./pages/Settings.jsx";

import AddProduct from "./pages/AddProduct.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import ViewProduct from "./pages/ViewProduct.jsx";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            ADMIN LOGIN
        ================================================= */}

        <Route
          path="/admin/login/*"
          element={<Login />}
        />


        {/* =================================================
            PROTECTED ADMIN ROUTES
        ================================================= */}

        <Route
          path="/admin"
          element={<AdminProtectedRoute />}
        >

          {/* =================================================
              ADMIN LAYOUT
          ================================================= */}

          <Route
            element={<AdminLayout />}
          >

            {/* /admin → dashboard */}

            <Route
              index
              element={
                <Navigate
                  to="/admin/dashboard"
                  replace
                />
              }
            />


            {/* =================================================
                DASHBOARD
            ================================================= */}

            <Route
              path="dashboard"
              element={<Dashboard />}
            />


            {/* =================================================
                PRODUCTS
            ================================================= */}

            <Route
              path="products"
              element={<Products />}
            />


            {/* =================================================
                ORDERS
            ================================================= */}

            <Route
              path="orders"
              element={<Orders />}
            />


            {/* =================================================
                USERS
            ================================================= */}

            <Route
              path="users"
              element={<Users />}
            />


            {/* =================================================
                SETTINGS
            ================================================= */}

            <Route
              path="settings"
              element={<Settings />}
            />

          </Route>

        </Route>


        {/* =================================================
            PRODUCT MANAGEMENT
        ================================================= */}

        <Route
          path="/products/add"
          element={<AddProduct />}
        />

        <Route
          path="/products/edit/:id"
          element={<EditProduct />}
        />

        <Route
          path="/products/view/:id"
          element={<ViewProduct />}
        />


        {/* =================================================
            UNKNOWN ROUTES
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/admin/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;