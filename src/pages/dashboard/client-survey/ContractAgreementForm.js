import {
  Autocomplete,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import { FormProvider, RHFEditor } from "src/components/hook-form";
import SearchIcon from "@mui/icons-material/Search";
import SearchSurveyDialog from "./SearchSurveyDialog";

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle1,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const editableTextFieldsDefinitions = [
  {
    id: "customerName",
    label: "The Customer",
    sizeXs: 12,
    sizeMd: 12,
  },
  {
    id: "nic",
    label: "ID",
    sizeXs: 12,
    sizeMd: 4,
  },
  {
    id: "brn",
    label: "BRN",
    sizeXs: 12,
    sizeMd: 4,
  },
  {
    id: "tan",
    label: "VAT",
    sizeXs: 12,
    sizeMd: 4,
  },
  {
    id: "address",
    label: "Address",
    sizeXs: 12,
    sizeMd: 12,
  },
  {
    id: "contactNumber",
    label: "Phone number",
    sizeXs: 12,
    sizeMd: 6,
  },
  {
    id: "email",
    label: "Email address",
    sizeXs: 12,
    sizeMd: 6,
  },
  {
    id: "representative",
    label: "Representative",
    sizeXs: 12,
    sizeMd: 6,
  },
  {
    id: "designation",
    label: "Designation",
    sizeXs: 12,
    sizeMd: 6,
  },
  {
    id: "quoteRef",
    label: "Quote Ref",
    sizeXs: 12,
    sizeMd: 12,
  },
  {
    id: "siteAddress",
    label: "Site address",
    sizeXs: 12,
    sizeMd: 12,
  },
];

const editableTextFieldsPeriodOfContract = [
  {
    id: "commencementPeriod",
    label: "Commencement period",
    sizeXs: 12,
    sizeMd: 12,
  },
  {
    id: "terms",
    label: "Terms",
    sizeXs: 12,
    sizeMd: 12,
  },
  {
    id: "serviceType",
    label: "Service type",
    sizeXs: 12,
    sizeMd: 12,
  },
  {
    id: "noOfIntervention",
    label: "No. of intervention:",
    sizeXs: 12,
    sizeMd: 12,
  },
  {
    id: "installationRequirement",
    label: "Installation requirement",
    sizeXs: 12,
    sizeMd: 12,
  },
  {
    id: "additional",
    label: "Additionals",
    sizeXs: 12,
    sizeMd: 12,
  },
];

const editableTextFieldsCost = [
  {
    id: "annualTotalAmt",
    label: "Annual Total amount",
    sizeXs: 12,
    sizeMd: 12,
  },
  {
    id: "termsOfPayment",
    label: "Terms of Payment",
    sizeXs: 12,
    sizeMd: 12,
  },
];

const editableTextFieldsDefinitionOfTreatment = [
  {
    id: "treatmentDefinition",
    label: "Description of treatment",
    sizeXs: 12,
    sizeMd: 12,
  },

  /*   {
    id: "specialMentions",
    label: "Special mentions",
    sizeXs: 12,
    sizeMd: 12,
  }, */
];

export default function ContractAgreementForm({
  clientList,
  clientDocumentObjectSelected,
  setClientDocumentObjectSelected,
  companyId,
  dialogType,
  surveyDetail,
  setSurveyDetail,
  logo,
  companyDetails,
}) {
  const temp_richTextChangeRef = useRef();

  const [openSearchSurveyDialog, setOpenSearchSurveyDialog] = useState(false);

  const NewProductSchema = Yup.object().shape({
    treatmentDefinition: Yup.string().required(
      "Description of treatment is required"
    ),
    specialMentions: Yup.string().required("Special mentions is required"),
  });

  const defaultValues = useMemo(
    () => ({
      treatmentDefinition:
        dialogType === "update" || dialogType === "view"
          ? surveyDetail?.treatmentDefinition
          : "",
      specialMentions:
        dialogType === "update" || dialogType === "view"
          ? surveyDetail?.specialMentions
          : "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const { watch, setValue } = methods;

  const values = watch();

  useEffect(() => {
    temp_richTextChangeRef.current();
  }, [values.treatmentDefinition, values.specialMentions]);

  function richTextChange() {
    if (values && values.treatmentDefinition) {
      setSurveyDetail((previous) => {
        return {
          ...previous,
          treatmentDefinition: values.treatmentDefinition,
        };
      });
    } else if (values && values.treatmentDefinition === "") {
      setSurveyDetail((previous) => {
        return {
          ...previous,
          treatmentDefinition: "",
        };
      });
    }

    if (values && values.specialMentions) {
      setSurveyDetail((previous) => {
        return {
          ...previous,
          specialMentions: values.specialMentions,
        };
      });
    } else if (values && values.specialMentions === "") {
      setSurveyDetail((previous) => {
        return {
          ...previous,
          specialMentions: "",
        };
      });
    }
  }

  temp_richTextChangeRef.current = richTextChange;

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenSearchSurveyDialog(true)}
            size="large"
            startIcon={<SearchIcon />}
          >
            Search existing Survey
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <Autocomplete
            ListboxProps={{ style: { maxHeight: "70vh" } }}
            size="small"
            label="Please choose a client"
            id="client-drop-down"
            options={clientList || []}
            value={clientDocumentObjectSelected || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Please choose a client"
                size="large"
              />
            )}
            onChange={(e, value, reason) => {
              e.preventDefault();
              if (reason !== "removeOption" && reason !== "clear" && value) {
                let phoneText = "";
                if (value?.data?.contactNumber && value?.data?.mobileNumber) {
                  phoneText = `${value?.data?.contactNumber} / ${value?.data?.mobileNumber}`;
                } else {
                  phoneText =
                    value?.data?.contactNumber ||
                    value?.data?.mobileNumber ||
                    "";
                }

                setSurveyDetail((prev) => {
                  return {
                    ...prev,
                    customerName: value?.data?.name || "",
                    clientSigName: value?.data?.name || "",
                    address: value?.data?.address || "",
                    email: value?.data?.email || "",
                    phone: phoneText || "",
                  };
                });

                setClientDocumentObjectSelected(value);
              } else if (reason === "removeOption" || reason === "clear") {
                setSurveyDetail((prev) => {
                  return {
                    ...prev,
                    customerName: "",
                    clientSigName: "",
                    address: "",
                    email: "",
                    phone: "",
                  };
                });

                setClientDocumentObjectSelected(null);
              }
            }}
            getOptionLabel={(option) => option?.name || ""}
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <Typography variant="h5">Definitions</Typography>
        </Grid>

        {editableTextFieldsDefinitions &&
          editableTextFieldsDefinitions?.map((inputField, index) => (
            <Grid
              item
              xs={inputField?.sizeXs}
              md={inputField?.sizeMd}
              key={index}
            >
              <TextField
                variant="outlined"
                name={inputField?.id}
                label={inputField?.label}
                id={inputField?.id}
                type="text"
                value={surveyDetail[inputField?.id] || ""}
                size="large"
                fullWidth
                onChange={(event) => {
                  setSurveyDetail((previous) => {
                    return {
                      ...previous,
                      [inputField?.id]: event.target.value,
                    };
                  });
                }}
                disabled={dialogType === "view"}
              />
            </Grid>
          ))}

        <Grid item xs={12} md={12}>
          <br />
          <Divider />
          <br />
          <Typography variant="h5">
            Period of Contract and frequency of Services
          </Typography>
        </Grid>

        {editableTextFieldsPeriodOfContract &&
          editableTextFieldsPeriodOfContract?.map((inputField, index) => (
            <Grid
              item
              xs={inputField?.sizeXs}
              md={inputField?.sizeMd}
              key={index}
            >
              <TextField
                variant="outlined"
                name={inputField?.id}
                label={inputField?.label}
                id={inputField?.id}
                type="text"
                value={surveyDetail[inputField?.id] || ""}
                size="large"
                fullWidth
                onChange={(event) => {
                  setSurveyDetail((previous) => {
                    return {
                      ...previous,
                      [inputField?.id]: event.target.value,
                    };
                  });
                }}
                disabled={dialogType === "view"}
              />
            </Grid>
          ))}

        <Grid item xs={12} md={12}>
          <br />
          <Divider />
          <br />
          <Typography variant="h5">Cost</Typography>
        </Grid>

        {editableTextFieldsCost &&
          editableTextFieldsCost?.map((inputField, index) => (
            <Grid
              item
              xs={inputField?.sizeXs}
              md={inputField?.sizeMd}
              key={index}
            >
              <TextField
                variant="outlined"
                name={inputField?.id}
                label={inputField?.label}
                id={inputField?.id}
                type="text"
                value={surveyDetail[inputField?.id] || ""}
                size="large"
                fullWidth
                onChange={(event) => {
                  setSurveyDetail((previous) => {
                    return {
                      ...previous,
                      [inputField?.id]: event.target.value,
                    };
                  });
                }}
                disabled={dialogType === "view"}
              />
            </Grid>
          ))}

        <Grid item xs={12} md={12}>
          <br />
          <Divider />
          <br />
          <Typography variant="h5">Description of treatment</Typography>
        </Grid>

        <Grid item xs={12} md={12}>
          <FormProvider methods={methods}>
            <Grid container spacing={3}>
              {editableTextFieldsDefinitionOfTreatment &&
                editableTextFieldsDefinitionOfTreatment?.map(
                  (inputField, index) => (
                    <Grid
                      item
                      xs={inputField?.sizeXs}
                      md={inputField?.sizeMd}
                      key={index}
                    >
                      <LabelStyle>{inputField?.label}</LabelStyle>
                      <RHFEditor
                        simple={false}
                        name={inputField?.id}
                        disabled={dialogType === "view"}
                      />
                    </Grid>
                  )
                )}
            </Grid>
          </FormProvider>
        </Grid>
      </Grid>

      {openSearchSurveyDialog && (
        <SearchSurveyDialog
          companyId={companyId}
          open={openSearchSurveyDialog}
          setOpen={setOpenSearchSurveyDialog}
          title="Survey"
          collectionName="survey"
          logo={logo}
          companyDetails={companyDetails}
          setSurveyDetail={setSurveyDetail}
          setValue={setValue}
        />
      )}
    </>
  );
}
