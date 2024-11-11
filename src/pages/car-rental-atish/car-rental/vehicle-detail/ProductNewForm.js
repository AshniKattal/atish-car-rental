import PropTypes from "prop-types";
import * as Yup from "yup";

import { useCallback, useEffect, useMemo } from "react";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import {
  Card,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  InputAdornment,
  Button,
} from "@mui/material";
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
} from "../../../../components/hook-form";

// ----------------------------------------------------------------------

const TRANMISSION_OPTION = ["Automatic", "Manual"];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewForm({
  isEdit,
  currentProduct,
  addVehicle,
  updateVehicle,
  handleCloseDialog,
  setImagesListChanged,
}) {
  const serviceCategoryList = [
    {
      id: "category01",
      serviceName: "Small Compact",
    },
    {
      id: "category02",
      serviceName: "Saloon",
    },
    {
      id: "category03",
      serviceName: "4x4",
    },
    {
      id: "category04",
      serviceName: "7 Seater",
    },
    {
      id: "category05",
      serviceName: "SUV",
    },
  ];

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    featuredImage: Yup.array().min(
      1,
      "Featured images is required, at least one image"
    ),
    description: Yup.string().required("Description is required"),
    plateNumber: Yup.string().required("Plate number is required"),
    price: Yup.number().moreThan(0, "Price should not be 0"),
    passengers: Yup.number().moreThan(0, "Passengers should not be 0"),
    doors: Yup.number().moreThan(0, "Doors should not be 0"),
    // transmission: Yup.string().required("Transmission is required"),
  });

  const defaultValues = useMemo(
    () => ({
      featuredImage: currentProduct?.featuredImage || [],
      name: currentProduct?.name || "",
      description: currentProduct?.description || "",
      serviceCategory: currentProduct?.serviceCategory || [],
      plateNumber: currentProduct?.plateNumber || "",
      price: currentProduct?.price || 0,
      passengers: currentProduct?.passengers || 0,
      luggage: currentProduct?.luggage || false,
      doors: currentProduct?.doors || 0,
      transmission: currentProduct?.transmission || null,
      airConditioning: currentProduct?.airConditioning || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const { reset, watch, setValue, getValues, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const submitForm = async () => {
    if (isEdit) {
      updateVehicle(values);
    } else {
      addVehicle(values);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setImagesListChanged(true);

      let acceptedFilesList = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      let newFilesList = [
        ...(values.featuredImage || []),
        ...acceptedFilesList,
      ];

      setValue(
        "featuredImage",
        newFilesList
        /* newFilesList.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ) */
      );
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setImagesListChanged(true);
    setValue("featuredImage", []);
  };

  const handleRemove = (file) => {
    setImagesListChanged(true);
    const filteredItems = values.featuredImage?.filter(
      (_file) => _file?.preview !== file?.preview
    );
    setValue("featuredImage", filteredItems);
  };

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <RHFTextField name="name" label="Vehicle Name" />
        </Grid>

        <Grid item xs={12} md={12}>
          <Autocomplete
            ListboxProps={{ style: { maxHeight: "70vh" } }}
            size="small"
            label="Please choose a category"
            id="category-drop-down"
            options={serviceCategoryList}
            value={values?.serviceCategory || []}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Please choose a category"
                fullWidth
                size="large"
              />
            )}
            onChange={(e, value) => {
              setValue("serviceCategory", value);
            }}
            getOptionLabel={(option) => option.serviceName}
            multiple={true}
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <RHFTextField name="plateNumber" label="Plate number" />
        </Grid>

        <Grid item xs={12} md={12}>
          <div>
            <LabelStyle>Description</LabelStyle>
            <RHFEditor simple name="description" />
          </div>
        </Grid>

        <Grid item xs={12} md={12}>
          <div>
            <LabelStyle>Featured images</LabelStyle>
            <RHFUploadMultiFile
              name="featuredImage"
              showPreview
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
              onRemove={handleRemove}
              onRemoveAll={handleRemoveAll}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="price"
            label="Regular Price"
            placeholder="0.00"
            value={getValues("price") === 0 ? "" : getValues("price")}
            onChange={(event) => setValue("price", event.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {process.env.REACT_APP_CURRENCY_USED}
                </InputAdornment>
              ),
              type: "text",
            }}
          />
        </Grid>

        {/*    <Grid item xs={12} md={6}>
          <RHFSwitch name="taxes" label="Price includes taxes" />
        </Grid> */}

        <Grid item xs={12} md={6}>
          <RHFTextField name="passengers" label="Number of passenger seats" />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFSwitch name="luggage" label="Luggage" />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField name="doors" label="Number of doors" />
        </Grid>

        {/*   <Grid item xs={12} md={6}>
          <RHFSelect
            name="transmission"
            label="Transmission"
            value={values?.transmission || ""}
          >
            {TRANMISSION_OPTION.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </RHFSelect>
        </Grid>
 */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            ListboxProps={{ style: { maxHeight: "70vh" } }}
            size="small"
            label="Transmission"
            id="transmission-drop-down"
            options={TRANMISSION_OPTION}
            value={values?.transmission || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Transmission"
                fullWidth
                size="large"
              />
            )}
            onChange={(e, value, reason) => {
              if (reason !== "removeOption" && reason !== "clear" && value) {
                setValue("transmission", value);
              } else if (reason === "removeOption" || reason === "clear") {
                setValue("transmission", null);
              }
            }}
            getOptionLabel={(option) => option}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFSwitch name="airConditioning" label="Air conditioning" />
        </Grid>

        <Grid item xs={12} md={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="success"
                onClick={() => submitForm()}
                size="large"
                fullWidth
              >
                {!isEdit ? "Create Product" : "Save Changes"}
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleCloseDialog()}
                size="large"
                fullWidth
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
