import { useEffect, useRef, useState } from "react";
// @mui
import { styled } from "@mui/material/styles";
import {
  Box,
  Tab,
  Card,
  Grid,
  Divider,
  Container,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
// redux
import { useSelector } from "../../../redux/store";
// routes
import { PATH_PAGE } from "../../../routes/paths";
// hooks
import useSettings from "../../../hooks/useSettings";
// components
import Page from "../../../components/Page";

import Markdown from "../../../components/Markdown";
import { SkeletonProduct } from "../../../components/skeleton";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
// sections
import {
  // ProductDetailsSummary,
  ProductDetailsReview,
  ProductDetailsCarousel,
  ProductDetailsSummaryServices,
  VehicleDetailsSummary,
} from "../../../sections/@dashboard/e-commerce/product-details";

import { fShortenNumber } from "src/utils/formatNumber";
import StarIcon from "@mui/icons-material/Star";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: theme.spacing(15),
  [theme.breakpoints.up("md")]: {
    paddingBottom: theme.spacing(15),
  },
}));

// ----------------------------------------------------------------------

export default function EcommerceProductDetailsServices() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [value, setValue] = useState("1");
  const tempCheckServiceDetailRef = useRef();

  const { serviceDetails } = useSelector((state) => state.service);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional for smooth scrolling
    });
  }, []); // Empty dependency array ensures this runs on mount

  useEffect(() => {
    tempCheckServiceDetailRef.current();
  }, [serviceDetails]);

  function checkServiceDetail() {
    if (!serviceDetails?.id) {
      if (process.env.REACT_APP_OWNER === "carrentalatish") {
        navigate("/");
      } else {
        navigate(PATH_PAGE.services);
      }
    }
  }

  tempCheckServiceDetailRef.current = checkServiceDetail;

  return (
    <Page
      title={
        process.env.REACT_APP_OWNER === "carrentalatish"
          ? "Vehicle detail"
          : "Ecommerce: Product Details"
      }
    >
      <RootStyle>
        <Container maxWidth={themeStretch ? false : "xl"}>
          <HeaderBreadcrumbs
            heading={
              process.env.REACT_APP_OWNER === "carrentalatish"
                ? "Vehicle detail"
                : "Product Details"
            }
            links={
              process.env.REACT_APP_OWNER === "carrentalatish"
                ? [{ name: "Home", href: "/" }, { name: serviceDetails?.name }]
                : [
                    { name: "Home", href: "/" },
                    {
                      name: "Services",
                      href: PATH_PAGE.services,
                    },
                    {
                      name: serviceDetails?.serviceTitle,
                    },
                  ]
            }
          />

          {/*        <CartWidget /> */}

          {serviceDetails && (
            <>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3 }}>
                    <Stack>
                      <Typography variant="h4" paragraph>
                        {process.env.REACT_APP_OWNER === "carrentalatish"
                          ? serviceDetails?.name || ""
                          : serviceDetails?.serviceTitle || ""}
                      </Typography>

                      <Stack
                        spacing={2}
                        direction={"row"}
                        alignItems={"center"}
                      >
                        {!process.env.REACT_APP_OWNER === "carrentalatish" && (
                          <Avatar
                            alt={serviceDetails?.logoFile?.name || ""}
                            src={serviceDetails?.logoFile?.downloadURL || ""}
                            sx={{
                              zIndex: 9,
                              width: 60,
                              height: 60,
                            }}
                          />
                        )}

                        <Stack>
                          {!process.env.REACT_APP_OWNER ===
                            "carrentalatish" && (
                            <Typography
                              variant="subtitle1"
                              sx={{ textTransform: "capitalize" }}
                            >
                              {serviceDetails?.nameOfContactPerson}
                            </Typography>
                          )}

                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <StarIcon />
                            {Number(serviceDetails?.totalRating || 0).toFixed(
                              1
                            )}
                            {serviceDetails?.totalReview ? (
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                (
                                {fShortenNumber(
                                  serviceDetails?.totalReview || 0
                                )}
                                reviews)
                              </Typography>
                            ) : (
                              <></>
                            )}
                          </Stack>
                        </Stack>
                      </Stack>

                      <ProductDetailsCarousel
                        product={{
                          images:
                            process.env.REACT_APP_OWNER === "carrentalatish"
                              ? serviceDetails?.featuredImage?.length > 0
                                ? serviceDetails?.featuredImage.map(
                                    (obj) => obj.downloadURL
                                  )
                                : []
                              : serviceDetails?.imagesFiles?.length > 0
                              ? serviceDetails?.imagesFiles.map(
                                  (obj) => obj.downloadURL
                                )
                              : [],
                        }}
                      />
                    </Stack>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    {process.env.REACT_APP_OWNER === "carrentalatish" ? (
                      <VehicleDetailsSummary product={serviceDetails} />
                    ) : (
                      <ProductDetailsSummaryServices product={serviceDetails} />
                    )}
                  </Card>
                </Grid>

                <Grid item xs={12} md={12}>
                  <Card sx={{ mt: 5 }}>
                    <TabContext value={value}>
                      <Box sx={{ px: 3, bgcolor: "background.neutral" }}>
                        <TabList onChange={(e, value) => setValue(value)}>
                          <Tab disableRipple value="1" label="Description" />
                          <Tab
                            disableRipple
                            value="2"
                            label={`Review (${
                              serviceDetails?.totalReview || 0
                            })`}
                            sx={{
                              "& .MuiTab-wrapper": { whiteSpace: "nowrap" },
                            }}
                          />
                        </TabList>
                      </Box>

                      <Divider />

                      <TabPanel value="1">
                        <Box sx={{ p: 3 }}>
                          <Markdown
                            children={serviceDetails?.serviceDescription || ""}
                          />
                        </Box>
                      </TabPanel>
                      <TabPanel value="2">
                        <ProductDetailsReview product={serviceDetails} />
                      </TabPanel>
                    </TabContext>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}

          {!serviceDetails && <SkeletonProduct />}

          {!serviceDetails && (
            <Typography variant="h6">404 Product not found</Typography>
          )}
        </Container>
      </RootStyle>
    </Page>
  );
}
