import { m } from "framer-motion";
import { Card, Grid, Stack, Typography } from "@mui/material";
import { varFade } from "src/components/animate";

import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import useAuth from "src/hooks/useAuth";

export default function CarRentalAtishCustomDashboardSections() {
  const { user } = useAuth();

  const navigate = useNavigate();

  return (
    <>
      <Grid item xs={12} md={6}>
        <m.div variants={varFade().inUp} className="cardDiv">
          <Card
            className="cardContainer clickable"
            onClick={() => {
              navigate(PATH_DASHBOARD.customCarRental.booking);
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6">Vehicle booking</Typography>

              <Stack spacing={1} direction={"row"} alignItems={"flex-start"}>
                <PlayCircleOutlineIcon />
                <Typography variant="body1">
                  {user && user?.role === "client"
                    ? "See your vehicle bookings"
                    : "Manage your vehicle bookings"}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </m.div>
      </Grid>

      {user && user?.role !== "client" ? (
        <>
          <Grid item xs={12} md={6}>
            <m.div variants={varFade().inUp} className="cardDiv">
              <Card
                className="cardContainer clickable"
                onClick={() => {
                  navigate(PATH_DASHBOARD.customCarRental.vehicles);
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h6">Manage vehicles</Typography>

                  <Stack
                    spacing={1}
                    direction={"row"}
                    alignItems={"flex-start"}
                  >
                    <PlayCircleOutlineIcon />
                    <Typography variant="body1">
                      Manage your vehicles
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            </m.div>
          </Grid>

          {/*  <Grid item xs={12} md={4}>
            <m.div variants={varFade().inUp} className="cardDiv">
              <Card
                className="cardContainer clickable"
                onClick={() => {
                  navigate(PATH_DASHBOARD.general.contracts);
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h6">Manage Contract</Typography>

                  <Stack
                    spacing={1}
                    direction={"row"}
                    alignItems={"flex-start"}
                  >
                    <PlayCircleOutlineIcon />
                    <Typography variant="body1">
                      Manage all contracts
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            </m.div>
          </Grid> */}

          <Grid item xs={12} md={6}>
            <m.div variants={varFade().inUp} className="cardDiv">
              <Card
                className="cardContainer clickable"
                onClick={() => {
                  navigate(PATH_DASHBOARD.general.payment);
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h6">Manage Payment</Typography>

                  <Stack
                    spacing={1}
                    direction={"row"}
                    alignItems={"flex-start"}
                  >
                    <PlayCircleOutlineIcon />
                    <Typography variant="body1">
                      Make full/partial payment
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            </m.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <m.div variants={varFade().inUp} className="cardDiv">
              <Card
                className="cardContainer clickable"
                onClick={() => {
                  navigate(PATH_DASHBOARD.general.report);
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h6">Report</Typography>

                  <Stack
                    spacing={1}
                    direction={"row"}
                    alignItems={"flex-start"}
                  >
                    <PlayCircleOutlineIcon />
                    <Typography variant="body1">
                      Report of all payments and income
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            </m.div>
          </Grid>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
