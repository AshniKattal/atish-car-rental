import "animate.css";
// @mui
import { styled } from "@mui/material/styles";
import { Container, Typography, Stack, Grid } from "@mui/material";
import { lazy, Suspense, useEffect, useState } from "react";
import "./Homehero.css";
import "./Circles.css";

const RegisterButton = lazy(() => import("./RegisterButton"));

// ----------------------------------------------------------------------

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(
  ({ theme }) => ({
    paddingBottom: theme.spacing(15),
  })
);

const StyledContainer = styled("div")(({ theme, scrollY }) => ({
  // width: "100vw",
  padding: `${Math.max(100 - scrollY / 10, 50)}px`,
  height: "100vh",
  background: `rgba(211, 211, 211, ${Math.min(scrollY / 500, 0.2)})`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",

  transition: "width ease-in-out, clip-path ease-in-out",
  clipPath: `inset(${Math.min(scrollY / 100, 6.25)}% round ${Math.min(
    scrollY / 10,
    40
  )}px)`,

  [theme.breakpoints.down("md")]: {
    padding: `${Math.max(25 - scrollY / 10, 25)}px`,
  },
}));

/* // Keyframes for scrolling
const scrollUp = keyframes`
  0% { transform: translateY(100%); }
  100% { transform: translateY(-100%); }
`;

const scrollDown = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

// Styled container for marquee
const MarqueeContainer = styled(Box)`
  display: flex;
  overflow: hidden;
  height: 300px; // Adjust height as needed
  position: relative;
`;

// Styled card component
const StyledCard = styled(Card)`
  margin: 10px;
  width: 200px; // Adjust width as needed
  height: 100px; // Adjust height as needed
  display: flex;
  align-items: center;
  justify-content: center;
`; */

/* // Marquee component
const Marquee = ({ direction }) => {
  const animation = direction === "up" ? scrollUp : scrollDown;

  return (
    <MarqueeContainer>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          animation: `${animation} 10s linear infinite`,
        }}
      >
        <StyledCard>
          <CardContent>
            <Typography variant="h6">Create document </Typography>
          </CardContent>
        </StyledCard>
        <StyledCard>
          <CardContent>
            <Typography variant="h6">Create document </Typography>
          </CardContent>
        </StyledCard>
      </Box>
    </MarqueeContainer>
  );
}; */

export default function HomeHero() {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <ContentStyle>
        <StyledContainer scrollY={scrollY}>
          <Container>
            <Grid container spacing={5} style={{ zIndex: 1000 }}>
              <Grid item xs={12} sm={8} md={7} lg={6} style={{ zIndex: 1000 }}>
                <Stack spacing={4} style={{ zIndex: 1000 }}>
                  {/* <Typography
                    variant="body1"
                    color="primary"
                    sx={{
                      textAlign: "left",
                      zIndex: "10000",
                    }}
                    className="animate__animated animate__slideInDown"
                  >
                    ACCOUNTING SOFTWARE FOR SMALL BUSINESS
                  </Typography> */}
                  <Typography
                    variant="h1"
                    //color="primary"
                    sx={{
                      textAlign: "left",
                      zIndex: "10000",
                    }}
                    className="animate__animated animate__fadeIn animate__delay-1s"
                  >
                    Save time, money and invoice smarter
                    <br />
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "left",
                      zIndex: "10000",
                    }}
                    className="animate__animated animate__fadeIn animate__delay-1s"
                  >
                    Create invoices, track payment and expenses, run reports and
                    even more from one place.
                  </Typography>

                  <Suspense fallback={<></>}>
                    <RegisterButton home={true} />
                  </Suspense>
                </Stack>
              </Grid>
              <Grid
                item
                xs={12}
                sm={8}
                md={7}
                lg={5}
                style={{ zIndex: 1000 }}
              ></Grid>
            </Grid>
            {/*           </ContentStyle> */}
          </Container>
          {/*  <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul> */}
        </StyledContainer>
      </ContentStyle>
    </>
  );
}
