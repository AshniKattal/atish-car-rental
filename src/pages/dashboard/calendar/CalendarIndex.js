import { DatePicker } from "@mui/lab";
import {
  Alert,
  Autocomplete,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Suspense, useRef, useState, lazy, useEffect } from "react";
import {
  CalendarStyle,
  CalendarToolbar,
} from "../../../sections/@dashboard/calendar";
import FullCalendar from "@fullcalendar/react"; // => request placed at the top
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import timelinePlugin from "@fullcalendar/timeline";
import interactionPlugin from "@fullcalendar/interaction";
import useResponsive from "../../../hooks/useResponsive";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../features/globalSlice";
import db from "../../../firebase";
import { useSnackbar } from "notistack";
import moment from "moment";
import CustomEvent from "./CustomEvent";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "../../../routes/paths";
import useAuth from "../../../hooks/useAuth";
import firebase from "firebase/compat";
import { selectCompanyList } from "../../../features/companySlice";

const CalendarForm = lazy(() => import("./CalendarForm"));
const EventColorIndicator = lazy(() => import("./EventColorIndicator"));

function CalendarIndex() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const { companyList } = useSelector(selectCompanyList);

  const [selectedCompany, set_selectedCompany] = useState(null);

  const calendarRef = useRef(null);

  const isDesktop = useResponsive("up", "sm");

  const [us_date_display, set_us_date_display] = useState(new Date());

  const [us_fromDate, set_us_fromDate] = useState(new Date());

  const [us_ToDate, set_us_ToDate] = useState(new Date());

  const [us_employees, set_us_employees] = useState([]);

  const [view, setView] = useState("timeGridDay");

  const [events, setEvents] = useState([]);

  const [updatedEvent, set_updatedEvent] = useState(null);

  const [us_operationType, set_us_operationType] = useState("");

  const [us_b_open_event_dlg, set_us_b_open_event_dlg] = useState(false);

  const temp_fetch_employee_ref = useRef();

  const temp_checkPermission_ref = useRef();

  const [viewPermissionGranted, setViewPermissionGranted] = useState(false);

  useEffect(() => {
    temp_checkPermission_ref.current();
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedCompany && viewPermissionGranted) {
      temp_fetch_employee_ref.current();
    }
  }, [selectedCompany, viewPermissionGranted]);

  function checkPermission() {
    if (selectedCompany && selectedCompany?.id) {
      if (
        !user?.permissions?.viewCalendar?.assignedCompanyId?.includes(
          selectedCompany?.id
        )
      ) {
        enqueueSnackbar(
          "You do not have the permission to view calendar for this company",
          { variant: "error" }
        );

        setViewPermissionGranted(false);
      } else {
        setViewPermissionGranted(true);
      }
    }
  }

  temp_checkPermission_ref.current = checkPermission;

  const fetchEmployee = async () => {
    dispatch(setLoading(true));

    await db
      .collection("company")
      .doc(selectedCompany.id)
      .collection("employee")
      .get()
      .then((result) => {
        if (result?.docs && result?.docs?.length > 0) {
          let allEmployees = [];
          result?.docs.forEach((doc) => {
            allEmployees.push({
              ...doc?.data(),
              id: doc.id,
            });
          });
          set_us_employees(allEmployees);
          dispatch(setLoading(false));
        } else {
          set_us_employees([]);
          dispatch(setLoading(false));
        }
        dispatch(setLoading(false));
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while fetching employees: ${err?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  };

  temp_fetch_employee_ref.current = fetchEmployee;

  async function fetchEventDateRange(
    companyId,
    calendarStartDate,
    calendarEndDate
  ) {
    const startDateISOString = calendarStartDate.toISOString();
    const startDateStringSplit = startDateISOString.split("T");

    const endDateISOString = calendarEndDate.toISOString();
    const endDateStringSplit = endDateISOString.split("T");

    const startDate = new Date(`${startDateStringSplit[0]}T00:00:00.000Z`); // The start date of the range
    const endDate = new Date(`${endDateStringSplit[0]}T23:59:59.000Z`); // The end date of the range

    dispatch(setLoading(true));

    await db
      .collection("company")
      .doc(companyId)
      .collection("calendar")
      .where(
        "firebaseDateTimestamp",
        ">=",
        firebase.firestore.Timestamp.fromDate(startDate)
      )
      .where(
        "firebaseDateTimestamp",
        "<=",
        firebase.firestore.Timestamp.fromDate(endDate)
      )
      .get()
      .then((result) => {
        if (result?.docs && result?.docs?.length > 0) {
          let allEvents = [];
          result?.docs.forEach((doc) => {
            let newTitle = doc?.data()?.title || "";
            let newDesc = doc.data()?.description || "";

            if (doc.data().editedUser) {
              newTitle =
                newTitle + `, updated by user: ${doc.data().editedUser}`;
              newDesc = newDesc + `, updated by user: ${doc.data().editedUser}`;
            }

            allEvents.push({
              eventId: doc.id,
              title: newTitle,
              titleField: doc.data()?.titleField,
              start: doc.data()?.start,
              end: doc.data()?.end,
              description: newDesc,
              descriptionField: doc.data()?.description,
              employees: doc.data()?.employees,
              eventColor: doc.data()?.eventColor,
              allDay: doc.data()?.allDay,
              linkedDocumentType: doc.data()?.linkedDocumentType,
              editedUser: doc.data().editedUser,
            });
          });
          setEvents(allEvents);
          dispatch(setLoading(false));
        } else {
          setEvents([]);
          dispatch(setLoading(false));
        }
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while fetching events: ${err?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  }

  const handleDatesSet = (arg) => {
    if (selectedCompany) {
      // arg.start and arg.end represent the visible date range in the calendar
      const startDate = arg.start;
      const endDate = arg.end;

      set_us_fromDate(startDate);
      set_us_ToDate(endDate);

      fetchEventDateRange(selectedCompany.id, startDate, endDate);
    }
  };

  const handleChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);

      set_us_date_display(calendarApi.getDate());
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      set_us_date_display(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      set_us_date_display(calendarApi.getDate());
    }
  };

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      set_us_date_display(calendarApi.getDate());
    }
  };

  const handleSelectEvent = (arg) => {
    const o_event_selected = arg?.event?._def;
    const o_event_dates = arg?.event?._instance?.range;

    const startTimeFormatted =
      (o_event_dates?.start &&
        moment(moment(o_event_dates?.start).utc()).utc().format("HH:mm")) ||
      "00:00";
    const endTimeFormatted =
      (o_event_dates?.end &&
        moment(moment(o_event_dates?.end).utc()).utc().format("HH:mm")) ||
      "00:00";

    set_updatedEvent({
      publicId: o_event_selected?.extendedProps?.eventId || "",
      date: o_event_dates?.start || new Date(),
      titleField: o_event_selected?.extendedProps?.titleField || "",
      description: o_event_selected?.extendedProps?.descriptionField || "",
      startTime: startTimeFormatted,
      endTime: endTimeFormatted,
      employees: o_event_selected?.extendedProps?.employees || [],
      eventColor: o_event_selected?.extendedProps?.eventColor || "",
      editedUser: o_event_selected?.extendedProps?.editedUser || "",
      linkedDocumentType:
        o_event_selected?.extendedProps?.linkedDocumentType || "",
    });

    set_us_operationType("update");

    set_us_b_open_event_dlg(true);
  };

  function handleClose() {
    set_us_b_open_event_dlg(false);
  }

  const handleEventInteraction = async (arg) => {
    dispatch(setLoading(true));

    const o_event_selected = arg?.event?._def;
    const o_event_dates = arg?.event?._instance?.range;

    let formattedDate = moment(o_event_dates?.start).format("YYYY-MM-DD");

    const startTimeFormatted =
      (o_event_dates?.start &&
        moment(moment(o_event_dates?.start).utc()).utc().format("HH:mm")) ||
      "00:00";
    const endTimeFormatted =
      (o_event_dates?.end &&
        moment(moment(o_event_dates?.end).utc()).utc().format("HH:mm")) ||
      "00:00";

    let startTimeString = `${formattedDate}T${startTimeFormatted}:00Z`;
    let endTimeString = `${formattedDate}T${endTimeFormatted}:00Z`;

    let employeeNames = "";
    o_event_selected?.extendedProps?.employees.forEach((employee) => {
      employeeNames = employeeNames + employee?.name + ", ";
    });

    let eventTitle = `Title: ${o_event_selected?.extendedProps?.titleField}`;

    let eventDescription = o_event_selected?.extendedProps?.descriptionField;

    if (o_event_selected?.extendedProps?.description) {
      eventTitle =
        eventTitle +
        ` - Description: ${o_event_selected?.extendedProps?.description}`;
    }

    if (employeeNames) {
      eventTitle = eventTitle + ` - Assigned employees: ${employeeNames}`;
    }

    eventTitle =
      eventTitle +
      ` - Start time: ${startTimeFormatted} - End time: ${endTimeFormatted}`;

    await db
      .collection("company")
      .doc(selectedCompany.id)
      .collection("calendar")
      .doc(o_event_selected?.extendedProps?.eventId)
      .set(
        {
          title: eventTitle,
          description: eventDescription,
          start: startTimeString,
          end: endTimeString,
          editedUser: user?.email,
          firebaseDateTimestamp: firebase.firestore.Timestamp.fromDate(
            new Date(formattedDate)
          ),
        },
        { merge: true }
      )
      .then(() => {
        // fetchEvent();
        fetchEventDateRange(selectedCompany.id, us_fromDate, us_ToDate);
        enqueueSnackbar("Details recorded successfully");
        dispatch(setLoading(false));
      })
      .catch((err) => {
        enqueueSnackbar(`Error occured while saving details: ${err?.message}`, {
          variant: "error",
        });
        dispatch(setLoading(false));
      });
  };

  const handleSelectChange = async (e, value, reason) => {
    e.preventDefault();
    if (reason !== "removeOption" && reason !== "clear" && value) {
      if (us_fromDate && us_ToDate) {
        fetchEventDateRange(value.id, us_fromDate, us_ToDate);
      }
      set_selectedCompany(value);
    } else if (reason === "removeOption" || reason === "clear") {
      setEvents([]);
      set_selectedCompany(null);
    }
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Stack spacing={3} direction="row" alignItems={"center"}>
            <Button
              startIcon={<KeyboardBackspaceIcon />}
              variant="contained"
              color="primary"
              onClick={() => navigate(PATH_DASHBOARD.general.app1)}
            >
              back
            </Button>
            <Typography variant="h3">Calendar section</Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={12}>
          <Autocomplete
            ListboxProps={{ style: { maxHeight: "70vh" } }}
            size="small"
            label="Please choose a company"
            id="company-drop-down"
            options={companyList}
            value={selectedCompany || null}
            sx={{ width: 300 }}
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
            getOptionLabel={(option) => option.name}
          />
        </Grid>

        {selectedCompany && viewPermissionGranted ? (
          <>
            <Grid item xs={12} md={12}>
              <Typography>Filter by date</Typography>

              <br />
              <Grid container spacing={3} alignItems={"flex-end"}>
                <Grid item xs={12} sm={6} md={2}>
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
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
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
                </Grid>
                <Grid item xs={12} sm={4} md={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      fetchEventDateRange(
                        selectedCompany.id,
                        us_fromDate,
                        us_ToDate
                      )
                    }
                  >
                    search
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {" "}
                  {events && events?.length > 0 ? (
                    <Alert
                      severity="info"
                      size="small"
                    >{`${events?.length} task(s) found for this date`}</Alert>
                  ) : (
                    <Alert
                      severity="warning"
                      size="small"
                    >{`No task found for this date`}</Alert>
                  )}
                </Grid>
              </Grid>

              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  set_us_operationType("create");
                  set_us_b_open_event_dlg(true);
                }}
                style={{ width: "300px" }}
                disabled={
                  !user?.permissions?.addCalendarTask?.assignedCompanyId?.includes(
                    selectedCompany?.id
                  )
                }
              >
                Add employee task
              </Button>
            </Grid>
            <Grid item xs={12} md={12}>
              <br />
              <hr />
              <br />
              <EventColorIndicator />
              <br />
              <Card>
                <CalendarStyle>
                  <CalendarToolbar
                    date={us_date_display}
                    view={view}
                    onNextDate={handleClickDateNext}
                    onPrevDate={handleClickDatePrev}
                    onToday={handleClickToday}
                    onChangeView={handleChangeView}
                  />
                  <FullCalendar
                    timeZone="UTC"
                    weekends
                    editable={true}
                    droppable
                    selectable
                    events={events || []}
                    eventContent={(eventInfo) => (
                      <CustomEvent event={eventInfo.event} />
                    )}
                    ref={calendarRef}
                    rerenderDelay={10}
                    initialDate={us_date_display}
                    initialView={view}
                    headerToolbar={false}
                    // allDayMaintainDuration
                    eventClick={handleSelectEvent}
                    eventResize={handleEventInteraction}
                    eventDrop={handleEventInteraction}
                    height={isDesktop ? 720 : "auto"}
                    plugins={[
                      listPlugin,
                      dayGridPlugin,
                      timelinePlugin,
                      timeGridPlugin,
                      interactionPlugin,
                    ]}
                    eventTimeFormat={{
                      hour: "2-digit",
                      minute: "2-digit",
                      meridiem: "short",
                    }}
                    datesSet={handleDatesSet}
                  />
                </CalendarStyle>
              </Card>
            </Grid>
          </>
        ) : (
          <></>
        )}
      </Grid>

      {us_b_open_event_dlg ? (
        <Suspense fallback={<></>}>
          <CalendarForm
            selectedCompany={selectedCompany}
            operationType={us_operationType}
            updatedEvent={updatedEvent || null}
            set_updatedEvent={set_updatedEvent}
            open={us_b_open_event_dlg}
            onCancel={handleClose}
            fetchEventDateRange={fetchEventDateRange}
            fetchEmployee={fetchEmployee}
            employeesList={us_employees}
            us_fromDate={us_fromDate}
            us_ToDate={us_ToDate}
          />
        </Suspense>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default CalendarIndex;
