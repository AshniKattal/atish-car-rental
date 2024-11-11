import PropTypes from "prop-types";
// hooks
import useAuth from "../hooks/useAuth";
/* import Login from "../pages/auth/Login"; */
import { Navigate } from "react-router-dom";
import { PATH_PAGE } from "../routes/paths";
import Home from "../pages/home/Home";

// ----------------------------------------------------------------------

RestrictedOnlyAdmin.propTypes = {
  children: PropTypes.node,
};

export default function RestrictedOnlyAdmin({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Home />;
  }

  if (
    isAuthenticated &&
    (user?.role === "super-admin" ||
      user?.role === "Admin" ||
      user?.role === "Secretary" ||
      user?.role === "SalePerson")
  ) {
    return <>{children}</>;
  } else {
    return <Navigate to={PATH_PAGE.page404} />;
  }
}
