// @mui
import { styled } from "@mui/material/styles";
import { Box, Stack, Container, Typography } from "@mui/material";
// components
import Page from "../../components/Page";
// sections
import { LoginForm } from "../../sections/auth/login";
import Logo from "../../components/Logo";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Stack spacing={3}>
            <Stack
              spacing={1}
              direction="row"
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Logo />
              <Typography variant="h4">
                {process.env.REACT_APP_SOFTWARE_NAME || ""}
              </Typography>
            </Stack>

            <Typography variant="h5" color="secondary">
              Version {process.env.REACT_APP_VERSION}
            </Typography>
          </Stack>
        </HeaderStyle>

        {/*
        mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <Image
              alt="login"
              src="https://minimal-assets-api.vercel.app/assets/illustrations/illustration_login.png"
            />
          </SectionStyle>
        )
        */}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {` Sign in to ${process.env.REACT_APP_SOFTWARE_NAME || ""}`}
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Enter your details below.
                </Typography>
              </Box>

              {/*
              <Tooltip title={capitalCase(method)} placement="right">
                <>
                  <Image
                    disabledEffect
                    src={`https://minimal-assets-api.vercel.app/assets/icons/auth/ic_${method}.png`}
                    sx={{ width: 32, height: 32 }}
                  />
                </>
              </Tooltip>
              */}
            </Stack>

            {/*
            <Alert severity="info" sx={{ mb: 3 }}>
              Use email : <strong>demo@minimals.cc</strong> / password :<strong> demo1234</strong>
            </Alert>
            */}

            <LoginForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
