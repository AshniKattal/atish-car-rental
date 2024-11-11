import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../../hooks/useAuth";
import {
  selectCompanyList,
  setCompanyList,
} from "../../../features/companySlice";
import { setLoading } from "../../../features/globalSlice";
import { selectSnackbar, setSnackbar } from "../../../features/snackbarSlice";
import db, { firebaseApp } from "../../../firebase";
import {
  dynamicSort,
  getCompanies,
} from "../../../components/core-functions/SelectionCoreFunctions";
import { useSnackbar } from "notistack";
import {
  setClientDocumentIdSelected,
  setClientDocumentObjectSelected,
  setCompanyIdSelected,
} from "../../../features/documentSlice";

function UpdateCompanyDialog({
  openDialog,
  handleCloseDialog,
  companyDetails,
  setCompanyDetails,
  initializeCompanies,
}) {
  const {
    id,
    name,
    vatPercentage,
    imageName,
    imageSig,
    imageUrl,
    sigUrl,
    stampName,
    stampUrl,
    companyType,
    // natureOfBusiness,
    // incorDate,
    // payeRegNo,
    vatOrNonVatRegistered,
    tan,
    address,
    // country,
    email,
    contactNumber,
    mobileNumber,
    brn,
    // nic,
    // absenceTariff,
    beneficiaryName,
    bankName,
    bankAccNo,
    bankIban,
    bankSwiftCode,
    MRATemplateFlag,
    displayMRAFiscalisationButton,
    documentTemplate,
  } = companyDetails;

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const snackbar = useSelector(selectSnackbar);
  const { companyList } = useSelector(selectCompanyList);

  const [uploadedFile, setUploadedFile] = useState("");
  const [uploadedSigFile, setUploadedSigFile] = useState("");
  const [uploadedStampSigFile, setUploadedStampSigFile] = useState("");

  const updateCompany = async (e) => {
    if (user?.id !== "") {
      e.preventDefault();
      dispatch(setLoading(true));
      if (name === "" /*  || companyType === "" || payeRegNo === "" */) {
        dispatch(
          setSnackbar({
            counter: snackbar.counter + 1,
            message: "Input with star cannot be blank",
            variant: "error",
          })
        );
        dispatch(setLoading(false));
      } else if (!vatOrNonVatRegistered) {
        dispatch(
          setSnackbar({
            counter: snackbar.counter + 1,
            message: "Please define if company is VAT registered or not",
            variant: "error",
          })
        );
        dispatch(setLoading(false));
      } else if (
        vatOrNonVatRegistered?.id === "VATR" &&
        (!tan || (tan && tan?.length !== 8))
      ) {
        dispatch(
          setSnackbar({
            counter: snackbar.counter + 1,
            message:
              "Please provide a Vat Registration Number and should be of 8 characters",
            variant: "error",
          })
        );
        dispatch(setLoading(false));
      } else {
        let compNameLowerCaseWithNoSpace = companyDetails?.name.replace(
          /\s/g,
          ""
        );
        compNameLowerCaseWithNoSpace =
          compNameLowerCaseWithNoSpace.toLowerCase();
        //upload image if present
        let fileUrl = "";
        if (uploadedFile !== "") {
          const storageRef = firebaseApp.storage().ref();
          const fileRef = storageRef.child(
            `/photo/companyLogo/${compNameLowerCaseWithNoSpace}/f_png/${uploadedFile.name}`
          );
          await fileRef.put(uploadedFile);
          fileUrl = await fileRef.getDownloadURL();
        }

        //upload signature img if present
        let fileSigUrl = "";
        if (uploadedSigFile !== "") {
          const storageRef = firebaseApp.storage().ref();
          const fileSigRef = storageRef.child(
            `/photo/companySignature/${compNameLowerCaseWithNoSpace}/f_png/${uploadedSigFile.name}`
          );
          await fileSigRef.put(uploadedSigFile);
          fileSigUrl = await fileSigRef.getDownloadURL();
        }

        //upload signature img if present
        let fileStampUrl = "";
        if (uploadedStampSigFile !== "") {
          const storageRef = firebaseApp.storage().ref();
          const fileSigRef = storageRef.child(
            `/photo/companyStamp/${compNameLowerCaseWithNoSpace}/f_png/${uploadedStampSigFile.name}`
          );
          await fileSigRef.put(uploadedStampSigFile);
          fileStampUrl = await fileSigRef.getDownloadURL();
        }

        // prepare images object
        let imageObject = {};

        // add image logo if logo has been uploaded
        if (fileUrl !== "") {
          imageObject = {
            ...imageObject,
            imageName: imageName,
            imageUrl: fileUrl,
          };
        } else {
          imageObject = {
            ...imageObject,
            imageName: imageName || "",
            imageUrl: imageUrl || "",
          };
        }

        // add image signature if logo has been uploaded
        if (fileSigUrl !== "") {
          imageObject = {
            ...imageObject,
            imageSig: imageSig,
            sigUrl: fileSigUrl,
          };
        } else {
          imageObject = {
            ...imageObject,
            imageSig: imageSig || "",
            sigUrl: sigUrl || "",
          };
        }

        // add image stamp if logo has been uploaded
        if (fileStampUrl !== "") {
          imageObject = {
            ...imageObject,
            stampName: stampName,
            stampUrl: fileStampUrl,
          };
        } else {
          imageObject = {
            ...imageObject,
            stampName: stampName || "",
            stampUrl: stampUrl || "",
          };
        }

        // check if name is the same
        let arr = [];
        companyList?.forEach((comp) => {
          if (comp.id === id && comp.name !== name) {
            arr.push({ ...comp, name: name });
          } else {
            arr.push(comp);
          }
        });

        arr.sort(dynamicSort("name"));

        const compDocRef = db.collection("company").doc(id);
        const compDocBigArrayRef = db.collection("company").doc("companyIds");

        var batch = db.batch();

        batch.set(
          compDocRef,
          {
            name: name || "",
            vatPercentage: vatPercentage || 0,
            /* imageName: imageName,
            imageUrl: fileUrl,
            imageSig: imageSig,
            sigUrl: fileSigUrl,
            stampName: stampName,
            stampUrl: fileStampUrl, */
            ...imageObject,
            companyType: companyType || "",
            vatOrNonVatRegistered: vatOrNonVatRegistered || null,
            tan: tan || "",
            address: address || "",
            email: email || "",
            contactNumber: contactNumber || "",
            mobileNumber: mobileNumber || "",
            brn: brn || "",
            beneficiaryName: beneficiaryName || "",
            bankName: bankName || "",
            bankAccNo: bankAccNo || "",
            bankIban: bankIban || "",
            bankSwiftCode: bankSwiftCode || "",
            MRATemplateFlag: MRATemplateFlag || null,
            displayMRAFiscalisationButton:
              displayMRAFiscalisationButton || false,
            documentTemplate: documentTemplate || "",
          },
          { merge: true }
        );

        batch.set(compDocBigArrayRef, {
          companyIdArray: arr,
        });

        batch
          .commit()
          .then(async () => {
            const result = await getCompanies(
              user?.id,
              user?.a_comp,
              user?.role
            );

            if (result.error) {
              enqueueSnackbar(result.msg || "", { variant: result.variant });
            } else {
              dispatch(setCompanyList(result));
            }

            if (initializeCompanies) {
              initializeCompanies();
            }

            // reset company id
            dispatch(setCompanyIdSelected(undefined));

            dispatch(setClientDocumentIdSelected(undefined));

            dispatch(setClientDocumentObjectSelected(undefined));

            enqueueSnackbar("Company successfully updated", {
              variant: "success",
            });

            handleCloseDialog();
            dispatch(setLoading(false));
          })
          .catch((err) => {
            enqueueSnackbar(
              `Error occured while updating company: ${err?.message}`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      }
    } else {
      enqueueSnackbar(
        "Your session has been terminated due to greater than 30 minutes of inactivity. Please log in again.",
        {
          variant: "error",
        }
      );
      dispatch(setLoading(false));
    }
  };

  const onFileChange = (e, type) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // let fileSize = Number(file.size) / 1000; //to get size in kb

      //check for valid image type
      const fileType = file["type"];
      const validImageTypes = ["image/jpeg", "image/png"];
      if (!validImageTypes.includes(fileType)) {
        // invalid file type
        dispatch(
          setSnackbar({
            counter: snackbar.counter + 1,
            message:
              "Sorry you should upload only images with type image/jpeg and image/png",
            variant: "error",
          })
        );
      } /* else if (Math.round(fileSize) > 25) {
        dispatch(
          setSnackbar({
            counter: snackbar.counter + 1,
            message:
              'Sorry the image you uploaded exceed 25 KB, size of image uploaded: ' + Math.round(fileSize) + ' KB',
            variant: 'error',
          })
        );
      } */ else {
        if (type === "logo") {
          /* let obj = Object.assign(file, {
            preview: URL.createObjectURL(file),
          }); */

          setUploadedFile(file);
          setCompanyDetails({
            ...companyDetails,
            imageName: file.name,
          });
        } else if (type === "signature") {
          setUploadedSigFile(file);
          setCompanyDetails({
            ...companyDetails,
            imageSig: file.name,
          });
        } else if (type === "stamp") {
          setUploadedStampSigFile(file);
          setCompanyDetails({
            ...companyDetails,
            stampName: file.name,
          });
        }
      }
    }
  };

  const clearImage = (type) => {
    if (type === "signature") {
      setUploadedSigFile("");
      setCompanyDetails({
        ...companyDetails,
        imageSig: "",
        sigUrl: "",
      });
    } else if (type === "logo") {
      setUploadedFile("");
      setCompanyDetails({
        ...companyDetails,
        imageName: "",
        imageUrl: "",
      });
    } else if (type === "stamp") {
      setUploadedStampSigFile("");
      setCompanyDetails({
        ...companyDetails,
        stampName: "",
        stampUrl: "",
      });
    }
  };

  return (
    <>
      <Dialog
        style={{ width: "100%" }}
        maxWidth="lg"
        fullWidth
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle id="alert-dialog-title">Update company</DialogTitle>
        <DialogContent>
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="name"
            label="Name"
            type="text"
            id="name"
            value={name || ""}
            onChange={(event) => {
              setCompanyDetails({
                ...companyDetails,
                name: event.target.value,
              });
            }}
          />

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="vatPercentage"
            label="VAT Percentahe"
            type="number"
            id="vatPercentage"
            size="small"
            value={vatPercentage || 0}
            onChange={(event) => {
              setCompanyDetails({
                ...companyDetails,
                vatPercentage: event.target.value,
              });
            }}
          />

          <div style={{ paddingTop: "1rem" }}></div>

          <FormControl
            size="small"
            variant="outlined"
            fullWidth
            style={{ marginTop: "1em" }}
          >
            <Select
              size="small"
              native
              //label="Company Type"
              placeholder="Please choose a company type"
              value={companyType || ""}
              required
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  companyType: event.target.value,
                });
              }}
              inputProps={{
                name: "companyType",
                id: "companyType",
              }}
            >
              <option value="">Please choose a Company Type *</option>
              <option value="Individual">Individual</option>
              <option value="Company">Company</option>
              <option value="Other">Other</option>
            </Select>
          </FormControl>
          <div style={{ paddingTop: "1rem" }}></div>
          <Typography>
            Upload Image Logo{" "}
            <span style={{ color: "red" }}>(Max Size of 25 KB)</span>:{" "}
            {imageName}
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              name="image"
              type="file"
              id="image"
              accept=".png,.jpeg"
              onChange={(event) => onFileChange(event, "logo")}
            />
            <div style={{ padding: "1em" }}></div>
            <Button
              color="primary"
              variant="contained"
              disabled={imageName !== "" ? false : true}
              onClick={() => clearImage("logo")}
            >
              Clear
            </Button>
          </div>

          <div style={{ paddingTop: "1rem" }}></div>
          <Typography>
            Upload Signature Image{" "}
            <span style={{ color: "red" }}>(Max Size of 25 KB)</span>:{" "}
            {imageSig}
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              name="imageSig"
              type="file"
              id="imageSig"
              accept=".png,.jpeg"
              onChange={(event) => onFileChange(event, "signature")}
            />
            <div style={{ padding: "1em" }}></div>
            <Button
              color="primary"
              variant="contained"
              disabled={imageSig !== "" ? false : true}
              onClick={() => clearImage("signature")}
            >
              Clear
            </Button>
          </div>

          <div style={{ paddingTop: "1rem" }}></div>
          <Typography>
            Upload Stamp Image{" "}
            <span style={{ color: "red" }}>(Max Size of 25 KB)</span>:{" "}
            {stampName}
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              name="stampName"
              type="file"
              id="stampName"
              accept=".png,.jpeg"
              onChange={(event) => onFileChange(event, "stamp")}
            />
            <div style={{ padding: "1em" }}></div>
            <Button
              color="primary"
              variant="contained"
              disabled={stampName !== "" ? false : true}
              onClick={() => clearImage("stamp")}
            >
              Clear
            </Button>
          </div>

          <br />
          <br />

          <Grid container spacing={3}>
            {/* <Grid item xs={12} sm={6} md={4}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="incorDate"
                label="Date Of Incorporation"
                id="incorDate"
                type="date"
                value={incorDate || ""}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    incorDate: event.target.value,
                  });
                }}
                size="small"
              />
            </Grid> */}
            {/* 
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                required
                fullWidth
                name="payeRegNo"
                label="PAYE Reg No"
                type="text"
                id="payeRegNo"
                value={payeRegNo || ""}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    payeRegNo: event.target.value,
                  });
                }}
              />
            </Grid> */}

            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                ListboxProps={{
                  style: { maxHeight: "70vh", marginTop: "1.5em" },
                }}
                size="small"
                label="Apply MRA Template"
                id="mra-template-application-drop-down"
                options={[
                  {
                    value: true,
                    title: "Apply",
                  },
                  {
                    value: false,
                    title: "Do not apply",
                  },
                ]}
                value={MRATemplateFlag}
                renderInput={(params) => (
                  <TextField {...params} label="Apply MRA Template" />
                )}
                required
                onChange={(e, value, reason) => {
                  e.preventDefault();
                  if (
                    reason !== "removeOption" &&
                    reason !== "clear" &&
                    value
                  ) {
                    setCompanyDetails({
                      ...companyDetails,
                      MRATemplateFlag: value,
                    });
                  } else if (reason === "removeOption" || reason === "clear") {
                    setCompanyDetails({
                      ...companyDetails,
                      MRATemplateFlag: null,
                    });
                  }
                }}
                getOptionLabel={(option) => option?.title || ""}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                ListboxProps={{
                  style: { maxHeight: "70vh", marginTop: "1.5em" },
                }}
                size="small"
                label="Show MRA send for Fiscalisation button"
                id="fiscalisation-button-display"
                options={[true, false]}
                value={displayMRAFiscalisationButton}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Show MRA send for Fiscalisation button"
                  />
                )}
                required
                onChange={(e, value, reason) => {
                  e.preventDefault();
                  if (
                    reason !== "removeOption" &&
                    reason !== "clear" &&
                    value
                  ) {
                    setCompanyDetails({
                      ...companyDetails,
                      displayMRAFiscalisationButton: value,
                    });
                  } else if (reason === "removeOption" || reason === "clear") {
                    setCompanyDetails({
                      ...companyDetails,
                      displayMRAFiscalisationButton: false,
                    });
                  }
                }}
                getOptionLabel={(option) =>
                  option === true ? "Show" : "Do not show"
                }
                fullWidth
              />
            </Grid>

            {user && user?.role === "super-admin" ? (
              <Grid item xs={12} sm={6} md={4}>
                <Autocomplete
                  ListboxProps={{
                    style: { maxHeight: "70vh", marginTop: "1.5em" },
                  }}
                  size="small"
                  label="Document template"
                  id="document-template-drop-down"
                  options={
                    process.env.REACT_APP_DOCUMENT_TEMPLATES
                      ? JSON.parse(process.env.REACT_APP_DOCUMENT_TEMPLATES)
                      : []
                  }
                  value={documentTemplate}
                  renderInput={(params) => (
                    <TextField {...params} label="Document template" />
                  )}
                  required
                  onChange={(e, value, reason) => {
                    e.preventDefault();
                    if (
                      reason !== "removeOption" &&
                      reason !== "clear" &&
                      value
                    ) {
                      setCompanyDetails({
                        ...companyDetails,
                        documentTemplate: value,
                      });
                    } else if (
                      reason === "removeOption" ||
                      reason === "clear"
                    ) {
                      setCompanyDetails({
                        ...companyDetails,
                        documentTemplate: null,
                      });
                    }
                  }}
                  getOptionLabel={(option) => option || ""}
                  fullWidth
                />
              </Grid>
            ) : (
              <></>
            )}

            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                ListboxProps={{
                  style: { maxHeight: "70vh" },
                }}
                size="small"
                label="VAT/Non VAT Registered"
                id="transaction-type-drop-down"
                options={
                  process.env.REACT_APP_EBS_VAT_OR_NON_VAT_REGISTERED_VALUES
                    ? JSON.parse(
                        process.env
                          .REACT_APP_EBS_VAT_OR_NON_VAT_REGISTERED_VALUES
                      )
                    : []
                }
                value={vatOrNonVatRegistered}
                renderInput={(params) => (
                  <TextField {...params} label="VAT/Non VAT Registered" />
                )}
                required
                onChange={(e, value, reason) => {
                  e.preventDefault();
                  if (
                    reason !== "removeOption" &&
                    reason !== "clear" &&
                    value
                  ) {
                    setCompanyDetails({
                      ...companyDetails,
                      vatOrNonVatRegistered: value,
                    });
                  } else if (reason === "removeOption" || reason === "clear") {
                    setCompanyDetails({
                      ...companyDetails,
                      vatOrNonVatRegistered: null,
                    });
                  }
                }}
                getOptionLabel={(option) => option?.title || ""}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="vatRegistrationNumber"
                label="VAT"
                type="number"
                id="vatRegistrationNumber"
                value={tan || ""}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    tan: event.target.value,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="brn"
                label="BRN"
                type="text"
                id="brn"
                value={brn || ""}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    brn: event.target.value,
                  });
                }}
              />
            </Grid>
            {/*      <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="nic"
                label="NIC"
                type="text"
                id="nic"
                value={nic || ""}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    nic: event.target.value,
                  });
                }}
              />
            </Grid> */}
            {/*         <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="natureOfBusiness"
                label="Nature Of Business"
                type="text"
                id="natureOfBusiness"
                value={natureOfBusiness || ""}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    natureOfBusiness: event.target.value,
                  });
                }}
              />
            </Grid> */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="address"
                label="Address"
                type="text"
                id="address"
                value={address || ""}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    address: event.target.value,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="contactNumber"
                label="Contact Number"
                type="text"
                id="contactNumber"
                value={contactNumber || ""}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    contactNumber: event.target.value,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="mobileNumber"
                label="Mobile Number"
                type="text"
                id="mobileNumber"
                value={mobileNumber || ""}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    mobileNumber: event.target.value,
                  });
                }}
              />
            </Grid>
            {/*        <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="country"
                label="Country"
                type="text"
                id="country"
                value={country || ""}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    country: event.target.value,
                  });
                }}
              />
            </Grid> */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="email"
                label="Email"
                type="text"
                id="email"
                value={email || ""}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    email: event.target.value,
                  });
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="beneficiaryName"
                label="Beneficiary name"
                type="text"
                id="beneficiaryName"
                value={beneficiaryName || ""}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    beneficiaryName: event.target.value,
                  });
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="bankName"
                label="Bank name"
                type="text"
                id="bankName"
                value={bankName || ""}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    bankName: event.target.value,
                  });
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="bankAccNo"
                label="Bank Acc No"
                type="text"
                id="bankAccNo"
                value={bankAccNo || ""}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    bankAccNo: event.target.value,
                  });
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="bankIban"
                label="Bank IABN"
                type="text"
                id="bankIban"
                value={bankIban || ""}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    bankIban: event.target.value,
                  });
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="bankSwiftCode"
                label="Bank Swift Code"
                type="text"
                id="bankSwiftCode"
                value={bankSwiftCode || ""}
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    bankSwiftCode: event.target.value,
                  });
                }}
              />
            </Grid>
            {/* <Grid item xs={12} sm={12} md={12}>
              <TableContainer>
                <Typography>The total number will be applicable after 1 year of employment.</Typography>
                <Table border={1}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Absence type</TableCell>
                      <TableCell>Total number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {absenceTariff?.map((o_abc, index) => (
                      <TableRow key={index}>
                        <TableCell>{o_abc?.txt}</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="absc"
                            label="Quantity"
                            type="number"
                            id={o_abc?.id}
                            value={o_abc?.qty}
                            onChange={(event) => {
                              let a_abscence = [...absenceTariff];
                              let a_new_absc = [];
                              a_abscence.forEach((o_absc) => {
                                if (o_absc?.id === o_abc?.id) {
                                  a_new_absc.push({ ...o_abc, qty: event.target.value });
                                } else {
                                  a_new_absc.push({ ...o_absc });
                                }
                              });
                              setCompanyDetails({ ...companyDetails, absenceTariff: a_new_absc });
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => updateCompany(e)}
            color="primary"
            variant="contained"
          >
            Update
          </Button>
          <Button onClick={handleCloseDialog} color="error" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UpdateCompanyDialog;
