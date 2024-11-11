import { m } from "framer-motion";
import { Card, Grid, Stack, Typography } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { varFade } from "src/components/animate";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";

export default function BugsBeGoneCustomCheckboxManagementSections() {
  const navigate = useNavigate();

  return (
    <Grid item xs={12} md={4}>
      <m.div variants={varFade().inUp} className="cardDiv">
        <Card
          className="cardContainer clickable"
          onClick={() => {
            navigate(PATH_DASHBOARD.general.bugsBeGoneCheckboxManagement);
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h6">BugsBeGone CheckBox Management</Typography>

            <Stack spacing={1} direction={"row"} alignItems={"flex-start"}>
              <PlayCircleOutlineIcon />
              <Typography variant="body1">
                Manage Control of, Infestation, Control vector and Location
                Treated
              </Typography>
            </Stack>
          </Stack>
        </Card>
      </m.div>
    </Grid>
  );
}
