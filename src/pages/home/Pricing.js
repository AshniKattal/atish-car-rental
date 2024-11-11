import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import "./Circles.css";
import { lazy, Suspense } from "react";
import backgroundImage from "./features/images/background12.png";
import useSettings from "src/hooks/useSettings";

const RegisterButton = lazy(() => import("./RegisterButton"));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(
  ({ theme }) => ({
    zIndex: 10,
    paddingTop: theme.spacing(20),
    paddingBottom: theme.spacing(20),
    margin: "auto",
    position: "relative",
    [theme.breakpoints.up("md")]: {
      margin: "unset",
    },
  })
);

export default function Pricing() {
  const { themeStretch } = useSettings();

  const options = [
    "All the above features",
    "Unlimited clients",
    "Every features can be personalised depending on your needs (price will vary in this case based on complexity of requirement)*",
    "Unlimited documents created",
    "Up to 10 users",
    "Each user with their permissions and restrictions based on your requirements",
    "Support (Mon-Fri, 9a.m to 5p.m)",
    "Monthly subscription fee",
  ];

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/*  <Box
        sx={{
          position: "absolute",
          top: "-50%",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          //opacity: 0.9, // Set your desired opacity here
          mixBlendMode: "hard-light",
          //zIndex: 1,
          borderTopLeftRadius: "200px",
        }}
      /> */}

      <div
        style={{
          position: "absolute",
          top: "0",
          width: "100%",
          height: "300px",
          //background: "blue",
          zIndex: 2,
          background:
            "linear-gradient(to top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)",
        }}
      ></div>

      <Box
        sx={{
          position: "absolute",
          top: "0",
          //left: "50%",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          //opacity: 0.9, // Set your desired opacity here
          mixBlendMode: "difference",
          // zIndex: 1,
          //borderTopLeftRadius: "200px",
        }}
      />

      <ContentStyle>
        <Container maxWidth={themeStretch ? false : "xl"}>
          <Grid container spacing={4} justifyContent={"center"}>
            <Grid item xs={10} sm={8} md={5} style={{ zIndex: 1000 }}>
              <Card
                data-aos="zoom-in"
                data-aos-easing="linear"
                data-aos-duration="1000"
                sx={{ p: 3 }}
              >
                <Stack spacing={1}>
                  <Typography variant="h4" align="center">
                    Pricing
                  </Typography>
                  <Divider />
                  <br />

                  <Stack spacing={2}>
                    {options &&
                      options?.map((option, index) => (
                        <Stack
                          spacing={1}
                          direction={"row"}
                          alignItems={"flex-start"}
                          key={index}
                          style={{ zIndex: 1000 }}
                        >
                          <PlayCircleOutlineIcon />
                          <Typography variant="body1">{option}</Typography>
                        </Stack>
                      ))}
                  </Stack>
                  <br />

                  <Divider />
                  <Stack>
                    <Typography
                      variant="h3"
                      style={{ zIndex: 1000 }}
                      align="center"
                    >
                      Rs 1,840 (MUR)
                    </Typography>
                    <Typography variant="caption" align="center">
                      Billed monthly (VAT Included)
                    </Typography>
                  </Stack>

                  <Suspense fallback={<></>}>
                    <RegisterButton home={false} />
                  </Suspense>
                </Stack>

                <ul className="circles">
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </ContentStyle>
    </div>
  );
}
