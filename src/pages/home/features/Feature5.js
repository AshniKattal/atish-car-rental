import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import backgroundImage from "./images/background11.png";

export default function Feature5() {
  const documents = [
    "Add your company details",
    "Upload company logo",
    "Upload company signatures",
    "Add your client details",
    "Link client to document creation",
    "Create unlimited clients",
  ];

  return (
    <>
      <Card
        sx={{
          minHeight: "550px",
          boxShadow: 10,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "75%",
            left: "50%",
            width: "100%",
            height: "100%",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            //opacity: 0.9, // Set your desired opacity here
            mixBlendMode: "hard-light",
            zIndex: 1,
            borderTopLeftRadius: "200px",
          }}
        />
        <CardContent
          sx={{
            zIndex: 2,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Typography variant="subtitle1">
            Company client data management
          </Typography>

          <Typography variant="h4">Create your company and clients.</Typography>
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

      {/* <Grid container spacing={3} style={{ minHeight: "60vh" }}>
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
            <Typography variant="h4" style={{ color: "#333333" }}>

              Add payment and expense.
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
          backgroundImage={wave_background}
        />
      </Grid>
    </Grid> */}
    </>
  );
}
