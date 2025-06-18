import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const appCredsEntered = !!localStorage.getItem("user");

  // If app credentials are entered, go directly to Homepage
  if (appCredsEntered) {
    return <Navigate to="/Homepage" />;
  }

  // If app credentials are NOT entered, redirect to root (login)
  if (!appCredsEntered) {
    window.location.href = '/';
    return null;
  }

  return null;
}