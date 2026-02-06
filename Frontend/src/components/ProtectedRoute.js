import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        console.log("ProtectedRoute: No token found, redirecting to /signin");
        return <Navigate to="/signin" replace />;
    }

    console.log("ProtectedRoute: Token found, allowing access");

    // If token exists, render the component
    return children;
};

export default ProtectedRoute;
