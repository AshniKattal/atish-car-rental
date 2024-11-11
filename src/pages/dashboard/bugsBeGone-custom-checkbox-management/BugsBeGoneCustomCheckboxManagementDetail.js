import {
  Autocomplete,
  Container,
  Grid,
  TableContainer,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobal, setLoading } from "src/features/globalSlice";
import db from "src/firebase";

const TableCRUDTemplate = lazy(() =>
  import("src/components/table/TableCRUDTemplate")
);
const CreateOrUpdateCheckboxDialog = lazy(() =>
  import("./CreateOrUpdateCheckboxDialog")
);

export default function BugsBeGoneCustomCheckboxManagementDetail() {
  const dispatch = useDispatch();

  const { loading } = useSelector(selectGlobal);

  const { enqueueSnackbar } = useSnackbar();

  const temp_fetchRowsRef = useRef();

  const collectionOptions = [
    { collectionName: "controlof", title: "Control Of" },
    { collectionName: "infestation", title: "Infestation" },
    { collectionName: "controlvector", title: "Control Vector" },
    { collectionName: "locationtreated", title: "Location Treated" },
    { collectionName: "recommendation", title: "Recommendation" },
    { collectionName: "routine", title: "Routine" },
  ];

  const [collectionSelected, setCollectionSelected] = useState(null);

  const [rows, setRows] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);

  const [dialogType, setDialogType] = useState("");

  const [rowDetail, setRowDetail] = useState({
    title: "",
    name: "",
  });

  const headers = [
    { id: "list", label: "List" },
    { id: "update", label: "Update" },
    { id: "delete", label: "Delete" },
    { id: "title", label: "Title" },
    { id: "name", label: "Name Id" },
  ];

  useEffect(() => {
    temp_fetchRowsRef.current();
  }, [collectionSelected]);

  const fetchRows = async () => {
    if (collectionSelected) {
      dispatch(setLoading(true));

      await db
        .collection("company")
        .doc(process.env.REACT_APP_CUSTOM_BUGSBEGONE_ID)
        .collection(collectionSelected?.collectionName)
        .orderBy("title")
        .get()
        .then((result) => {
          if (result?.docs?.length > 0) {
            let arr = [];
            result?.docs.forEach((doc) => {
              arr.push({
                id: doc?.id,
                data: { ...doc?.data() },
                title: doc?.data()?.title || "",
                name: doc?.data()?.name || "",
              });
            });
            setRows(arr);
            dispatch(setLoading(false));
          } else {
            setRows([]);
            dispatch(setLoading(false));
          }
        })
        .catch((error) => {
          enqueueSnackbar(
            `Error occured while fetching rows: ${error?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  };

  temp_fetchRowsRef.current = fetchRows;

  const addBtnFunc = () => {
    setDialogType("add");
    setOpenDialog(true);
    setRowDetail({
      ...rowDetail,
      id: "",
      title: "",
      name: "",
    });
  };

  const updateBtnFunc = (id, data) => {
    setDialogType("update");
    setOpenDialog(true);
    setRowDetail({
      ...data,
      id: id,
    });
  };

  const handleCloseDialog = () => {
    setDialogType("");
    setOpenDialog(false);
    setRowDetail({
      title: "",
      name: "",
    });
  };

  const deleteBtnFunc = async (id) => {
    dispatch(setLoading(true));

    await db
      .collection("company")
      .doc(process.env.REACT_APP_CUSTOM_BUGSBEGONE_ID)
      .collection(collectionSelected?.collectionName)
      .doc(id)
      .delete()
      .then(async () => {
        await fetchRows();
        dispatch(setLoading(false));
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while deleting ${collectionSelected?.title || ""}: ${
            err?.message
          }`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Autocomplete
            size="small"
            label="Please choose type of checkbox"
            id="collection-drop-down"
            options={collectionOptions || []}
            value={collectionSelected || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Please choose type of checkbox"
                required
              />
            )}
            onChange={(e, value, reason) => {
              e.preventDefault();
              if (reason !== "removeOption" && reason !== "clear" && value) {
                setCollectionSelected(value);
              } else if (reason === "removeOption" || reason === "clear") {
                setCollectionSelected(null);
              }
            }}
            getOptionLabel={(option) => option?.title || ""}
          />
        </Grid>

        {collectionSelected ? (
          <Grid item xs={12} md={12}>
            <Suspense fallback={<></>}>
              <TableCRUDTemplate
                type="bugsBeGoneCustomCheckboxManagement"
                headers={headers}
                aCollection={rows}
                viewOption={false}
                viewBtnFunc={undefined}
                addBtnDisplay={true}
                addBtnLabel={`Create new ${collectionSelected?.title}`}
                addBtnFunc={addBtnFunc}
                openDialog={openDialog}
                handleCloseDialog={handleCloseDialog}
                emptyColMsg={`No ${collectionSelected?.title} retrieved for the date range selected.`}
                updateBtnDisplay={true}
                deleteBtnDisplay={true}
                updateBtnFunc={updateBtnFunc}
                deleteBtnFunc={deleteBtnFunc}
              />
            </Suspense>
          </Grid>
        ) : (
          <></>
        )}
      </Grid>

      {openDialog && (
        <Suspense fallback={<></>}>
          <CreateOrUpdateCheckboxDialog
            dialogType={dialogType}
            openDialog={openDialog}
            handleCloseDialog={handleCloseDialog}
            rowDetail={rowDetail}
            setRowDetail={setRowDetail}
            fetchRows={fetchRows}
            title={collectionSelected?.title}
            collectionName={collectionSelected?.collectionName}
            companyId={process.env.REACT_APP_CUSTOM_BUGSBEGONE_ID}
          />
        </Suspense>
      )}
    </Container>
  );
}
