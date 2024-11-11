import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Stack,
  Divider,
} from "@mui/material";

import { useState } from "react";
import { functions } from "../../../firebase";
import { useDispatch } from "react-redux";
import {
  ValidateEmail,
  ValidatePassword,
  ValidateEmptyInput,
} from "../../../components/core-functions/SelectionCoreFunctions";
import { setLoading } from "../../../features/globalSlice";
import { useSnackbar } from "notistack";
import { getPermissions } from "../permisssions/Permissions";
import useAuth from "../../../hooks/useAuth";
import AdminStep1 from "./AdminStep1";
import AdminStepPermission from "./AdminStepPermission";

function CreateAdminDialog({
  openDialog,
  handleCloseDialog,
  adminDetails,
  setAdminDetails,
  init_admin_list,
}) {
  const { user } = useAuth();

  const {
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
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);

  const [selectedCompanies, set_selectedCompanies] = useState([]);

  const addAdmin = (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    if (
      !ValidateEmptyInput([
        firstName,
        lastName,
        contactNumber,
        email,
        password,
        role,
      ])
    ) {
      enqueueSnackbar("Please fill in all the inputs", { variant: "error" });
      dispatch(setLoading(false));
    } else if (!ValidateEmail(email)) {
      enqueueSnackbar("You have entered an invalid email address", {
        variant: "error",
      });
      dispatch(setLoading(false));
    } else if (!ValidatePassword(password)) {
      enqueueSnackbar("Password must be equal or greater than 6 characters", {
        variant: "error",
      });
      dispatch(setLoading(false));
    } else {
      let userObjectParams = {
        firstName: firstName,
        lastName: lastName,
        contactNumber: contactNumber,
        email: email,
        password: password,
        role: role,
        access: access,
        sysFunc: sysFunc,
        a_comp: a_comp || [],
      };

      const createUserByAdmin = functions.httpsCallable("createuserbyadminnew");
      createUserByAdmin({ ...userObjectParams })
        .then((result) => {
          if (init_admin_list) {
            init_admin_list();
          }
          setStep(0);
          enqueueSnackbar(result?.data?.result || "", { variant: "success" });
          dispatch(setLoading(false));
          handleCloseDialog();
        })
        .catch((err) => {
          setStep(0);
          enqueueSnackbar(err?.message, { variant: "error" });
          dispatch(setLoading(false));
        });
    }
  };

  /* const handleChkChange = (e, index, name) => {
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
  }; */
  /*   const assignAll = async () => {
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
  }; */

  /* async function onHandleRoleChange(value) {
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
  } */

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth={"md"}
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">Create a User</DialogTitle>
        <DialogContent>
          <Divider />
          <br />
          {step === 0 ? (
            <AdminStep1
              adminDetails={adminDetails}
              setAdminDetails={setAdminDetails}
              selectedCompanies={selectedCompanies}
              set_selectedCompanies={set_selectedCompanies}
              type="admin"
              dialogType={"add"}
            />
          ) : step === 1 ? (
            <AdminStepPermission
              adminDetails={adminDetails}
              setAdminDetails={setAdminDetails}
              type="admin"
              dialogType={"add"}
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
                  onClick={(e) => addAdmin(e)}
                  color="primary"
                  variant="contained"
                >
                  Add
                </Button>
              </>
            ) : (
              ""
            )}

            <Button
              onClick={() => {
                handleCloseDialog();
                setStep(0);
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

export default CreateAdminDialog;
