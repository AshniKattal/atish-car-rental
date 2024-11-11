import * as Yup from "yup";
import PropTypes from "prop-types";
// form
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { styled } from "@mui/material/styles";
import {
  Button,
  Stack,
  Rating,
  Typography,
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import { FormProvider, RHFTextField } from "../../../../components/hook-form";
import { useDispatch } from "react-redux";
import { setLoading } from "src/features/globalSlice";
import { useSnackbar } from "notistack";
import db from "src/firebase";
import { getServiceList } from "src/components/core-functions/CoreFunctions";
import { setServiceDetails, setServicesList } from "src/redux/slices/service";
import useAuth from "src/hooks/useAuth";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

// ----------------------------------------------------------------------

ProductDetailsReviewForm.propTypes = {
  onClose: PropTypes.func,
  id: PropTypes.string,
};

export default function ProductDetailsReviewForm({
  onClose,
  id,
  product,
  ...other
}) {
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const ReviewSchema = Yup.object().shape({
    rating: Yup.mixed().required("Rating is required"),
    review: Yup.string().required("Review is required"),
  });

  const defaultValues = {
    rating: null,
    review: "",
  };

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(setLoading(true));

      let ratingsList = [...(product?.ratings || [])];

      ratingsList.push({
        id: user?.id,
        rating: values.rating,
        review: values.review,
      });

      let totalRatingCal = 0;

      totalRatingCal =
        Number(product?.totalRating || 0) + Number(values?.rating || 0);

      totalRatingCal = totalRatingCal / ratingsList?.length;

      await db
        .collection("services")
        .doc(product?.id)
        .set(
          {
            ratings: ratingsList,
            totalRating: totalRatingCal,
            totalReview: ratingsList?.length || 0,
          },
          { merge: true }
        )
        .then(async () => {
          enqueueSnackbar("Service updated successfully");

          let servicesListResult = await getServiceList();

          if (servicesListResult) {
            dispatch(setServicesList(servicesListResult));

            let newServiceDetails = servicesListResult.find(
              (service) => service.id === product.id
            );
            dispatch(setServiceDetails({ ...newServiceDetails }));
          }

          reset();
          onClose();
          dispatch(setLoading(false));
        })
        .catch((error) => {
          enqueueSnackbar(
            `Error occured while updating service: ${error?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    } catch (error) {
      console.error(error);
    }
  };

  const onCancel = () => {
    onClose();
    reset();
  };

  return (
    <RootStyle {...other} id={id}>
      <Typography variant="subtitle1" gutterBottom>
        Add Review
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <div>
            <Stack
              direction="row"
              flexWrap="wrap"
              alignItems="center"
              spacing={1.5}
            >
              <Typography variant="body2">
                Your review about this product:
              </Typography>

              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <Rating {...field} value={Number(field.value)} />
                )}
              />
            </Stack>
            {!!errors.rating && (
              <FormHelperText error> {errors.rating?.message}</FormHelperText>
            )}
          </div>

          <RHFTextField name="review" label="Review *" multiline rows={3} />

          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            <Button color="inherit" variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Post review
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </RootStyle>
  );
}
