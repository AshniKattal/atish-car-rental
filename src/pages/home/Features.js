import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { Container, Grid, IconButton, Stack, Typography } from "@mui/material";
import { useRef } from "react";
import { styled } from "@mui/material/styles";
import "./Features.css";
import Feature1 from "./features/Feature1";
import Feature2 from "./features/Feature2";
import FeatureMRACompliance from "./features/FeatureMRACompliance";
import Feature5 from "./features/Feature5";
import Feature4 from "./features/Feature4";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import "./Features.css";
import useResponsive from "../../hooks/useResponsive";
import useSettings from "src/hooks/useSettings";

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(
  ({ theme }) => ({
    zIndex: 10,
    paddingBottom: theme.spacing(10),
    //maxWidth: 520,
    margin: "auto",
    position: "relative",
    /*    display: "flex",
    alignItems: "center",
    justifyContent: "center", */
    [theme.breakpoints.up("md")]: {
      margin: "unset",
    },
  })
);

const featuresCarousel = [
  <div
    data-aos="fade-zoom-in"
    data-aos-easing="ease-in-back"
    data-aos-delay={100}
    data-aos-offset="0"
    style={{ height: "100%", cursor: "pointer" }}
  >
    <FeatureMRACompliance />
  </div>,
  <div
    data-aos="fade-zoom-in"
    data-aos-easing="ease-in-back"
    data-aos-delay={150}
    data-aos-offset="0"
    style={{ height: "100%", cursor: "pointer" }}
  >
    <Feature5 />
  </div>,
  <div
    data-aos="fade-zoom-in"
    data-aos-easing="ease-in-back"
    data-aos-delay={200}
    data-aos-offset="0"
    style={{ height: "100%", cursor: "pointer" }}
  >
    <Feature1 />
  </div>,
  <div
    data-aos="fade-zoom-in"
    data-aos-easing="ease-in-back"
    data-aos-delay={250}
    data-aos-offset="0"
    style={{ height: "100%", cursor: "pointer" }}
  >
    <Feature2 />
  </div>,
  <div
    data-aos="fade-zoom-in"
    data-aos-easing="ease-in-back"
    data-aos-delay={300}
    data-aos-offset="0"
    style={{ height: "100%", cursor: "pointer" }}
  >
    <Feature4 />
  </div>,
];

export default function Features() {
  const { themeStretch } = useSettings();

  const isDesktop = useResponsive("up", "sm");

  let sliderRef = useRef(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3.5, // Default for desktop
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1536, // When the screen width is less than 1024px
        settings: {
          slidesToShow: 3.5, // Show 3.5 cards on desktop
        },
      },
      {
        breakpoint: 1200, // When the screen width is less than 1024px
        settings: {
          slidesToShow: 2.5, // Show 3.5 cards on desktop
        },
      },
      {
        breakpoint: 900, // When the screen width is less than 1024px
        settings: {
          slidesToShow: 2.5, // Show 3.5 cards on desktop
        },
      },

      {
        breakpoint: 700, // When the screen width is less than 768px (tablet/mobile)
        settings: {
          slidesToShow: 1.2, // Show 1.5 cards on mobile
        },
      },
    ],
  };

  return (
    <ContentStyle>
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Grid
          container
          spacing={5}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid
            item
            xs={12}
            md={12}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "stretch",
              height: "100%",
            }}
          >
            <div
              data-aos="fade-right"
              data-aos-easing="linear"
              data-aos-duration="1000"
            >
              <Typography
                variant="h3"
                align="left"
                style={{ paddingLeft: "1em" }}
              >
                Get to know PlusInvoice.
              </Typography>
            </div>
          </Grid>

          {isDesktop ? (
            <>
              {featuresCarousel &&
                featuresCarousel?.length > 0 &&
                featuresCarousel?.map((feature, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    {feature}
                  </Grid>
                ))}
            </>
          ) : (
            <>
              <Grid item xs={12} md={12} style={{ height: "100%" }}>
                <Slider
                  ref={(slider) => {
                    sliderRef = slider;
                  }}
                  {...settings}
                >
                  {featuresCarousel &&
                    featuresCarousel?.length > 0 &&
                    featuresCarousel?.map((feature, index) => (
                      <div key={index} style={{ height: "100%" }}>
                        <div
                          style={{
                            borderRadius: "10px",
                            transition: "transform 0.3s ease",
                            padding: "1.5em",
                            height: "100%",
                          }}
                          className="carousel-card"
                        >
                          {feature}
                        </div>
                      </div>
                    ))}
                </Slider>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <Stack spacing={3} direction={"row"}>
                    <IconButton onClick={() => sliderRef.slickPrev()}>
                      <ExpandCircleDownIcon
                        fontSize="large"
                        style={{
                          transform: "rotate(90deg)",
                          cursor: "pointer",
                        }}
                      />
                    </IconButton>

                    <IconButton onClick={() => sliderRef.slickNext()}>
                      <ExpandCircleDownIcon
                        fontSize="large"
                        style={{
                          transform: "rotate(-90deg)",
                          cursor: "pointer",
                        }}
                      />
                    </IconButton>
                  </Stack>
                </div>
              </Grid>
            </>
          )}

          {/*     <Grid item xs={12} md={12} style={{ minHeight: "90vh" }}>
            <Feature1 />
          </Grid>

          <Grid item xs={12} md={12} style={{ minHeight: "90vh" }}>
            <Feature2 />
          </Grid>

          <Grid item xs={12} md={12} style={{ minHeight: "90vh" }}>
            <Feature3 />
          </Grid> */}
        </Grid>
      </Container>
    </ContentStyle>
  );
}
