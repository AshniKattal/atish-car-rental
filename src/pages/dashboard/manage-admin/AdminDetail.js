import { useState, useEffect, lazy, Suspense, useRef } from "react";
import { Alert, Autocomplete, Container, Grid, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectAdmin, setUsersList } from "../../../features/adminSlice";
import { setLoading } from "../../../features/globalSlice";
import db, { functions } from "../../../firebase";
import useAuth from "../../../hooks/useAuth";
import { useSnackbar } from "notistack";
import { getPermissions } from "../permisssions/Permissions";
import {
  dynamicSort,
  getCompanies,
} from "src/components/core-functions/SelectionCoreFunctions";
import { selectCompanyList, setCompanyList } from "src/features/companySlice";
import useSettings from "src/hooks/useSettings";

const TableCRUDAdmin = lazy(() =>
  import("../../../components/table/TableCRUDAdmin")
);
const CreateAdminDialog = lazy(() => import("./CreateAdminDialog"));
const UpdateAdminDialog = lazy(() => import("./UpdateAdminDialog"));

const AdminDetail = () => {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const { companyList } = useSelector(selectCompanyList);

  const temp_initializeCompanies = useRef();

  const [selectedCompany, setSelectedCompany] = useState(null);

  const adminSlice = useSelector(selectAdmin);
  const [adminListTable, setAdminListTable] = useState([]);
  const [adminDetails, setAdminDetails] = useState({
    id: "",
    firstName: "",
    lastName: "",
    a_dep: [], // array of departments
    contactNumber: "",
    email: "",
    password: "",
    role: "admin",
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
    /*     { id: "a_dep", label: "Department" }, */
    { id: "contactNumber", label: "contactNumber" },
    { id: "email", label: "Email" },
    /*{ id: "password", label: "Password" },*/
    { id: "role", label: "Role" },
    { id: "a_comp", label: "assigned Companies" },
    /*{ id: "access", label: "Access" },*/
    /*{ id: "sysFunc", label: "Permissions" },*/
  ];

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");

  const temp_init_adminList_ref = useRef();

  const temp_init_adminTable_ref = useRef();

  const temp_checkPermission_ref = useRef();

  const [viewPermissionGranted, setViewPermissionGranted] = useState(false);

  useEffect(() => {
    temp_checkPermission_ref.current();
  }, [selectedCompany]);

  function checkPermission() {
    if (selectedCompany && selectedCompany?.id) {
      if (
        !user?.permissions?.viewAdminChk?.assignedCompanyId?.includes(
          selectedCompany?.id
        )
      ) {
        enqueueSnackbar(
          "You do not have the permission to view admin for this company",
          { variant: "error" }
        );

        setViewPermissionGranted(false);
      } else {
        setViewPermissionGranted(true);
      }
    }
  }

  temp_checkPermission_ref.current = checkPermission;

  useEffect(() => {
    temp_initializeCompanies.current();
  }, [companyList]);

  useEffect(() => {
    temp_init_adminList_ref.current();
  }, [selectedCompany, viewPermissionGranted]);

  useEffect(() => {
    temp_init_adminTable_ref.current();
  }, [adminSlice]);

  const initializeCompanies = async () => {
    // if (user?.id !== "" && user?.role !== "admin_member") {
    if (companyList && companyList.length === 0) {
      dispatch(setLoading(true));
      let result = await getCompanies(user?.id, user?.a_comp, user?.role);

      if (result.error) {
        enqueueSnackbar(result.msg || "", { variant: result.variant });
        dispatch(setLoading(false));
      } else {
        dispatch(setCompanyList(result));
        dispatch(setLoading(false));
      }
    }
    // }
  };

  temp_initializeCompanies.current = initializeCompanies;

  async function init_admin_list() {
    if (user?.id !== "" && selectedCompany && viewPermissionGranted) {
      dispatch(setLoading(true));
      await db
        .collection("users")
        .where("role", "!=", "super-admin")
        .get()
        .then((snapshot) => {
          var arr = [];
          if (snapshot.docs && snapshot.docs?.length > 0) {
            snapshot.docs.forEach((doc) => {
              let validDocument = false;

              if (
                //user?.role === "super-admin" ||
                doc
                  ?.data()
                  ?.a_comp.find(
                    (adminCompany) => adminCompany.id === selectedCompany?.id
                  )
              ) {
                validDocument = true;
              }

              if (validDocument) {
                arr.push({
                  id: doc.id,
                  data: doc.data(),
                  firstName:
                    (doc?.data()?.firstName &&
                      doc?.data()?.firstName.toLowerCase()) ||
                    "",
                });

                arr.sort(dynamicSort("firstName"));
              }
            });
            dispatch(setUsersList(arr));
            dispatch(setLoading(false));
          } else {
            dispatch(setUsersList([]));
            dispatch(setLoading(false));
          }
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while fetching administrators: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    } else {
      dispatch(setUsersList([]));
      dispatch(setLoading(false));
    }
  }

  temp_init_adminList_ref.current = init_admin_list;

  async function init_adminTable() {
    if (
      adminSlice &&
      adminSlice.usersList &&
      adminSlice.usersList.length !== 0
    ) {
      let arr = [];
      let arrTable = [];
      let a_permissions = await getPermissions();
      adminSlice.usersList.forEach((obj) => {
        arr.push({
          id: obj.id,
          data: obj.data,
          firstName: obj.data.firstName,
          lastName: obj.data.lastName,
          a_dep: obj.data.a_dep || [],
          contactNumber: obj.data.contactNumber,
          email: obj.data.email,
          password: obj.data.password,
          role: obj.data.role,
          access: obj.data.access,
          sysFunc: obj.data.sysFunc || a_permissions,
          a_comp: obj?.data?.a_comp || [],
        });
        arrTable.push({
          id: obj.id,
          data: obj.data,
          firstName: obj.data.firstName,
          lastName: obj.data.lastName,
          a_dep: obj.data.a_dep || [],
          contactNumber: obj.data.contactNumber,
          email: obj.data.email,
          //password: obj.data.password,
          role: obj.data.role,
          a_comp: obj?.data?.a_comp || [],
          //access: obj.data.access,
          //sysFunc: JSON.stringify(obj.data.sysFunc),
        });
      });
      setAdminListTable(arrTable);
    } else {
      setAdminListTable([]);
    }
  }

  temp_init_adminTable_ref.current = init_adminTable;

  const handleCloseDialog = async () => {
    setOpenDialog(false);
    let a_permissions = await getPermissions(true);
    setAdminDetails({
      id: "",
      firstName: "",
      lastName: "",
      a_dep: [],
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
      a_dep: [],
      contactNumber: "",
      email: "",
      password: "",
      role: "",
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
      a_dep: data.a_dep,
      contactNumber: data.contactNumber,
      email: data.email,
      password: data.password,
      role: data.role,
      access: data.access,
      sysFunc: data.sysFunc || [],
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Autocomplete
            ListboxProps={{ style: { maxHeight: "70vh" } }}
            size="small"
            label="Please select company"
            id="client-drop-down"
            options={companyList || []}
            value={selectedCompany || null}
            renderInput={(params) => (
              <TextField {...params} label="Please select company" />
            )}
            onChange={(e, value, reason) => {
              if (reason !== "removeOption" && reason !== "clear" && value) {
                setSelectedCompany(value);
              } else if (reason === "removeOption" || reason === "clear") {
                setSelectedCompany(null);
              }
            }}
            getOptionLabel={(option) => option?.name || ""}
            renderOption={(props, option) => (
              <li {...props} key={option?.id}>
                <span>{option?.name || ""}</span>
              </li>
            )}
          />
        </Grid>

        {selectedCompany && viewPermissionGranted ? (
          <Grid item xs={12} md={12}>
            <Suspense fallback={<p></p>}>
              <TableCRUDAdmin
                companyId={selectedCompany?.id}
                type="admin"
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
          </Grid>
        ) : (
          <></>
        )}
      </Grid>

      {dialogType && dialogType === "add" ? (
        <Suspense fallback={<p></p>}>
          <CreateAdminDialog
            openDialog={openDialog}
            handleCloseDialog={handleCloseDialog}
            adminDetails={adminDetails}
            setAdminDetails={setAdminDetails}
            init_admin_list={init_admin_list}
          />
        </Suspense>
      ) : (
        <Suspense fallback={<p></p>}>
          <UpdateAdminDialog
            openDialog={openDialog}
            handleCloseDialog={handleCloseDialog}
            adminDetails={adminDetails}
            setAdminDetails={setAdminDetails}
            init_admin_list={init_admin_list}
          />
        </Suspense>
      )}
    </Container>
  );
};

export default AdminDetail;
