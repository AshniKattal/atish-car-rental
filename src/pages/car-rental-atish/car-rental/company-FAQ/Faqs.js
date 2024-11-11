// @mui
import { Grid, Container, Typography, useTheme } from "@mui/material";
// components

import { FaqsList } from "../../../../sections/faqs";

// ----------------------------------------------------------------------

export default function Faqs() {
  const theme = useTheme();

  return (
    <div style={{ backgroundColor: theme.palette.grey[100] }}>
      <Container
        maxWidth="md"
        style={{
          paddingTop: theme.spacing(20),
          paddingBottom: theme.spacing(20),
        }}
      >
        <div data-aos="fade-up" data-aos-duration="500">
          <Typography align="center" variant="h3">
            Frequently asked questions
          </Typography>
        </div>

        <Grid container spacing={10} sx={{ marginTop: "5px" }}>
          <Grid item xs={12} md={12}>
            <FaqsList />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
