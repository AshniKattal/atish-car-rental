import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import backgroundImage from "./images/background11.png";

export default function Feature2() {
  const documents = [
    "Add partial payment",
    "Add full payment",
    "Upload receipt of payment",
    "View which client has not yet made payment",
    "Add expenses",
    "Upload receipt of expense",
    "Get notified if expense amount exceeds invoice total amount.",
  ];

  return (
    <>
      <Card
        sx={{
          minHeight: "550px",
          height: "100%",
          // background: "#f9f9f9",
          boxShadow: 10,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "15%",
            left: "60%",
            width: "100%",
            height: "100%",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            // opacity: 0.9, // Set your desired opacity here
            zIndex: 1,
            borderTopLeftRadius: "300px",
            mixBlendMode: "difference",
          }}
        />
        <CardContent sx={{ zIndex: 2, position: "relative" }}>
          <Typography variant="subtitle1">Payment and expense</Typography>

          <Typography variant="h4">
            Add and track your payments and expenses.
          </Typography>

          <br />

          <Stack spacing={2}>
            {documents &&
              documents?.map((document, index) => (
                <Stack
                  spacing={1}
                  direction={"row"}
                  alignItems={"center"}
                  key={index}
                >
                  <PlayCircleOutlineIcon />
                  <Typography variant="body1">{document}</Typography>
                </Stack>
              ))}
          </Stack>
        </CardContent>
      </Card>
      {/*
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
              <Typography variant="h3" style={{ color: "#333333" }}>
                Add payment.
              </Typography>
              <br />

              <Stack spacing={2}>
                {documents &&
                  documents?.map((document, index) => (
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
                src: paymentPart1,
                objectFit: "fill",
              },
              {
                src: paymentPart2,
                objectFit: "fill",
              },
              {
                src: paymentPart3,
                objectFit: "fill",
              },
            ]}
            backgroundImage={background2}
          />
        </Grid>
      </Grid>{" "}
      */}
    </>
  );
}
