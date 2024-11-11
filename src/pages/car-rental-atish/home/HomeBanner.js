import { Card, CardContent, Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { PATH_PAGE } from "src/routes/paths";

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: theme.spacing(15),
  [theme.breakpoints.up("md")]: {
    paddingBottom: theme.spacing(15),
  },
}));

export default function HomeBanner() {
  const navigate = useNavigate();

  return (
    <RootStyle>
      <Container maxWidth={"sm"}>
        <Grid container>
          <Grid item xs={12} md={12}>
            <Card
              sx={{ p: 3, cursor: "pointer" }}
              onClick={() => navigate(PATH_PAGE.services)}
            >
              <CardContent>
                <Typography align="center">Services</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
