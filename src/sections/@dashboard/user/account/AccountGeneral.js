import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useState, useCallback, useEffect } from "react";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Box, Grid, Card, Stack, Typography, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// hooks
import useAuth from "../../../../hooks/useAuth";
// utils
import { fData } from "../../../../utils/formatNumber";
// components
import {
  FormProvider,
  RHFTextField,
  RHFUploadAvatar,
} from "../../../../components/hook-form";
import db, { storage } from "../../../../firebase";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../../features/globalSlice";

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();

  const [us_file, set_us_file] = useState(null);

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().required("Email is required"),
  });

  const defaultValues = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    contactNumber: user?.contactNumber || "",
    photoURL: user?.photoURL || "",
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (user && setValue) {
      setValue("firstName", user?.firstName || "");
      setValue("lastName", user?.lastName || "");
      setValue("email", user?.email || "");
      setValue("contactNumber", user?.contactNumber || "");
      setValue("photoURL", user?.photoURL || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      db.collection("users")
        .doc(user?.id)
        .set(
          {
            firstName: data?.firstName || "",
            lastName: data?.lastName || "",
            email: data?.email || "",
            contactNumber: data?.contactNumber || "",
            // photoURL: data?.photoURL?.preview || '',
          },
          { merge: true }
        )
        .then(() => {
          enqueueSnackbar("Update success!");
        })
        .catch((err) => {
          enqueueSnackbar(`Error occured: ${err?.message}`, {
            variant: "error",
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        set_us_file(file);
        setValue(
          "photoURL",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const uploadImage = (o_file) => {
    if (o_file && o_file?.name !== undefined && o_file?.name !== "") {
      dispatch(setLoading(true));
      const uploadTask = storage
        .ref(`images/${user?.id}/${o_file.name}`)
        .put(o_file);
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          enqueueSnackbar(`Error occured: ${error}`, { variant: "error" });
          dispatch(setLoading(false));
        },
        () => {
          storage
            .ref(`images/${user?.id}`)
            .child(o_file.name)
            .getDownloadURL()
            .then((url) => {
              db.collection("users")
                .doc(user?.id)
                .set(
                  {
                    photoURL: url || "",
                  },
                  { merge: true }
                )
                .then(() => {
                  enqueueSnackbar("Image saved successfully");
                  set_us_file(null);
                  dispatch(setLoading(false));
                })
                .catch((err) => {
                  enqueueSnackbar(`Error occured: ${err?.message}`, {
                    variant: "error",
                  });
                  dispatch(setLoading(false));
                });
            });
        }
      );
    } else {
      enqueueSnackbar("Image uploaded could be identified", {
        variant: "error",
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: "center" }}>
            <RHFUploadAvatar
              name="photoURL"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: "auto",
                    display: "block",
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
            <br />
            <Button
              variant="contained"
              color="primary"
              disabled={us_file === null}
              onClick={() => uploadImage(us_file)}
            >
              Save image
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                },
              }}
            >
              <RHFTextField name="firstName" label="First name" />
              <RHFTextField name="lastName" label="Last name" />
              <RHFTextField name="email" label="Email Address" disabled />
              <RHFTextField name="contactNumber" label="Contact number" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
