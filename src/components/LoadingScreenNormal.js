import { m } from "framer-motion";
// @mui
import { styled } from "@mui/material/styles";
//
import ProgressBar from "./ProgressBar";
// import Lottie from "lottie-react";
// import LottieLogo from "./logo/Lottie-only-logo.json";

import CircularProgress from "@mui/material/CircularProgress";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 99999,
  width: "100%",
  height: "100%",
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.default,
  opacity: "0.5",
}));

export default function LoadingScreenNormal() {
  return (
    <>
      <ProgressBar />
      <RootStyle>
        <m.div
          initial={{ rotateY: 0 }}
          /* animate={{ zoom: [1, 1.5, 1, 1] }}
          transition={{
            duration: 3.2,
            ease: "linear",
            repeatDelay: 1,
            repeat: Infinity,
          }} */
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <Typography variant="h5" color="primary">
            Loading...
          </Typography> */}
          <CircularProgress />
          {/* <Logo disabledLink sx={{ width: 200, height: 25 }} /> */}
          {/* <Typography variant="h5" color="primary">
            Loading...
          </Typography> */}
          {/* <Lottie
            animationData={LottieLogo}
            loop={false}
            autoplay={true}
            style={{
              width: "100%",
              height: "100%",
            }}
          /> */}
        </m.div>
      </RootStyle>
    </>
  );
}
