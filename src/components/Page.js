import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import { forwardRef } from "react";
// @mui
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { selectTemplate } from "src/features/templateSlice";

// ----------------------------------------------------------------------

const Page = forwardRef(({ children, title = "", meta, ...other }, ref) => {
  const { template } = useSelector(selectTemplate);
  return (
    <>
      <Helmet>
        <title>{`${title} | ${
          process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH === "carrentalatish"
            ? "Reaching Heights Ltd"
            : "PlusInvoice - PlusMauritius Ltd"
        } `}</title>
        {meta}
      </Helmet>

      <Box ref={ref} {...other}>
        {children}
      </Box>
    </>
  );
});

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node,
};

export default Page;
