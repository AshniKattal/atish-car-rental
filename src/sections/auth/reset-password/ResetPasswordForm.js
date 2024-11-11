// @mui
import { Button, Stack, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../features/globalSlice";
import { auth } from "../../../firebase";

// ----------------------------------------------------------------------

export default function ResetPasswordForm() {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [us_s_email, set_us_s_email] = useState("");

  const resetPassword = async () => {
    dispatch(setLoading(true));
    if (us_s_email !== "") {
      await auth
        .sendPasswordResetEmail(us_s_email)
        .then(() => {
          enqueueSnackbar("Reset url has been sent to you by email.");
          dispatch(setLoading(false));
        })
        .catch((error) => {
          enqueueSnackbar(`Error occured: ${error?.message}`);
          dispatch(setLoading(false));
        });
    } else {
      enqueueSnackbar("Email is required", { variant: "error" });
      dispatch(setLoading(false));
    }
  };

  return (
    <Stack spacing={3}>
      <TextField
        fullWidth
        variant="outlined"
        required
        id="email"
        name="email"
        type="text"
        value={us_s_email || ""}
        label="Email address"
        onChange={(event) => set_us_s_email(event.target.value)}
      />

      <Button
        fullWidth
        size="large"
        variant="contained"
        onClick={() => resetPassword()}
      >
        Reset Password
      </Button>
    </Stack>
  );
}
