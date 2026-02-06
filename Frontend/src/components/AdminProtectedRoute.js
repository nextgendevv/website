import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("authToken");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!token || !isAdmin) {
        // If no token or not admin, redirect to admin login
        return <Navigate to="/admin" replace />;
    }

    // If authorized, render the component
    return children;
};

export default AdminProtectedRoute;
