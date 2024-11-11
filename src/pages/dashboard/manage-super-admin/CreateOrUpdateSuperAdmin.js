import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import AdminStep1 from "../manage-admin/AdminStep1";
import AdminStepPermission from "../manage-admin/AdminStepPermission";

function CreateOrUpdateSuperAdmin({
  dialogType,
  openDialog,
  handleCloseDialog,
  adminDetails,
  setAdminDetails,
  init_admin_list,
}) {
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
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);

  const [selectedCompanies, set_selectedCompanies] = useState([]);

  const submitChanges = (e) => {
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
        access,
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
      if (dialogType === "add") {
        performAdd();
      } else if (dialogType === "update") {
        performUpdate();
      }
    }
  };

  async function performAdd() {
    const createUserByAdmin = functions.httpsCallable("createuserbyadminnew");
    createUserByAdmin({
      firstName: firstName,
      lastName: lastName,
      contactNumber: contactNumber,
      email: email,
      password: password,
      role: role,
      access: access,
      sysFunc: sysFunc,
      a_comp: a_comp,
    })
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

  async function performUpdate() {
    const updateUserByAdmin = functions.httpsCallable("updateuserbyadminnew");
    updateUserByAdmin({
      id: id || "",
      firstName: firstName || "",
      lastName: lastName || "",
      contactNumber: contactNumber || "",
      // email: email,
      password: password || "",
      role: role || "",
      access: access || false,
      sysFunc: sysFunc || [],
      a_comp: a_comp || [],
    })
      .then((result) => {
        if (init_admin_list) {
          init_admin_list();
        }
        enqueueSnackbar(result?.data?.result || "", { variant: "success" });

        handleCloseDialog();
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

        dispatch(setLoading(false));
      });
  }

  /*   const handleChkChange = (e, index, name) => {
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

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth={"lg"}
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {dialogType && dialogType === "add" ? "Create a User" : "Update User"}
        </DialogTitle>
        <DialogContent>
          <Divider />
          <br />
          {step === 0 ? (
            <AdminStep1
              adminDetails={adminDetails}
              setAdminDetails={setAdminDetails}
              selectedCompanies={selectedCompanies}
              set_selectedCompanies={set_selectedCompanies}
              type="super-admin"
            />
          ) : step === 1 ? (
            <AdminStepPermission
              adminDetails={adminDetails}
              setAdminDetails={setAdminDetails}
              type="super-admin"
              dialogType={dialogType}
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
                  onClick={(e) => submitChanges(e)}
                  color="primary"
                  variant="contained"
                >
                  {dialogType && dialogType === "add" ? "Add" : "Update"}
                </Button>
              </>
            ) : (
              <></>
            )}

            <Button
              onClick={handleCloseDialog}
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

export default CreateOrUpdateSuperAdmin;
