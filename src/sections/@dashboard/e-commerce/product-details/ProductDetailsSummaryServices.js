import PropTypes from "prop-types";

// @mui
import { styled } from "@mui/material/styles";
import { Stack, Divider, Typography } from "@mui/material";

import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));

// ----------------------------------------------------------------------

ProductDetailsSummaryServices.propTypes = {
  product: PropTypes.shape({
    serviceTitle: PropTypes.string,
    serviceCategory: PropTypes.array,
    otherServiceChecked: PropTypes.bool,
    otherService: PropTypes.string,
    nameOfContactPerson: PropTypes.string,
    phoneNumber: PropTypes.string,
    mobileNumber: PropTypes.string,
    email: PropTypes.string,
    companyName: PropTypes.string,
    brn: PropTypes.string,
    isVatRegistered: PropTypes.bool,
    vatNumber: PropTypes.string,
    district: PropTypes.string,
    region: PropTypes.string,
    address: PropTypes.string,
    geoLocationPin: PropTypes.string,
  }),
};

export default function ProductDetailsSummaryServices({ product, ...other }) {
  const {
    // serviceTitle,
    serviceCategory,
    // otherServiceChecked,
    // otherService,
    // nameOfContactPerson,
    phoneNumber,
    mobileNumber,
    email,
    companyName,
    brn,
    // isVatRegistered,
    // vatNumber,
    district,
    region,
    address,
  } = product;

  return (
    <RootStyle {...other}>
      <>
        <Typography
          variant="overline"
          sx={{
            mt: 2,
            mb: 1,
            display: "block",
            color: "info.main",
          }}
        >
          {serviceCategory?.serviceName || ""}
        </Typography>

        <Stack
          spacing={1}
          direction={"row"}
          alignItems={"center"}
          sx={{ mb: 1 }}
        >
          <BusinessIcon color="primary" />
          <Typography variant="h5">Company</Typography>
        </Stack>

        <Stack
          spacing={1}
          direction={"row"}
          alignItems={"center"}
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle1">Name:</Typography>

          <Typography>{companyName}</Typography>
        </Stack>

        <Stack
          spacing={1}
          direction={"row"}
          alignItems={"center"}
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle1">BRN:</Typography>

          <Typography>{brn}</Typography>
        </Stack>

        <Stack
          spacing={1}
          direction={"row"}
          alignItems={"center"}
          sx={{ mb: 2 }}
        >
          <Typography variant="subtitle1">Email:</Typography>

          <Typography>{email}</Typography>
        </Stack>

        <Divider sx={{ borderStyle: "dashed", mb: 2 }} />

        <Stack
          spacing={1}
          direction={"row"}
          alignItems={"center"}
          sx={{ mb: 1 }}
        >
          <LocationOnIcon color="primary" />
          <Typography variant="h5">Location</Typography>
        </Stack>

        <Stack
          spacing={1}
          direction={"row"}
          alignItems={"center"}
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle1">District:</Typography>

          <Typography>{district}</Typography>
        </Stack>

        <Stack
          spacing={1}
          direction={"row"}
          alignItems={"center"}
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle1">Region:</Typography>

          <Typography>{region}</Typography>
        </Stack>

        <Stack
          spacing={1}
          direction={"row"}
          alignItems={"center"}
          sx={{ mb: 2 }}
        >
          <Typography variant="subtitle1">Address:</Typography>

          <Typography>{address}</Typography>
        </Stack>

        <Divider sx={{ borderStyle: "dashed", mb: 2 }} />

        <Stack
          spacing={1}
          direction={"row"}
          alignItems={"center"}
          sx={{ mb: 1 }}
        >
          <CallIcon color="primary" />
          <Typography variant="h5">Contact</Typography>
        </Stack>

        {phoneNumber ? (
          <Stack
            spacing={1}
            direction={"row"}
            alignItems={"center"}
            sx={{ mb: 1 }}
          >
            <Typography variant="subtitle1">Phone number:</Typography>

            <Typography>{phoneNumber}</Typography>
          </Stack>
        ) : (
          <></>
        )}

        <Stack
          spacing={1}
          direction={"row"}
          alignItems={"center"}
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle1">Mobile number:</Typography>

          <Typography>{mobileNumber}</Typography>
        </Stack>

        {/*     <Stack alignItems="center" sx={{ mt: 3 }}>
          <SocialsButton initialColor />
        </Stack> */}
      </>
    </RootStyle>
  );
}
