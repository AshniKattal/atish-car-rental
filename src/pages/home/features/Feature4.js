import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import backgroundImage from "./images/background11.png";

export default function Feature4() {
  const reports = [
    "Account statement: list of clients whose payment has not been made",
    "Total sales amount",
    "Total Vat amount",
    "Total payment amount made",
    "Total payment amount due",
    "Total expenses",
    "Export as Excel (XLSX)",
  ];

  return (
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
          right: "60%",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          // opacity: 0.9, // Set your desired opacity here
          zIndex: 1,
          borderTopRightRadius: "300px",
          mixBlendMode: "difference",
        }}
      />
      <CardContent sx={{ zIndex: 2, position: "relative" }}>
        <Typography variant="subtitle1">Reports</Typography>

        <Typography variant="h4">Generate report</Typography>

        <br />

        <Stack spacing={2}>
          {reports &&
            reports?.map((document, index) => (
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
  );
}
