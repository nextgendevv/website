import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        // If no token, redirect to signin
        return <Navigate to="/signin" replace />;
    }

    // If token exists, render the component
    return children;
};

export default ProtectedRoute;
