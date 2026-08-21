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

import Notifications from "./pages/Notification.jsx";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==========================================
            ADMIN LOGIN
        ========================================== */}

        <Route
          path="/admin/login"
          element={<Login />}
        />

     

        {/* ==========================================
            PROTECTED ADMIN AREA
        ========================================== */}

        <Route
          path="/admin"
          element={<AdminProtectedRoute />}
        >

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

            {/* ======================================
                DASHBOARD
            ====================================== */}

            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            {/* ======================================
                PRODUCTS
            ====================================== */}

            <Route
              path="products"
              element={<Products />}
            />

            <Route
              path="products/add"
              element={<AddProduct />}
            />

            <Route
              path="products/edit/:id"
              element={<EditProduct />}
            />

            <Route
              path="products/view/:id"
              element={<ViewProduct />}
            />

            {/* ======================================
                ORDERS
            ====================================== */}

            <Route
              path="orders"
              element={<Orders />}
            />

            {/* ======================================
                USERS
            ====================================== */}

            <Route
              path="users"
              element={<Users />}
            />

            {/* ======================================
                NOTIFICATIONS
            ====================================== */}

            <Route
              path="notifications"
              element={<Notifications />}
            />

            {/* ======================================
                SETTINGS
            ====================================== */}

            <Route
              path="settings"
              element={<Settings />}
            />

          </Route>

        </Route>

        {/* ==========================================
            UNKNOWN ROUTES
        ========================================== */}

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