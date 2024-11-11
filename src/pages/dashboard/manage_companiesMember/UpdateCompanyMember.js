import {
  Alert,
  Button,
  Card,
  Container,
  FormControl,
  Grid,
  InputLabel,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../../hooks/useAuth";
import {
  selectCompanyList,
  setCompanyList,
} from "../../../features/companySlice";
import { setLoading } from "../../../features/globalSlice";
import { selectSnackbar, setSnackbar } from "../../../features/snackbarSlice";
import db, { firebaseApp } from "../../../firebase";
import { dynamicSort } from "../../../components/core-functions/SelectionCoreFunctions";

function UpdateCompanyMember() {
  const { companyList } = useSelector(selectCompanyList);

  const [companyDetails, setCompanyDetails] = useState({
    id: "",
    name: "",
    vatPercentage: 0,
    imageName: "",
    imageUrl: "",
    imageSig: "",
    sigUrl: "",
    stampName: "",
    stampUrl: "",
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
    brn: "",
    // nic: "",
    // absenceTariff: [],
    beneficiaryName: "",
    bankName: "",
    bankAccNo: "",
  });

  const [originalDetails, setOriginalDetails] = useState({
    id: "",
    name: "",
    vatPercentage: 0,
    imageName: "",
    imageUrl: "",
    imageSig: "",
    sigUrl: "",
    stampName: "",
    stampUrl: "",
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
    brn: "",
    // nic: "",
    // absenceTariff: [],
    beneficiaryName: "",
    bankName: "",
    bankAccNo: "",
  });

  const {
    name,
    vatPercentage,
    imageName,
    imageUrl,
    imageSig,
    sigUrl,
    stampName,
    stampUrl,
    companyType,
    tan,
    address,
    contactNumber,
    mobileNumber,
    email,
    brn,
    beneficiaryName,
    bankName,
    bankAccNo,
  } = companyDetails;

  const dispatch = useDispatch();
  const { user } = useAuth();
  const snackbar = useSelector(selectSnackbar);

  const [uploadedFile, setUploadedFile] = useState("");
  const [uploadedSigFile, setUploadedSigFile] = useState("");
  const [uploadedStampSigFile, setUploadedStampSigFile] = useState("");

  const [selectedComp, setSelectedComp] = useState("");
  const [updateFormDisplay, setUpdateFormDisplay] = useState(false);

  useEffect(() => {
    if (
      user?.role === "admin_member" &&
      user?.a_comp &&
      user?.a_comp?.length > 0 &&
      user?.permissions?.viewCompChk
    ) {
      init_comp_det(user?.a_comp);
    }
  }, [user]);

  const init_comp_det = async (a_comp) => {
    if (a_comp?.length === 1) {
      await db
        .collection("company")
        .doc(a_comp[0]?.id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            let comp_obj = {
              id: doc.id,
              data: doc?.data(),
              name: doc?.data()?.name || "",
              vatPercentage: doc?.data()?.vatPercentage || 0,
              imageName: doc?.data()?.imageName || "",
              imageSig: doc?.data()?.imageSig || "",
              imageUrl: doc?.data()?.imageUrl || "",
              sigUrl: doc?.data()?.sigUrl || "",
              stampName: doc?.data()?.stampName || "",
              stampUrl: doc?.data()?.stampUrl || "",
              companyType: doc?.data()?.companyType || "",
              // natureOfBusiness: data?.data()?.natureOfBusiness,
              // incorDate: data?.data()?.incorDate,
              // payeRegNo: data?.data()?.payeRegNo,
              tan: doc?.data()?.tan || "",
              brn: doc?.data()?.brn || "",
              // nic: data?.data()?.nic,
              address: doc?.data()?.address || "",
              // country: data?.data()?.country,
              contactNumber: doc?.data()?.contactNumber || "",
              mobileNumber: doc?.data()?.mobileNumber || "",
              email: doc?.data()?.email || "",
              // absenceTariff: doc?.data()?.absenceTariff || [],
              beneficiaryName: doc?.data()?.beneficiaryName || "",
              bankName: doc?.data()?.bankName || "",
              bankAccNo: doc?.data()?.bankAccNo || "",
            };
            setCompanyDetails(comp_obj);
            setOriginalDetails(comp_obj);
            setUpdateFormDisplay(true);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  };

  const updateCompany = async (e) => {
    let companyId = "";
    if (user?.a_comp?.length > 1) {
      companyId = selectedComp?.id || "";
    } else if (user?.a_comp?.length === 1) {
      companyId = user?.a_comp[0]?.id;
    }

    if (user?.id !== "" && user?.role === "admin_member" && companyId !== "") {
      e.preventDefault();
      dispatch(setLoading(true));
      if (name === "") {
        dispatch(
          setSnackbar({
            counter: snackbar.counter + 1,
            message: "Input with star cannot be blank",
            variant: "error",
          })
        );
        dispatch(setLoading(false));
      } /*  else if (
        tan !== "" &&
        tan !== undefined &&
        tan !== null &&
        tan.length !== 8
      ) {
        dispatch(
          setSnackbar({
            counter: snackbar.counter + 1,
            message: "Vat Registration Number should be of 8 characters",
            variant: "error",
          })
        );
        dispatch(setLoading(false));
      } */ else {
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
        companyList.forEach((comp) => {
          if (
            comp.id === /* user?.companyId */ companyId &&
            comp.name !== name
          ) {
            arr.push({ ...comp, name: name });
          } else {
            arr.push(comp);
          }
        });

        arr.sort(dynamicSort("name"));

        const compDocRef = db.collection("company").doc(companyId);
        const compDocBigArrayRef = db.collection("company").doc("companyIds");
        var batch = db.batch();

        batch.set(
          compDocRef,
          {
            name: name || "",
            vatPercentage: vatPercentage || 0,
            ...imageObject,
            companyType: companyType || "",
            tan: tan || "",
            address: address || "",
            email: email || "",
            contactNumber: contactNumber || "",
            mobileNumber: mobileNumber || "",
            brn: brn || "",
            beneficiaryName: beneficiaryName || "",
            bankName: bankName || "",
            bankAccNo: bankAccNo || "",
          },
          { merge: true }
        );

        batch.set(compDocBigArrayRef, {
          companyIdArray: arr,
        });

        batch.commit().then(async () => {
          dispatch(setCompanyList(arr));

          /* if (nameOriginal !== name) {
            await db
              .collection("company")
              .doc(companyId)
              .collection("client")
              .get()
              .then(async function (querySnapshot) {
                if (
                  querySnapshot &&
                  querySnapshot.docs &&
                  querySnapshot.docs.length > 0
                ) {
                  querySnapshot.docs.forEach(async function (doc) {
                    await db
                      .collection("company")
                      .doc(companyId)
                      .collection("client")
                      .doc(doc.id)
                      .set(
                        {
                          companyRefName: name,
                        },
                        { merge: true }
                      )
                      .then(() => {
                        console.log(
                          "Client : " +
                            doc.id +
                            " has been updated successfully."
                        );
                      })
                      .catch((error) => {
                        dispatch(
                          setSnackbar({
                            counter: snackbar.counter + 1,
                            message:
                              "Error occured while updating Employee: " +
                              doc.id +
                              ", Error: " +
                              error.message,
                            variant: "error",
                          })
                        );
                        dispatch(setLoading(false));
                      });
                  });

                  //reset home fields to initialise new options by user
                  dispatch(
                    setSnackbar({
                      counter: snackbar.counter + 1,
                      message: "Company successfully updated",
                      variant: "success",
                    })
                  );

                  dispatch(setLoading(false));
                } else {
                  dispatch(
                    setSnackbar({
                      counter: snackbar.counter + 1,
                      message: "Company successfully updated",
                      variant: "success",
                    })
                  );
                  dispatch(setLoading(false));
                }
              });
          }  */ // else {
          dispatch(
            setSnackbar({
              counter: snackbar.counter + 1,
              message: "Company successfully updated",
              variant: "success",
            })
          );
          dispatch(setLoading(false));
          // }
        });
      }
    } else {
      dispatch(
        setSnackbar({
          counter: snackbar.counter + 1,
          message:
            "Your session has been terminated due to greater than 30 minutes of inactivity. Please log in again.",
          variant: "error",
        })
      );
      dispatch(setLoading(false));
    }
  };

  const onFileChange = (e, type) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let fileSize = Number(file.size) / 1000; //to get size in kb

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
      } else if (Math.round(fileSize) > 25) {
        dispatch(
          setSnackbar({
            counter: snackbar.counter + 1,
            message:
              "Sorry the image you uploaded exceed 25 KB, size of image uploaded: " +
              Math.round(fileSize) +
              " KB",
            variant: "error",
          })
        );
      } else {
        if (type === "logo") {
          /* let obj = Object.assign(file, {
            preview: URL.createObjectURL(file),
          }); */
          /*
          setUploadedFile(file);
          setCompanyDetails({
            ...companyDetails,
            imageName: file.name,
          });
          */
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

  const onCompChange = async (event) => {
    if (event.target.value !== "") {
      let val = JSON.parse(event.target.value);

      await db
        .collection("company")
        .doc(val.id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            let comp_obj = {
              id: doc.id,
              data: doc.data(),
              name: doc?.data()?.name || "",
              vatPercentage: doc?.data()?.vatPercentage || 0,
              imageName: doc?.data()?.imageName || "",
              imageSig: doc?.data()?.imageSig || "",
              imageUrl: doc?.data()?.imageUrl || "",
              sigUrl: doc?.data()?.sigUrl || "",
              stampName: doc?.data()?.stampName || "",
              stampUrl: doc?.data()?.stampUrl || "",
              companyType: doc?.data()?.companyType || "",
              // natureOfBusiness: doc?.data()?.natureOfBusiness,
              // incorDate: doc?.data()?.incorDate,
              // payeRegNo: doc?.data()?.payeRegNo,
              tan: doc?.data()?.tan || "",
              brn: doc?.data()?.brn || "",
              // nic: doc?.data()?.nic,
              address: doc?.data()?.address || "",
              // country: doc?.data()?.country,
              contactNumber: doc?.data()?.contactNumber || "",
              mobileNumber: doc?.data()?.mobileNumber || "",
              email: doc?.data()?.email || "",
              // absenceTariff: doc?.data()?.absenceTariff || [],
              beneficiaryName: doc?.data()?.beneficiaryName || "",
              bankName: doc?.data()?.bankName || "",
              bankAccNo: doc?.data()?.bankAccNo || "",
            };
            setCompanyDetails(comp_obj);
            setOriginalDetails(comp_obj);

            setSelectedComp({
              id: val.id,
              name: val.name,
            });

            setUpdateFormDisplay(true);
          } else {
            // doc?.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    } else {
      setSelectedComp("");
      setUpdateFormDisplay(false);
    }
  };

  return (
    <Container>
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent={"center"}
        sx={{ width: "100%" }}
      >
        <Grid
          item
          xs={12}
          md={12}
          style={{ display: !user?.permissions?.viewCompChk ? "" : "none" }}
        >
          <Alert severity="error">
            Sorry, you do not have access to this section. Please contact Admin
            for more info. Thank you.
          </Alert>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          style={{
            display:
              user?.a_comp?.length > 1 && user?.permissions?.viewCompChk
                ? ""
                : "none",
          }}
        >
          <FormControl
            size="small"
            variant="outlined"
            fullWidth
            margin="normal"
          >
            <InputLabel id="mutiple-company-select">
              Please choose a Company *
            </InputLabel>

            <Select
              label="Please choose a Company *"
              labelId="mutiple-company-select"
              size="small"
              native
              value={JSON.stringify(selectedComp) || ""}
              required
              onChange={(event) => onCompChange(event)}
            >
              <option value="">Please choose a Company *</option>
              {user?.a_comp?.map((o_comp, index) => (
                <option
                  key={index}
                  value={JSON.stringify({
                    id: o_comp.id,
                    name: o_comp.name,
                  })}
                >
                  {o_comp?.name || ""}
                </option>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          style={{
            display:
              updateFormDisplay && user?.permissions?.viewCompChk ? "" : "none",
          }}
        >
          <Card>
            <Stack sx={{ p: 3 }}>
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
                margin="normal"
              >
                <InputLabel id="mutiple-company-type" required>
                  Company type
                </InputLabel>

                <Select
                  label="Company type"
                  labelId="mutiple-company-type"
                  size="small"
                  native
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

              <div style={{ paddingTop: "1.5rem" }}></div>

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

              <div style={{ paddingTop: "1.5rem" }}></div>

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
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    size="small"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    name="vatRegistrationNumber"
                    label="TAN"
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
                    margin="normal"
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
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    size="small"
                    margin="normal"
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
              </Grid>

              <br />

              <Stack spacing={3} direction="row" justifyContent={"flex-end"}>
                <Button
                  onClick={(e) => updateCompany(e)}
                  color="primary"
                  variant="contained"
                  disabled={!user?.permissions?.updateCompChk}
                >
                  Update
                </Button>
                <Button
                  onClick={() => {
                    setCompanyDetails({ ...originalDetails });
                  }}
                  color="secondary"
                  variant="contained"
                  disabled={!user?.permissions?.updateCompChk}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default UpdateCompanyMember;
