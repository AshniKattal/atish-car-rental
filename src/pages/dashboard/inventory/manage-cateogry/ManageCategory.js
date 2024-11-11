import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDocument } from "src/features/documentSlice";
import { setLoading } from "src/features/globalSlice";
import db from "src/firebase";
import CreateOrUpdateCategoryDialog from "./CreateOrUpdateCategoryDialog";

const TableCRUDTemplate = lazy(() =>
  import("src/components/table/TableCRUDTemplate")
);

export default function ManageCategory() {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const { companyDetails } = useSelector(selectDocument);

  const headers = [
    { id: "list", label: "List" },
    { id: "update", label: "Update" },
    { id: "delete", label: "Delete" },
    { id: "title", label: "Title" },
  ];

  const [openDialog, setOpenDialog] = useState(false);

  const [dialogType, setDialogType] = useState("");

  const [categoryDetail, setCategoryDetail] = useState({
    title: "",
  });

  const [list, setList] = useState([]);

  const temp_fetchCategoryRef = useRef();

  useEffect(() => {
    temp_fetchCategoryRef.current();
  }, []);

  const fetchCategory = async () => {
    dispatch(setLoading(true));

    await db
      .collection("company")
      .doc(companyDetails?.id)
      .collection("category")
      .orderBy("title")
      .get()
      .then((result) => {
        if (result?.docs?.length > 0) {
          const itemList = result.docs.map((doc) => ({
            id: doc.id,
            data: { ...doc.data() },
            title: doc?.data()?.title || "",
          }));

          setList(itemList);

          dispatch(setLoading(false));
        } else {
          setList([]);

          dispatch(setLoading(false));
        }
      })
      .catch((error) => {
        enqueueSnackbar(
          `Error occured while fetching categories: ${error?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  };

  temp_fetchCategoryRef.current = fetchCategory;

  const addBtnFunc = () => {
    setDialogType("add");
    setOpenDialog(true);
    setCategoryDetail({
      ...categoryDetail,
      id: "",
      title: "",
    });
  };

  const updateBtnFunc = (id, data) => {
    setDialogType("update");
    setOpenDialog(true);
    setCategoryDetail({
      id: id,
      title: data?.title || "",
    });
  };

  const deleteBtnFunc = async (id) => {
    dispatch(setLoading(true));
    await db
      .collection("company")
      .doc(companyDetails?.id)
      .collection("category")
      .doc(id)
      .delete()
      .then(async () => {
        fetchCategory();
        dispatch(setLoading(false));
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while deleting a category: ${err?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  };

  function handleCloseDialog() {
    setCategoryDetail({
      id: "",
      category: "",
    });

    setOpenDialog(false);

    setDialogType("");
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Grid item xs={12} md={12}>
            <Suspense fallback={<p>Loading...</p>}>
              <TableCRUDTemplate
                companyId={companyDetails?.id}
                type="category"
                headers={headers}
                aCollection={list}
                addBtnDisplay={true}
                addBtnLabel={"Create an category"}
                addBtnFunc={addBtnFunc}
                openDialog={openDialog}
                handleCloseDialog={handleCloseDialog}
                emptyColMsg={
                  "Sorry, not a single category has been created yet. Please create a category."
                }
                updateBtnDisplay={true}
                deleteBtnDisplay={true}
                updateBtnFunc={updateBtnFunc}
                deleteBtnFunc={deleteBtnFunc}
              />
            </Suspense>
          </Grid>
        </Grid>
      </Grid>

      {openDialog ? (
        <CreateOrUpdateCategoryDialog
          dialogType={dialogType}
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          state={categoryDetail}
          setState={setCategoryDetail}
          fetchData={fetchCategory}
          companyId={companyDetails?.id}
        />
      ) : (
        <></>
      )}
    </>
  );
}
