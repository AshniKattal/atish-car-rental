import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { formatDocumentIdNumber } from "src/components/core-functions/SelectionCoreFunctions";
import { setLoading } from "src/features/globalSlice";
import db from "src/firebase";
import useAuth from "src/hooks/useAuth";
import firebase from "firebase/compat";

export default function ContractConfirmationDialog({
  data,
  setData,
  fetchBooking,
}) {
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  async function createContract() {
    dispatch(setLoading(true));

    var documentDocRef = db.collection("contract").doc("documentIndex");

    db.runTransaction((transaction) => {
      return transaction.get(documentDocRef).then((sfDoc) => {
        if (!sfDoc.exists) {
          // throw "Document does not exist!";
          transaction.update(documentDocRef, {
            documentIndex: 1,
          });
          return 1;
        }

        var newDocumentNumber = Number(sfDoc.data().documentIndex) + 1;
        transaction.update(documentDocRef, {
          documentIndex: newDocumentNumber,
        });
        return newDocumentNumber;
      });
    })
      .then(async (documentNumber) => {
        let documentNumberDocString = await formatDocumentIdNumber(
          documentNumber
        );

        documentNumberDocString = `PC${documentNumberDocString}`;

        if (documentNumberDocString) {
          performCreateTransaction(documentNumberDocString);
        }
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while overall updating contract ID transactions: ${err?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  }

  async function performCreateTransaction(documentNumberDocString) {
    await db
      .collection("contract")
      .doc(documentNumberDocString)
      .set(
        {
          contractId: documentNumberDocString,
          clientId: data?.booking?.data?.createdByUserId,
          bookingId: data?.booking?.id,
          pickUpDate: data?.booking?.data?.bookingPickupDate,
          dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
          userCreated: user?.id,
          userEmail: user?.email || "",
        },
        { merge: true }
      )
      .then(async () => {
        await db
          .collection("vehiclebooking")
          .doc(data?.booking?.id)
          .set(
            {
              contractId: documentNumberDocString,
            },
            { merge: true }
          )
          .then(() => {
            enqueueSnackbar("Contract created successfully.");
            dispatch(setLoading(false));
            fetchBooking();

            setData({ open: false });
          });
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while creating contract: ${err?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  }

  return (
    <Dialog open={data?.open || false} maxWidth="md" fullWidth>
      <DialogTitle>Are you sure you want to create a contract ? </DialogTitle>
      <DialogContent>
        <Divider />
        <br />

        <Typography>
          After creating the contract, if you want to delete the contract, you
          need to go to the contract section.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => createContract()}
        >
          Create
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setData({ open: false })}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
