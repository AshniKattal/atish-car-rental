// @mui
import {
  Button,
  TextField,
  DialogActions,
  Dialog,
  DialogTitle,
  Grid,
  Autocomplete,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { setLoading } from "../../../features/globalSlice";
import db from "../../../firebase";
import PropTypes from "prop-types";
import { DatePicker } from "@mui/lab";
import moment from "moment";
import { useDispatch } from "react-redux";
// import { ColorSinglePicker } from "../../../components/color-utils";
import useAuth from "../../../hooks/useAuth";
import firebase from "firebase/compat";
// ----------------------------------------------------------------------

CalendarForm.propTypes = {
  operationType: PropTypes.string,
  updatedEvent: PropTypes.object,
  set_updatedEvent: PropTypes.func,
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  fetchEvent: PropTypes.func,
  fetchEmployee: PropTypes.func,
  employeesList: PropTypes.array,
};

/* const COLOR_OPTIONS = [
  "#00AB55", // theme.palette.primary.main,
  "#1890FF", // theme.palette.info.main,
  "#54D62C", // theme.palette.success.main,
  "#FFC107", // theme.palette.warning.main,
  "#FF4842", // theme.palette.error.main
  "#04297A", // theme.palette.info.darker
  "#7A0C2E", // theme.palette.error.darker
]; */

export default function CalendarForm({
  selectedCompany,
  operationType,
  updatedEvent,
  set_updatedEvent,
  open,
  onCancel,
  fetchEventDateRange,
  fetchEmployee,
  employeesList,
  us_fromDate,
  us_ToDate,
}) {
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const [employeeName, set_employeeName] = useState("");

  const [event, set_events] = useState({
    eventId: operationType === "update" ? updatedEvent?.eventId : "",
    date: operationType === "update" ? updatedEvent?.date : new Date(),
    title: operationType === "update" ? updatedEvent?.titleField : "",
    description: operationType === "update" ? updatedEvent?.description : "",
    startTime: operationType === "update" ? updatedEvent?.startTime : "00:00",
    endTime: operationType === "update" ? updatedEvent?.endTime : "00:00",
    employees: operationType === "update" ? updatedEvent?.employees : [],
    eventColor:
      operationType === "update"
        ? updatedEvent?.linkedDocumentType &&
          updatedEvent?.linkedDocumentType === "invoice"
          ? "#54D62C"
          : updatedEvent?.linkedDocumentType &&
            updatedEvent?.linkedDocumentType === "proforma"
          ? "#FF4842"
          : ""
        : "",
    editedUser: operationType === "update" ? updatedEvent?.editedUser : "",
    linkedDocumentType:
      operationType === "update" ? updatedEvent?.linkedDocumentType : "",
  });

  const {
    date,
    title,
    description,
    startTime,
    endTime,
    employees,
    eventColor,
    editedUser,
    linkedDocumentType,
  } = event;

  async function submitChanges() {
    if (
      !title ||
      //!description ||
      !date ||
      !startTime ||
      !endTime ||
      startTime === "00:00" ||
      endTime === "00:00" ||
      !employees ||
      employees?.length === 0 /* ||
      !linkedDocumentType */
    ) {
      enqueueSnackbar("Title, date, time and employees fields are compulsory", {
        variant: "warning",
      });
    } else {
      dispatch(setLoading(true));

      let formattedDate = moment(date).format("YYYY-MM-DD");
      let startTimeString = `${formattedDate}T${startTime}:00Z`;
      let endTimeString = `${formattedDate}T${endTime}:00Z`;

      let employeeNames = "";
      employees.forEach((employee) => {
        employeeNames = employeeNames + employee?.name + ", ";
      });

      let eventTitle = `Title: ${title}`;

      let eventDescription = description;

      if (description) {
        eventTitle = eventTitle + ` - Description: ${description}`;
      }

      if (employeeNames) {
        eventTitle = eventTitle + ` - Assigned employees: ${employeeNames}`;
      }

      eventTitle =
        eventTitle + ` - Start time: ${startTime} - End time: ${endTime}`;

      if (operationType && operationType === "create") {
        await db
          .collection("company")
          .doc(selectedCompany.id)
          .collection("calendar")
          .add({
            title: eventTitle,
            titleField: title,
            start: startTimeString,
            end: endTimeString,
            allDay: false,
            description: eventDescription,
            employees: employees,
            eventColor: eventColor,
            linkedDocumentType: linkedDocumentType,
            editedUser: user?.email,
            firebaseDateTimestamp: firebase.firestore.Timestamp.fromDate(
              new Date(formattedDate)
            ),
          })
          .then(() => {
            set_events({
              date: new Date(),
              title: "",
              description: "",
              startTime: "00:00",
              endTime: "00:00",
              employees: [],
              eventColor: "",
              linkedDocumentType: "",
            });
            // fetchEvent();
            fetchEventDateRange(selectedCompany.id, us_fromDate, us_ToDate);
            enqueueSnackbar("Details saved successfully");
            dispatch(setLoading(false));
            onCancel();
          })
          .catch((err) => {
            enqueueSnackbar(
              `Error occured while saving details: ${err?.message}`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      } else if (operationType === "update" && updatedEvent?.publicId !== "") {
        await db
          .collection("company")
          .doc(selectedCompany.id)
          .collection("calendar")
          .doc(updatedEvent?.publicId)
          .set(
            {
              title: eventTitle,
              titleField: title,
              start: startTimeString,
              end: endTimeString,
              allDay: false,
              description: eventDescription,
              employees: employees,
              eventColor: eventColor,
              linkedDocumentType: linkedDocumentType,
              editedUser: user?.email,
              firebaseDateTimestamp: firebase.firestore.Timestamp.fromDate(
                new Date(formattedDate)
              ),
            },
            { merge: true }
          )
          .then(() => {
            set_events({
              date: new Date(),
              title: "",
              description: "",
              startTime: "00:00",
              endTime: "00:00",
              employees: [],
              eventColor: "",
              linkedDocumentType: "",
            });
            set_updatedEvent(null);
            // fetchEvent();
            fetchEventDateRange(selectedCompany.id, us_fromDate, us_ToDate);
            enqueueSnackbar("Details saved successfully");
            dispatch(setLoading(false));
            onCancel();
          })
          .catch((err) => {
            enqueueSnackbar(
              `Error occured while saving details: ${err?.message}`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      }
    }
  }

  async function addEmployee() {
    if (employeeName) {
      dispatch(setLoading(true));
      await db
        .collection("company")
        .doc(selectedCompany.id)
        .collection("employee")
        .add({
          name: employeeName,
        })
        .then(() => {
          set_employeeName("");
          fetchEmployee();
          enqueueSnackbar("Employee saved successfully");
          dispatch(setLoading(false));
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while saving employee name: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    } else {
      enqueueSnackbar("Please provide an employee name", {
        variant: "warning",
      });
    }
  }

  return (
    <Dialog open={open} onClose={onCancel} maxWidth={"sm"} fullWidth>
      <DialogTitle>
        {operationType && operationType === "create"
          ? "Add task"
          : operationType && operationType === "update"
          ? "Edit task"
          : ""}
      </DialogTitle>

      <Grid container spacing={3} style={{ padding: "1em" }}>
        <Grid item xs={12} md={12}>
          <TextField
            variant="outlined"
            fullWidth
            name="title"
            label="Title"
            type="text"
            id="title"
            value={title || ""}
            size="small"
            onChange={(event) => {
              set_events((previousState) => {
                return {
                  ...previousState,
                  title: event.target.value,
                };
              });
            }}
            required
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            variant="outlined"
            fullWidth
            name="description"
            label="Description"
            type="text"
            id="description"
            value={description || ""}
            multiline
            rows={4}
            size="small"
            onChange={(event) => {
              set_events((previousState) => {
                return {
                  ...previousState,
                  description: event.target.value,
                };
              });
            }}
          />
        </Grid>

        {operationType === "update" ? (
          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              fullWidth
              name="editedUser"
              label="User edited"
              type="text"
              id="editedUser"
              value={editedUser || ""}
              size="small"
              disabled
            />
          </Grid>
        ) : (
          ""
        )}

        <Grid item xs={12} md={12}>
          <DatePicker
            label="Date"
            value={date || ""}
            onChange={(newValue) => {
              set_events((previousState) => {
                return {
                  ...previousState,
                  date: newValue,
                };
              });
            }}
            inputFormat="dd/MM/yyyy"
            renderInput={(params) => <TextField {...params} size="small" />}
            style={{ maxWidth: "500px" }}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            type="time"
            label="Start time"
            id="startTime"
            name="startTime"
            value={startTime}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            onChange={(e) => {
              set_events((previousState) => {
                return {
                  ...previousState,
                  startTime: e.target.value,
                };
              });
            }}
            size="small"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            type="time"
            label="End time"
            id="endTime"
            name="endTime"
            value={endTime}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            onChange={(e) => {
              set_events((previousState) => {
                return {
                  ...previousState,
                  endTime: e.target.value,
                };
              });
            }}
            size="small"
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <Autocomplete
            multiple
            id="tags-standard"
            options={employeesList || []}
            getOptionLabel={(option) => option.name}
            value={employees || null}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Assigned employees"
                placeholder="Employees"
                size="small"
              />
            )}
            onChange={(e, value) => {
              set_events((previousState) => {
                return {
                  ...previousState,
                  employees: value,
                };
              });
            }}
            required
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <Stack spacing={2}>
            <Typography>
              Please choose if task is linked to proforma or invoice
            </Typography>

            <FormControl
              size="small"
              variant="outlined"
              fullWidth
              margin="normal"
            >
              <InputLabel id="linked-document-type">
                Linked document type
              </InputLabel>

              <Select
                label="Linked document type"
                labelId="linked-document-type"
                size="small"
                placeholder="Please choose a document type"
                value={linkedDocumentType || ""}
                onChange={(event) => {
                  const value = event.target.value;
                  let eventColour = "";
                  if (value === "invoice") {
                    eventColour = "#54D62C";
                  } else if (value === "proforma") {
                    eventColour = "#FF4842";
                  }

                  set_events((previousState) => {
                    return {
                      ...previousState,
                      linkedDocumentType: value,
                      eventColor: eventColour,
                    };
                  });
                }}
                inputProps={{
                  name: "linkedDocumentType",
                  id: "linkedDocumentType",
                }}
              >
                <MenuItem value="">Please choose a document type *</MenuItem>
                <MenuItem value="invoice">Invoice</MenuItem>
                <MenuItem value="proforma">Proforma</MenuItem>
              </Select>
            </FormControl>
            {/* <ColorSinglePicker
              value={eventColor || ""}
              onChange={(e) => {
                set_events((previousState) => {
                  return {
                    ...previousState,
                    eventColor: e.target.value,
                  };
                });
              }}
              colors={COLOR_OPTIONS}
            /> */}
          </Stack>
        </Grid>

        <Grid item xs={12} md={12}>
          <Stack spacing={3} direction="row" alignItems="center">
            <TextField
              variant="outlined"
              fullWidth
              name="employeeName"
              label="Enter new employee name"
              type="text"
              id="employeeName"
              value={employeeName || ""}
              size="small"
              onChange={(e) => {
                set_employeeName(e.target.value);
              }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() => addEmployee()}
              style={{ whiteSpace: "nowrap", width: "300px" }}
              disabled={!employeeName}
            >
              Add employee
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <DialogActions>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => submitChanges()}
              fullWidth
              disabled={
                (operationType === "update" &&
                  !user?.permissions?.updateCalendarTask?.assignedCompanyId?.includes(
                    selectedCompany?.id
                  )) ||
                !title ||
                // !description ||
                !date ||
                !startTime ||
                !endTime ||
                startTime === "00:00" ||
                endTime === "00:00" ||
                !employees ||
                employees?.length === 0 /* ||
                !linkedDocumentType */
              }
            >
              submit changes
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              color="error"
              onClick={onCancel}
              fullWidth
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}
