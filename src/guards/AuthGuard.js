import PropTypes from "prop-types";
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
// hooks
import useAuth from "../hooks/useAuth";
// pages
/* import Login from '../pages/auth/Login'; */
// components
import LoadingScreen from "../components/LoadingScreen";
import Home from "../pages/home/Home";
import { useSelector } from "react-redux";
import { selectTemplate } from "src/features/templateSlice";
import HomeCarRental from "src/pages/car-rental-atish/car-rental/HomeCarRental";

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const { template } = useSelector(selectTemplate);
  const { isAuthenticated, isInitialized } = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }

    if (template === process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH) {
      return <HomeCarRental />;
    } else {
      return <Home />;
    }
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
