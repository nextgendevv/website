import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("authToken");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!token || !isAdmin) {
        console.log(`AdminProtectedRoute: Auth failed (token: ${!!token}, isAdmin: ${isAdmin}), redirecting to /admin`);
        return <Navigate to="/admin" replace />;
    }

    console.log("AdminProtectedRoute: Admin auth success, allowing access");

    // If authorized, render the component
    return children;
};

export default AdminProtectedRoute;
