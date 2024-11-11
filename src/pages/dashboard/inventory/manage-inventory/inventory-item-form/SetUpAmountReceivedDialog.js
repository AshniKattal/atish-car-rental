import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import db from "src/firebase";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { setLoading } from "src/features/globalSlice";
import firebase from "firebase/compat";

export default function SetUpAmountReceivedDialog({
  data,
  setData,
  dialogType,
  fetchData,
  setState,
}) {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const temp_retrievedListRef = useRef();

  const [list, setList] = useState([]);

  const [amount, setAmount] = useState("");

  useEffect(() => {
    temp_retrievedListRef.current();
  }, [data?.open]);

  async function retrievedList() {
    if (data?.open) {
      dispatch(setLoading(true));
      await db
        .collection("company")
        .doc(data?.companyId)
        .collection("inventory")
        .doc(data?.inventoryId)
        .collection(data?.type)
        .orderBy("timestamp", "desc")
        .get()
        .then((result) => {
          if (result?.docs?.length > 0) {
            let arr = [];
            result?.docs.forEach((doc) => {
              arr.push({ id: doc?.id, data: { ...doc?.data() } });
            });
            setList(arr);
            dispatch(setLoading(false));
          } else {
            setList([]);
            dispatch(setLoading(false));
          }
        })
        .catch((error) => {
          enqueueSnackbar(
            `Error occured while retieving history list: ${error?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  }

  temp_retrievedListRef.current = retrievedList;

  async function submitChanges() {
    dispatch(setLoading(true));
    await db
      .collection("company")
      .doc(data?.companyId)
      .collection("inventory")
      .doc(data?.inventoryId)
      .collection(data?.type)
      .add({
        timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
        amount: amount,
      })
      .then(async () => {
        let updatedData = {
          [data?.type]: amount,
        };

        await db
          .collection("company")
          .doc(data?.companyId)
          .collection("inventory")
          .doc(data?.inventoryId)
          .set(
            {
              ...updatedData,
            },
            { merge: true }
          )
          .then(() => {
            setState((prev) => {
              return { ...prev, [data?.type]: amount };
            });
            setAmount("");
            enqueueSnackbar("Changes recorded successfully");
            fetchData();
            retrievedList();
            dispatch(setLoading(false));
            setData({
              open: false,
            });
          })
          .catch((error) => {
            enqueueSnackbar(
              `Error occured while retieving : ${error?.message}`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      })
      .catch((error) => {
        enqueueSnackbar(
          `Error occured while retieving history list: ${error?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  }

  return (
    <Dialog open={data?.open} maxWidth="md" fullWidth>
      <DialogTitle>Amount Update History</DialogTitle>
      <DialogContent>
        <Divider />
        <br />
        <Grid container spacing={3}>
          {dialogType !== "view" ? (
            <Grid item xs={12} md={5}>
              <Stack
                spacing={2}
                direction={"row"}
                alignItems={"center"}
                sx={{ whiteSpace: "nowrap" }}
              >
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  name={"amount"}
                  label={data?.typeLabel}
                  type="text"
                  id={"amount"}
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                  }}
                  disabled={dialogType === "view"}
                />

                {amount ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => submitChanges()}
                  >
                    Submit
                  </Button>
                ) : (
                  <></>
                )}
              </Stack>
            </Grid>
          ) : (
            <></>
          )}

          <Grid item xs={12} md={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell size="small" align="center">
                      Date - last manually modified
                    </TableCell>
                    <TableCell size="small" align="center">
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list &&
                    list?.length > 0 &&
                    list?.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell size="small" align="center">
                          {data?.data?.timestamp
                            ? moment(data?.data?.timestamp.toDate()).format(
                                "DD-MM-YYYY HH:mm:ss"
                              )
                            : ""}
                        </TableCell>
                        <TableCell size="small" align="center">
                          {data?.data?.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          onClick={() =>
            setData({
              open: false,
            })
          }
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
