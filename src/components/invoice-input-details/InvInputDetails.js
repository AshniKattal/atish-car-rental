import { useEffect, useRef, useState } from "react";
// @mui
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectInvoiceSection } from "../../features/invoiceSectionSlice";
import Scrollbar from "../Scrollbar";
import useResponsive from "../../hooks/useResponsive";
import db from "../../firebase";
import { useSnackbar } from "notistack";
import { setLoading } from "../../features/globalSlice";
import moment from "moment";
import firebase from "firebase/compat";
import { dynamicSort } from "../core-functions/SelectionCoreFunctions";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// ----------------------------------------------------------------------

export default function InvInputDetails({
  action,
  handleCloseUpdateDialog,
  set_us_actionChoice,
}) {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const isDesktop = useResponsive("up", "md");

  const ref = useRef(null);

  const { companyInvSelected, clientInvSelected, updateInvData } =
    useSelector(selectInvoiceSection);

  const [invDetails, setInvDetails] = useState({
    /* invCompDetails: { ...companyInvSelected },
    invClientDetails: { ...clientInvSelected },
    invDate: moment(new Date()).format("yyyy-MM-DD"), */
    /*  invCompDetails: {},
    invClientDetails: {},
    invDate: "",
    invVehicleNo: "",
    invJobRef: "",
    invParticulars: [],
    invRemarks: "",
    invSubTotal: 0,
    invStorageFee: 0,
    invScanningFee: 0,
    invEdiFee: 0,
    invVatFee: 0,
    invTotal: 0, */

    invCompDetails: { ...companyInvSelected },
    invClientDetails:
      action === "update" && updateInvData !== undefined
        ? { ...updateInvData?.data?.clientDetails }
        : { ...clientInvSelected },
    invDate:
      action === "update" && updateInvData !== undefined
        ? moment(updateInvData?.data?.invDate.toDate()).format("yyyy-MM-DD")
        : moment(new Date()).format("yyyy-MM-DD"),
    invVehicleNo:
      action === "update" && updateInvData !== undefined
        ? updateInvData?.data?.invVehicleNo || ""
        : "",
    invJobRef:
      action === "update" && updateInvData !== undefined
        ? updateInvData?.data?.invJobRef || ""
        : "",
    invParticulars:
      action === "update" && updateInvData !== undefined
        ? updateInvData?.data?.invParticulars || []
        : [],
    invRemarks:
      action === "update" && updateInvData !== undefined
        ? updateInvData?.data?.invRemarks || ""
        : "",
    invSubTotal:
      action === "update" && updateInvData !== undefined
        ? updateInvData?.data?.invSubTotal || ""
        : "",
    invStorageFee:
      action === "update" && updateInvData !== undefined
        ? updateInvData?.data?.invStorageFee || ""
        : "",
    invScanningFee:
      action === "update" && updateInvData !== undefined
        ? updateInvData?.data?.invScanningFee || ""
        : "",
    invEdiFee:
      action === "update" && updateInvData !== undefined
        ? updateInvData?.data?.invEdiFee || ""
        : "",
    invVatFee:
      action === "update" && updateInvData !== undefined
        ? updateInvData?.data?.invVatFee || ""
        : "",
    invTotal:
      action === "update" && updateInvData !== undefined
        ? updateInvData?.data?.invTotal || ""
        : "",
  });

  const {
    invClientDetails,
    invDate,
    invVehicleNo,
    invJobRef,
    invParticulars,
    invRemarks,
    invSubTotal,
    invStorageFee,
    invScanningFee,
    invEdiFee,
    invVatFee,
    invTotal,
  } = invDetails;

  const [us_transportFees, set_us_transportFees] = useState(
    action === "update" && updateInvData !== undefined
      ? updateInvData?.data?.transportFees || ""
      : ""
  );

  const [us_transportDesc, set_us_transportDesc] = useState(
    action === "update" && updateInvData !== undefined
      ? updateInvData?.data?.transportDesc || ""
      : ""
  );

  const [us_newParticular, set_us_newParticular] = useState("");

  const [us_particularDetail, set_us_particularDetail] = useState("");

  const [us_newParticular_orderNum, set_us_newParticular_orderNum] =
    useState(0);

  const [us_new_particularDetailList, set_us_new_particularDetailList] =
    useState([]);

  const [us_showViewInvoice, set_us_showViewInvoice] = useState({
    showViewButton: false,
    savedInvoice: null,
  });

  const [us_openDialog, set_us_openDialog] = useState(false);

  const [us_dlg_type, set_us_dlg_type] = useState("");

  const [us_update_id, set_us_update_id] = useState("");

  const temp_fetch_particulars_ref = useRef();

  const temp_calculateTotal_ref = useRef();

  // fetch all stored particulars
  useEffect(() => {
    temp_fetch_particulars_ref.current();
  }, [action]);

  // calculate total
  useEffect(() => {
    temp_calculateTotal_ref.current();
  }, [
    invParticulars,
    invStorageFee,
    invScanningFee,
    us_transportFees,
    invVatFee,
  ]);

  async function fetchParticulars() {
    set_us_showViewInvoice({
      showViewButton: false,
      savedInvoice: null,
    });

    if (action && action === "add") {
      dispatch(setLoading(true));

      await db
        .collection("company")
        .doc(companyInvSelected?.id)
        .collection("particulars")
        .get()
        .then(async (querySnapshot) => {
          if (querySnapshot?.docs?.length > 0) {
            let arr = [];
            querySnapshot?.docs.forEach((doc) => {
              arr.push({
                orderNum: doc?.data()?.orderNum || "",
                id: doc.id,
                isChecked: true,
                title: doc?.data()?.title,
                customDetail: "",
                selectedValue: "",
                valueList: doc?.data()?.valueList || [],
                amount: 0,
              });
            });

            arr.sort(dynamicSort("orderNum"));

            setInvDetails({ ...invDetails, invParticulars: arr });
            dispatch(setLoading(false));
          } else {
            await db
              .collection("particulars")
              .get()
              .then((querySnapshot) => {
                if (querySnapshot?.docs?.length > 0) {
                  let arr = [];
                  querySnapshot?.docs.forEach((doc) => {
                    arr.push({
                      orderNum: doc?.data()?.orderNum || "",
                      id: doc.id,
                      isChecked: true,
                      title: doc?.data()?.title,
                      customDetail: "",
                      selectedValue: "",
                      valueList: doc?.data()?.valueList || [],
                      amount: 0,
                    });
                  });

                  arr.sort(dynamicSort("orderNum"));

                  setInvDetails({ ...invDetails, invParticulars: arr });
                  dispatch(setLoading(false));
                } else {
                  setInvDetails({ ...invDetails, invParticulars: [] });
                  dispatch(setLoading(false));
                }
              })
              .catch((err) => {
                enqueueSnackbar(
                  `Error occured while fetching particulars: ${err?.message}`,
                  { variant: "error" }
                );
                dispatch(setLoading(false));
              });
          }
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while fetching particulars: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  }

  temp_fetch_particulars_ref.current = fetchParticulars;

  function calculateTotal() {
    let subTotal = 0;
    let total = 0;

    // custom total calculation for ashley
    // only one amount for ashley -> transport fees
    if (
      companyInvSelected &&
      (companyInvSelected?.id === process.env.REACT_APP_CUSTOM_ASHLEY_ID ||
        companyInvSelected?.id === process.env.REACT_APP_CUSTOM_SOREFAN_ID)
    ) {
      subTotal = subTotal + Number(us_transportFees);
    } else {
      // total particulars
      if (invParticulars?.length > 0) {
        invParticulars.forEach((particular) => {
          if (particular?.isChecked) {
            subTotal = subTotal + Number(particular?.amount || 0);
          }
        });
      }
    }

    // fees
    total =
      subTotal +
      Number(invStorageFee) +
      Number(invScanningFee) +
      Number(invVatFee);

    setInvDetails({ ...invDetails, invSubTotal: subTotal, invTotal: total });
  }

  temp_calculateTotal_ref.current = calculateTotal;

  function handleAmountChange(value, id) {
    if (Number(value) >= 0) {
      if (invParticulars?.length > 0) {
        let newList = [];
        for (var i = 0; i < invParticulars?.length; i++) {
          if (invParticulars[i].id === id) {
            if (Number(value) > 0) {
              newList.push({
                ...invParticulars[i],
                amount: value,
                isChecked: true,
              });
            } else if (Number(value) <= 0) {
              newList.push({
                ...invParticulars[i],
                amount: value,
                isChecked: false,
              });
            }
          } else {
            newList.push(invParticulars[i]);
          }
        }
        setInvDetails({ ...invDetails, invParticulars: newList });
      }
    }
  }

  const handleCloseDialog = () => {
    set_us_openDialog(false);
    set_us_dlg_type("");
    set_us_update_id("");
  };

  function deleteNewParticularDetail(index) {
    if (us_new_particularDetailList?.length > 0) {
      if (us_new_particularDetailList?.length === 1) {
        set_us_new_particularDetailList([]);
      } else {
        let newList = [];
        for (var i = 0; i < us_new_particularDetailList?.length; i++) {
          if (i !== index) {
            newList.push(us_new_particularDetailList[i]);
          }
        }
        set_us_new_particularDetailList(newList);
      }
    }
  }

  function addParticularDetail() {
    if (us_particularDetail && us_particularDetail !== "") {
      let newList = [...us_new_particularDetailList];
      newList.push(us_particularDetail);
      set_us_new_particularDetailList(newList);

      set_us_particularDetail("");
    }
  }

  function handleParticularDetailChange(index, value) {
    if (us_new_particularDetailList?.length > 0) {
      let newList = [];
      for (var i = 0; i < us_new_particularDetailList?.length; i++) {
        if (i === index) {
          newList.push(value);
        } else {
          newList.push(us_new_particularDetailList[i]);
        }
      }
      set_us_new_particularDetailList(newList);
    }
  }

  async function submitChanges() {
    if (us_newParticular !== undefined && us_newParticular !== "") {
      dispatch(setLoading(true));

      if (us_dlg_type === "add") {
        await db
          .collection("company")
          .doc(companyInvSelected?.id)
          .collection("particulars")
          .add({
            orderNum: us_newParticular_orderNum,
            title: us_newParticular,
            customDetail: us_particularDetail,
            selectedValue: "",
            valueList: [us_particularDetail],
          })
          .then((docRef) => {
            enqueueSnackbar("Particular added successfully");

            let newInvParticularsList = [
              ...invDetails?.invParticulars,
              {
                id: docRef?.id,
                isChecked: false,
                title: us_newParticular,
                customDetail: us_particularDetail,
                orderNum: us_newParticular_orderNum,
                valueList: [us_particularDetail],
                amount: 0,
              },
            ];

            newInvParticularsList.sort(dynamicSort("orderNum"));

            setInvDetails({
              ...invDetails,
              invParticulars: newInvParticularsList,
            });

            set_us_particularDetail("");
            set_us_newParticular("");
            set_us_newParticular_orderNum(0);
            set_us_new_particularDetailList([]);

            handleCloseDialog();
            dispatch(setLoading(false));
          })
          .catch((err) => {
            enqueueSnackbar(
              `Error occured while adding new particular: ${
                err?.message || ""
              }`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      } else if (us_dlg_type === "update") {
        await db
          .collection("company")
          .doc(companyInvSelected?.id)
          .collection("particulars")
          .doc(us_update_id)
          .set(
            {
              title: us_newParticular,
              valueList: us_new_particularDetailList,
            },
            { merge: true }
          )
          .then(() => {
            enqueueSnackbar("Particular updated successfully");

            let newList = [];
            if (invDetails?.invParticulars?.length > 0) {
              invDetails?.invParticulars.forEach((particular) => {
                if (particular?.id === us_update_id) {
                  newList.push({
                    ...particular,
                    title: us_newParticular,
                    valueList: us_new_particularDetailList,
                    // selectedValue: us_new_particularDetailList[0],
                  });
                } else {
                  newList.push({ ...particular });
                }
              });
            }

            setInvDetails({
              ...invDetails,
              invParticulars: newList,
            });

            set_us_particularDetail("");
            set_us_newParticular("");
            set_us_new_particularDetailList([]);

            handleCloseDialog();
            dispatch(setLoading(false));
          })
          .catch((err) => {
            enqueueSnackbar(
              `Error occured while adding new particular: ${
                err?.message || ""
              }`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      }
    }
  }

  function handleChkChange(value, id) {
    if (invParticulars?.length > 0) {
      let newList = [];
      for (var i = 0; i < invParticulars?.length; i++) {
        if (invParticulars[i].id === id) {
          newList.push({ ...invParticulars[i], isChecked: value });
        } else {
          newList.push(invParticulars[i]);
        }
      }
      setInvDetails({ ...invDetails, invParticulars: newList });
    }
  }

  function handleInputChange(value, id, name) {
    if (invParticulars?.length > 0) {
      let newList = [];
      for (var i = 0; i < invParticulars?.length; i++) {
        if (invParticulars[i].id === id) {
          newList.push({ ...invParticulars[i], [name]: value });
        } else {
          newList.push(invParticulars[i]);
        }
      }
      setInvDetails({ ...invDetails, invParticulars: newList });
    }
  }

  function handleOrderChange(value, id) {
    if (invParticulars?.length > 0) {
      let newList = [];
      for (var i = 0; i < invParticulars?.length; i++) {
        if (invParticulars[i].id === id) {
          newList.push({ ...invParticulars[i], orderNum: Number(value) });
        } else {
          newList.push(invParticulars[i]);
        }
      }

      newList.sort(dynamicSort("orderNum"));

      setInvDetails({ ...invDetails, invParticulars: newList });
    }
  }

  function handleAdditionalFeesChange(value, fee) {
    if (Number(value) >= 0) {
      setInvDetails({ ...invDetails, [fee]: value });
    }
  }

  /*   async function deleteParticular(id) {
    dispatch(setLoading(true));
    await db
      .collection("particulars")
      .doc(id)
      .delete()
      .then(() => {
        const newList = invDetails?.invParticulars.filter(
          (particular) => particular.id !== id
        );

        setInvDetails({
          ...invDetails,
          invParticulars: newList,
        });

        enqueueSnackbar("Particular successfully deleted!");
        dispatch(setLoading(false));
      })
      .catch((error) => {
        enqueueSnackbar(`Error removing document: ${error?.message}`, {
          variant: "error",
        });
        dispatch(setLoading(false));
      });
  } */

  async function saveInvoice() {
    dispatch(setLoading(true));

    if (action === "add") {
      var invoiceDocRef = db
        .collection("company")
        .doc(companyInvSelected?.id)
        .collection("invoice")
        .doc("invNumber");

      db.runTransaction((transaction) => {
        return transaction.get(invoiceDocRef).then((sfDoc) => {
          if (!sfDoc.exists) {
            // throw "Document does not exist!";
            transaction.update(invoiceDocRef, { invNumber: 1 });
            return 1;
          }

          var newInvoiceNumber = Number(sfDoc.data().invNumber) + 1;
          transaction.update(invoiceDocRef, { invNumber: newInvoiceNumber });
          return newInvoiceNumber;
        });
      })
        .then(async (newInvoiceNumber) => {
          let invoiceDoc = newInvoiceNumber.toString();
          if (invoiceDoc?.length === 1) {
            invoiceDoc = `0000${invoiceDoc}`;
          } else if (invoiceDoc?.length === 2) {
            invoiceDoc = `000${invoiceDoc}`;
          } else if (invoiceDoc?.length === 3) {
            invoiceDoc = `00${invoiceDoc}`;
          } else if (invoiceDoc?.length === 4) {
            invoiceDoc = `0${invoiceDoc}`;
          }

          // check for new customDetail -> save as new doc in db if present
          let newInvParticulars = [];
          if (invParticulars?.length > 0) {
            invParticulars.forEach(async (particular) => {
              if (particular?.customDetail !== "") {
                // save customDetail
                newInvParticulars.push({
                  ...particular,
                  valueList: [
                    ...particular?.valueList,
                    particular?.customDetail,
                  ],
                });
              } else {
                newInvParticulars.push({ ...particular });
              }
            });
          }

          // check if company has collection particulars
          await db
            .collection("company")
            .doc(companyInvSelected?.id)
            .collection("particulars")
            .get()
            .then(async (queryDocs) => {
              // save all particulars if no particulars present
              if (queryDocs?.docs?.length === 0) {
                if (newInvParticulars?.length > 0) {
                  newInvParticulars.forEach(async (particular) => {
                    await db
                      .collection("company")
                      .doc(companyInvSelected?.id)
                      .collection("particulars")
                      .add({
                        orderNum: particular?.orderNum || "",
                        title: particular?.title || "",
                        customDetail: particular?.customDetail || "",
                        selectedValue: particular?.selectedValue || "",
                        valueList: particular?.valueList || [],
                        isChecked: particular?.isChecked || false,
                        amount: particular?.amount || "",
                      });
                  });
                }
              } else {
                // update entire particulars list
                if (newInvParticulars?.length > 0) {
                  newInvParticulars.forEach(async (particular) => {
                    if (particular?.id && particular?.id !== "") {
                      await db
                        .collection("company")
                        .doc(companyInvSelected?.id)
                        .collection("particulars")
                        .doc(particular?.id)
                        .update(
                          {
                            ...particular,
                          },
                          { merge: true }
                        );
                    }
                  });
                }
              }

              // save invoice
              await db
                .collection("company")
                .doc(companyInvSelected?.id)
                .collection("invoice")
                .doc(newInvoiceNumber.toString())
                .set(
                  {
                    id: newInvoiceNumber.toString(),
                    invoiceString: invoiceDoc,
                    companyDetails: companyInvSelected,
                    clientDetails: clientInvSelected,
                    invDate: firebase.firestore.Timestamp.fromDate(new Date()),
                    invVehicleNo: invVehicleNo,
                    invJobRef: invJobRef,
                    invParticulars: newInvParticulars,
                    invRemarks: invRemarks,
                    invSubTotal: invSubTotal,
                    invStorageFee: invStorageFee,
                    invScanningFee: invScanningFee,
                    invEdiFee: invEdiFee,
                    invVatFee: invVatFee,
                    invTotal: invTotal,
                    transportDesc: us_transportDesc,
                    transportFees: us_transportFees,
                    // used in payment section
                    paymentStatus: "Unpaid",
                    invRemainingPaymentAmt: invTotal,
                    attachedPaymentNumber: [],
                  },
                  { merge: true }
                )
                .then(async () => {
                  dispatch(setLoading(true));

                  set_us_showViewInvoice({
                    showViewButton: true,
                    savedInvoice: {
                      id: newInvoiceNumber.toString(),
                      invoiceString: invoiceDoc,
                      companyDetails: companyInvSelected,
                      clientDetails: clientInvSelected,
                      invDate: firebase.firestore.Timestamp.fromDate(
                        new Date()
                      ),
                      invVehicleNo: invVehicleNo,
                      invJobRef: invJobRef,
                      invParticulars: newInvParticulars,
                      invRemarks: invRemarks,
                      invSubTotal: invSubTotal,
                      invStorageFee: invStorageFee,
                      invScanningFee: invScanningFee,
                      invEdiFee: invEdiFee,
                      invVatFee: invVatFee,
                      invTotal: invTotal,
                      transportDesc: us_transportDesc,
                      transportFees: us_transportFees,
                      // used in payment section
                      paymentStatus: "Unpaid",
                      invRemainingPaymentAmt: invTotal,
                      attachedPaymentNumber: [],
                    },
                  });

                  await db
                    .collection("company")
                    .doc(companyInvSelected?.id)
                    .collection("particulars")
                    .get()
                    .then(async (querySnapshot) => {
                      if (querySnapshot?.docs?.length > 0) {
                        let arr = [];
                        querySnapshot?.docs.forEach((doc) => {
                          arr.push({
                            orderNum: doc?.data()?.orderNum || "",
                            id: doc.id,
                            isChecked: true,
                            title: doc?.data()?.title,
                            customDetail: "",
                            selectedValue: "",
                            valueList: doc?.data()?.valueList || [],
                            amount: 0,
                          });
                        });

                        arr.sort(dynamicSort("orderNum"));

                        setInvDetails({
                          ...invDetails,
                          invParticulars: [...arr],
                          invCompDetails: { ...companyInvSelected },
                          invClientDetails: { ...clientInvSelected },
                          invDate: moment(new Date()).format("yyyy-MM-DD"),
                          invVehicleNo: "",
                          invJobRef: "",
                          invRemarks: "",
                          invSubTotal: "",
                          invStorageFee: "",
                          invScanningFee: "",
                          invEdiFee: "",
                          invVatFee: "",
                          invTotal: "",
                        });
                        dispatch(setLoading(false));
                      }
                    });

                  enqueueSnackbar("Invoice saved successfully");

                  dispatch(setLoading(false));
                })
                .catch((err) => {
                  enqueueSnackbar(
                    `Error occured while saving Invoice: ${err?.message}`,
                    { variant: "error" }
                  );
                  dispatch(setLoading(false));
                });
            });
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while doing Invoice transaction: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    } else if (action === "update") {
      // check for new customDetail -> save as new doc in db if present
      let newInvParticulars = [];
      if (invParticulars?.length > 0) {
        invParticulars.forEach(async (particular) => {
          if (particular?.customDetail !== "") {
            // save customDetail
            newInvParticulars.push({
              ...particular,
              valueList: [...particular?.valueList, particular?.customDetail],
            });
          } else {
            newInvParticulars.push({ ...particular });
          }
        });
      }

      // check if company has collection particulars
      await db
        .collection("company")
        .doc(companyInvSelected?.id)
        .collection("particulars")
        .get()
        .then(async (queryDocs) => {
          // save all particulars if no particulars present
          if (queryDocs?.docs?.length === 0) {
            if (newInvParticulars?.length > 0) {
              newInvParticulars.forEach(async (particular) => {
                await db
                  .collection("company")
                  .doc(companyInvSelected?.id)
                  .collection("particulars")
                  .add({
                    orderNum: particular?.orderNum || "",
                    title: particular?.title || "",
                    customDetail: particular?.customDetail || "",
                    selectedValue: particular?.selectedValue || "",
                    valueList: particular?.valueList || [],
                    isChecked: particular?.isChecked || false,
                    amount: particular?.amount || "",
                  });
              });
            }
          } else {
            // update entire particulars list
            if (newInvParticulars?.length > 0) {
              newInvParticulars.forEach(async (particular) => {
                if (particular?.id && particular?.id !== "") {
                  await db
                    .collection("company")
                    .doc(companyInvSelected?.id)
                    .collection("particulars")
                    .doc(particular?.id)
                    .update(
                      {
                        ...particular,
                      },
                      { merge: true }
                    );
                }
              });
            }
          }

          // calculate remaining payment amount
          let remainingPaymentAmount = Number(invTotal);
          if (
            updateInvData?.data?.attachedPaymentNumber &&
            updateInvData?.data?.attachedPaymentNumber?.length > 0
          ) {
            updateInvData?.data?.attachedPaymentNumber.forEach(
              (paymentDone) => {
                remainingPaymentAmount =
                  remainingPaymentAmount - Number(paymentDone?.paymentAmount);
              }
            );
          }

          // save invoice
          await db
            .collection("company")
            .doc(companyInvSelected?.id)
            .collection("invoice")
            .doc(updateInvData?.id)
            .set(
              {
                companyDetails: companyInvSelected,
                clientDetails: invClientDetails,
                invVehicleNo: invVehicleNo,
                invJobRef: invJobRef,
                invParticulars: newInvParticulars,
                invRemarks: invRemarks,
                invSubTotal: invSubTotal,
                invStorageFee: invStorageFee,
                invScanningFee: invScanningFee,
                invEdiFee: invEdiFee,
                invVatFee: invVatFee,
                invTotal: invTotal,
                invRemainingPaymentAmt: remainingPaymentAmount,
                transportDesc: us_transportDesc,
                transportFees: us_transportFees,
              },
              { merge: true }
            )
            .then(() => {
              enqueueSnackbar("Invoice updated successfully");
              if (handleCloseUpdateDialog) {
                handleCloseUpdateDialog(true);
              }

              dispatch(setLoading(false));
            })
            .catch((err) => {
              enqueueSnackbar(
                `Error occured while updating Invoice: ${err?.message}`,
                { variant: "error" }
              );
              dispatch(setLoading(false));
            });
        });
    }
  }

  async function deleteParticular(id) {
    dispatch(setLoading(true));

    let newInvParticulars = [];
    if (invParticulars?.length > 0) {
      invParticulars.forEach(async (particular) => {
        if (particular?.id !== id) {
          newInvParticulars.push({
            ...particular,
          });
        }
      });

      newInvParticulars.sort(dynamicSort("orderNum"));

      setInvDetails({ ...invDetails, invParticulars: newInvParticulars });
    } else {
      setInvDetails({ ...invDetails, invParticulars: [] });
    }

    await db
      .collection("company")
      .doc(companyInvSelected?.id)
      .collection("particulars")
      .doc(id)
      .delete()
      .then(() => {
        enqueueSnackbar("Particular deleted successfully");
        dispatch(setLoading(false));
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while deleting particular: ${err?.message || ""}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  }

  function onHandleTransportFeeChange(value) {
    if (Number(value) >= 0) {
      set_us_transportFees(value);

      // calculate vat on transport if vat percentage is not zero
      if (
        companyInvSelected?.data?.vatPercentage &&
        Number(companyInvSelected?.data?.vatPercentage) > 0
      ) {
        let vatFee = 0;
        vatFee =
          (Number(companyInvSelected?.data?.vatPercentage) / 100) *
          Number(value);
        setInvDetails({ ...invDetails, invVatFee: vatFee });
      }
    }
  }

  return (
    <>
      <Grid item xs={12} md={12}>
        <hr />
        <br />
        <Typography>Please enter details required for the invoice</Typography>
      </Grid>

      <Grid item xs={12} md={12} ref={ref}>
        <Card /* style={{ width: isDesktop ? "40%" : "100%" }} */>
          <Stack style={{ padding: "20px" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack direction={"row"} spacing={3}>
                  <Typography style={{ whiteSpace: "nowrap" }}>
                    Send Invoice to
                  </Typography>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    name="clientName"
                    label="Sent Invoice to"
                    id="clientName"
                    type="text"
                    value={invClientDetails?.data?.name || ""}
                    disabled
                    size="small"
                    fullWidth
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack direction={"row"} spacing={3}>
                  <Typography style={{ whiteSpace: "nowrap" }}>Date</Typography>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    name="invoiceDate"
                    label="Date Of Invoice"
                    id="invoiceDate"
                    type="date"
                    value={invDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    size="small"
                    fullWidth
                    disabled
                  />
                </Stack>
              </Grid>
              {companyInvSelected &&
                companyInvSelected?.id !==
                  process.env.REACT_APP_CUSTOM_SOREFAN_ID && (
                  <Grid item xs={12} md={6}>
                    <Stack direction={"row"} spacing={3}>
                      <Typography style={{ whiteSpace: "nowrap" }}>
                        Clients BRN
                      </Typography>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        name="clientBrn"
                        label="Clients BRN"
                        id="clientBrn"
                        type="text"
                        value={invClientDetails?.data?.brn || ""}
                        disabled
                        size="small"
                        fullWidth
                      />
                    </Stack>
                  </Grid>
                )}

              <Grid item xs={12} md={6}>
                <Stack direction={"row"} spacing={3}>
                  <Typography style={{ whiteSpace: "nowrap" }}>
                    {companyInvSelected &&
                    companyInvSelected?.id ===
                      process.env.REACT_APP_CUSTOM_SOREFAN_ID
                      ? "Lorry number"
                      : "Vehicle number"}
                  </Typography>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    name="invVehicleNo"
                    label="Vehicle Number"
                    id="invVehicleNo"
                    type="text"
                    value={invVehicleNo || ""}
                    size="small"
                    onChange={(event) =>
                      setInvDetails({
                        ...invDetails,
                        invVehicleNo: event.target.value,
                      })
                    }
                    fullWidth
                  />
                </Stack>
              </Grid>
              {companyInvSelected &&
                companyInvSelected?.id !==
                  process.env.REACT_APP_CUSTOM_SOREFAN_ID && (
                  <Grid item xs={12} md={12}>
                    <Stack direction={"row"} spacing={3}>
                      <Typography style={{ whiteSpace: "nowrap" }}>
                        Job Ref
                      </Typography>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        name="invJobRef"
                        label="Job Ref"
                        id="invJobRef"
                        type="text"
                        value={invJobRef || ""}
                        size="small"
                        onChange={(event) =>
                          setInvDetails({
                            ...invDetails,
                            invJobRef: event.target.value,
                          })
                        }
                        fullWidth
                      />
                    </Stack>
                  </Grid>
                )}
            </Grid>
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} md={12}>
        <hr />
        <br />
        <Typography>Please enter particulars</Typography>
      </Grid>

      <Grid item xs={12} md={12} style={{ width: "100%" }}>
        <Card style={{ width: "100%" }}>
          <Stack sx={{ padding: "20px", width: "100%" }}>
            <Scrollbar>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  set_us_openDialog(true);
                  set_us_dlg_type("add");
                  set_us_update_id("");
                }}
              >
                Add new particular
              </Button>
              <br />
              <br />
              <TableContainer>
                <Table style={{ width: "100%", minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        size="small"
                        align="center"
                        style={{ width: "5%", whiteSpace: "nowrap" }}
                      />
                      <TableCell
                        size="small"
                        align="center"
                        style={{ width: "5%", whiteSpace: "nowrap" }}
                      >
                        Order
                      </TableCell>
                      <TableCell
                        size="small"
                        align="center"
                        style={{ width: "5%" }}
                      >
                        Select
                      </TableCell>
                      <TableCell
                        size="small"
                        style={{ width: "20%", whiteSpace: "nowrap" }}
                      >
                        Particulars
                      </TableCell>
                      <TableCell
                        size="small"
                        align="center"
                        style={{ width: "45%", whiteSpace: "nowrap" }}
                      >
                        Description
                      </TableCell>
                      <TableCell
                        size="small"
                        align="center"
                        style={{ width: "20%", whiteSpace: "nowrap" }}
                      >
                        Amount (Rs)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companyInvSelected &&
                      (companyInvSelected?.id ===
                        process.env.REACT_APP_CUSTOM_ASHLEY_ID ||
                        companyInvSelected?.id ===
                          process.env.REACT_APP_CUSTOM_SOREFAN_ID) && (
                        <TableRow>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap" }}
                          />
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            Fixed
                          </TableCell>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <Checkbox checked={true} />
                          </TableCell>
                          <TableCell
                            size="small"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            Transport fees
                          </TableCell>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <TextField
                              variant="outlined"
                              name="transportDesc"
                              id="transportDesc"
                              type="text"
                              value={us_transportDesc || ""}
                              size="small"
                              onChange={(event) => {
                                set_us_transportDesc(event.target.value);
                              }}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <TextField
                              variant="outlined"
                              name="transportFees"
                              id="transportFees"
                              type="text"
                              value={us_transportFees || ""}
                              size="small"
                              onChange={(event) =>
                                onHandleTransportFeeChange(event.target.value)
                              }
                              fullWidth
                            />
                          </TableCell>
                        </TableRow>
                      )}

                    {invParticulars &&
                      invParticulars?.length > 0 &&
                      invParticulars?.map((particular, index) => (
                        <TableRow key={index}>
                          <TableCell
                            size="small"
                            align="center"
                            style={{
                              whiteSpace: "nowrap",
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <IconButton
                              onClick={() => {
                                set_us_dlg_type("update");
                                set_us_update_id(particular?.id || "");
                                set_us_newParticular(particular?.title || "");
                                set_us_new_particularDetailList(
                                  particular?.valueList || []
                                );
                                set_us_newParticular_orderNum(
                                  particular?.orderNum
                                );
                                set_us_openDialog(true);
                              }}
                            >
                              <EditIcon color="primary" />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => deleteParticular(particular?.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <TextField
                              variant="outlined"
                              name="orderNum"
                              id="orderNum"
                              type="number"
                              value={particular?.orderNum || ""}
                              size="small"
                              onChange={(event) =>
                                handleOrderChange(
                                  event.target.value,
                                  particular?.id
                                )
                              }
                              fullWidth
                            />
                          </TableCell>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <Checkbox
                              checked={particular?.isChecked || false}
                              onChange={(e) =>
                                handleChkChange(
                                  e.target.checked,
                                  particular?.id
                                )
                              }
                            />
                          </TableCell>
                          <TableCell
                            size="small"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <TextField
                              variant="outlined"
                              name="title"
                              id="title"
                              type="text"
                              value={particular?.title || ""}
                              size="small"
                              onChange={(event) =>
                                handleInputChange(
                                  event.target.value,
                                  particular?.id,
                                  "title"
                                )
                              }
                              fullWidth
                            />
                          </TableCell>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <Stack spacing={3} direction="row">
                              <TextField
                                variant="outlined"
                                name="customDetail"
                                id="customDetail"
                                type="text"
                                value={particular?.customDetail || ""}
                                size="small"
                                onChange={(event) =>
                                  handleInputChange(
                                    event.target.value,
                                    particular?.id,
                                    "customDetail"
                                  )
                                }
                                fullWidth
                              />

                              {particular?.valueList &&
                                particular?.valueList?.length > 0 && (
                                  <FormControl
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                  >
                                    <InputLabel
                                      id="particular-detail-label"
                                      required
                                    >
                                      Previous particular detail
                                    </InputLabel>
                                    <Select
                                      label="Previous particular detail"
                                      labelId="particular-detail-label"
                                      value={particular?.selectedValue || ""}
                                      onChange={(event) =>
                                        handleInputChange(
                                          event.target.value,
                                          particular?.id,
                                          "selectedValue"
                                        )
                                      }
                                    >
                                      <MenuItem value={""}>
                                        Please choose previous detail
                                      </MenuItem>
                                      {particular?.valueList &&
                                        particular?.valueList?.map(
                                          (detail, index) => (
                                            <MenuItem
                                              value={detail}
                                              key={index}
                                            >
                                              {detail}
                                            </MenuItem>
                                          )
                                        )}
                                    </Select>
                                  </FormControl>
                                )}
                            </Stack>
                          </TableCell>
                          {/* <TableCell size="small">
                            <Stack direction={"row"} spacing={2}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  set_us_dlg_type("update");
                                  set_us_update_id(particular?.id || "");
                                  set_us_newParticular(particular?.title || "");
                                  set_us_new_particularDetailList(
                                    particular?.valueList || []
                                  );
                                  set_us_openDialog(true);
                                }}
                              >
                                update
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => deleteParticular(particular?.id)}
                              >
                                delete
                              </Button>
                            </Stack>
                          </TableCell> */}
                          <TableCell size="small" align="center">
                            {companyInvSelected &&
                            (companyInvSelected?.id ===
                              process.env.REACT_APP_CUSTOM_ASHLEY_ID ||
                              companyInvSelected?.id ===
                                process.env.REACT_APP_CUSTOM_SOREFAN_ID) ? (
                              ""
                            ) : (
                              <TextField
                                variant="outlined"
                                name="amount"
                                id="amount"
                                type="number"
                                value={particular?.amount || ""}
                                size="small"
                                onChange={(event) =>
                                  handleAmountChange(
                                    event.target.value,
                                    particular?.id
                                  )
                                }
                                fullWidth
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Stack>
        </Card>
      </Grid>

      <Grid
        item
        xs={12}
        md={12}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <hr />

        <Card style={{ width: isDesktop ? "40%" : "100%" }}>
          <Stack sx={{ padding: "20px", width: "100%" }}>
            <TableContainer>
              <Typography>Total Summary</Typography>
              <Table>
                <TableBody>
                  {companyInvSelected &&
                    (companyInvSelected?.id ===
                      process.env.REACT_APP_CUSTOM_ASHLEY_ID ||
                      companyInvSelected?.id ===
                        process.env.REACT_APP_CUSTOM_SOREFAN_ID) && (
                      <TableRow>
                        <TableCell
                          size="small"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {companyInvSelected?.id ===
                          process.env.REACT_APP_CUSTOM_SOREFAN_ID
                            ? "Storage Fee"
                            : "Gate Pass / Storage Fee"}
                        </TableCell>
                        <TableCell size="small">
                          <TextField
                            variant="outlined"
                            name="invStorageFee"
                            id="invStorageFee"
                            type="text"
                            value={invStorageFee || ""}
                            size="small"
                            onChange={(event) =>
                              handleAdditionalFeesChange(
                                event.target.value,
                                "invStorageFee"
                              )
                            }
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                    )}

                  <TableRow>
                    <TableCell size="small" style={{ whiteSpace: "nowrap" }}>
                      Scanning Fee
                    </TableCell>
                    <TableCell size="small">
                      <TextField
                        variant="outlined"
                        name="invScanningFee"
                        id="invScanningFee"
                        type="text"
                        value={invScanningFee || ""}
                        size="small"
                        onChange={(event) =>
                          handleAdditionalFeesChange(
                            event.target.value,
                            "invScanningFee"
                          )
                        }
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>

                  {companyInvSelected?.data?.vatPercentage &&
                  Number(companyInvSelected?.data?.vatPercentage) > 0 ? (
                    <TableRow>
                      <TableCell size="small" style={{ whiteSpace: "nowrap" }}>
                        15% VAT on Transport Fee
                      </TableCell>
                      <TableCell size="small">
                        <TextField
                          variant="outlined"
                          name="invVatFee"
                          id="invVatFee"
                          type="number"
                          value={invVatFee ? Number(invVatFee).toFixed(2) : ""}
                          size="small"
                          fullWidth
                          disabled
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    ""
                  )}

                  <TableRow>
                    <TableCell size="small">Total</TableCell>
                    <TableCell size="small">
                      {(invTotal &&
                        invTotal > 0 &&
                        Number(invTotal).toFixed(2)) ||
                        0}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} md={12} style={{ width: "100%" }}>
        <Stack spacing={3} direction="row">
          <Button
            variant={"contained"}
            color={"primary"}
            onClick={() => saveInvoice()}
            fullWidth
            disabled={!invTotal}
          >
            {action === "add"
              ? "Save invoice"
              : action === "update"
              ? "Update invoice"
              : ""}
          </Button>

          <Button
            variant={"contained"}
            color={"primary"}
            onClick={() => {
              set_us_showViewInvoice({
                showViewButton: false,
                savedInvoice: null,
              });

              ref.current?.scrollIntoView({ behavior: "smooth" });
            }}
            fullWidth
            style={{
              display: us_showViewInvoice?.showViewButton ? "" : "none",
            }}
          >
            Create new invoice
          </Button>

          <Button
            variant={"contained"}
            color={"primary"}
            onClick={() => {
              set_us_actionChoice("view");
            }}
            fullWidth
            style={{
              display: us_showViewInvoice?.showViewButton ? "" : "none",
            }}
          >
            View invoice
          </Button>
        </Stack>
      </Grid>

      <Dialog open={us_openDialog} maxWidth={"sm"} fullWidth>
        <DialogTitle>
          {us_dlg_type === "add"
            ? "Add new particular"
            : us_dlg_type === "update"
            ? "Update particular"
            : ""}
        </DialogTitle>
        <DialogContent>
          <br />
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <TextField
                label="Order number"
                variant="outlined"
                name="newParticularOrderNum"
                id="newParticularOrderNum"
                type="text"
                value={
                  us_newParticular_orderNum !== undefined &&
                  Number(us_newParticular_orderNum)
                    ? parseInt(us_newParticular_orderNum, 2)
                    : 0
                }
                size="small"
                onChange={(event) => {
                  if (event.target.value >= 0) {
                    set_us_newParticular_orderNum(Number(event.target.value));
                  }
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                label="New particular"
                variant="outlined"
                name="newParticular"
                id="newParticular"
                type="text"
                value={us_newParticular}
                size="small"
                onChange={(event) => set_us_newParticular(event.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TableContainer>
                <Stack direction={"row"} spacing={3} style={{ paddingTop: 5 }}>
                  <TextField
                    label="Particular description"
                    variant="outlined"
                    name="particularDetail"
                    id="particularDetail"
                    type="text"
                    value={us_particularDetail}
                    size="small"
                    onChange={(event) =>
                      set_us_particularDetail(event.target.value)
                    }
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => addParticularDetail()}
                    disabled={!us_particularDetail}
                    size="small"
                  >
                    add
                  </Button>
                </Stack>
                <br />

                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell size="small">Particular description</TableCell>
                      <TableCell size="small">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {us_new_particularDetailList?.map((newDetail, index) => (
                      <TableRow key={index}>
                        <TableCell size="small">
                          <TextField
                            label="Particular detail"
                            variant="outlined"
                            margin="normal"
                            name={`particularDetail${index}`}
                            id={`particularDetail${index}`}
                            type="text"
                            value={newDetail}
                            size="small"
                            onChange={(event) =>
                              handleParticularDetailChange(
                                index,
                                event.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell size="small">
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => deleteNewParticularDetail(index)}
                          >
                            delete
                          </Button>
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
            variant="contained"
            color="primary"
            onClick={() => submitChanges()}
          >
            {us_dlg_type === "add"
              ? "apply new particular"
              : "update particular"}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleCloseDialog()}
          >
            cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
