import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
// @mui
import { Box, Card, Typography, Stack, Avatar, Tooltip } from "@mui/material";
// routes
import { PATH_PAGE } from "../../../../routes/paths";
// components
import Label from "../../../../components/Label";
import Image from "../../../../components/Image";

import { useState } from "react";

import FullDescriptionDialog from "./FullDescriptionDialog";
import { useDispatch, useSelector } from "react-redux";
import { setServiceDetails } from "src/redux/slices/service";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import { fShortenNumber } from "src/utils/formatNumber";
import CurrencyFormat from "react-currency-format";
import Iconify from "src/components/Iconify";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { selectTemplate } from "src/features/templateSlice";

// ----------------------------------------------------------------------

ShopProductCardServices.propTypes = {
  product: PropTypes.object,
};

const IconifyBoxStyled = styled("div")(() => ({
  border: "1px solid black",
  borderRadius: "10px",
  padding: "5px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));

export default function ShopProductCardServices({ product }) {
  const { template } = useSelector(selectTemplate);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    serviceTitle,
    imagesFiles,
    serviceDescription,
    district,
    logoFile,
    nameOfContactPerson,
    totalRating,
    totalReview,

    /**
     * car rental properties
     */
    featuredImage,
    name,
    price,
    serviceCategory,
    passengers,
    luggage,
    doors,
    transmission,
    airConditioning,
  } = product;

  const [openFullDescriptionDialog, setOpenFullDescriptionDialog] =
    useState(false);

  const vehicleOptions = [
    {
      tooltipTitle: "Doors",
      badgeContent: Number(doors || 0),
      icon: "mingcute:car-door-line",
    },
    {
      tooltipTitle: "Seats",
      badgeContent: Number(passengers || 0),
      icon: "mingcute:seat-line",
    },
    {
      tooltipTitle: "Transmission",
      badgeContent: transmission || "",
      icon:
        transmission === "Manual"
          ? "solar:transmission-bold"
          : "tabler:automatic-gearbox-filled",
    },
    {
      tooltipTitle: "Luggage",
      badgeContent: Number(luggage || 0),
      icon: "fluent:luggage-32-regular",
    },
    {
      tooltipTitle: "Air Conditioning",
      badgeContent: airConditioning ? (
        <DoneIcon style={{ fontSize: "10px", paddiing: "1px" }} />
      ) : (
        <CloseIcon />
      ),
      icon: "hugeicons:thermometer-cold",
    },
  ];

  function openServiceDetail() {
    dispatch(setServiceDetails({ ...product }));
    navigate(PATH_PAGE.serviceDetail);
  }

  return (
    <>
      {process.env.REACT_APP_OWNER === "carrentalatish" ? (
        <>
          <Card
            sx={{ boxShadow: 10, cursor: "pointer" }}
            onClick={() => openServiceDetail()}
          >
            <Box sx={{ position: "relative" }}>
              <Image
                alt={name || ""}
                src={featuredImage[0]?.downloadURL || ""}
                ratio="16/9"
              />
            </Box>

            <Stack spacing={1} sx={{ p: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ textTransform: "capitalize", textAlign: "center" }}
              >
                {name || ""}
              </Typography>

              <Typography variant="subtitle1" align="center">
                <CurrencyFormat
                  value={Number(price || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={
                    template === process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH
                      ? process.env.REACT_APP_CURRENCY_USED
                      : "Rs "
                  }
                />{" "}
                / day
              </Typography>

              {serviceCategory && serviceCategory?.length > 0 ? (
                <Typography variant="subtitle1" align="center">
                  {serviceCategory?.map(
                    (category) => category?.serviceName + " - "
                  )}
                </Typography>
              ) : (
                <></>
              )}

              <Stack
                direction="row"
                alignItems="center"
                justifyContent={"center"}
                spacing={1}
                sx={{ mb: 2 }}
              >
                {vehicleOptions &&
                  vehicleOptions?.map((option) => (
                    <Tooltip
                      title={`${option?.tooltipTitle || ""}: ${
                        option?.badgeContent
                      }`}
                    >
                      <IconifyBoxStyled>
                        {/* <Badge badgeContent={option?.badgeContent} color="info"> */}
                        <Iconify icon={option?.icon} width={30} height={30} />
                        {/* </Badge> */}
                      </IconifyBoxStyled>
                    </Tooltip>
                  ))}
              </Stack>

              {/* <Stack
                direction="row"
                alignItems="center"
                justifyContent={"center"}
                spacing={1}
                sx={{ mb: 2 }}
              >
                <StarIcon color="warning" />
                {Number(totalRating || 0).toFixed(1)}
                {totalReview ? (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    ({fShortenNumber(totalReview || 0)}
                    reviews)
                  </Typography>
                ) : (
                  <></>
                )}
              </Stack> */}
            </Stack>
          </Card>
        </>
      ) : (
        <>
          <Card sx={{ boxShadow: 5 }}>
            <Box sx={{ position: "relative" }}>
              {district && (
                <Stack
                  spacing={1}
                  sx={{
                    top: 16,
                    right: 16,
                    zIndex: 9,
                    position: "absolute",
                    textTransform: "uppercase",
                  }}
                >
                  <Label
                    variant="filled"
                    color={"info"}
                    sx={{
                      textTransform: "uppercase",
                    }}
                  >
                    {district || ""}
                  </Label>

                  <div align="right">
                    <FavoriteBorderIcon sx={{ cursor: "pointer" }} />
                  </div>
                </Stack>
              )}

              <Image
                alt={serviceTitle || ""}
                src={
                  (imagesFiles &&
                    imagesFiles?.length > 0 &&
                    imagesFiles[0]?.downloadURL) ||
                  ""
                }
                ratio="16/9"
              />
            </Box>

            <Stack spacing={1} sx={{ p: 3 }}>
              <Stack spacing={1} direction={"row"} alignItems={"center"}>
                <Avatar
                  alt={logoFile?.name || ""}
                  src={logoFile?.downloadURL || ""}
                  sx={{
                    zIndex: 9,
                    width: 32,
                    height: 32,
                  }}
                />

                <Typography
                  variant="subtitle1"
                  sx={{ textTransform: "capitalize" }}
                >
                  {nameOfContactPerson}
                </Typography>
              </Stack>

              <Typography
                noWrap
                style={{ textDecoration: "underline", cursor: "pointer" }}
                onClick={() => openServiceDetail()}
              >
                {serviceTitle || ""}
              </Typography>

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <StarIcon color="warning" />
                {Number(totalRating || 0).toFixed(1)}
                {totalReview ? (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    ({fShortenNumber(totalReview || 0)}
                    reviews)
                  </Typography>
                ) : (
                  <></>
                )}
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                {/*  <ColorPreview colors={colors} /> */}

                {/*  <Stack direction="row" spacing={0.5}>
            {
              <Typography
                component="span"
                sx={{ color: "text.disabled", textDecoration: "line-through" }}
              >
                {fCurrency(priceSale || 100)}
              </Typography>
            }

            <Typography variant="subtitle1">
              {fCurrency(price || 200)}
            </Typography>
          </Stack> */}
                {/* <Stack direction="row" spacing={0.5}>
              <Typography
                variant="subtitle2"
                sx={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  WebkitLineClamp: 2, // Number of lines before truncation
                  WebkitBoxOrient: "vertical",
                  lineHeight: "1.5em", // Adjust the line height as needed
                  maxHeight: "3em", // lineHeight * numberOfLines (1.5em * 2 = 3em)
                }}
              >
                {serviceDescription || ""}
              </Typography>

              <Tooltip title="View full service description">
                <IconButton onClick={() => setOpenFullDescriptionDialog(true)}>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </Stack> */}
              </Stack>
            </Stack>
          </Card>

          <FullDescriptionDialog
            open={openFullDescriptionDialog}
            setOpen={setOpenFullDescriptionDialog}
            serviceDescription={serviceDescription}
          />
        </>
      )}
    </>
  );
}
