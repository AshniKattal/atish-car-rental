import PropTypes from "prop-types";
// hooks
import useAuth from "../hooks/useAuth";
/* import Login from "../pages/auth/Login"; */
import Home from "../pages/home/Home";
import HomeCarRental from "src/pages/car-rental-atish/car-rental/HomeCarRental";
import { useSelector } from "react-redux";
import { selectTemplate } from "src/features/templateSlice";
import MainLayout from "src/layouts/main";

// ----------------------------------------------------------------------

AdminGuard.propTypes = {
  children: PropTypes.node,
};

export default function AdminGuard({ children }) {
  const { template } = useSelector(selectTemplate);

  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    if (process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH === "carrentalatish") {
      return <MainLayout children={<HomeCarRental />} />;
    } else {
      return <MainLayout children={<Home />} />;
    }
  }

  if (
    isAuthenticated &&
    (user?.role === "super-admin" ||
      user?.role === "Admin" ||
      user?.role === "Secretary" ||
      user?.role === "SalePerson" ||
      user?.role === "client")
  ) {
    return <>{children}</>;
  }
}
