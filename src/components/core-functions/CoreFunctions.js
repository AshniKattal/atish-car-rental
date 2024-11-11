import db from "src/firebase";
import firebase from "firebase/compat";
import emailjs from "@emailjs/browser";
import { formatDocumentIdNumber } from "./SelectionCoreFunctions";
import moment from "moment";

// fetch list of services -> all service owners
export async function getServiceList(type, userId) {
  return await new Promise(async (resolve) => {
    if (type === "user" && userId) {
      await db
        .collection(process.env.REACT_APP_COLLECTION_SERVICES)
        .where("userId", "==", userId)
        .get()
        .then((result) => {
          let arr = [];
          if (result?.docs && result?.docs?.length > 0) {
            result?.docs.forEach((service) => {
              arr.push({
                id: service?.id,
                ...service?.data(),
              });
              resolve({
                error: false,
                list: arr,
              });
            });
          } else {
            resolve({
              error: false,
              list: [],
            });
          }
        })
        .catch((error) => {
          resolve({
            error: true,
            message: `Error occured while uploading logo: ${error?.message}`,
          });
        });
    } else {
      await db
        .collection(process.env.REACT_APP_COLLECTION_SERVICES)
        .limit(15)
        .get()
        .then((result) => {
          let arr = [];
          if (result?.docs?.length > 0) {
            result?.docs.forEach((doc) => {
              arr.push({
                id: doc?.id,
                data: { ...doc?.data() },
                ...doc?.data(),
              });
            });
            resolve(arr);
          } else {
            resolve([]);
          }
        });
    }
  });
}

// fetch list of stores -> all users
export async function getStoresList(type, userId) {
  return await new Promise(async (resolve) => {
    if (type === "user" && userId) {
      await db
        .collection(process.env.REACT_APP_COLLECTION_STORES)
        .where("userId", "==", userId)
        .get()
        .then((result) => {
          let arr = [];
          if (result?.docs?.length > 0) {
            result?.docs.forEach((doc) => {
              arr.push({
                id: doc?.id,
                data: { ...doc?.data() },
                ...doc?.data(),
              });
            });
            resolve({
              error: false,
              list: arr,
            });
          } else {
            resolve({
              error: false,
              list: [],
            });
          }
        })
        .catch((error) => {
          resolve({
            error: true,
            message: `Error occured while uploading logo: ${error?.message}`,
          });
        });
    } else if (type === "all") {
      await db
        .collection(process.env.REACT_APP_COLLECTION_STORES)
        .orderBy("serviceTitle", "asc")
        .get()
        .then((result) => {
          let arr = [];
          if (result?.docs?.length > 0) {
            result?.docs.forEach((doc) => {
              arr.push({
                id: doc?.id,
                data: { ...doc?.data() },
                ...doc?.data(),
              });
            });
            resolve({
              error: false,
              list: arr,
            });
          } else {
            resolve({
              error: false,
              list: [],
            });
          }
        })
        .catch((error) => {
          resolve({
            error: true,
            message: `Error occured while uploading logo: ${error?.message}`,
          });
        });
    }
  });
}

// fetch list of products from a specific store -> all users
export async function getProductList(type, userId) {
  return await new Promise(async (resolve) => {
    if (type === "user" && userId) {
      await db
        .collection(process.env.REACT_APP_COLLECTION_STORES)
        .where("userId", "==", userId)
        .get()
        .then((result) => {
          let arr = [];
          if (result?.docs?.length > 0) {
            result?.docs.forEach((doc) => {
              arr.push({
                id: doc?.id,
                data: { ...doc?.data() },
                ...doc?.data(),
              });
            });
            resolve({
              error: false,
              list: arr,
            });
          } else {
            resolve({
              error: false,
              list: [],
            });
          }
        })
        .catch((error) => {
          resolve({
            error: true,
            message: `Error occured while uploading logo: ${error?.message}`,
          });
        });
    }
  });
}

