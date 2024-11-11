import SavingsIcon from "@mui/icons-material/Savings";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import {
  Avatar,
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const RootStyle = styled(Container)(({ theme }) => ({
  marginTop: "4em",
  [theme.breakpoints.up("md")]: {
    marginBottom: theme.spacing(10),
  },
}));

const OVERVIEW = [
  {
    number: 1,
    title: "Erat at semper",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat odio, vehicula convallis tristique ut, finibus a diam. Etiam ac faucibus lectus, porta suscipit nibh. ",
  },
  {
    number: 2,
    title: "Urna nec vivamus risus duis arcu",
    description:
      "Vestibulum quis justo sed nulla mollis malesuada. Suspendisse blandit felis et nunc luctus, ac dignissim est pulvinar.",
  },
  {
    number: 3,
    title: "Lobortis euismod imperdiet tempus",
    description:
      "Praesent nisi lectus, consequat quis placerat in, commodo quis purus. Praesent ultricies rhoncus posuere. Donec interdum elit ipsum, eleifend porta dolor imperdiet a. ",
  },
  {
    number: 4,
    title: "Cras nulla aliquet nam eleifend amet et",
    description:
      "Maecenas at varius arcu, ac eleifend lorem. Suspendisse non eros non lacus viverra aliquet sit amet id neque.",
  },
];

const OverviewSection = ({ image = "https://picsum.photos/600" }) => {
  return (
    <RootStyle>
      <Box py={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} textAlign="center">
            <AvTimerIcon fontSize="large" />
            <Typography variant="h6" gutterBottom>
              Availability
            </Typography>
            <Typography variant="">
              Diam tincidunt tincidunt erat at semper fermentum. Id ultrices
              quis.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} textAlign="center">
            <DirectionsCarIcon fontSize="large" />
            <Typography variant="h6" gutterBottom>
              Comfort
            </Typography>
            <Typography variant="">
              Gravida auctor fermentum morbi vulputate ac egestas orci.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} textAlign="center">
            <SavingsIcon fontSize="large" />
            <Typography variant="h6" gutterBottom>
              Savings
            </Typography>
            <Typography variant="">
              Proin convallis id diam sed commodo vestibulum lobortis.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3} style={{ marginTop: "4em" }}>
        <Grid item xs={12} md={6} display="flex" alignItems="center">
          <Box
            component="img"
            src={image}
            alt="Overview Image"
            sx={{ width: "80%", borderRadius: 2, margin: "0 auto" }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box py={5}>
            <List>
              {OVERVIEW.map((overview) => (
                <ListItem key={overview.number}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: "#4A00E0", width: 24, height: 24 }}>
                      <Typography variant="body2" color="common.white">
                        {overview.number}
                      </Typography>
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={overview.title}
                    secondary={overview.description}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>
    </RootStyle>
  );
};

export default OverviewSection;
