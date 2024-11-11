import { m } from "framer-motion";
import { useSelector } from "../redux/store";
import { selectGlobal } from "../features/globalSlice";
// @mui
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
//
import ProgressBar from "./ProgressBar";
// import Lottie from "lottie-react";
// import LottieLogo from "./logo/Lottie-only-logo.json";

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

export default function LoadingScreenCustom() {
  const globalSlice = useSelector(selectGlobal);
  const { msg, loading } = globalSlice;
  return (
    <>
      {loading ? (
        <>
          <ProgressBar />
          <RootStyle>
            <m.div
              initial={{ rotateY: 0 }}
              // animate={{ zoom: [1, 1.5, 1, 1] }}
              /* transition={{
                duration: 3.2,
                ease: 'linear',
                repeatDelay: 1,
                repeat: Infinity,
              }}*/
            >
              <CircularProgress />
              {/* <Lottie
                                animationData={LottieLogo}
                                loop={false}
                                autoplay={true}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            /> */}
              {/*
              <Logo disabledLink sx={{ width: 200, height: 25 }} />
              */}
              {/*   <br />
              <div align="center">
                <Typography color="primary">Loading...</Typography>
                {msg && msg !== "" ? (
                  <Typography color="primary">{msg}</Typography>
                ) : (
                  ""
                )}
              </div> */}
            </m.div>

            {/*<Box
              component={m.div}
              animate={{
                scale: [1.2, 1, 1, 1.2, 1.2],
                rotate: [270, 0, 0, 270, 270],
                opacity: [0.25, 1, 1, 1, 0.25],
                borderRadius: ['25%', '25%', '50%', '50%', '25%'],
              }}
              transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
              sx={{
                width: 100,
                height: 100,
                borderRadius: '25%',
                position: 'absolute',
                border: (theme) => `solid 3px ${alpha(theme.palette.primary.dark, 0.24)}`,
              }}
            />

            <Box
              component={m.div}
              animate={{
                scale: [1, 1.2, 1.2, 1, 1],
                rotate: [0, 270, 270, 0, 0],
                opacity: [1, 0.25, 0.25, 0.25, 1],
                borderRadius: ['25%', '25%', '50%', '50%', '25%'],
              }}
              transition={{
                ease: 'linear',
                duration: 3.2,
                repeat: Infinity,
              }}
              sx={{
                width: 120,
                height: 120,
                borderRadius: '25%',
                position: 'absolute',
                border: (theme) => `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`,
              }}
            />*/}
          </RootStyle>
        </>
      ) : (
        ""
      )}

      {/*
      !isDashboard && (
        <RootStyle {...other}>
          <m.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 360 }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeatDelay: 1,
              repeat: Infinity,
            }}
          >
            <Logo disabledLink sx={{ width: 64, height: 64 }} />
          </m.div>

          <Box
            component={m.div}
            animate={{
              scale: [1.2, 1, 1, 1.2, 1.2],
              rotate: [270, 0, 0, 270, 270],
              opacity: [0.25, 1, 1, 1, 0.25],
              borderRadius: ['25%', '25%', '50%', '50%', '25%'],
            }}
            transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
            sx={{
              width: 100,
              height: 100,
              borderRadius: '25%',
              position: 'absolute',
              border: (theme) => `solid 3px ${alpha(theme.palette.primary.dark, 0.24)}`,
            }}
          />

          <Box
            component={m.div}
            animate={{
              scale: [1, 1.2, 1.2, 1, 1],
              rotate: [0, 270, 270, 0, 0],
              opacity: [1, 0.25, 0.25, 0.25, 1],
              borderRadius: ['25%', '25%', '50%', '50%', '25%'],
            }}
            transition={{
              ease: 'linear',
              duration: 3.2,
              repeat: Infinity,
            }}
            sx={{
              width: 120,
              height: 120,
              borderRadius: '25%',
              position: 'absolute',
              border: (theme) => `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`,
            }}
          />
        </RootStyle>
          )
          */}
    </>
  );
}
