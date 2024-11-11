import PropTypes from "prop-types";
// @mui
import { Box } from "@mui/material";
// components
import { SkeletonProductItem } from "../../../../components/skeleton";
//
import ShopProductCardServices from "./ShopProductCardServices";

// ----------------------------------------------------------------------

ShopProductListServices.propTypes = {
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

export default function ShopProductListServices({ products, loading }) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 8,
        gridTemplateColumns: {
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
      }}
    >
      {(loading ? [...Array(12)] : products).map((product, index) =>
        product ? (
          <ShopProductCardServices key={product.id} product={product} />
        ) : (
          <SkeletonProductItem key={index} />
        )
      )}
    </Box>
  );
}
