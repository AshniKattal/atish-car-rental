import { Box, Card, CardContent, Typography } from "@mui/material";
import backgroundImage from "./images/background11.png";
import mraCompliantImage from "./images/MRALogo.png";
import Image from "src/components/Image";

export default function FeatureMRACompliance() {
  return (
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
          top: "60%",
          right: "10%",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1,
          borderTopRightRadius: "300px",
          mixBlendMode: "difference",
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
        <Typography variant="subtitle1">MRA Compliance</Typography>

        <Typography variant="h4">Compliant with MRA.</Typography>
        <br />
        <br />

        <Typography variant="body1">
          PlusInvoice powered by FerToSiteWeb complies with MRA e-invoicing
          requirements and is registered as an EBS solution provider.
        </Typography>

        <Image
          alt="MRA Compliant Image"
          src={mraCompliantImage}
          sx={{ height: 220 }}
        />
      </CardContent>
    </Card>
  );
}
