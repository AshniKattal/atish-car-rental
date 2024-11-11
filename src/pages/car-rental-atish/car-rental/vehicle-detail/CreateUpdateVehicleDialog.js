import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../../features/globalSlice";
import db, { firebaseApp } from "../../../../firebase";
import ProductNewForm from "./ProductNewForm";
import firebase from "firebase/compat";
import { useState } from "react";

export default function CreateUpdateVehicleDialog({
  dialogType,
  openDialog,
  handleCloseDialog,
  vehicleDetails,
  setVehicleDetails,
  initialiseVehicles,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [imagesListChanged, setImagesListChanged] = useState(false);

  const addVehicle = async (values) => {
    dispatch(setLoading(true));

    if (
      !values?.name ||
      // !values?.plateNumber ||
      !values?.price ||
      !values?.passengers ||
      !values?.doors ||
      !values?.transmission ||
      // !values?.airConditioning ||
      values?.featuredImage?.length === 0
    ) {
      enqueueSnackbar("Please fill in all the inputs", { variant: "error" });
      dispatch(setLoading(false));
    } else {
      let uploadedImages = await checkForImagesUpdates(values);

      if (uploadedImages) {
        await db
          .collection(process.env.REACT_APP_COLLECTION_VEHICLES)
          .add({
            // ...values,
            name: values?.name || "",
            plateNumber: values?.plateNumber || "",
            price: values?.price || "",
            passengers: values?.passengers || "",
            doors: values?.doors || "",
            transmission: values?.transmission || null,
            airConditioning: values?.airConditioning || "",
            featuredImage: uploadedImages || [],
            serviceCategory: values?.serviceCategory || null,
            dateTimeCreated: firebase.firestore.Timestamp.fromDate(new Date()),
          })
          .then(async () => {
            enqueueSnackbar("Vehicle created successfully", {
              variant: "success",
            });
            initialiseVehicles();
            dispatch(setLoading(false));
            handleCloseDialog();
          })
          .catch((error) => {
            enqueueSnackbar(
              `Error occured while creating Vehicle. Error: ${error?.message}`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      }
    }
  };

  const updateVehicle = async (values) => {
    dispatch(setLoading(true));
    if (
      !values?.name ||
      // !values?.plateNumber ||
      !values?.price ||
      !values?.passengers ||
      !values?.doors ||
      !values?.transmission ||
      // !values?.airConditioning ||
      values?.featuredImage?.length === 0
    ) {
      enqueueSnackbar("Please fill in all the inputs", { variant: "error" });
      dispatch(setLoading(false));
    } else {
      let uploadedImages = await checkForImagesUpdates(values);

      if (uploadedImages) {
        await db
          .collection(process.env.REACT_APP_COLLECTION_VEHICLES)
          .doc(vehicleDetails?.id)
          .set(
            {
              // ...values,
              name: values?.name || "",
              plateNumber: values?.plateNumber || "",
              price: values?.price || "",
              passengers: values?.passengers || "",
              doors: values?.doors || "",
              transmission: values?.transmission || "",
              airConditioning: values?.airConditioning || "",
              featuredImage: uploadedImages || [],
              serviceCategory: values?.serviceCategory || null,
            },
            { merge: true }
          )
          .then(async () => {
            enqueueSnackbar("Vehicle updated successfully");
            initialiseVehicles();
            dispatch(setLoading(false));
            handleCloseDialog();
          })
          .catch((error) => {
            enqueueSnackbar(
              `Error occured while creating Vehicle. Error: ${error?.message}`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      } else {
        await db
          .collection(process.env.REACT_APP_COLLECTION_VEHICLES)
          .doc(vehicleDetails?.id)
          .set(
            {
              name: values?.name || "",
              plateNumber: values?.plateNumber || "",
              price: values?.price || "",
              passengers: values?.passengers || "",
              doors: values?.doors || "",
              transmission: values?.transmission || "",
              airConditioning: values?.airConditioning || "",
              serviceCategory: values?.serviceCategory || null,
            },
            { merge: true }
          )
          .then(async () => {
            enqueueSnackbar("Vehicle updated successfully");
            initialiseVehicles();
            dispatch(setLoading(false));
            handleCloseDialog();
          })
          .catch((error) => {
            enqueueSnackbar(
              `Error occured while creating Vehicle. Error: ${error?.message}`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      }
    }
  };

  async function checkForImagesUpdates(values) {
    return await new Promise(async (resolve) => {
      if (imagesListChanged) {
        //upload images if present
        const uploadedImagesFiles = values?.featuredImage;

        let storageRef = `car-rental-vehicles-images`;

        const promises = [];

        let storageImageRef = firebaseApp
          .storage()
          .ref(`${storageRef}/${values?.name}/`);

        uploadedImagesFiles.forEach((imageFile, index) => {
          promises.push(
            new Promise(async (resolveImage) => {
              // upload other images in storage
              let fileImageRef = storageImageRef.child(`image${index + 1}`);
              await fileImageRef
                .put(imageFile)
                .then(() => {
                  // get other images download url
                  fileImageRef
                    .getDownloadURL()
                    .then((downloadURL) => {
                      resolveImage({
                        error: false,
                        imageObject: {
                          name: `image${index + 1}`,
                          url: downloadURL,
                        },
                      });
                    })
                    .catch((error) => {
                      resolveImage({
                        error: true,
                        message: `Error occured while retrieving the download url: ${error?.message}`,
                      });
                    });
                })
                .catch((error) => {
                  resolveImage({
                    error: true,
                    message: `Error occured while uploading the file in the storage folder: ${error?.message}`,
                  });
                });
            })
          );
        });

        Promise.all(promises).then(async (allImagesDownloadUrls) => {
          let imagesList = [];
          if (allImagesDownloadUrls && allImagesDownloadUrls?.length > 0) {
            allImagesDownloadUrls.forEach((image) => {
              if (!image?.error) {
                imagesList.push({
                  downloadURL: image?.imageObject?.url,
                  preview: image?.imageObject?.url,
                  name: image?.imageObject?.name,
                });
              }
            });

            resolve(imagesList);
          }
        });
      } else {
        resolve(null);
      }
    });
  }

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth={"md"}
      >
        <DialogTitle id="alert-dialog-title">
          {dialogType && dialogType === "add"
            ? "Create vehicle"
            : "Update vehicle"}
        </DialogTitle>
        <DialogContent style={{ paddingTop: "1em" }}>
          <ProductNewForm
            isEdit={dialogType === "add" ? false : true}
            currentProduct={vehicleDetails}
            addVehicle={addVehicle}
            updateVehicle={updateVehicle}
            handleCloseDialog={handleCloseDialog}
            setImagesListChanged={setImagesListChanged}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
