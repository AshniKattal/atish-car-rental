import { useState, useEffect, lazy, Suspense, useRef } from "react";
import db from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Autocomplete,
  Card,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  selectCompanyList,
  setCompanyList,
} from "../../../features/companySlice";
import { getCompanies } from "../../../components/core-functions/SelectionCoreFunctions";
import useAuth from "../../../hooks/useAuth";
import { useSnackbar } from "notistack";
import {
  setClientInvSelected,
  setCompanyInvSelected,
} from "../../../features/invoiceSectionSlice";
import { setLoading } from "src/features/globalSlice";
import useSettings from "src/hooks/useSettings";
/* import readXlsxFile from "read-excel-file";
import firebase from "firebase/compat"; */

const TableCRUDTemplate = lazy(() =>
  import("../../../components/table/TableCRUDTemplate")
);
const CreateClientDialog = lazy(() => import("./CreateClientDialog"));
const UpdateClientDialog = lazy(() => import("./UpdateClientDialog"));

const ClientDetail = () => {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { companyList } = useSelector(selectCompanyList);

  const [clientListOriginal, setClientListOriginal] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [clientDetails, setClientDetails] = useState({
    id: "",
    companyRefId: "",
    companyRefName: "",
    name: "",
    companyType: "",
    // natureOfBusiness: "",
    // incorDate: "",
    // payeRegNo: "",
    tan: "",
    address: "",
    // country: "",
    contactNumber: "",
    mobileNumber: "",
    email: "",
    email2: "",
    email3: "",
    email4: "",
    brn: "",
    nic: "",
    buyerType: null,
    representativeName: "",
    representativeContactNumber: "",
  });

  const [companySearchId, setCompanySearchId] = useState("");

  const [selectedClient, setSelectedClient] = useState(null);

  const [selectedCompany, setSelectedCompany] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");

  const headers = [
    { id: "list", label: "List" },
    { id: "update", label: "Update" },
    { id: "delete", label: "Delete" },
    { id: "name", label: "Name" },
    { id: "companyType", label: "Type" },
    { id: "address", label: "Address" },
    { id: "contactNumber", label: "Contact number" },
    { id: "mobileNumber", label: "Mobile_Number" },
    { id: "email", label: "Email 1" },
    { id: "email2", label: "Email 2" },
    { id: "email3", label: "Email 3" },
    { id: "email4", label: "Email 4" },
    { id: "tan", label: "VAT" },
    { id: "brn", label: "BRN" },
    { id: "nic", label: "NIC" },
    { id: "buyerType", label: "Buyer Type" },
    { id: "representativeName", label: "Representative name" },
    {
      id: "representativeContactNumber",
      label: "Representative contact number",
    },
  ];

  const temp_initMemberCompId = useRef();

  const temp_initializeCompanies = useRef();

  const temp_initializeClient = useRef();

  const temp_filterClientsRef = useRef();

  const temp_checkPermission_ref = useRef();

  const [viewPermissionGranted, setViewPermissionGranted] = useState(false);

  useEffect(() => {
    temp_checkPermission_ref.current();
  }, [companySearchId]);

  function checkPermission() {
    if (companySearchId) {
      if (
        !user?.permissions?.viewClientChk?.assignedCompanyId?.includes(
          companySearchId
        )
      ) {
        enqueueSnackbar(
          "You do not have the permission to view clients for this company",
          { variant: "error" }
        );

        setViewPermissionGranted(false);
      } else {
        setViewPermissionGranted(true);
      }
    }
  }

  temp_checkPermission_ref.current = checkPermission;

  useEffect(() => {
    temp_initMemberCompId.current();
  }, [user]);

  useEffect(() => {
    temp_initializeCompanies.current();
  }, [companyList]);

  useEffect(() => {
    if (companySearchId && viewPermissionGranted) {
      temp_initializeClient.current();
    } else {
      setClientListOriginal([]);
      setClientList([]);
    }
  }, [companySearchId, viewPermissionGranted]);

  useEffect(() => {
    temp_filterClientsRef.current();
  }, [selectedClient]);

  const _ue_initMemberCompId = async () => {
    if (
      user?.role === "admin_member" &&
      user?.a_comp &&
      user?.a_comp?.length > 0 &&
      user?.permissions?.viewClientChk
    ) {
      if (user?.a_comp?.length === 1) {
        setCompanySearchId(user?.a_comp[0]?.id);
      }
    }
  };

  temp_initMemberCompId.current = _ue_initMemberCompId;

  const initializeCompanies = async () => {
    // if (user?.id !== "" && user?.role !== "admin_member") {
    if (companyList && companyList.length === 0) {
      dispatch(setLoading(true));
      let result = await getCompanies(user?.id, user?.a_comp, user?.role);

      if (result.error) {
        enqueueSnackbar(result.msg || "", { variant: result.variant });
        dispatch(setLoading(false));
      } else {
        dispatch(setCompanyList(result));
        dispatch(setLoading(false));
      }
    }
    // }
  };

  temp_initializeCompanies.current = initializeCompanies;

  const initializeClientList = async () => {
    if (companySearchId && companySearchId !== "") {
      dispatch(setLoading(true));
      await db
        .collection("company")
        .doc(companySearchId)
        .collection("client")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          var arr = [];
          if (snapshot?.docs?.length > 0) {
            snapshot.docs.forEach((doc) => {
              if (doc.id !== "--counterStatus--") {
                arr.push({
                  id: doc?.id,
                  data: doc?.data(),
                  name: doc?.data()?.name || "",
                  companyRefName: doc?.data()?.companyRefName || "",
                  companyRefId: doc?.data()?.companyRefId || "",
                  companyType: doc?.data()?.companyType || "",
                  address: doc?.data()?.address || "",
                  contactNumber: doc?.data()?.contactNumber || "",
                  mobileNumber: doc?.data()?.mobileNumber || "",
                  email: doc?.data()?.email || "",
                  email2: doc?.data()?.email2 || "",
                  email3: doc?.data()?.email3 || "",
                  email4: doc?.data()?.email4 || "",
                  tan: doc?.data()?.tan || "",
                  brn: doc?.data()?.brn || "",
                  nic: doc?.data()?.nic || "",
                  buyerType: doc?.data()?.buyerType
                    ? JSON.stringify(doc?.data()?.buyerType)
                    : null,

                  representativeName: doc?.data()?.representativeName || "",
                  representativeContactNumber:
                    doc?.data()?.representativeContactNumber || "",
                });
              }
            });
            setClientList(arr);
            setClientListOriginal(arr);
            dispatch(setLoading(false));
          } else {
            setClientList([]);
            setClientListOriginal([]);
            dispatch(setLoading(false));
          }
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while fetching clients: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  };

  temp_initializeClient.current = initializeClientList;

  function filterClients() {
    if (selectedClient) {
      let newClientList = clientListOriginal.filter(
        (client) => client?.id === selectedClient?.id
      );
      setClientList(newClientList);
    } else {
      setClientList([...clientListOriginal]);
    }
  }

  temp_filterClientsRef.current = filterClients;

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setClientDetails({
      id: "",
      companyRefId: "",
      companyRefName: "",
      name: "",
      companyType: "",
      // natureOfBusiness: "",
      // incorDate: "",
      // payeRegNo: "",
      tan: "",
      address: "",
      // country: "",
      contactNumber: "",
      mobileNumber: "",
      email: "",
      email2: "",
      email3: "",
      email4: "",
      brn: "",
      nic: "",
      buyerType: null,
      representativeName: "",
      representativeContactNumber: "",
    });
  };

  const addBtnFunc = () => {
    setDialogType("add");
    setOpenDialog(true);
    setClientDetails({
      ...clientDetails,
      id: "",
      //companyRefId: "",
      companyRefName: "",
      name: "",
      companyType: "",
      // natureOfBusiness: "",
      // incorDate: "",
      // payeRegNo: "",
      tan: "",
      address: "",
      // country: "",
      contactNumber: "",
      mobileNumber: "",
      email: "",
      email2: "",
      email3: "",
      email4: "",
      brn: "",
      nic: "",
      buyerType: null,
      representativeName: "",
      representativeContactNumber: "",
    });
  };

  const updateBtnFunc = (id, data) => {
    setDialogType("update");
    setOpenDialog(true);
    setClientDetails({
      id: id,
      name: data?.name || "",
      companyRefId: data?.companyRefId || "",
      companyRefName: data?.companyRefName || "",
      companyType: data?.companyType || "",
      // natureOfBusiness: data.natureOfBusiness,
      // incorDate: data.incorDate,
      // payeRegNo: data.payeRegNo,
      tan: data?.tan || "",
      address: data?.address || "",
      // country: data.country,
      email: data?.email || "",
      email2: data?.email2 || "",
      email3: data?.email3 || "",
      email4: data?.email4 || "",
      contactNumber: data?.contactNumber || "",
      mobileNumber: data?.mobileNumber || "",
      brn: data?.brn || "",
      nic: data?.nic || "",
      buyerType: data?.buyerType || null,
      representativeName: data?.representativeName || "",
      representativeContactNumber: data?.representativeContactNumber || "",
    });
  };

  const deleteBtnFunc = async (id) => {
    dispatch(setLoading(true));
    await db
      .collection("company")
      .doc(companySearchId)
      .collection("client")
      .doc(id)
      .delete()
      .then(async () => {
        initializeClientList();
        dispatch(setCompanyInvSelected(undefined));
        dispatch(setClientInvSelected(undefined));
        dispatch(setLoading(false));
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while deleting a client: ${err?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  };

  // const onFileChange = async (e) => {
  //   if (e.target.files?.length > 0) {
  //     let o_file = e.target.files[0];
  //     dispatch(setLoading(true));

  //     await readXlsxFile(o_file).then(async (rows) => {
  //       // check if first row contain title
  //       if (rows[0]?.length === 1) {
  //         rows.shift();
  //       }

  //       // check if first row has 2nd column named as Name -> remove if present
  //       if (rows[0][0] === "Table 1") {
  //         rows.shift();
  //       }

  //       // check if first row has 2nd column named as Name -> remove if present
  //       if (rows[0][0] === "Name") {
  //         rows.shift();
  //       }

  //       for (let i = 0; i < rows?.length; i++) {
  //         let name = rows[i][0] || "";
  //         name = name
  //           .trim() // Remove leading and trailing spaces
  //           .replace(/\s+/g, " ") // Replace multiple spaces with a single space
  //           .toLowerCase() // Convert to lowercase
  //           .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word

  //         await db
  //           .collection("company")
  //           .doc(companySearchId)
  //           .collection("client")
  //           .add({
  //             name: name || "",
  //             companyRefId: clientDetails?.companyRefId || "",
  //             companyRefName: clientDetails?.companyRefName || "",
  //             companyType: "",
  //             tan: "",
  //             address: rows[i][1] || "",
  //             email: rows[i][5] || "",
  //             contactNumber: rows[i][2] || "",
  //             mobileNumber: rows[i][3] || "",
  //             brn: "",
  //             nic: rows[i][4] || "",
  //             buyerType: null,
  //             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //           });
  //       }
  //     });
  //   }
  // };

  return (
    <Container maxWidth={themeStretch ? false : "xl"}>
      {/*   <TextField
        className="uploadInput"
        variant="outlined"
        size="small"
        //fullWidth
        name="excel"
        type="file"
        id="excel"
        accept=".xlsx"
        onChange={(event) => onFileChange(event)}
      /> */}
      {/* 
      <div
        style={{
          display: !user?.permissions?.viewClientChk ? "" : "none",
        }}
      >
        <Alert severity="error">
          Sorry, you do not have access to this section. Please contact Admin
          for more info. Thank you.
        </Alert>
      </div>
      <div
        style={{
          display: user?.permissions?.viewClientChk ? "" : "none",
        }}
      > */}
      <div
        style={{
          display:
            user?.role === "admin_member" &&
            user?.a_comp &&
            user?.a_comp?.length === 1
              ? "none"
              : "",
        }}
      >
        <Card>
          <Stack sx={{ p: 3 }}>
            <Grid container>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  ListboxProps={{ style: { maxHeight: "70vh" } }}
                  size="small"
                  label="Please select company"
                  id="client-drop-down"
                  options={companyList || []}
                  value={selectedCompany || null}
                  renderInput={(params) => (
                    <TextField {...params} label="Please select company" />
                  )}
                  onChange={(e, value, reason) => {
                    if (
                      reason !== "removeOption" &&
                      reason !== "clear" &&
                      value
                    ) {
                      setCompanySearchId(value?.id);
                      setSelectedCompany(value);
                    } else if (
                      reason === "removeOption" ||
                      reason === "clear"
                    ) {
                      setCompanySearchId("");
                      setSelectedCompany(null);
                    }
                  }}
                  getOptionLabel={(option) => option?.name || ""}
                  renderOption={(props, option) => (
                    <li {...props} key={option?.id}>
                      <span>{option?.name || ""}</span>
                    </li>
                  )}
                />
              </Grid>
            </Grid>
          </Stack>
        </Card>
        <br />
      </div>

      <Grid container spacing={3}>
        {companySearchId && viewPermissionGranted && clientList ? (
          <>
            <Grid item xs={12} md={12}>
              <Typography>{`${clientList?.length} clients retrieved`}</Typography>{" "}
            </Grid>

            {clientList?.length > 0 ? (
              <Grid item xs={12} md={4}>
                <Autocomplete
                  ListboxProps={{ style: { maxHeight: "70vh" } }}
                  size="small"
                  label="Search client"
                  id="client-drop-down"
                  options={clientListOriginal || []}
                  value={selectedClient || null}
                  renderInput={(params) => (
                    <TextField {...params} label="Search client" />
                  )}
                  onChange={(e, value, reason) => {
                    if (
                      reason !== "removeOption" &&
                      reason !== "clear" &&
                      value
                    ) {
                      setSelectedClient(value);
                    } else if (
                      reason === "removeOption" ||
                      reason === "clear"
                    ) {
                      setSelectedClient(null);
                    }
                  }}
                  getOptionLabel={(option) => option?.name || ""}
                  renderOption={(props, option) => (
                    <li {...props} key={option?.id}>
                      <span>{option?.name || ""}</span>
                    </li>
                  )}
                />
              </Grid>
            ) : (
              <></>
            )}

            <Grid item xs={12} md={12}>
              <Suspense fallback={<p>Loading...</p>}>
                <TableCRUDTemplate
                  companyId={companySearchId}
                  type="client"
                  headers={headers}
                  aCollection={clientList}
                  addBtnDisplay={selectedCompany ? true : false}
                  addBtnLabel={"Create a client"}
                  addBtnFunc={addBtnFunc}
                  openDialog={openDialog}
                  handleCloseDialog={handleCloseDialog}
                  emptyColMsg={
                    "Sorry, not a single client has been created yet. Please create a client."
                  }
                  updateBtnDisplay={true}
                  deleteBtnDisplay={true}
                  updateBtnFunc={updateBtnFunc}
                  deleteBtnFunc={deleteBtnFunc}
                />
              </Suspense>
            </Grid>
          </>
        ) : (
          <></>
        )}
      </Grid>

      <div>
        {dialogType && dialogType === "add" ? (
          <Suspense fallback={<p>Loading...</p>}>
            <CreateClientDialog
              companyId={companySearchId}
              openDialog={openDialog}
              handleCloseDialog={handleCloseDialog}
              clientDetails={clientDetails}
              setClientDetails={setClientDetails}
              initializeClientList={initializeClientList}
            />
          </Suspense>
        ) : (
          <Suspense fallback={<p>Loading...</p>}>
            <UpdateClientDialog
              companyId={companySearchId}
              openDialog={openDialog}
              handleCloseDialog={handleCloseDialog}
              clientDetails={clientDetails}
              setClientDetails={setClientDetails}
              initializeClientList={initializeClientList}
            />
          </Suspense>
        )}
      </div>
      {/*       </div> */}
    </Container>
  );
};

export default ClientDetail;
