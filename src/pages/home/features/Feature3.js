import { Grid, Stack, Typography } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import expensePart1 from "./video/expensePart1.mp4";
import expensePart2 from "./video/expensePart2.mp4";
import FeatureVideos from "./FeatureVideos";
import background3 from "./images/background3.png";

export default function Feature3() {
  const payments = [
    "Add expenses to an invoice",
    "Upload receipt of expense (pdf/Image)",
    "Get notified if expense amount exceeds invoice total amount.",
    "View total sales and expense amount",
    "Profit and loss report",
  ];

  return (
    <Grid container spacing={3} style={{ minHeight: "60vh" }}>
      <Grid item xs={12} md={5}>
        <div
          data-aos="zoom-in-right"
          data-aos-duration="1500"
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Stack sx={{ p: 3 }}>
            <Typography variant="h3">Add Expenses.</Typography>
            <br />

            <Stack spacing={2}>
              {payments &&
                payments?.map((document, index) => (
                  <div
                    data-aos="fade-in"
                    data-aos-easing="linear"
                    data-aos-delay={50 * index}
                  >
                    <Stack
                      spacing={1}
                      direction={"row"}
                      alignItems={"center"}
                      key={index}
                    >
                      <PlayCircleOutlineIcon />
                      <Typography variant="body3">{document}</Typography>
                    </Stack>
                  </div>
                ))}
            </Stack>
          </Stack>
        </div>
      </Grid>

      <Grid item xs={12} md={7}>
        <FeatureVideos
          videoList={[
            {
              src: expensePart1,
              objectFit: "fill",
            },
            {
              src: expensePart2,
              objectFit: "fill",
            },
          ]}
          backgroundImage={background3}
        />
      </Grid>
    </Grid>
  );
}
