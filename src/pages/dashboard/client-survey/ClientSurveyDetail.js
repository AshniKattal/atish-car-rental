import {
  Autocomplete,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCompanyList } from "src/features/companySlice";
import {
  selectDocument,
  setClientList,
  setCompanyDetails,
  setCompanyIdSelected,
} from "src/features/documentSlice";
import { setLoading } from "src/features/globalSlice";
import db from "src/firebase";
import moment from "moment";
import CreateClientDialog from "../manage-client/CreateClientDialog";
import { DatePicker } from "@mui/lab";
import firebase from "firebase/compat";
import { dynamicSortDesc } from "src/components/core-functions/SelectionCoreFunctions";
import useAuth from "src/hooks/useAuth";
import useSettings from "src/hooks/useSettings";
import Page from "src/components/Page";

const TableCRUDTemplate = lazy(() =>
  import("src/components/table/TableCRUDTemplate")
);
const CreateOrUpdateClientSurveyDialog = lazy(() =>
  import("./CreateOrUpdateClientSurveyDialog")
);

export default function ClientSurveyDetail() {
  const { themeStretch } = useSettings();

  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const temp_fetchDataRef = useRef();

  const { companyDetails, clientList } = useSelector(selectDocument);

  const { companyList } = useSelector(selectCompanyList);

  const [documentType, setDocumentType] = useState(null);

  const [surveyList, setSurveyList] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);

  const [dialogType, setDialogType] = useState("");

  const [us_new_client_dlg, set_us_new_client_dlg] = useState(false);

  // Calculate the from date to be 5 months before today
  const initialDate = new Date();
  initialDate.setMonth(initialDate.getMonth() - 5);

  // Set up useState with the from date
  const [us_fromDate, set_us_fromDate] = useState(initialDate);

  const [us_ToDate, set_us_ToDate] = useState(new Date());

  const [logo, setLogo] = useState("");

  const temp_logo_image_ref = useRef();

  const temp_checkPermission_ref = useRef();

  const [viewPermissionGranted, setViewPermissionGranted] = useState(false);

  useEffect(() => {
    temp_checkPermission_ref.current();
  }, [companyDetails]);

  function checkPermission() {
    if (companyDetails && companyDetails?.id) {
      if (
        !user?.permissions?.viewAllClientSurveyChk?.assignedCompanyId?.includes(
          companyDetails?.id
        )
      ) {
        enqueueSnackbar(
          "You do not have the permission to view this custom feature for this company",
          { variant: "error" }
        );

        setViewPermissionGranted(false);
      } else {
        setViewPermissionGranted(true);
      }
    }
  }

  temp_checkPermission_ref.current = checkPermission;

  const [clientDetails, setClientDetails] = useState({
    id: "",
    companyRefId: companyDetails?.id || "",
    companyRefName: (companyDetails && companyDetails?.name) || "",
    name: "",
    companyType: "",
    tan: "",
    address: "",
    contactNumber: "",
    email: "",
    brn: "",
    nic: "",
  });

  const [surveyDetail, setSurveyDetail] = useState({
    surveyNumber: "",
    customerName: "",
    address: "",
    email: "",
    phone: "",

    time: "",
    controlOf: {
      ants: false,
      geckos: false,
      lizard: false,
      spiders: false,
      rodent: false,
      woodworm: false,
      pigeon: false,
      cockroaches: false,
      fleas: false,
      mosquitoes: false,
      bedbugs: false,
      termite: false,
      snake: false,
    },
    otherControlOf: "",
    infestation: {
      slight: false,
      moderate: false,
      severe: false,
    },
    infestationNote: "",
    typeOfCockroach: "",
    typeOfTermite: "",
    typeOfTermiteBait: "",
    typeOfTermiteTotal: "",

    solTreatmentmeter: "",
    solTreatmentFt: "",
    solTreatmentUnitPrice: "",
    solTreatmentTotal: "",

    controlVector: {
      fumigation: false,
      mistingControl: false,
      lightSpraying: false,
    },

    locationTreated: {
      house: false,
      restaurant: false,
      villa: false,
      shop: false,
      stroes: false,
      snack: false,
      school: false,
    },
    otherLocationTreated: "",

    rodentBox: "",
    recommendation: {
      contratOneYear: false,
      serviceOneOff: false,
    },

    evaluationPieces: "",
    estimateAmount: "",

    preparedBy: "",
    preparedByName: "",

    clientSig: "",
    clientSigName: "",

    // service report new requirements
    serviceCarriesAt: "",
    timeIn: "",
    timeOut: "",
    routine: {
      complaint: "",
      job: "",
      initialFlushOut: "",
      spotCheck: "",
    },
    findings: "",
    recommendationServiceReport: "",
    technicianSig: "",

    signatureDate: "",
  });

  const headers = [
    { id: "list", label: "List" },
    { id: "view", label: "View" },
    { id: "update", label: "Update" },
    { id: "delete", label: "Delete" },
    { id: "dateCreated", label: "Date created" },
    { id: "id", label: `${documentType?.title} Number` },
    { id: "customerName", label: "Customer" },
    { id: "status", label: "Status" },
    { id: "viewDownloadPdf", label: "PDF" },
    { id: "sendEmail", label: "Send email to client" },
  ];

  useEffect(() => {
    temp_logo_image_ref.current();
  }, [companyDetails]);

  useEffect(() => {
    temp_fetchDataRef.current();
  }, [companyDetails, documentType, us_fromDate, us_ToDate]);

  async function getLogoImage() {
    if (
      companyDetails?.data?.imageUrl &&
      companyDetails?.data?.imageUrl !== ""
    ) {
      dispatch(setLoading(true));
      let logoImage = await toDataUrl(companyDetails?.data?.imageUrl);
      setLogo(logoImage);
      dispatch(setLoading(false));
    }
  }

  temp_logo_image_ref.current = getLogoImage;

  /*  async function getSignatureImage() {
    if (companyDetails?.data?.sigUrl && companyDetails?.data?.sigUrl !== "") {
      dispatch(setLoading(true));
      let sigImage = await toDataUrl(companyDetails?.data?.sigUrl);
      setSigClientImage(sigImage);
    }
  }

  temp_signature_image_client_ref.current = getSignatureImage; */

  async function toDataUrl(url) {
    if (url === "") {
      return "";
    } else {
      try {
        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
          };
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  const fetchData = () => {
    if (companyDetails && documentType && us_fromDate && us_ToDate) {
      fetchClientSurvey(companyDetails.id, documentType?.id);
    }
  };

  temp_fetchDataRef.current = fetchData;

  async function initializeClientList(companyId) {
    await db
      .collection("company")
      .doc(process.env.REACT_APP_COMPANY_ID)
      .collection("client")
      .orderBy("name", "asc")
      .get()
      .then((queryDocs) => {
        if (queryDocs?.docs?.length > 0) {
          let arr = [];
          queryDocs?.docs.forEach((doc) => {
            arr.push({
              id: doc?.id,
              name: doc?.data()?.name,
              data: { ...doc?.data() },
            });
          });

          dispatch(setClientList(arr));
          dispatch(setLoading(false));
        } else {
          dispatch(setClientList([]));
          dispatch(setLoading(false));
        }
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while fetching clients: ${err?.message}`
        );
        dispatch(setLoading(false));
      });
  }

  const handleSelectChange = async (e, value, reason, type) => {
    e.preventDefault();
    if (reason !== "removeOption" && reason !== "clear" && value) {
      if (type === "company") {
        // redux company id
        dispatch(setCompanyIdSelected(value.id));

        // redux company object
        dispatch(setCompanyDetails(value));

        initializeClientList(value.id);
      } else if (type === "documentType") {
        setDocumentType(value);
      }
    } else if (reason === "removeOption" || reason === "clear") {
      if (type === "company") {
        // reset company id
        dispatch(setCompanyIdSelected(undefined));

        // reset company details
        dispatch(setCompanyDetails(null));

        dispatch(setClientList([]));
      } else if (type === "documentType") {
        setDialogType(null);
      }
    }
  };

  const fetchClientSurvey = async (companyId, collectionName) => {
    if (new Date(us_fromDate) > new Date(us_ToDate)) {
      enqueueSnackbar(`Date incorrect. To Date cannot be before From Date.`, {
        variant: "error",
      });
      dispatch(setLoading(false));
    } else {
      dispatch(setLoading(true));
      const startDateISOString = us_fromDate.toISOString();
      const startDateStringSplit = startDateISOString.split("T");

      const endDateISOString = us_ToDate.toISOString();
      const endDateStringSplit = endDateISOString.split("T");

      const startDate = new Date(`${startDateStringSplit[0]}T00:00:00.000Z`); // The start date of the range
      const endDate = new Date(`${endDateStringSplit[0]}T23:59:59.000Z`); // The end date of the range

      await db
        .collection("company")
        .doc(companyId)
        .collection(collectionName)
        .where(
          "dateCreated",
          ">=",
          firebase.firestore.Timestamp.fromDate(startDate)
        )
        .where(
          "dateCreated",
          "<=",
          firebase.firestore.Timestamp.fromDate(endDate)
        )
        .get()
        .then((result) => {
          if (result?.docs && result?.docs?.length > 0) {
            let arr = [];
            result?.docs.forEach((doc) => {
              if (doc?.id !== "documentIndex") {
                arr.push({
                  data: { ...doc?.data() },
                  dateCreated: doc?.data()?.dateCreated
                    ? moment(doc?.data()?.dateCreated.toDate()).format(
                        "DD-MM-YYYY HH:mm:ss"
                      )
                    : "",
                  id: doc?.id,
                  customerName: doc?.data()?.customerName || "",
                  status: doc?.data()?.status || "Pending",
                  viewDownloadPdf: "",
                  sendEmail: "",
                });
              }
            });

            arr.sort(dynamicSortDesc("id"));

            setSurveyList(arr);
            dispatch(setLoading(false));
          } else {
            setSurveyList([]);
            dispatch(setLoading(false));
          }
        });
    }
  };

  const addBtnFunc = () => {
    setDialogType("add");
    setOpenDialog(true);
    setSurveyDetail({
      ...surveyDetail,
      id: "",
      surveyNumber: "",
      customerName: "",
      address: "",
      email: "",
      phone: "",
      serviceCarriesAt: "",
      time: "",
      controlOf: {
        ants: false,
        geckos: false,
        lizard: false,
        spiders: false,
        rodent: false,
        woodworm: false,
        pigeon: false,
        cockroaches: false,
        fleas: false,
        mosquitoes: false,
        bedbugs: false,
        termite: false,
        snake: false,
      },
      otherControlOf: "",
      infestation: {
        slight: false,
        moderate: false,
        severe: false,
      },
      infestationNote: "",
      typeOfCockroach: "",
      typeOfTermite: "",
      typeOfTermiteBait: "",
      typeOfTermiteTotal: "",

      solTreatmentmeter: "",
      solTreatmentFt: "",
      solTreatmentUnitPrice: "",
      solTreatmentTotal: "",

      controlVector: {
        fumigation: false,
        mistingControl: false,
        lightSpraying: false,
      },

      locationTreated: {
        house: false,
        restaurant: false,
        villa: false,
        shop: false,
        stroes: false,
        snack: false,
        school: false,
      },
      otherLocationTreated: "",

      rodentBox: "",
      recommendation: {
        contratOneYear: false,
        serviceOneOff: false,
      },

      evaluationPieces: "",
      estimateAmount: "",

      preparedBy: "",
      clientSigName: "",
      clientSig: "",

      signatureDate: "",
    });
  };

  const updateBtnFunc = (id, data) => {
    setDialogType("update");
    setOpenDialog(true);
    setSurveyDetail({
      ...data,
      id: id,
    });
  };

  const viewBtnFunc = (id, data) => {
    setDialogType("view");
    setOpenDialog(true);
    setSurveyDetail({
      ...data,
      id: id,
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSurveyDetail({
      surveyNumber: "",
      customerName: "",
      address: "",
      email: "",
      phone: "",
      serviceCarriesAt: "",
      time: "",
      controlOf: {
        ants: false,
        geckos: false,
        lizard: false,
        spiders: false,
        rodent: false,
        woodworm: false,
        pigeon: false,
        cockroaches: false,
        fleas: false,
        mosquitoes: false,
        bedbugs: false,
        termite: false,
        snake: false,
      },
      otherControlOf: "",
      infestation: {
        slight: false,
        moderate: false,
        severe: false,
      },
      infestationNote: "",
      typeOfCockroach: "",
      typeOfTermite: "",
      typeOfTermiteBait: "",
      typeOfTermiteTotal: "",

      solTreatmentmeter: "",
      solTreatmentFt: "",
      solTreatmentUnitPrice: "",
      solTreatmentTotal: "",

      controlVector: {
        fumigation: false,
        mistingControl: false,
        lightSpraying: false,
      },

      locationTreated: {
        house: false,
        restaurant: false,
        villa: false,
        shop: false,
        stroes: false,
        snack: false,
        school: false,
      },
      otherLocationTreated: "",

      rodentBox: "",
      recommendation: {
        contratOneYear: false,
        serviceOneOff: false,
      },

      evaluationPieces: "",
      estimateAmount: "",

      preparedBy: "",
      clientSigName: "",
      clientSig: "",

      signatureDate: "",
    });
  };

  const deleteBtnFunc = async (id) => {
    dispatch(setLoading(true));

    let collectionName = documentType.id;

    if (collectionName) {
      await db
        .collection("company")
        .doc(companyDetails?.id)
        .collection(collectionName)
        .doc(id)
        .delete()
        .then(async () => {
          fetchClientSurvey(companyDetails?.id, documentType?.id);
          dispatch(setLoading(false));
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while deleting ${documentType?.title || ""}: ${
              err?.message
            }`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  };

  const handleCloseClientDialog = () => {
    set_us_new_client_dlg(false);
  };

  return (
    <Page title="Bugs Be Gone custom">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Typography variant="h5">Bugs Be Gone Custom documents</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              ListboxProps={{ style: { maxHeight: "70vh" } }}
              size="small"
              label="Please choose a company"
              id="company-drop-down"
              options={companyList || []}
              value={companyDetails || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Please choose a company"
                  InputLabelProps={{ required: true }}
                />
              )}
              required
              onChange={(e, value, reason) =>
                handleSelectChange(e, value, reason, "company")
              }
              getOptionLabel={(option) => option?.name || ""}
            />
          </Grid>

          {companyDetails && viewPermissionGranted ? (
            <>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  ListboxProps={{ style: { maxHeight: "70vh" } }}
                  size="small"
                  label="Please choose type of document"
                  id="document-drop-down"
                  options={
                    (process.env.REACT_APP_DOCUMENT_TYPE_OPTIONS &&
                      JSON.parse(
                        process.env.REACT_APP_DOCUMENT_TYPE_OPTIONS
                      )) ||
                    []
                  }
                  value={documentType || null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Please choose type of document"
                      InputLabelProps={{ required: true }}
                    />
                  )}
                  required
                  onChange={(e, value, reason) =>
                    handleSelectChange(e, value, reason, "documentType")
                  }
                  getOptionLabel={(option) => option.title || ""}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => set_us_new_client_dlg(true)}
                >
                  Add new client
                </Button>
              </Grid>

              {documentType ? (
                <>
                  <Grid item xs={12} md={12}>
                    <hr />
                    <br />
                    <Typography>Please choose a date</Typography>
                  </Grid>

                  <Grid item xs={12} md={12} style={{ width: "100%" }}>
                    <Stack direction={"row"} spacing={3} alignItems={"center"}>
                      <DatePicker
                        label="From"
                        value={us_fromDate || ""}
                        onChange={(newValue) => {
                          set_us_fromDate(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} size="small" />
                        )}
                        inputFormat="dd/MM/yyyy"
                      />

                      <DatePicker
                        label="To"
                        value={us_ToDate || ""}
                        onChange={(newValue) => {
                          set_us_ToDate(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} size="small" />
                        )}
                        inputFormat="dd/MM/yyyy"
                      />
                    </Stack>
                  </Grid>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}

          {companyDetails && documentType ? (
            <>
              <Grid item xs={12} md={12}>
                <Suspense fallback={<p>Loading...</p>}>
                  <TableCRUDTemplate
                    companyId={companyDetails?.id}
                    type="survey"
                    headers={headers}
                    aCollection={surveyList}
                    viewOption={true}
                    viewBtnFunc={viewBtnFunc}
                    addBtnDisplay={true}
                    addBtnLabel={`Create new ${documentType?.title}`}
                    addBtnFunc={addBtnFunc}
                    openDialog={openDialog}
                    handleCloseDialog={handleCloseDialog}
                    emptyColMsg={`No ${documentType?.title} retrieved for the date range selected.`}
                    updateBtnDisplay={true}
                    deleteBtnDisplay={true}
                    updateBtnFunc={updateBtnFunc}
                    deleteBtnFunc={deleteBtnFunc}
                    documentType={documentType}
                    logo={logo}
                    companyDetails={companyDetails}
                    fetchClientSurvey={fetchClientSurvey}
                  />
                </Suspense>
              </Grid>
            </>
          ) : (
            <></>
          )}
        </Grid>

        {openDialog && (
          <Suspense fallback={<></>}>
            <CreateOrUpdateClientSurveyDialog
              dialogType={dialogType}
              openDialog={openDialog}
              handleCloseDialog={handleCloseDialog}
              surveyDetail={surveyDetail}
              setSurveyDetail={setSurveyDetail}
              fetchClientSurvey={fetchClientSurvey}
              companyId={companyDetails?.id}
              documentType={documentType}
              clientList={clientList}
              logo={logo}
              companyDetails={companyDetails}
            />
          </Suspense>
        )}

        {us_new_client_dlg && (
          <Suspense fallback={<p>Loading...</p>}>
            <CreateClientDialog
              companyId={companyDetails?.id}
              openDialog={us_new_client_dlg}
              handleCloseDialog={handleCloseClientDialog}
              clientDetails={clientDetails}
              setClientDetails={setClientDetails}
              initializeClientList={initializeClientList}
            />
          </Suspense>
        )}
      </Container>
    </Page>
  );
}
