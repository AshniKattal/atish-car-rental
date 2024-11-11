import { useSnackbar } from "notistack";
// @mui
import {
  Button,
  Stack,
  Card,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../../features/globalSlice";
import { useState } from "react";
import firebase from "firebase/compat";
import { auth } from "../../../../firebase";

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const user = firebase.auth().currentUser;

  const [newPassword, setNewPassword] = useState("");

  const resetPass = async () => {
    dispatch(setLoading(true));
    if (newPassword === "") {
      enqueueSnackbar("Please provide a new password", {
        variant: "error",
      });
      dispatch(setLoading(false));
    } else if (newPassword && newPassword?.length < 6) {
      enqueueSnackbar(
        "Please provide a password containing at least 6 characters",
        {
          variant: "error",
        }
      );
      dispatch(setLoading(false));
    } else {
      user
        .updatePassword(newPassword)
        .then(() => {
          // Update successful.
          enqueueSnackbar(
            "Password updated successfully. Please login again with your new password.",
            {
              variant: "success",
            }
          );
          setNewPassword("");
          dispatch(setLoading(false));
          auth.signOut();
        })
        .catch((error) => {
          enqueueSnackbar(
            `An error occured while updating password: ${error?.message || ""}`,
            {
              variant: "error",
            }
          );
          dispatch(setLoading(false));
        });
    }

    /*   if (s_email === '') {
      enqueueSnackbar(
        'Your email address has not yet been detected. Please login again to the website. May be there is a timeout.',
        {
          variant: 'error',
        }
      );
      dispatch(setLoading(false));
    } else {
      await auth
        .sendPasswordResetEmail(s_email)
        .then(() => {
          enqueueSnackbar('Reset url has been sent to you by email.');
          dispatch(setLoading(false));
        })
        .catch((error) => {
          enqueueSnackbar(`Error occured: ${error?.message}`);
          dispatch(setLoading(false));
        });
    } */
  };

  return (
    <Grid container justifyContent={"center"} alignItems={"center"}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={5}>
            <Typography>
              {/* A reset password email with a reset password link will be sent to the email below. Then you will need to
              click the url and reset your password. */}
              Please enter a new password
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              margin="normal"
              fullWidth
              name="newPassword"
              label="New password"
              type="text"
              id="newPassword"
              value={newPassword || ""}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() => resetPass()}
            >
              Submit
            </Button>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