// fetch list of data
export async function getAllDataList(collectionName) {
  return await new Promise(async (resolve) => {
    if (collectionName) {
      await db
        .collection(collectionName)
        .orderBy("dateTimeCreated", "asc")
        .get()
        .then((result) => {
          let arr = [];
          if (result?.docs && result?.docs?.length > 0) {
            result?.docs.forEach((doc) => {
              arr.push({
                id: doc?.id,
                ...doc?.data(),
              });
              resolve({
                error: false,
                list: arr,
              });
            });
          } else {
            resolve({
              error: false,
              list: [],
            });
          }
        })
        .catch((error) => {
          resolve({
            error: true,
            message: `Error occured while uploading logo: ${error?.message}`,
          });
        });
    } else {
      resolve({
        error: true,
        message: "Collection name has not been provided.",
      });
    }
  });
}

// send email after booking car rental
export async function sendEmailAfterCarRentalBooking(
  fromName,
  toName,
  fromEmail,
  toEmail,
  subject,
  message,
  fileName,
  content,
  serviceKey,
  templateKey,
  successfulMessage
) {
  return await new Promise((resolve) => {
    let emailParameters = {
      from_name: fromName,
      to_name: toName,
      from_email: fromEmail,
      to_email: toEmail,
      reply_to: fromName,
      fileName: fileName,
      content: content,
      subject: subject,
      message: message,
    };

    emailjs
      .send(
        serviceKey,
        templateKey,
        {
          ...emailParameters,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(async () => {
        resolve({
          error: false,
          message: successfulMessage,
          variant: "success",
        });
      })
      .catch((error) => {
        resolve({ error: true, message: error?.message, variant: "error" });
      });
  });
}

export async function getNewBookingId() {
  return await new Promise(async (resolve) => {
    var documentDocRef = db.collection("vehiclebooking").doc("documentIndex");

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

        if (documentNumberDocString) {
          resolve({
            error: false,
            bookingId: documentNumberDocString,
          });
        }
      })
      .catch((err) => {
        resolve({
          error: true,
          message: `Error occured while generating new booking number: ${err?.message}`,
        });
      });
  });
}

export async function saveNewBooking(bookingId, product, bookingData, user) {
  return await new Promise(async (resolve) => {
    await db
      .collection("vehiclebooking")
      .doc(bookingId)
      .set({
        vehicleDetails: { ...product },
        status: "pending",
        ...bookingData,
        dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
        createdByUserId: user?.id || "",
        clientName: `${user?.lastName || ""} ${user?.firstName || ""}`,
        clientMobile: user?.phoneNumber || "",
        clientEmail: user?.email || "",
      })
      .then(async () => {
        resolve({
          error: false,
        });
      })
      .catch((error) => {
        resolve({
          error: true,
          message: `Error occured while saving booking details: ${error?.message}`,
        });
      });
  });
}

