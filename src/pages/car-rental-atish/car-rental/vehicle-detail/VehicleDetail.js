import { Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import Page from "src/components/Page";
import TableCRUDTemplate from "src/components/table/TableCRUDTemplate";
import { setLoading } from "src/features/globalSlice";
import db from "src/firebase";
import { PATH_DASHBOARD } from "src/routes/paths";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import useSettings from "src/hooks/useSettings";

const CreateUpdateVehicleDialog = lazy(() =>
  import("./CreateUpdateVehicleDialog")
);

const headers = [
  { id: "list", label: "List" },
  { id: "update", label: "Update" },
  { id: "delete", label: "Delete" },
  { id: "featuredImage", label: "Featured Image" },
  { id: "name", label: "Name" },
  { id: "dateTimeCreated", label: "Date time created" },
  { id: "categoryDisplay", label: "Category" },
  { id: "plateNumber", label: "Plate number" },
  { id: "price", label: "Price" },
  { id: "passengers", label: "Passengers" },
  { id: "luggage", label: "Luggage" },
  { id: "doors", label: "Doors" },
  { id: "transmission", label: "Transmission" },
  { id: "airConditioning", label: "Air conditioning" },
];

export default function VehicleDetail() {
  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const temp_initialiseVehiclesRef = useRef();

  const [lastVisibleId, set_lastVisibleId] = useState("");

  const [rows, setRows] = useState([]);

  const [vehicleDetails, setVehicleDetails] = useState(null);

  const [dialogType, setDialogType] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    temp_initialiseVehiclesRef.current();
  }, []);

  const initialiseVehicles = async () => {
    dispatch(setLoading(true));

    const limit = 50;

    await db
      .collection(process.env.REACT_APP_COLLECTION_VEHICLES)
      .limit(limit)
      .get()
      .then((result) => {
        if (result?.docs && result?.docs?.length > 0) {
          let arr = [];

          result?.docs.forEach((doc) => {
            arr.push({
              id: doc.id,
              data: { ...doc?.data() },
              featuredImage: doc?.data()?.featuredImage || [],
              name: doc?.data()?.name || "",
              dateTimeCreated: doc?.data()?.dateTimeCreated || "",
              categoryDisplay: JSON.stringify(
                doc?.data()?.serviceCategory || []
              ),
              serviceCategory: doc?.data()?.serviceCategory || [],
              plateNumber: doc?.data()?.plateNumber || "",
              price: doc?.data()?.price || 0,
              passengers: doc?.data()?.passengers || 0,
              luggage: doc?.data()?.luggage || 0,
              doors: doc?.data()?.doors || 0,
              transmission: doc?.data()?.transmission || null,
              airConditioning: doc?.data()?.airConditioning || false,
            });
          });

          if (result?.docs?.length === limit) {
            let lastDocId = result?.docs[result?.docs?.length - 1]?.id || "";
            set_lastVisibleId(lastDocId);
          } else {
            set_lastVisibleId("");
          }

          setRows(arr);
          dispatch(setLoading(false));
        } else {
          setRows([]);
          dispatch(setLoading(false));
        }
      })
      .catch((error) => {
        enqueueSnackbar(
          `Error occured while retrieving vehicles: ${error?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  };

  temp_initialiseVehiclesRef.current = initialiseVehicles;

  async function handleLoadMore() {
    dispatch(setLoading(true));

    const limit = 50;

    await db
      .collection(process.env.REACT_APP_COLLECTION_VEHICLES)
      .startAfter(lastVisibleId)
      .limit(limit)
      .get()
      .then((result) => {
        if (result?.docs && result?.docs?.length > 0) {
          let arr = [];

          result?.docs.forEach((doc) => {
            arr.push({
              id: doc.id,
              ...doc?.data(),
            });
          });

          if (result?.docs?.length === limit) {
            let lastDocId = result?.docs[result?.docs?.length - 1]?.id || "";
            set_lastVisibleId(lastDocId);
          } else {
            set_lastVisibleId("");
          }

          setRows(arr);
          dispatch(setLoading(false));
        } else {
          setRows([]);
          dispatch(setLoading(false));
        }
      })
      .catch((error) => {
        enqueueSnackbar(
          `Error occured while retrieving more vehicles: ${error?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  }

  function handleCloseDialog() {
    setVehicleDetails(null);
    setDialogType(null);
    setOpenDialog(false);
  }

  const addBtnFunc = () => {
    setDialogType("add");
    setOpenDialog(true);
    setVehicleDetails({
      featuredImage: "",
      name: "",
      dateTimeCreated: "",
      serviceCategory: [],
      plateNumber: "",
      price: "",
      passengers: "",
      luggage: "",
      doors: "",
      transmission: null,
      airConditioning: "",
    });
  };

  const updateBtnFunc = (id, data) => {
    setDialogType("update");
    setOpenDialog(true);
    setVehicleDetails({
      id: id,
      featuredImage: data?.featuredImage || "",
      name: data?.name || "",
      dateTimeCreated: data?.dateTimeCreated || "",
      serviceCategory: data?.serviceCategory || [],
      plateNumber: data?.plateNumber || "",
      price: data?.price || "",
      passengers: data?.passengers || "",
      luggage: data?.luggage || "",
      doors: data?.doors || "",
      transmission: data?.transmission || null,
      airConditioning: data?.airConditioning || "",
    });
  };

  const deleteBtnFunc = async (id) => {
    dispatch(setLoading(true));

    await db
      .collection(process.env.REACT_APP_COLLECTION_VEHICLES)
      .doc(id)
      .delete()
      .then(() => {
        enqueueSnackbar("Row deleted successfully");
        initialiseVehicles();
        dispatch(setLoading(false));
      })
      .catch((error) => {
        enqueueSnackbar(
          `Error occured while deleting company: ${error?.message}`,
          {
            variant: "error",
          }
        );
        dispatch(setLoading(false));
      });
  };

  return (
    <Page title="Vehicle Booking">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Stack spacing={3} direction="row" alignItems={"center"}>
              <Button
                startIcon={<KeyboardBackspaceIcon />}
                variant="outlined"
                color="primary"
                onClick={() => navigate(PATH_DASHBOARD.general.app1)}
              >
                Back
              </Button>
              <Typography variant="h4">{`Vehicle list section`}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <Suspense fallback={<p></p>}>
              <TableCRUDTemplate
                type="vehicles"
                headers={headers}
                aCollection={rows}
                addBtnDisplay={true}
                addBtnLabel={"Create a vehicle"}
                addBtnFunc={addBtnFunc}
                openDialog={openDialog}
                handleCloseDialog={handleCloseDialog}
                emptyColMsg={
                  "Sorry, not a single vehicle has been created yet. Please create a vehicle."
                }
                updateBtnDisplay={true}
                deleteBtnDisplay={true}
                updateBtnFunc={updateBtnFunc}
                deleteBtnFunc={deleteBtnFunc}
              />
            </Suspense>
          </Grid>
        </Grid>

        {openDialog && (
          <Suspense fallback={<p></p>}>
            <CreateUpdateVehicleDialog
              openDialog={openDialog}
              handleCloseDialog={handleCloseDialog}
              vehicleDetails={vehicleDetails}
              setVehicleDetails={setVehicleDetails}
              initialiseVehicles={initialiseVehicles}
              dialogType={dialogType}
            />
          </Suspense>
        )}
      </Container>
    </Page>
  );
}
