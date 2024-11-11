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
} from "@mui/material";
import Scrollbar from "../Scrollbar";
import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import db from "../../firebase";
import {
  dynamicSort,
  getParticularsDefaultValue,
} from "../core-functions/SelectionCoreFunctions";
import { setLoading } from "../../features/globalSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function DocumentTableTransport({
  action,
  classes,
  companyDetails,
  companyIdSelected,
  documentDetails,
  setDocumentDetails,
  deleteParticular,
  originalDocParticulars,
}) {
  /**
   * check if company chosen require old or new table template
   * template may alter depending on action -> add or update
   * if action === add -> check if company's MRATemplateFlag is true to apply new template or not
   * if action === update -> check if MRATemplateApplied to verify if the updated invoice has been saved with new template
   */

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const {
    docParticulars,
    invVehicleNo,
    invJobRef,
    invApplyVat,
    transportDesc,
    transportFees,
  } = documentDetails;

  const [us_newParticular, set_us_newParticular] = useState("");

  const [us_particularDetail, set_us_particularDetail] = useState("");

  const [us_openDialog, set_us_openDialog] = useState(false);

  const [us_dlg_type, set_us_dlg_type] = useState("");

  const [us_new_particularDetailList, set_us_new_particularDetailList] =
    useState([]);

  const [us_newParticular_orderNum, set_us_newParticular_orderNum] =
    useState("");

  const [us_update_id, set_us_update_id] = useState("");

  const temp_retrieveDefaultValueListRef = useRef();

  const handleCloseDialog = () => {
    set_us_openDialog(false);
    set_us_dlg_type("");
    set_us_update_id("");
  };

  useEffect(() => {
    // get default value list for transport template only
    temp_retrieveDefaultValueListRef.current();
  }, [action, originalDocParticulars]);

  const retrieveDefaultValueList = async () => {
    if (action === "update" && originalDocParticulars?.length > 0) {
      let particularsDefaultValue = [];
      if (companyDetails?.data?.documentTemplate === "transport") {
        particularsDefaultValue = await getParticularsDefaultValue(
          companyDetails?.id,
          companyDetails?.data?.documentTemplate
        );

        let newDocParticulars = [];
        originalDocParticulars.forEach((particular) => {
          let defaultParticular = particularsDefaultValue.find(
            (defaultPart) => defaultPart.id === particular.id
          );
          newDocParticulars.push({
            ...particular,
            valueList: defaultParticular?.valueList,
          });
        });

        setDocumentDetails((prev) => {
          return {
            ...prev,
            docParticulars: newDocParticulars,
          };
        });
      }
    }
  };

  temp_retrieveDefaultValueListRef.current = retrieveDefaultValueList;

  function onHandleTransportFeeChange(invApplyVatValue, value) {
    if (Number(value) >= 0) {
      // calculate vat on transport if vat percentage is not zero
      if (invApplyVatValue) {
        let vatFee = 0;
        vatFee = 0.15 * Number(value);

        setDocumentDetails({
          ...documentDetails,
          invVatFee: vatFee,
          docVatFee: vatFee,
          transportFees: value,
        });
      } else {
        setDocumentDetails({
          ...documentDetails,
          transportFees: value,
        });
      }
    }
  }

  async function submitChanges() {
    if (us_newParticular !== undefined && us_newParticular !== "") {
      dispatch(setLoading(true));

      if (us_dlg_type === "add") {
        let uniqueValueList = [...new Set(us_particularDetail)];
        uniqueValueList.sort();

        await db
          .collection("company")
          .doc(companyIdSelected)
          .collection("particulars")
          .add({
            orderNum: us_newParticular_orderNum,
            title: us_newParticular,
            customDetail: us_particularDetail,
            selectedValue: "",
            valueList: uniqueValueList,
          })
          .then((docRef) => {
            enqueueSnackbar("Particular added successfully");

            let newInvParticularsList = [
              // ...invDetails?.invParticulars,
              ...docParticulars,
              {
                id: docRef?.id,
                isChecked: false,
                title: us_newParticular,
                customDetail: us_particularDetail,
                orderNum: us_newParticular_orderNum,
                valueList: uniqueValueList,
                amount: 0,
              },
            ];

            newInvParticularsList.sort(dynamicSort("orderNum"));

            /* setInvDetails({
              ...invDetails,
              invParticulars: newInvParticularsList,
            }); */
            setDocumentDetails({
              ...documentDetails,
              invParticulars: newInvParticularsList,
              docParticulars: newInvParticularsList,
            });

            set_us_particularDetail("");
            set_us_newParticular("");
            set_us_newParticular_orderNum("");
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
        let uniqueValueList = [...new Set(us_new_particularDetailList)];
        uniqueValueList.sort();

        await db
          .collection("company")
          .doc(companyIdSelected)
          .collection("particulars")
          .doc(us_update_id)
          .set(
            {
              title: us_newParticular,
              valueList: uniqueValueList,
            },
            { merge: true }
          )
          .then(() => {
            enqueueSnackbar("Particular updated successfully");

            let newList = [];
            // if (invDetails?.invParticulars?.length > 0) {
            if (docParticulars?.length > 0) {
              docParticulars.forEach((particular) => {
                if (particular?.id === us_update_id) {
                  newList.push({
                    ...particular,
                    title: us_newParticular,
                    valueList: uniqueValueList,
                  });
                } else {
                  newList.push({ ...particular });
                }
              });
            }

            /* setInvDetails({
              ...invDetails,
              invParticulars: newList,
            }); */
            setDocumentDetails({
              ...documentDetails,
              invParticulars: newList,
              docParticulars: newList,
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

  function handleChkChange(value, id) {
    if (docParticulars?.length > 0) {
      let newList = [];
      for (var i = 0; i < docParticulars?.length; i++) {
        if (docParticulars[i].id === id) {
          newList.push({ ...docParticulars[i], isChecked: value });
        } else {
          newList.push(docParticulars[i]);
        }
      }

      setDocumentDetails({
        ...documentDetails,
        docParticulars: newList,
      });
    }
  }

  function handleInputChange(value, id, name) {
    if (docParticulars?.length > 0) {
      let newList = [];
      for (var i = 0; i < docParticulars?.length; i++) {
        if (docParticulars[i].id === id) {
          newList.push({ ...docParticulars[i], [name]: value });
        } else {
          newList.push(docParticulars[i]);
        }
      }
      setDocumentDetails({
        ...documentDetails,
        docParticulars: newList,
      });
    }
  }

  function handleOrderChange(value, id) {
    if (docParticulars?.length > 0) {
      let newList = [];
      for (var i = 0; i < docParticulars?.length; i++) {
        if (docParticulars[i].id === id) {
          newList.push({ ...docParticulars[i], orderNum: Number(value) });
        } else {
          newList.push(docParticulars[i]);
        }
      }

      newList.sort(dynamicSort("orderNum"));

      setDocumentDetails({
        ...documentDetails,
        docParticulars: newList,
      });
    }
  }

  return (
    <>
      <Grid item xs={12} md={4}>
        <TextField
          variant="outlined"
          name="invVehicleNo"
          label={
            companyIdSelected &&
            companyIdSelected === process.env.REACT_APP_CUSTOM_SOREFAN_ID
              ? "Lorry number"
              : "Vehicle number"
          }
          id="invVehicleNo"
          type="text"
          value={invVehicleNo || ""}
          size="small"
          onChange={(event) =>
            setDocumentDetails({
              ...documentDetails,
              invVehicleNo: event.target.value,
            })
          }
          fullWidth
          InputProps={{ className: classes.input }}
        />
      </Grid>

      {companyIdSelected &&
        companyIdSelected !== process.env.REACT_APP_CUSTOM_SOREFAN_ID && (
          <Grid item xs={12} md={4}>
            <TextField
              variant="outlined"
              name="invJobRef"
              label="Job Ref"
              id="invJobRef"
              type="text"
              value={invJobRef || ""}
              size="small"
              onChange={(event) =>
                setDocumentDetails({
                  ...documentDetails,
                  invJobRef: event.target.value,
                })
              }
              fullWidth
              InputProps={{ className: classes.input }}
            />
          </Grid>
        )}

      <Grid item xs={12} md={12}>
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
      </Grid>

      <Grid item xs={12} md={12} style={{ width: "100%" }}>
        <Card style={{ width: "100%" }}>
          <Stack sx={{ padding: "20px", width: "100%" }}>
            <Scrollbar>
              <TableContainer>
                <Table style={{ width: "100%" }} border={1}>
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
                      <TableCell size="small" style={{ whiteSpace: "nowrap" }}>
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
                          value={transportDesc || ""}
                          size="small"
                          onChange={(event) => {
                            setDocumentDetails({
                              ...documentDetails,
                              transportDesc: event.target.value,
                            });
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
                          value={transportFees || ""}
                          size="small"
                          onChange={(event) =>
                            onHandleTransportFeeChange(
                              invApplyVat,
                              event.target.value
                            )
                          }
                          fullWidth
                        />
                      </TableCell>
                    </TableRow>

                    {docParticulars &&
                      docParticulars?.length > 0 &&
                      docParticulars?.map((particular, index) => (
                        <TableRow key={index}>
                          <TableCell
                            size="small"
                            align="center"
                            style={{
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Stack
                              spacing={1}
                              direction={"row"}
                              alignItems={"center"}
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
                                    particular?.orderNum || ""
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
                            </Stack>
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

                          <TableCell size="small" align="center"></TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Stack>
        </Card>
      </Grid>

      {us_openDialog ? (
        <>
          <Dialog
            open={us_openDialog}
            onClose={handleCloseDialog}
            maxWidth={"sm"}
            fullWidth
          >
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
                    value={us_newParticular_orderNum || ""}
                    size="small"
                    onChange={(event) => {
                      set_us_newParticular_orderNum(Number(event.target.value));
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
                    onChange={(event) =>
                      set_us_newParticular(event.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TableContainer>
                    <Stack
                      direction={"row"}
                      spacing={3}
                      style={{ paddingTop: 5 }}
                    >
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

                    <Table border={1}>
                      <TableHead>
                        <TableRow>
                          <TableCell size="small">
                            Particular description
                          </TableCell>
                          <TableCell size="small" align="center">
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {us_new_particularDetailList?.map(
                          (newDetail, index) => (
                            <TableRow key={index}>
                              <TableCell size="small">
                                <TextField
                                  variant="outlined"
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
                              <TableCell size="small" align="center">
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() =>
                                    deleteNewParticularDetail(index)
                                  }
                                >
                                  delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        )}
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
      ) : (
        <></>
      )}
    </>
  );
}