// notify client/admin via email after client make a new booking
export async function notifyByEmailAfterNewBooking(
  bookingId,
  toName,
  toEmail,
  bookingData,
  vehicleName,
  successfulMessage,
  role,
  clientName
) {
  return await new Promise(async (resolve) => {
    let fromName = "Reaching Heights Ltd";
    let fromEmail = process.env.REACT_APP_EMAIL;

    let message =
      role === "client"
        ? `<p>Dear ${toName},<br><br>Hope you are doing great.<br><br>This is to inform you that your booking has been recorded successfully with Booking ID-${bookingId}.<br>Our team will review and confirm the booking within two days.<br><br>Please find below the booking details:-<br><ul><li>Status: Pending(Waiting for admin to review)</li><li>Date of Pickup: ${
            bookingData.bookingPickupDate
              ? moment(bookingData.bookingPickupDate).format("DD/MM/YYYY")
              : ""
          }</li><li>Date of Return: ${
            bookingData.bookingReturnDate
              ? moment(bookingData.bookingReturnDate).format("DD/MM/YYYY")
              : ""
          }, 
    }</li><li>Time of Pickup: ${
      bookingData?.bookingPickupTime || ""
    }</li><li>Time of Return: ${
            bookingData?.bookingReturnTime || ""
          }</li><li>Pickup Location: ${
            bookingData?.bookingPickupAddress?.id === "anywhere"
              ? bookingData?.bookingPickupAnywhereAddress || ""
              : bookingData?.bookingPickupAddress?.title || ""
          }</li><li>Car model: ${
            vehicleName || ""
          }</li></ul><br><br>You can access the dashboard to view the status of your booking.<br><br>Thank you.<br>Kind regards,<br>${fromName}</p>`
        : role === "admin"
        ? `<p>Dear ${toName},<br><br>A new booking with id number ${bookingId} has been created by client ${clientName}.<br><br><ul><li>Status: Pending(Waiting for admin to review)</li><li>Date of Pickup: ${
            bookingData.bookingPickupDate
              ? moment(bookingData.bookingPickupDate).format("DD/MM/YYYY")
              : ""
          }</li><li>Date of Return: ${
            bookingData.bookingReturnDate
              ? moment(bookingData.bookingReturnDate).format("DD/MM/YYYY")
              : ""
          }, 
    }</li><li>Time of Pickup: ${
      bookingData?.bookingPickupTime || ""
    }</li><li>Time of Return: ${
            bookingData?.bookingReturnTime || ""
          }</li><li>Pickup Location: ${
            bookingData?.bookingPickupAddress?.id === "anywhere"
              ? bookingData?.bookingPickupAnywhereAddress || ""
              : bookingData?.bookingPickupAddress?.title || ""
          }</li><li>Car model: ${vehicleName}</li></ul><br><br>Thank you.<br>Kind regards,<br>${fromName}</p>`
        : "";

    let subject =
      role === "client"
        ? `Booking ${bookingId} recorded successfully`
        : role === "admin"
        ? `New booking ${bookingId} from client ${clientName}`
        : "";

    let fileName = "";
    let content = [];
    let serviceKey = process.env.REACT_APP_SERVICE_KEY;
    let templateKey = process.env.REACT_APP_TEMPLATE_KEY;

    let emailResponse = await sendEmailAfterCarRentalBooking(
      fromName,
      toName,
      fromEmail,
      toEmail,
      subject,
      message,
      fileName,
      content,
      serviceKey,
      templateKey,
      successfulMessage
    );

    if (emailResponse?.error) {
      resolve({
        error: true,
        message: emailResponse?.message,
      });
    } else if (!emailResponse?.error) {
      resolve({
        error: false,
        message: emailResponse?.message,
      });
    }
  });
}

// notify client/admin via email after client update an existing booking
export async function notifyByEmailAfterUpdatingBooking(
  bookingId,
  toName,
  toEmail,
  bookingData,
  vehicleName,
  role,
  updatedByRole
) {
  return await new Promise(async (resolve) => {
    let fromName = "Reaching Heights Ltd";
    let fromEmail = process.env.REACT_APP_EMAIL;

    let subject = `Booking ${bookingId} updated`;

    let addedClientText =
      bookingData.status === "confirmed"
        ? `Your booking ${bookingId} has been confirmed.`
        : bookingData.status === "declined"
        ? `Your booking ${bookingId} has been declined.`
        : bookingData.status === "pending"
        ? "Our team will review and confirm the booking within two days."
        : "";

    let addedAdminText = updatedByRole === "client" ? "by client" : "";

    let statusText =
      bookingData.status === "confirmed"
        ? "Confirmed (by admin)"
        : bookingData.status === "declined"
        ? "Declined (by admin)"
        : bookingData.status === "pending"
        ? "Pending (Waiting for admin to review booking details)"
        : "";

    let message =
      role === "client"
        ? `<p>Dear ${toName},<br><br>Hope you are doing great.<br><br>This is to inform you that booking with Id number ${bookingId} has been updated successfully.<br>${addedClientText}<br><br>Please find below the updated booking details:-<br><ul><li>Status: ${statusText}</li><li>Date of Pickup: ${
            bookingData.bookingPickupDate
              ? moment(bookingData.bookingPickupDate).format("DD/MM/YYYY")
              : ""
          }</li><li>Date of Return: ${
            bookingData.bookingReturnDate
              ? moment(bookingData.bookingReturnDate).format("DD/MM/YYYY")
              : ""
          }, 
    </li><li>Time of Pickup: ${
      bookingData?.bookingPickupTime || ""
    }</li><li>Time of Return: ${
            bookingData?.bookingReturnTime || ""
          }</li><li>Pickup Location: ${
            bookingData?.bookingPickupAddress?.id === "anywhere"
              ? bookingData?.bookingPickupAnywhereAddress || ""
              : bookingData?.bookingPickupAddress?.title || ""
          }</li><li>Car model: ${
            vehicleName || ""
          }</li></ul><br><br>You can access the dashboard to view the status of your booking.<br><br>Thank you.<br>Kind regards,<br>${
            fromName || ""
          }</p>`
        : role === "admin"
        ? `<p>Dear ${toName},<br><br>The booking with id number ${bookingId} has been updated ${addedAdminText}.<br><br><ul><li>Status: ${statusText}</li><li>Date of Pickup: ${
            bookingData.bookingPickupDate
              ? moment(bookingData.bookingPickupDate).format("DD/MM/YYYY")
              : ""
          }</li><li>Date of Return: ${
            bookingData.bookingReturnDate
              ? moment(bookingData.bookingReturnDate).format("DD/MM/YYYY")
              : ""
          }, 
    }</li><li>Time of Pickup: ${
      bookingData?.bookingPickupTime || ""
    }</li><li>Time of Return: ${
            bookingData?.bookingReturnTime || ""
          }</li><li>Pickup Location: ${
            bookingData?.bookingPickupAddress?.id === "anywhere"
              ? bookingData?.bookingPickupAnywhereAddress || ""
              : bookingData?.bookingPickupAddress?.title || ""
          }</li><li>Car model: ${
            vehicleName || ""
          }</li></ul><br><br>Thank you.<br>Kind regards,<br>${fromName}</p>`
        : "";

    let fileName = "";
    let content = [];
    let serviceKey = process.env.REACT_APP_SERVICE_KEY;
    let templateKey = process.env.REACT_APP_TEMPLATE_KEY;
    let successfulMessage =
      role === "client"
        ? `Booking updated successfully.`
        : role === "admin"
        ? "Admin notified successfully."
        : "";

    let emailResponse = await sendEmailAfterCarRentalBooking(
      fromName,
      toName,
      fromEmail,
      toEmail,
      subject,
      message,
      fileName,
      content,
      serviceKey,
      templateKey,
      successfulMessage
    );

    if (emailResponse?.error) {
      resolve({
        error: true,
        message: emailResponse?.message,
      });
    } else if (!emailResponse?.error) {
      resolve({
        error: false,
        message: emailResponse?.message,
      });
    }
  });
}

