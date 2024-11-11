import {
  Badge,
  Button,
  Container,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import BadgeStatus from "src/components/BadgeStatus";
import { setLoading } from "src/features/globalSlice";
import db from "src/firebase";
import EditIcon from "@mui/icons-material/Edit";
import Page from "src/components/Page";
import useSettings from "src/hooks/useSettings";
import useAuth from "src/hooks/useAuth";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import { setBookingData } from "src/features/bookingSlice";
import UpdateVehicleBookingDialog from "./UpdateVehicleBookingDialog";
import ContractConfirmationDialog from "./ContractConfirmationDialog";
import Iconify from "src/components/Iconify";
import {
  handleViewDownloadAtish,
  handleViewDownloadAtishRecto,
} from "src/components/core-functions/SelectionCoreFunctions";

export default function BookingList() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const theme = useTheme();

  const dispatch = useDispatch();

  const { themeStretch } = useSettings();

  const temp_fetchBookingRef = useRef();

  const { enqueueSnackbar } = useSnackbar();

  const [bookingList, setBookingList] = useState([]);

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(null);

  useEffect(() => {
    temp_fetchBookingRef.current();
  }, []);

  const fetchBooking = async () => {
    dispatch(setLoading(true));

    if (user && user?.role === "client") {
      await db
        .collection("vehiclebooking")
        .where("createdByUserId", "==", user?.id)
        .orderBy("dateCreated", "desc")
        .get()
        .then((result) => {
          if (result?.docs?.length > 0) {
            let arr = [];
            result?.docs.forEach((doc) => {
              if (doc?.id !== "documentIndex") {
                arr.push({ id: doc?.id, data: { ...doc?.data() } });
              }
            });

            setBookingList(arr);
            dispatch(setLoading(false));
          } else {
            setBookingList([]);
            dispatch(setLoading(false));
          }
        })
        .catch((error) => {
          enqueueSnackbar(
            `Error occured while retrieving booking list: ${error?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    } else if (user && user?.role !== "client") {
      await db
        .collection("vehiclebooking")
        .orderBy("dateCreated", "desc")
        .get()
        .then((result) => {
          if (result?.docs?.length > 0) {
            let arr = [];
            result?.docs.forEach((doc) => {
              if (doc?.id !== "documentIndex") {
                arr.push({ id: doc?.id, data: { ...doc?.data() } });
              }
            });

            setBookingList(arr);
            dispatch(setLoading(false));
          } else {
            setBookingList([]);
            dispatch(setLoading(false));
          }
        })
        .catch((error) => {
          enqueueSnackbar(
            `Error occured while retrieving booking list: ${error?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  };

  temp_fetchBookingRef.current = fetchBooking;

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
              <Typography variant="h4">{`Vehicle booking section`}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <TableContainer>
              <Table border={1}>
                <TableHead>
                  <TableRow>
                    <TableCell size="small" align="center" />
                    <TableCell size="small" align="center">
                      <Typography>Update</Typography>
                    </TableCell>
                    <TableCell size="small" align="center">
                      <Typography>Status</Typography>
                    </TableCell>
                    <TableCell size="small" align="center">
                      <Typography>Booking ID</Typography>
                    </TableCell>
                    <TableCell size="small" align="center">
                      <Typography>Contract</Typography>
                    </TableCell>
                    <TableCell size="small" align="center">
                      <Typography>Client name</Typography>
                    </TableCell>
                    <TableCell size="small" align="center">
                      <Typography>Vehicle</Typography>
                    </TableCell>
                    <TableCell size="small" align="center">
                      <Typography>Pickup date time</Typography>
                    </TableCell>
                    <TableCell size="small" align="center">
                      <Typography>Return date time</Typography>
                    </TableCell>
                    <TableCell size="small" align="center">
                      <Typography>Pickup address</Typography>
                    </TableCell>
                    {/* <TableCell size="small" align="center">
                      <Typography>All booking details</Typography>
                    </TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookingList &&
                    bookingList?.length > 0 &&
                    bookingList?.map((booking, index) => (
                      <TableRow key={index}>
                        <TableCell
                          size="small"
                          align="center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          size="small"
                          align="center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          <IconButton
                            color="primary"
                            onClick={() => {
                              dispatch(
                                setBookingData({
                                  ...booking?.data,
                                  bookingPickupDate:
                                    booking?.data?.bookingPickupDate.toDate(),

                                  bookingReturnDate:
                                    booking?.data?.bookingReturnDate.toDate(),
                                })
                              );
                              setOpenUpdateDialog(true);
                            }}
                            disabled={
                              user &&
                              user?.role === "client" &&
                              booking?.data?.status === "confirmed"
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell
                          size="small"
                          align="center"
                          style={{
                            background:
                              booking?.data?.status === "pending"
                                ? theme.palette.warning.main
                                : booking?.data?.status === "confirmed"
                                ? theme.palette.success.main
                                : booking?.data?.status === "declined"
                                ? theme.palette.error.main
                                : "",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Typography style={{ textTransform: "capitalize" }}>
                            {booking?.data?.status}
                          </Typography>
                        </TableCell>
                        <TableCell
                          size="small"
                          align="center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {booking?.data?.bookingId || ""}
                        </TableCell>

                        <TableCell
                          size="small"
                          align="center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {!booking?.data?.contractId ? (
                            <Button
                              variant="contained"
                              color="info"
                              onClick={() =>
                                setOpenConfirmationDialog({
                                  open: true,
                                  booking: booking,
                                })
                              }
                            >
                              Create contract
                            </Button>
                          ) : (
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              justifyContent={"center"}
                              spacing={2}
                            >
                              <IconButton
                                variant="contained"
                                color="info"
                                onClick={() => {
                                  handleViewDownloadAtishRecto(
                                    "view",
                                    booking?.data?.createdByUserId,
                                    booking
                                  );
                                }}
                              >
                                <Iconify icon={"carbon:view"} />
                              </IconButton>

                              <IconButton
                                variant="contained"
                                color="info"
                                onClick={() => {
                                  handleViewDownloadAtishRecto(
                                    "download",
                                    booking?.data?.createdByUserId,
                                    booking
                                  );
                                }}
                              >
                                <Iconify icon={"eva:download-fill"} />
                              </IconButton>
                            </Stack>
                          )}
                        </TableCell>

                        <TableCell
                          size="small"
                          align="center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {booking?.data?.clientName || ""}
                        </TableCell>
                        <TableCell
                          size="small"
                          align="center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {booking?.data?.vehicleDetails?.name || ""}
                        </TableCell>
                        <TableCell
                          size="small"
                          align="center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {`${moment(
                            booking?.data?.bookingPickupDate.toDate()
                          ).format("DD/MM/YYYY")}, ${
                            booking?.data?.bookingPickupTime
                          }`}
                        </TableCell>
                        <TableCell
                          size="small"
                          align="center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {`${moment(
                            booking?.data?.bookingReturnDate.toDate()
                          ).format("DD/MM/YYYY")}, ${
                            booking?.data?.bookingReturnTime
                          }`}
                        </TableCell>
                        <TableCell
                          size="small"
                          align="center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {booking?.data?.bookingPickupAddress?.id ===
                          "anywhere"
                            ? booking?.data?.bookingPickupAnywhereAddress
                            : booking?.data?.bookingPickupAddress?.title}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>

      {openUpdateDialog ? (
        <UpdateVehicleBookingDialog
          open={openUpdateDialog}
          setOpen={setOpenUpdateDialog}
          fetchBooking={fetchBooking}
        />
      ) : (
        <></>
      )}

      {openConfirmationDialog?.open ? (
        <ContractConfirmationDialog
          data={openConfirmationDialog}
          setData={setOpenConfirmationDialog}
          fetchBooking={fetchBooking}
        />
      ) : (
        <></>
      )}
    </Page>
  );
}
