import { Box, Card, Stack, Typography } from "@mui/material";

export default function EventColorIndicator() {
  return (
    <div align="right">
      <Card style={{ maxWidth: "300px" }}>
        <Stack p={3} spacing={3}>
          <Stack direction="row" alignItems={"center"} spacing={2}>
            <Box
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: "#54D62C",
              }}
            />
            <Typography>Task linked to an invoice</Typography>
          </Stack>

          <Stack direction="row" alignItems={"center"} spacing={2}>
            <Box
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: "#FF4842",
              }}
            />
            <Typography>Task linked to a proforma</Typography>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
}
