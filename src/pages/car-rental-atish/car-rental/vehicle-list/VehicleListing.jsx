import { Box, Container, Typography, useTheme } from "@mui/material";
import React from "react";
import CarRentalVehiclesList from "../dahsboard/CarRentalVehiclesList";
import { MotionInView, varFade } from "src/components/animate";
import useSettings from "src/hooks/useSettings";

export const VehicleListing = () => {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  return (
    <Container maxWidth={themeStretch ? false : "xl"}>
      <Box
        style={{
          paddingTop: theme.spacing(20),
          paddingBottom: theme.spacing(20),
        }}
      >
        <MotionInView variants={varFade({ durationIn: 1 }).inLeft}>
          <Typography variant="h3" gutterBottom>
            Choose the car that suits you
          </Typography>
        </MotionInView>
        <Box xs={12} md={12}>
          <CarRentalVehiclesList />
          {/** TODO:
           * Make a subset of highlighted vehicles
           * Remove filtering
           * Add link to all
           * */}
        </Box>
      </Box>
    </Container>
  );
};

export default VehicleListing;
