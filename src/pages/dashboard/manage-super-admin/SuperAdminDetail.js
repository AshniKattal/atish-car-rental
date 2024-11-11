import { useState, useEffect, lazy, Suspense, useRef } from "react";
import { Alert, Container } from "@mui/material";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../features/globalSlice";
import db, { functions } from "../../../firebase";
import useAuth from "../../../hooks/useAuth";
import { useSnackbar } from "notistack";
import { getPermissions } from "../permisssions/Permissions";
import useSettings from "src/hooks/useSettings";

const TableCRUDAdmin = lazy(() =>
  import("../../../components/table/TableCRUDAdmin")
);
const CreateOrUpdateSuperAdmin = lazy(() =>
  import("./CreateOrUpdateSuperAdmin")
);

const SuperAdminDetail = () => {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [adminListTable, setAdminListTable] = useState([]);
  const [adminDetails, setAdminDetails] = useState({
    id: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    password: "",
    role: "super-admin",
    access: true,
    sysFunc: [],
    a_comp: [],
  });

  const headers = [
    { id: "list", label: "List" },
    { id: "update", label: "Update" },
    { id: "delete", label: "Delete" },
    { id: "firstName", label: "First Name" },
    { id: "lastName", label: "Last Name" },
    { id: "contactNumber", label: "contactNumber" },
    { id: "email", label: "Email" },
    { id: "role", label: "Role" },
  ];

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");

  const temp_init_adminList_ref = useRef();

  useEffect(() => {
    temp_init_adminList_ref.current();
  }, []);

  async function init_admin_list() {
    if (user?.id !== "") {
      dispatch(setLoading(true));
      await db
        .collection("users")
        .where("role", "==", "super-admin")
        .get()
        .then((snapshot) => {
          var arr = [];
          if (snapshot.docs && snapshot.docs?.length > 0) {
            snapshot.docs.forEach((doc) => {
              arr.push({
                id: doc.id,
                data: { ...doc.data() },
                firstName: doc.data().firstName,
                lastName: doc.data().lastName,
                contactNumber: doc.data().contactNumber,
                email: doc.data().email,
                role: doc.data().role,
                access: doc?.data()?.access || false,
                sysFunc: doc?.data()?.sysFunc || [],
                a_comp: doc?.data()?.a_comp || [],
              });
            });
            setAdminListTable(arr);
            dispatch(setLoading(false));
          } else {
            setAdminListTable([]);
            dispatch(setLoading(false));
          }
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while fetching super administrators: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    } else {
      enqueueSnackbar(
        "Your session has been terminated due to greater than 30 minutes of inactivity. Please log in again.",
        { variant: "error" }
      );
    }
  }

  temp_init_adminList_ref.current = init_admin_list;

  const handleCloseDialog = async () => {
    setOpenDialog(false);
    let a_permissions = await getPermissions(true);
    setAdminDetails({
      id: "",
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      password: "",
      role: "",
      access: "",
      sysFunc: a_permissions,
      a_comp: [],
    });
  };

  const addBtnFunc = async () => {
    setDialogType("add");
    setOpenDialog(true);
    let a_permissions = await getPermissions(true);
    setAdminDetails({
      id: "",
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      password: "",
      role: "super-admin",
      access: "",
      sysFunc: a_permissions,
      a_comp: [],
    });
  };

  const updateBtnFunc = (id, data) => {
    setDialogType("update");
    setOpenDialog(true);
    setAdminDetails({
      id: id,
      firstName: data.firstName,
      lastName: data.lastName,
      contactNumber: data.contactNumber,
      email: data.email,
      password: data.password,
      role: data.role,
      access: data.access,
      sysFunc: data.sysFunc,
      a_comp: data?.a_comp || [],
    });
  };

  const deleteBtnFunc = (id) => {
    dispatch(setLoading(true));
    const deleteUserByAdmin = functions.httpsCallable("deleteuserbyadminnew");
    deleteUserByAdmin({
      id: id,
    })
      .then((result) => {
        init_admin_list();
        enqueueSnackbar(result?.data?.result, { variant: "success" });
        dispatch(setLoading(false));
      })
      .catch((err) => {
        let msg = "";
        if (err.message) {
          msg = err.message;
        } else {
          msg = err;
        }
        enqueueSnackbar(msg, { variant: "error" });
        dispatch(setLoading(false));
      });
  };

  return (
    <Container maxWidth={themeStretch ? false : "xl"}>
      <div
        style={{
          display: !user?.permissions?.viewSuperAdminChk ? "" : "none",
        }}
      >
        <Alert severity="error">
          Sorry, you do not have access to this section. Please contact Admin
          for more info. Thank you.
        </Alert>
      </div>

      <div
        style={{
          display: user?.permissions?.viewSuperAdminChk ? "" : "none",
        }}
      >
        <Suspense fallback={<p></p>}>
          <TableCRUDAdmin
            type="super-admin"
            headers={headers}
            aCollection={adminListTable}
            addBtnDisplay={true}
            addBtnLabel={"Create a User"}
            addBtnFunc={addBtnFunc}
            openDialog={openDialog}
            handleCloseDialog={handleCloseDialog}
            emptyColMsg={
              "Sorry, not a User has been created yet. Please create a user."
            }
            updateBtnDisplay={true}
            deleteBtnDisplay={true}
            updateBtnFunc={updateBtnFunc}
            deleteBtnFunc={deleteBtnFunc}
          />
        </Suspense>

        <div>
          <Suspense fallback={<></>}>
            <CreateOrUpdateSuperAdmin
              dialogType={dialogType}
              openDialog={openDialog}
              handleCloseDialog={handleCloseDialog}
              adminDetails={adminDetails}
              setAdminDetails={setAdminDetails}
              init_admin_list={init_admin_list}
            />
          </Suspense>
        </div>
      </div>
    </Container>
  );
};

export default SuperAdminDetail;
