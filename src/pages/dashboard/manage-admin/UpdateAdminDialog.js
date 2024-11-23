import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Divider,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../features/globalSlice";
import { functions } from "../../../firebase";
import {
  ValidatePassword,
  ValidateEmptyInput,
} from "../../../components/core-functions/SelectionCoreFunctions";
import { useSnackbar } from "notistack";
import { getPermissions } from "../permisssions/Permissions";
// import { getPermissionsSuperAdmin } from "../manage-super-admin/Permissions";
import useAuth from "../../../hooks/useAuth";
import AdminStep1 from "./AdminStep1";
import AdminStepPermission from "./AdminStepPermission";

function UpdateAdminDialog({
  openDialog,
  handleCloseDialog,
  adminDetails,
  setAdminDetails,
  init_admin_list,
}) {
  const { user } = useAuth();

  const {
    id,
    firstName,
    lastName,
    contactNumber,
    email,
    password,
    role,
    access,
    sysFunc,
    a_comp,
  } = adminDetails;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState(0);

  const [us_b_modified, set_us_b_modified] = useState(false);

  const [selectedCompanies, set_selectedCompanies] = useState([]);

  const temp_setUpPermissions = useRef();

  useEffect(() => {
    temp_setUpPermissions.current();
  }, [sysFunc, openDialog]);

  async function setUpPermissions() {
    if (sysFunc === undefined && openDialog) {
      let arr = await getPermissions(true);
      setAdminDetails({
        ...adminDetails,
        sysFunc: arr,
      });
    } else if (!us_b_modified && sysFunc?.length > 0 && openDialog) {
      /**
       * check if the permission stored contains all the new permissions if added.
       */
      _reArrangeSysFunc(sysFunc);
    }
  }

  temp_setUpPermissions.current = setUpPermissions;

  const _reArrangeSysFunc = async (a_sysFunc) => {
    let a_new_sysFunc = [];
    let a_default_sysFunc = await getPermissions(false);
    a_default_sysFunc.forEach((o_val) => {
      let a_filer = a_sysFunc.filter((e) => e.name === o_val.name);
      if (a_filer?.length === 0) {
        /* a_sysFunc does not contain the permission */
        a_new_sysFunc.push(o_val);
      } else {
        a_new_sysFunc.push(a_filer[0]);
      }
    });
    setAdminDetails({
      ...adminDetails,
      sysFunc: a_new_sysFunc,
    });
    set_us_b_modified(true);
  };

  const updateAdmin = (e) => {
    dispatch(setLoading(true));
    e.preventDefault();
    if (
      !ValidateEmptyInput([
        firstName,
        lastName,
        contactNumber,
        // email,
        password,
        role,
      ])
    ) {
      enqueueSnackbar("Please fill in all the inputs", { variant: "error" });
      dispatch(setLoading(false));
    } else if (!ValidatePassword(password)) {
      enqueueSnackbar("Password must be equal or greater than 6 characters", {
        variant: "error",
      });
      dispatch(setLoading(false));
    } else {
      let userObjectParams = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        contactNumber: contactNumber,
        // email: email,
        password: password,
        role: role,
        access: access,
        sysFunc: sysFunc,
        a_comp: a_comp || [],
      };

      const updateUserByAdmin = functions.httpsCallable("updateuserbyadminnew");
      updateUserByAdmin({
        ...userObjectParams,
      })
        .then((result) => {
          if (init_admin_list) {
            init_admin_list();
          }
          enqueueSnackbar(result?.data?.result || "", { variant: "success" });

          handleCloseDialog();
          set_us_b_modified(false);
          setStep(0);

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

          setStep(0);
          handleCloseDialog();
          set_us_b_modified(false);

          dispatch(setLoading(false));
        });
    }
  };

  const handleChkChange = (e, index, name) => {
    let arr = [...sysFunc];
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (i === index) {
        newArr.push({
          ...arr[i],
          [name]: e.target.checked,
        });
      } else {
        newArr.push(arr[i]);
      }
    }
    setAdminDetails({
      ...adminDetails,
      sysFunc: newArr,
    });
  };

  const assignAll = async () => {
    let arr = await getPermissions(true);
    setAdminDetails({
      ...adminDetails,
      sysFunc: arr,
    });
  };

  const none = async () => {
    let arr = await getPermissions(false);
    setAdminDetails({
      ...adminDetails,
      sysFunc: arr,
    });
  };

  async function onHandleRoleChange(value) {
    if (value === "Admin") {
      let arr = await getPermissions(true);
      setAdminDetails({
        ...adminDetails,
        sysFunc: arr,
        role: value,
      });
    } else if (value === "SalePerson") {
      let arr = await getPermissions(false);
      if (arr?.length > 0) {
        let newPermissions = [];
        arr.forEach((permission) => {
          if (
            permission.name === "viewQuotation" ||
            permission.name === "createQuotation" ||
            permission.name === "updateQuotation"
          ) {
            newPermissions.push({
              ...permission,
              [permission.name]: true,
            });
          } else {
            newPermissions.push(permission);
          }
        });
        setAdminDetails({
          ...adminDetails,
          sysFunc: newPermissions,
          role: value,
        });
      }
    } else if (value === "Secretary") {
      let arr = await getPermissions(false);
      if (arr?.length > 0) {
        let newPermissions = [];
        arr.forEach((permission) => {
          if (
            permission.name === "accessPaymentExpense" ||
            permission.name === "addExpense" ||
            permission.name === "viewQuotation" ||
            permission.name === "updateQuotation" ||
            permission.name === "viewQuotation" ||
            permission.name === "createQuotation" ||
            permission.name === "viewInvoice" ||
            permission.name === "createInvoice" ||
            permission.name === "viewVatInvoice" ||
            permission.name === "createVatInvoice" ||
            permission.name === "viewPurchaseOrder" ||
            permission.name === "createPurchaseOrder" ||
            permission.name === "viewProforma" ||
            permission.name === "createProforma" ||
            permission.name === "viewCreditNote" ||
            permission.name === "createCreditNote" ||
            permission.name === "viewUnpaidInvoiceOnly"
          ) {
            newPermissions.push({
              ...permission,
              [permission.name]: true,
            });
          } else {
            newPermissions.push(permission);
          }
        });
        setAdminDetails({
          ...adminDetails,
          sysFunc: newPermissions,
          role: value,
        });
      }
    }
  }

  /*  async function convertToSuperAdmin() {
    const super_admin_permissions = await getPermissionsSuperAdmin();

    const updateUserByAdmin = functions.httpsCallable("updateuserbyadminnew");
    updateUserByAdmin({
      id: id,
      firstName: firstName,
      lastName: lastName,
      contactNumber: contactNumber,
      password: password,
      role: "super-admin",
      access: true,
      sysFunc: super_admin_permissions,
    })
      .then((result) => {
        if (init_admin_list) {
          init_admin_list();
        }
        enqueueSnackbar(result?.data?.result || "", { variant: "success" });

        handleCloseDialog();
        set_us_b_modified(false);
        setStep(0);

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

        setStep(0);
        handleCloseDialog();
        set_us_b_modified(false);

        dispatch(setLoading(false));
      });
  } */

  return (
    <>
      <Dialog open={openDialog} maxWidth="lg" fullWidth>
        <DialogTitle id="alert-dialog-title">Update a User</DialogTitle>
        <DialogContent style={{ height: "auto" }}>
          <Divider />
          <br />
          {step === 0 ? (
            <AdminStep1
              adminDetails={adminDetails}
              setAdminDetails={setAdminDetails}
              selectedCompanies={selectedCompanies}
              set_selectedCompanies={set_selectedCompanies}
              type="admin"
              dialogType={"update"}
            />
          ) : step === 1 ? (
            <AdminStepPermission
              adminDetails={adminDetails}
              setAdminDetails={setAdminDetails}
              type="admin"
              dialogType={"update"}
            />
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Stack spacing={2} direction="row">
            {step === 0 ? (
              <Button
                onClick={() => {
                  setStep(1);
                }}
                color="primary"
                variant="contained"
              >
                Next
              </Button>
            ) : step === 1 ? (
              <>
                <Button
                  onClick={() => setStep(0)}
                  color="secondary"
                  variant="contained"
                >
                  Back
                </Button>
                <Button
                  onClick={(e) => updateAdmin(e)}
                  color="primary"
                  variant="contained"
                >
                  Update
                </Button>
              </>
            ) : (
              ""
            )}

            <Button
              onClick={() => {
                handleCloseDialog();
                setStep(0);
                set_us_b_modified(false);
              }}
              color="error"
              variant="outlined"
            >
              Cancel
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UpdateAdminDialog;
