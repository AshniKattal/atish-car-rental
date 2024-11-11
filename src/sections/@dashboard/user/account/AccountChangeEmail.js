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
import db, { auth } from "../../../../firebase";

// ----------------------------------------------------------------------

export default function AccountChangeEmail() {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const user = firebase.auth().currentUser;

  const [newEmail, setNewEmail] = useState("");

  const resetEmail = async () => {
    dispatch(setLoading(true));
    if (newEmail === "") {
      enqueueSnackbar("Please provide a new email", {
        variant: "error",
      });
      dispatch(setLoading(false));
    } else {
      user
        .updateEmail(newEmail)
        .then(async () => {
          // Update successful.
          db.collection("users")
            .doc(user?.id)
            .set({ email: newEmail }, { merge: true })
            .then(() => {
              enqueueSnackbar(
                "Email updated successfully. Please login again with your new email.",
                {
                  variant: "success",
                }
              );
              setNewEmail("");
              dispatch(setLoading(false));
              auth.signOut();
            })
            .catch((error) => {
              enqueueSnackbar(
                `An error occured while updating email in collection users: ${
                  error?.message || ""
                }`,
                {
                  variant: "error",
                }
              );
              dispatch(setLoading(false));
            });
        })
        .catch((error) => {
          enqueueSnackbar(
            `An error occured while updating email: ${error?.message || ""}`,
            {
              variant: "error",
            }
          );
          dispatch(setLoading(false));
        });
    }
  };

  return (
    <Grid container justifyContent={"center"} alignItems={"center"}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={5}>
            <Typography>
              {/* A reset password email with a reset password link will be sent to the email below. Then you will need to
              click the url and reset your password. */}
              Please enter a new email
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              margin="normal"
              fullWidth
              name="newEmail"
              label="New Email"
              type="text"
              id="newEmail"
              value={newEmail || ""}
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() => resetEmail()}
            >
              Submit
            </Button>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