// create new car rental contract
export async function createNewContract(bookingId, bookingData) {
  return await new Promise(async (resolve) => {
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

        await db
          .collection("contract")
          .doc(documentNumberDocString)
          .set({
            id: documentNumberDocString,
            bookingId: bookingId,
            driverName: bookingData?.clientName || "",
            driverMobile: bookingData?.clientMobile || "",
            driverEmail: bookingData?.clientEmail || "",
            vehicleModelName: bookingData?.vehicleDetails?.name || "",
            vehicleClass: bookingData?.vehicleDetails?.category?.title || "",
            pickUpLocation:
              bookingData?.bookingPickupAddress?.title === "anywhere"
                ? bookingData?.bookingPickupAnywhereAddress || ""
                : bookingData?.bookingPickupAddress?.title || "",
            pickUpDateTime: `${moment(
              bookingData?.bookingPickupDate?.toDate()
            ).format("DD-MM-YYYY")}, ${bookingData?.bookingPickupTime} `,
            returnLocation: "",
            returnDateTime: `${moment(
              bookingData?.bookingReturnDate?.toDate()
            ).format("DD-MM-YYYY")}, ${bookingData?.bookingReturnTime} `,
            rentalAmount: Number(bookingData?.bookingTotalAmount || 0),
            paymentStatus: "Unpaid",
            docRemainingPaymentAmt: Number(
              bookingData?.bookingTotalAmount || 0
            ),
            attachedPaymentNumber: [
              {
                paymentType: "",
                paymentAmount: 0,
                paymentRemainingAmount: Number(
                  bookingData?.bookingTotalAmount || 0
                ),
                paymentDate: "",
              },
            ],
          })
          .then(() => {
            resolve({
              error: false,
              contractId: documentNumberDocString,
            });
          })
          .catch((error) => {
            resolve({
              error: true,
              message: `Error occured while creating contract: ${error?.message}`,
            });
          });
      })
      .catch((error) => {
        resolve({
          error: true,
          message: `Error occured while generating contract: ${error?.message}`,
        });
      });
  });
}
