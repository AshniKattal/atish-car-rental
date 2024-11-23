/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const cors = require("cors")({ origin: true });
const { onRequest, onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
require("dotenv").config();
const functions = require("firebase-functions");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto-browserify");
var forge = require("node-forge");
const moment = require("moment");
const fs = require("fs");
const CryptoJs = require("crypto-js");
const { execSync } = require("child_process");
const firestore = require("@google-cloud/firestore");
const client = new firestore.v1.FirestoreAdminClient();
const bucket = process.env.BUCKET_NAME;

admin.initializeApp();

exports.generatepdf = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      let data = req.body;

      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();

      await page.setContent(
        //`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body><h1>Hello world</h1></body></html>`,
        data.data.element,
        { waitUntil: "domcontentloaded" }
      );

      const buffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          left: "25px",
          top: "25px",
          right: "25px",
          bottom: "25px",
        },
        displayHeaderFooter: true,
        headerTemplate: "<div></div>",
        footerTemplate: data.data.footer,
      });
      await browser.close();
      res.set({
        "Content-Type": "application/pdf",
        "Content-Length": buffer.length,
      });
      res.send({ result: buffer });
    } catch (error) {
      console.log("There is an error " + error);
      //return { error: error };
    }
  });
});

exports.createuserbyadmin = onRequest(
  /* { cors: true }, */ async (req, res) => {
    cors(req, res, async () => {
      const data = req.body.data; // Extract the request payload
      const context = { auth: req }; // Optional: Create a context object if you need authentication
      console.log("Context: ", context);

      const role = data.role;
      if (!roleIsValid(role)) {
        throw new functions.https.HttpsError(
          "out-of-range",
          `The ${role} role is not a valid role`
        );
      }

      const newUser = {
        email: data.email,
        emailVerified: false,
        password: data.password,
        displayName: data.firstName + " " + data.lastName,
        disabled: false,
      };

      const userRecord = await admin.auth().createUser(newUser);

      const userId = userRecord.uid;

      const claims = {};
      claims["role"] = data.role;
      claims["access"] = data.access;

      await admin.auth().setCustomUserClaims(userId, claims);

      await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .set({ ...data }, { merge: true });

      res.send({ result: "The new user has been successfully created." });
    });
  }
);

exports.createuserbyadminnew = onCall({ cors: true }, async (req) => {
  const data = req.data; // Extract the request payload

  const role = data.role;
  if (!roleIsValid(role)) {
    throw new functions.https.HttpsError(
      "out-of-range",
      `The ${role} role is not a valid role`
    );
  }

  const newUser = {
    email: data.email,
    emailVerified: false,
    password: data.password,
    displayName: data.firstName + " " + data.lastName,
    disabled: false,
  };

  const userRecord = await admin.auth().createUser(newUser);

  const userId = userRecord.uid;

  const claims = {};
  claims["role"] = data.role;
  claims["access"] = data.access;

  await admin.auth().setCustomUserClaims(userId, claims);

  await admin
    .firestore()
    .collection("users")
    .doc(userId)
    .set({ ...data }, { merge: true });

  return { result: "The new user has been successfully created." };
});

exports.creatememberadminuser = onRequest({ cors: true }, async (req, res) => {
  const data = req.body.data; // Extract the request payload

  const role = data.role;
  if (!roleIsValid(role)) {
    throw new functions.https.HttpsError(
      "out-of-range",
      `The ${role} role is not a valid role`
    );
  }

  const newUser = {
    email: data.email,
    emailVerified: false,
    password: data.password,
    displayName: data.firstName + " " + data.lastName,
    disabled: false,
  };

  const userRecord = await admin.auth().createUser(newUser);

  const userId = userRecord.uid;

  const claims = {};
  claims["role"] = "admin_member";
  claims["access"] = true;

  await admin.auth().setCustomUserClaims(userId, claims);

  await admin.firestore().collection("users").doc(userId).set(data);

  res.send({ result: "The new user has been successfully created." });
});

exports.updateuserbyadmin = onRequest({ cors: true }, async (req, res) => {
  const data = req.body.data; // Extract the request payload

  const userId = data.id;
  await admin.auth().updateUser(userId, data);

  await admin
    .firestore()
    .collection("users")
    .doc(userId)
    .set({ ...data }, { merge: true });

  await admin.auth().setCustomUserClaims(userId, {
    access: data.access,
    role: data.role,
    permissions: data.sysFunc,
  });

  res.send({ result: "User has been successfully updated." });
});

exports.updateuserbyadminnew = onCall({ cors: true }, async (request) => {
  const userId = request.data.id;
  await admin.auth().updateUser(userId, request.data);

  await admin
    .firestore()
    .collection("users")
    .doc(userId)
    .set({ ...request.data }, { merge: true });

  await admin.auth().setCustomUserClaims(userId, {
    access: request.data.access,
    role: request.data.role,
  });

  return { result: "User has been successfully updated." };
});

exports.deleteuserbyadmin = onRequest(
  /* { cors: true }, */ async (req, res) => {
    cors(req, res, async () => {
      const data = req.body.data;

      const userId = data.id;
      await admin.auth().deleteUser(userId);
      await admin.firestore().collection("users").doc(userId).delete();
      res.send({ result: "User has been successfully deleted." });
    });
  }
);
exports.deleteuserbyadminnew = onCall({ cors: true }, async (request) => {
  const data = request.data;

  const userId = data.id;
  await admin.auth().deleteUser(userId);
  await admin.firestore().collection("users").doc(userId).delete();

  return { result: "User has been successfully deleted." };
});

exports.checkusertype = onRequest(
  /* { cors: true }, */ async (req, res) => {
    cors(req, res, async () => {
      const data = req.body.data; // Extract the request payload

      let userDetails = await admin
        .firestore()
        .collection("users")
        .doc(data.userId)
        .get();

      if (
        data.userId &&
        (!userDetails.exists ||
          (userDetails &&
            userDetails.data() &&
            (userDetails.data().role === "client" || !userDetails.data().role)))
      ) {
        // user with role as client
        res.send({
          result: {
            result: "client",
            success: true,
            a_comp: JSON.parse(data.a_comp || []),
          },
        });
      } else {
        const callerUserRecord = await admin.auth().getUser(data.userId);

        if (callerUserRecord.customClaims["access"]) {
          if (callerUserRecord.customClaims["role"] === "super-admin") {
            res.send({
              result: {
                result: "super-admin",
                success: true,
                a_comp: userDetails?.data()?.a_comp || [],
              },
            });
          } else if (callerUserRecord.customClaims["role"] === "Admin") {
            res.send({
              result: {
                result: "Admin",
                success: true,
                a_comp: userDetails?.data()?.a_comp || [],
              },
            });
          } else if (callerUserRecord.customClaims["role"] === "Secretary") {
            res.send({
              result: {
                result: "Secretary",
                success: true,
                a_comp: userDetails?.data()?.a_comp || [],
              },
            });
          } else if (callerUserRecord.customClaims["role"] === "SalePerson") {
            res.send({
              result: {
                result: "SalePerson",
                success: true,
                a_comp: userDetails?.data()?.a_comp || [],
              },
            });
          } else if (callerUserRecord.customClaims["role"] === "admin_member") {
            let a_empNotAlowed = [];
            if (
              userDetails &&
              userDetails.data() &&
              userDetails.data().a_empNotAllow
            ) {
              a_empNotAlowed = userDetails.data().a_empNotAllow;
            }

            if (
              userDetails &&
              userDetails.data() &&
              userDetails.data().a_comp &&
              userDetails.data().a_comp.length > 0
            ) {
              res.send({
                result: {
                  result: "admin_member",
                  success: true,
                  a_comp: userDetails.data().a_comp,
                  a_empNotAllow: a_empNotAlowed,
                },
              });
            } else {
              res.send({
                result: {
                  result: "admin_member",
                  success: false,
                  a_comp: [],
                  a_empNotAllow: [],
                },
              });
            }
          } else {
            res.send({ result: { result: false, success: false } });
          }
        } else {
          res.send({
            result: {
              result:
                "Sorry you do not have access to this site, contact your admin for more info.",
              success: false,
            },
          });
        }
      }
    });
  }
);

// exports.submitinvoicetomra = onRequest(async (req, res) => {
//   cors(req, res, async () => {
//     const data = req.body.data; // Extract the request payload

//     const user = JSON.parse(data?.user);
//     const companyIdSelected = data.companyIdSelected;
//     const invoiceData = JSON.parse(data?.invoiceData);
//     const documentType = JSON.parse(data?.documentType);
//     const companyDetails = JSON.parse(data?.companyDetails);
//     const clientDocumentObjectSelected = JSON.parse(
//       data?.clientDocumentObjectSelected
//     );

//     // check if user has a token and if it has expired
//     const validToken = false; // await checkToken(user);

//     // get new token if actual token is not valid
//     let ebs_mra_key = "";
//     let ebs_encrypt_key = "";
//     let ebs_mra_token = "";
//     if (!validToken) {
//       const authenticationDetails = await getEbsAuthenticationDetails(
//         user,
//         null
//       );

//       if (authenticationDetails?.error) {
//         // store error
//         await admin
//           .firestore()
//           .collection("company")
//           .doc(companyIdSelected)
//           .collection(documentType?.id)
//           .doc(invoiceData?.data?.docString)
//           .set(
//             {
//               mraCompliantStatus: "error",
//               mraCompliantMessage: authenticationDetails?.message,
//             },
//             { merge: true }
//           )
//           .then(() => {
//             console.log("Error stored successfully");
//           });
//       } else {
//         ebs_mra_key = authenticationDetails?.ebs_mra_key;
//         ebs_encrypt_key = authenticationDetails?.ebs_encrypt_key;
//         ebs_mra_token = authenticationDetails?.ebs_mra_token;
//       }
//     } else {
//       ebs_mra_key = user?.ebs_mra_key;
//       ebs_encrypt_key = user?.ebs_encrypt_key;
//       ebs_mra_token = user?.ebs_mra_token;
//     }

//     if (ebs_encrypt_key && ebs_mra_key && ebs_mra_token) {
//       // get previous hash
//       let previousNoteHashValue = "";
//       const previousNoteHash = await getPreviousNoteHash(
//         companyIdSelected,
//         documentType?.id,
//         invoiceData?.data?.invoiceTypeDesc?.id,
//         data?.brn
//       );

//       if (previousNoteHash?.error) {
//         // store error
//         await admin
//           .firestore()
//           .collection("company")
//           .doc(companyIdSelected)
//           .collection(documentType?.id)
//           .doc(invoiceData?.data?.docString)
//           .set(
//             {
//               mraCompliantStatus: "error",
//               mraCompliantMessage: previousNoteHash?.message,
//             },
//             { merge: true }
//           )
//           .then(() => {
//             console.log("Error stored successfully");
//           });
//       } else {
//         previousNoteHashValue = previousNoteHash?.value;
//       }

//       if (previousNoteHashValue) {
//         const requestDateTime = moment(new Date()).format("yyyyMMDD HH:mm:ss");

//         const aesKey = ebs_encrypt_key;
//         const mraKey = ebs_mra_key;

//         // 1. Decode and decrypt Key received from MRA using the random AES Key that was generated in the authentication step
//         const decryptedKeyFromMraKey = decryptKeyReceivedFromMRA(
//           Buffer.from(aesKey, "base64"),
//           mraKey
//         );

//         // 2. Generate invoice corresponding to sample JSON invoice (MRA requested format)
//         const InvoiceDataJSON = await getInvoiceDataJson(
//           invoiceData,
//           previousNoteHashValue,
//           companyDetails,
//           clientDocumentObjectSelected
//         );

//         /**
//          * 3. is optional
//          * 4. Encrypt JSON string from step 2 using decrypted Key from step 1
//          * (The encrypted key that was received from MRA in the authentication response parameters).
//          * Note that the decrypted key should be decoded first before using same for encryption (refer to code snippet)
//          * 5 Encode encrypted JSON from step 4 to Base 64
//          */
//         const encryptedData = encryptInvoice(
//           InvoiceDataJSON,
//           Buffer.from(decryptedKeyFromMraKey, "base64")
//         );

//         // 6 Generate JSON payload corresponding to the invoice transmission request
//         const payload = {
//           requestId: uuidv4(),
//           requestDateTime: requestDateTime,
//           signedHash: "", // optional
//           encryptedInvoice: encryptedData,
//         };

//         const headers = {
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Credentials": "true",
//           "Access-Control-Max-Age": "1800",
//           "Access-Control-Allow-Headers": "content-type",
//           "Access-Control-Allow-Methods":
//             "PUT, POST, GET, DELETE, PATCH, OPTIONS",
//           username: process.env.REACT_APP_EBS_MRA_USERNAME,
//           ebsMraId: process.env.REACT_APP_EBS_MRA_ID,
//           areaCode: process.env.REACT_APP_EBS_MRA_AREA_CODE.toString(),
//           token: ebs_mra_token,
//         };

//         try {
//           // 7 Call the transmission API with username, EBS MRA ID, and token in the request header
//           const responseData = await axios.post(
//             process.env.REACT_APP_EBS_MRA_INVOICE_TRANSMISSION_ENDPOINT,
//             {
//               ...payload,
//             },
//             {
//               headers: { ...headers },
//             }
//           );

//           if (responseData) {
//             // store response Data
//             await storeResponseData(
//               responseData,
//               companyIdSelected,
//               documentType?.id,
//               "single",
//               invoiceData?.data?.docString,
//               []
//             );
//           }
//         } catch (error) {
//           console.log("error: ", error);
//           console.log("response: ", error?.response);
//           console.log("sda: ", error?.response?.data);
//           if (error?.response & error?.response?.data) {
//             console.log(
//               "Error:: ",
//               JSON.stringify(error?.response?.data?.ErrorMessages)
//             );
//           }

//           // store error
//           await admin
//             .firestore()
//             .collection("company")
//             .doc(companyIdSelected)
//             .collection(documentType?.id)
//             .doc(invoiceData?.data?.docString)
//             .set(
//               {
//                 mraCompliantStatus: "error",
//                 mraCompliantMessage: error?.message || "",
//               },
//               { merge: true }
//             )
//             .then(() => {
//               console.log("Error stored successfully");
//             });
//         }
//       }
//     }
//   });
// });

exports.testscheduler = onRequest(async (req, res) => {
  cors(req, res, async () => {
    console.log(req.body.data);

    // get all un fiscalised
    const documentTypes = [
      "vat_invoice",
      "purchase_order",
      "proforma",
      "credit_note",
      "debit_note",
    ];

    // get all companies where displayMRAFiscalisationButton is applicable
    await admin
      .firestore()
      .collection("company")
      .where("displayMRAFiscalisationButton", "==", true)
      .get()
      .then((resultCompanies) => {
        console.log("Companies found: ", resultCompanies?.docs?.length);

        let companyArray = [];
        if (resultCompanies?.docs && resultCompanies?.docs?.length > 0) {
          resultCompanies?.docs.forEach((company) => {
            companyArray.push({
              companyId: company?.id,
              companyData: { ...company?.data() },
            });
          });

          // loop through each company
          const promisesCompany = [];
          companyArray.forEach(async (company) => {
            promisesCompany.push(
              new Promise(async (resolveCompany) => {
                // get all unfiscalised documents

                const promisesDocument = [];
                documentTypes.forEach(async (documentType) => {
                  promisesDocument.push(
                    new Promise(async (resolveDocument) => {
                      await admin
                        .firestore()
                        .collection("company")
                        .doc(company?.companyId)
                        .collection(documentType)
                        .where("mraCompliantStatus", "==", "error")
                        .get()
                        .then((result) => {
                          let arr = [];
                          if (result?.docs?.length > 0) {
                            result?.docs.forEach(async (doc) => {
                              // get client details
                              let clientDoc = await admin
                                .firestore()
                                .collection("company")
                                .doc(process.env.REACT_APP_COMPANY_ID)
                                .collection("client")
                                .doc(doc?.data()?.clientId)
                                .get();

                              if (clientDoc?.exists) {
                                arr.push({
                                  documentId: doc?.id,
                                  documentType: documentType,
                                  documentData: { ...doc?.data() },
                                  companyId: company?.companyId,
                                  companyData: company?.companyData,
                                  clientData: { ...clientDoc?.data() },
                                });
                              }
                            });

                            resolveDocument(arr);
                          } else {
                            resolveDocument(arr);
                          }
                        });
                    })
                  );
                });

                Promise.all(promisesDocument).then((allDocs) => {
                  let allPendingDocs = [];
                  if (allDocs?.length > 0) {
                    allDocs.forEach((pendingDocArray) => {
                      if (pendingDocArray?.length > 0) {
                        pendingDocArray.forEach((doc) => {
                          allPendingDocs.push({ ...doc });
                        });
                      }
                    });
                  }

                  resolveCompany(allPendingDocs);
                });
              })
            );
          });

          Promise.all(promisesCompany).then(async (allCompanyDocs) => {
            let allCompanyPendingDocs = [];
            if (allCompanyDocs?.length > 0) {
              allCompanyDocs.forEach((pendingDocArray) => {
                if (pendingDocArray?.length > 0) {
                  pendingDocArray.forEach((doc) => {
                    allCompanyPendingDocs.push({ ...doc });
                  });
                }
              });
            }

            if (allCompanyPendingDocs?.length > 0) {
              // get new token if actual token is not valid
              let ebs_mra_key = "";
              let ebs_encrypt_key = "";
              let ebs_mra_token = "";

              const authenticationDetails = await getEbsAuthenticationDetails(
                null,
                true
              );

              if (authenticationDetails?.error) {
                storeMultipleCompanyInvoiceErrorMessage(allCompanyPendingDocs, {
                  mraCompliantStatus: "error",
                  mraCompliantMessage: authenticationDetails?.message,
                  mraCompliantDateTime: new Date(),
                });
              } else {
                ebs_mra_key = authenticationDetails?.ebs_mra_key;
                ebs_encrypt_key = authenticationDetails?.ebs_encrypt_key;
                ebs_mra_token = authenticationDetails?.ebs_mra_token;
              }

              if (ebs_encrypt_key && ebs_mra_key && ebs_mra_token) {
                // get previous hash
                const promises = [];
                allCompanyPendingDocs.forEach(async (invoiceData) => {
                  promises.push(
                    new Promise(async (resolve) => {
                      let previousNoteHashValue = "";
                      const previousNoteHash = await getPreviousNoteHash(
                        invoiceData?.companyId,
                        invoiceData?.documentType,
                        invoiceData?.documentData?.invoiceTypeDesc?.id,
                        invoiceData?.companyData?.brn
                      );

                      if (previousNoteHash?.error) {
                        // store error
                        await admin
                          .firestore()
                          .collection("company")
                          .doc(invoiceData?.companyId)
                          .collection(invoiceData?.documentType)
                          .doc(invoiceData?.documentId)
                          .set(
                            {
                              mraCompliantStatus: "error",
                              mraCompliantMessage: previousNoteHash?.message,
                              mraCompliantDateTime: new Date(),
                            },
                            { merge: true }
                          )
                          .then(() => {
                            console.log("Error stored successfully");
                            resolve({
                              error: true,
                            });
                          });
                      } else {
                        previousNoteHashValue = previousNoteHash?.value;
                        resolve({
                          error: false,
                          value: previousNoteHashValue,
                          invoiceData: { ...invoiceData },
                        });
                      }
                    })
                  );
                });

                Promise.all(promises).then(async (invoicesPreviousHash) => {
                  let invoicesWithPreviousHash = [];

                  invoicesPreviousHash.forEach((invPrevHash) => {
                    if (!invPrevHash?.error) {
                      const invDetail = allCompanyPendingDocs.find(
                        (doc) =>
                          doc?.companyId ===
                            invPrevHash?.invoiceData?.companyId &&
                          doc?.documentId ===
                            invPrevHash?.invoiceData?.documentId
                      );
                      invoicesWithPreviousHash.push({
                        ...invDetail,
                        previousNoteHashValue: invPrevHash?.value,
                      });
                    }
                  });

                  const requestDateTime = moment(new Date()).format(
                    "yyyyMMDD HH:mm:ss"
                  );

                  const aesKey = ebs_encrypt_key;
                  const mraKey = ebs_mra_key;

                  // 1. Decode and decrypt Key received from MRA using the random AES Key that was generated in the authentication step
                  const decryptedKeyFromMraKey = decryptKeyReceivedFromMRA(
                    Buffer.from(aesKey, "base64"),
                    mraKey
                  );

                  // group by company
                  const result = await groupById(invoicesWithPreviousHash);

                  if (result && result?.length > 0) {
                    result.forEach(async (company) => {
                      let invoicesToBeSent = [];
                      if (company?.items?.length > 0) {
                        company?.items.forEach((invoice) => {
                          invoicesToBeSent.push({
                            ...invoice,
                            companyId: company?.companyId,
                          });
                        });

                        // 2. Generate invoice corresponding to sample JSON invoice (MRA requested format)
                        const InvoiceDataJSON =
                          await getMultipleInvoiceDataJson(
                            "multiple-company",
                            invoicesToBeSent,
                            null,
                            null
                          );

                        /**
                         * 3. is optional
                         * 4. Encrypt JSON string from step 2 using decrypted Key from step 1
                         * (The encrypted key that was received from MRA in the authentication response parameters).
                         * Note that the decrypted key should be decoded first before using same for encryption (refer to code snippet)
                         * 5 Encode encrypted JSON from step 4 to Base 64
                         */
                        const encryptedData = encryptInvoice(
                          InvoiceDataJSON,
                          Buffer.from(decryptedKeyFromMraKey, "base64")
                        );

                        // 6 Generate JSON payload corresponding to the invoice transmission request
                        const payload = {
                          requestId: uuidv4(),
                          requestDateTime: requestDateTime,
                          signedHash: "", // optional
                          encryptedInvoice: encryptedData,
                        };

                        try {
                          const headers = {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Credentials": "true",
                            "Access-Control-Max-Age": "1800",
                            "Access-Control-Allow-Headers": "content-type",
                            "Access-Control-Allow-Methods":
                              "PUT, POST, GET, DELETE, PATCH, OPTIONS",
                            username: process.env.REACT_APP_EBS_MRA_USERNAME,
                            ebsMraId: process.env.REACT_APP_EBS_MRA_ID,
                            areaCode:
                              process.env.REACT_APP_EBS_MRA_AREA_CODE.toString(),
                            token: ebs_mra_token,
                          };

                          // 7 Call the transmission API with username, EBS MRA ID, and token in the request header
                          const responseData = await axios.post(
                            process.env
                              .REACT_APP_EBS_MRA_INVOICE_TRANSMISSION_ENDPOINT,
                            {
                              ...payload,
                            },
                            {
                              headers: { ...headers },
                            }
                          );

                          if (responseData) {
                            // store response Data
                            await storeResponseData(
                              responseData,
                              company?.companyId,
                              null,
                              "schedule",
                              null,
                              invoicesToBeSent
                            );
                          }
                        } catch (error) {
                          console.log("error: ", error);
                          console.log("response: ", error?.response);
                          console.log("sda: ", error?.response?.data);
                          if (error?.response & error?.response?.data) {
                            console.log(
                              "Error:: ",
                              JSON.stringify(
                                error?.response?.data?.ErrorMessages
                              )
                            );
                          }

                          let errorString = "";
                          if (
                            error?.response?.data?.errorMessages &&
                            error?.response?.data?.errorMessages?.length > 0
                          ) {
                            error?.response?.data?.errorMessages.forEach(
                              (message) => {
                                const errorText = `Error code: ${message?.code}. Error description: ${message?.description}`;

                                errorString = errorString + errorText;
                              }
                            );
                          }

                          invoicesToBeSent.forEach(async (invoiceData) => {
                            // store error
                            await admin
                              .firestore()
                              .collection("company")
                              .doc(company?.companyId)
                              .collection(invoiceData?.documentType)
                              .doc(invoiceData?.documentData?.docString)
                              .set(
                                {
                                  mraCompliantStatus: "error",
                                  mraCompliantMessage:
                                    `${error?.message} - ${errorString}` || "",
                                  mraCompliantDateTime: new Date(),
                                },
                                { merge: true }
                              )
                              .then(() => {
                                console.log("Error stored successfully");
                              });
                          });
                        }
                      }
                    });
                  }
                });
              }
            }
          });
        }
      });
  });
});

exports.submitmultipleinvoicestomra = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const data = req.body.data; // Extract the request payload

    const user = JSON.parse(data?.user);
    const companyIdSelected = data.companyIdSelected;
    const invoices = JSON.parse(data?.invoices);
    const documentType = JSON.parse(data?.documentType);
    const companyDetails = JSON.parse(data?.companyDetails);
    const clientDocumentObjectSelected = JSON.parse(
      data?.clientDocumentObjectSelected
    );

    // check if user has a token and if it has expired
    const validToken = false; // await checkToken(user);

    // get new token if actual token is not valid
    let ebs_mra_key = "";
    let ebs_encrypt_key = "";
    let ebs_mra_token = "";
    if (!validToken) {
      const authenticationDetails = await getEbsAuthenticationDetails(
        user,
        null
      );

      if (authenticationDetails?.error) {
        storeInvoiceErrorMessage(
          companyIdSelected,
          documentType?.id,
          invoices,
          {
            mraCompliantStatus: "error",
            mraCompliantMessage: authenticationDetails?.message,
            mraCompliantDateTime: new Date(),
          }
        );
      } else {
        ebs_mra_key = authenticationDetails?.ebs_mra_key;
        ebs_encrypt_key = authenticationDetails?.ebs_encrypt_key;
        ebs_mra_token = authenticationDetails?.ebs_mra_token;
      }
    } else {
      ebs_mra_key = user?.ebs_mra_key;
      ebs_encrypt_key = user?.ebs_encrypt_key;
      ebs_mra_token = user?.ebs_mra_token;
    }

    if (ebs_encrypt_key && ebs_mra_key && ebs_mra_token) {
      // get previous hash
      const promises = [];
      invoices.forEach(async (invoiceData) => {
        promises.push(
          new Promise(async (resolve) => {
            let previousNoteHashValue = "";
            const previousNoteHash = await getPreviousNoteHash(
              companyIdSelected,
              documentType?.id,
              invoiceData?.data?.invoiceTypeDesc?.id,
              data?.brn
            );

            if (previousNoteHash?.error) {
              // store error
              await admin
                .firestore()
                .collection("company")
                .doc(companyIdSelected)
                .collection(documentType?.id)
                .doc(invoiceData?.data?.docString)
                .set(
                  {
                    mraCompliantStatus: "error",
                    mraCompliantMessage: previousNoteHash?.message,
                    mraCompliantDateTime: new Date(),
                  },
                  { merge: true }
                )
                .then(() => {
                  console.log("Error stored successfully");
                  resolve({
                    error: true,
                  });
                });
            } else {
              previousNoteHashValue = previousNoteHash?.value;
              resolve({
                error: false,
                value: previousNoteHashValue,
                id: invoiceData?.data?.docString,
              });
            }
          })
        );
      });

      Promise.all(promises).then(async (invoicesPreviousHash) => {
        let invoicesWithPreviousHash = [];

        invoicesPreviousHash.forEach((invPrevHash) => {
          if (!invPrevHash?.error) {
            const invDetail = invoices.find(
              (doc) => doc?.data?.docString === invPrevHash?.id
            );
            invoicesWithPreviousHash.push({
              ...invDetail,
              previousNoteHashValue: invPrevHash?.value,
            });
          }
        });

        const requestDateTime = moment(new Date()).format("yyyyMMDD HH:mm:ss");

        const aesKey = ebs_encrypt_key;
        const mraKey = ebs_mra_key;

        // 1. Decode and decrypt Key received from MRA using the random AES Key that was generated in the authentication step
        const decryptedKeyFromMraKey = decryptKeyReceivedFromMRA(
          Buffer.from(aesKey, "base64"),
          mraKey
        );

        // 2. Generate invoice corresponding to sample JSON invoice (MRA requested format)
        const InvoiceDataJSON = await getMultipleInvoiceDataJson(
          "single-company",
          invoicesWithPreviousHash,
          companyDetails,
          clientDocumentObjectSelected
        );

        /**
         * 3. is optional
         * 4. Encrypt JSON string from step 2 using decrypted Key from step 1
         * (The encrypted key that was received from MRA in the authentication response parameters).
         * Note that the decrypted key should be decoded first before using same for encryption (refer to code snippet)
         * 5 Encode encrypted JSON from step 4 to Base 64
         */
        const encryptedData = encryptInvoice(
          InvoiceDataJSON,
          Buffer.from(decryptedKeyFromMraKey, "base64")
        );

        // 6 Generate JSON payload corresponding to the invoice transmission request
        const payload = {
          requestId: uuidv4(),
          requestDateTime: requestDateTime,
          signedHash: "", // optional
          encryptedInvoice: encryptedData,
        };

        const headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "1800",
          "Access-Control-Allow-Headers": "content-type",
          "Access-Control-Allow-Methods":
            "PUT, POST, GET, DELETE, PATCH, OPTIONS",
          username: process.env.REACT_APP_EBS_MRA_USERNAME,
          ebsMraId: process.env.REACT_APP_EBS_MRA_ID,
          areaCode: process.env.REACT_APP_EBS_MRA_AREA_CODE.toString(),
          token: ebs_mra_token,
        };

        try {
          // 7 Call the transmission API with username, EBS MRA ID, and token in the request header
          const responseData = await axios.post(
            process.env.REACT_APP_EBS_MRA_INVOICE_TRANSMISSION_ENDPOINT,
            {
              ...payload,
            },
            {
              headers: { ...headers },
            }
          );

          if (responseData) {
            // store response Data
            await storeResponseData(
              responseData,
              companyIdSelected,
              documentType?.id,
              "multiple",
              null,
              invoicesWithPreviousHash
            );
          }
        } catch (error) {
          console.log("error: ", error);
          console.log("response: ", error?.response);
          console.log("sda: ", error?.response?.data);
          if (error?.response & error?.response?.data) {
            console.log(
              "Error:: ",
              JSON.stringify(error?.response?.data?.ErrorMessages)
            );
          }

          let errorString = "";
          if (
            error?.response?.data?.errorMessages &&
            error?.response?.data?.errorMessages?.length > 0
          ) {
            error?.response?.data?.errorMessages.forEach((message) => {
              const errorText = `Error code: ${message?.code}. Error description: ${message?.description}`;

              errorString = errorString + errorText;
            });
          }

          // store error
          storeInvoiceErrorMessage(
            companyIdSelected,
            documentType?.id,
            invoices,
            {
              mraCompliantStatus: "error",
              mraCompliantMessage: `${error?.message} - ${errorString}` || "",
              mraCompliantDateTime: new Date(),
            }
          );
        }
      });
    }
  });
});

exports.scheduledMRAFiscalisationfinal = functions.pubsub
  .schedule("every 3 minutes")
  .onRun(async (context) => {
    // get all un fiscalised
    const documentTypes = [
      "vat_invoice",
      "purchase_order",
      "proforma",
      "credit_note",
      "debit_note",
    ];

    // get all companies where displayMRAFiscalisationButton is applicable
    await admin
      .firestore()
      .collection("company")
      .where("displayMRAFiscalisationButton", "==", true)
      .get()
      .then((resultCompanies) => {
        console.log("Companies found: ", resultCompanies?.docs?.length);

        let companyArray = [];
        if (resultCompanies?.docs && resultCompanies?.docs?.length > 0) {
          resultCompanies?.docs.forEach((company) => {
            companyArray.push({
              companyId: company?.id,
              companyData: { ...company?.data() },
            });
          });

          // loop through each company
          const promisesCompany = [];
          companyArray.forEach(async (company) => {
            promisesCompany.push(
              new Promise(async (resolveCompany) => {
                // get all unfiscalised documents

                const promisesDocument = [];
                documentTypes.forEach(async (documentType) => {
                  promisesDocument.push(
                    new Promise(async (resolveDocument) => {
                      await admin
                        .firestore()
                        .collection("company")
                        .doc(company?.companyId)
                        .collection(documentType)
                        .where("mraCompliantStatus", "==", "error")
                        .get()
                        .then((result) => {
                          if (result?.docs?.length > 0) {
                            const promisesClient = [];
                            result?.docs.forEach(async (doc) => {
                              promisesClient.push(
                                new Promise(async (resolveClient) => {
                                  // get client details
                                  await admin
                                    .firestore()
                                    .collection("company")
                                    .doc(process.env.REACT_APP_COMPANY_ID)
                                    .collection("client")
                                    .doc(doc?.data()?.clientId)
                                    .get()
                                    .then((clientDoc) => {
                                      if (clientDoc.exists) {
                                        resolveClient({
                                          documentId: doc?.id,
                                          documentType: documentType,
                                          documentData: { ...doc?.data() },
                                          companyId: company?.companyId,
                                          companyData: company?.companyData,
                                          clientData: { ...clientDoc?.data() },
                                        });
                                      } else {
                                        resolveClient([]);
                                      }
                                    });
                                })
                              );
                            });

                            Promise.all(promisesClient).then(
                              (allDocsWithClient) => {
                                console.log(
                                  "allDocsWithClient: ",
                                  JSON.stringify(allDocsWithClient)
                                );

                                resolveDocument(allDocsWithClient);
                              }
                            );
                          } else {
                            resolveDocument([]);
                          }
                        });
                    })
                  );
                });

                Promise.all(promisesDocument).then((allDocs) => {
                  console.log("allDocs", allDocs?.length);

                  console.log("allDocs Str: ", JSON.stringify(allDocs));

                  let allPendingDocs = [];
                  if (allDocs?.length > 0) {
                    allDocs.forEach((pendingDocArray) => {
                      if (pendingDocArray?.length > 0) {
                        pendingDocArray.forEach((doc) => {
                          allPendingDocs.push({ ...doc });
                        });
                      }
                    });
                  }

                  resolveCompany(allPendingDocs);
                });
              })
            );
          });

          Promise.all(promisesCompany).then(async (allCompanyDocs) => {
            console.log("allCompanyDocs", JSON.stringify(allCompanyDocs));

            let allCompanyPendingDocs = [];
            if (allCompanyDocs?.length > 0) {
              allCompanyDocs.forEach((pendingDocArray) => {
                if (pendingDocArray?.length > 0) {
                  pendingDocArray.forEach((doc) => {
                    allCompanyPendingDocs.push({ ...doc });
                  });
                }
              });
            }

            console.log("allCompanyPendingDocs", allCompanyPendingDocs?.length);

            if (allCompanyPendingDocs?.length > 0) {
              // get new token if actual token is not valid
              let ebs_mra_key = "";
              let ebs_encrypt_key = "";
              let ebs_mra_token = "";

              const authenticationDetails = await getEbsAuthenticationDetails(
                null,
                true
              );

              if (authenticationDetails?.error) {
                storeMultipleCompanyInvoiceErrorMessage(allCompanyPendingDocs, {
                  mraCompliantStatus: "error",
                  mraCompliantMessage: authenticationDetails?.message,
                  mraCompliantDateTime: new Date(),
                });
              } else {
                ebs_mra_key = authenticationDetails?.ebs_mra_key;
                ebs_encrypt_key = authenticationDetails?.ebs_encrypt_key;
                ebs_mra_token = authenticationDetails?.ebs_mra_token;
              }

              if (ebs_encrypt_key && ebs_mra_key && ebs_mra_token) {
                // get previous hash
                const promises = [];
                allCompanyPendingDocs.forEach(async (invoiceData) => {
                  promises.push(
                    new Promise(async (resolve) => {
                      let previousNoteHashValue = "";
                      const previousNoteHash = await getPreviousNoteHash(
                        invoiceData?.companyId,
                        invoiceData?.documentType,
                        invoiceData?.documentData?.invoiceTypeDesc?.id,
                        invoiceData?.companyData?.brn
                      );

                      if (previousNoteHash?.error) {
                        // store error
                        await admin
                          .firestore()
                          .collection("company")
                          .doc(invoiceData?.companyId)
                          .collection(invoiceData?.documentType)
                          .doc(invoiceData?.documentId)
                          .set(
                            {
                              mraCompliantStatus: "error",
                              mraCompliantMessage: previousNoteHash?.message,
                              mraCompliantDateTime: new Date(),
                            },
                            { merge: true }
                          )
                          .then(() => {
                            console.log("Error stored successfully");
                            resolve({
                              error: true,
                            });
                          });
                      } else {
                        previousNoteHashValue = previousNoteHash?.value;
                        resolve({
                          error: false,
                          value: previousNoteHashValue,
                          invoiceData: { ...invoiceData },
                        });
                      }
                    })
                  );
                });

                Promise.all(promises).then(async (invoicesPreviousHash) => {
                  let invoicesWithPreviousHash = [];

                  invoicesPreviousHash.forEach((invPrevHash) => {
                    if (!invPrevHash?.error) {
                      const invDetail = allCompanyPendingDocs.find(
                        (doc) =>
                          doc?.companyId ===
                            invPrevHash?.invoiceData?.companyId &&
                          doc?.documentId ===
                            invPrevHash?.invoiceData?.documentId
                      );
                      invoicesWithPreviousHash.push({
                        ...invDetail,
                        previousNoteHashValue: invPrevHash?.value,
                      });
                    }
                  });

                  const requestDateTime = moment(new Date()).format(
                    "yyyyMMDD HH:mm:ss"
                  );

                  const aesKey = ebs_encrypt_key;
                  const mraKey = ebs_mra_key;

                  // 1. Decode and decrypt Key received from MRA using the random AES Key that was generated in the authentication step
                  const decryptedKeyFromMraKey = decryptKeyReceivedFromMRA(
                    Buffer.from(aesKey, "base64"),
                    mraKey
                  );

                  // group by company
                  const result = await groupById(invoicesWithPreviousHash);

                  if (result && result?.length > 0) {
                    result.forEach(async (company) => {
                      let invoicesToBeSent = [];
                      if (company?.items?.length > 0) {
                        company?.items.forEach((invoice) => {
                          invoicesToBeSent.push({
                            ...invoice,
                            companyId: company?.companyId,
                          });
                        });

                        // 2. Generate invoice corresponding to sample JSON invoice (MRA requested format)
                        const InvoiceDataJSON =
                          await getMultipleInvoiceDataJson(
                            "multiple-company",
                            invoicesToBeSent,
                            null,
                            null
                          );

                        /**
                         * 3. is optional
                         * 4. Encrypt JSON string from step 2 using decrypted Key from step 1
                         * (The encrypted key that was received from MRA in the authentication response parameters).
                         * Note that the decrypted key should be decoded first before using same for encryption (refer to code snippet)
                         * 5 Encode encrypted JSON from step 4 to Base 64
                         */
                        const encryptedData = encryptInvoice(
                          InvoiceDataJSON,
                          Buffer.from(decryptedKeyFromMraKey, "base64")
                        );

                        // 6 Generate JSON payload corresponding to the invoice transmission request
                        const payload = {
                          requestId: uuidv4(),
                          requestDateTime: requestDateTime,
                          signedHash: "", // optional
                          encryptedInvoice: encryptedData,
                        };

                        try {
                          console.log("Execute MRA function");

                          const headers = {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Credentials": "true",
                            "Access-Control-Max-Age": "1800",
                            "Access-Control-Allow-Headers": "content-type",
                            "Access-Control-Allow-Methods":
                              "PUT, POST, GET, DELETE, PATCH, OPTIONS",
                            username: process.env.REACT_APP_EBS_MRA_USERNAME,
                            ebsMraId: process.env.REACT_APP_EBS_MRA_ID,
                            areaCode:
                              process.env.REACT_APP_EBS_MRA_AREA_CODE.toString(),
                            token: ebs_mra_token,
                          };

                          // 7 Call the transmission API with username, EBS MRA ID, and token in the request header
                          const responseData = await axios.post(
                            process.env
                              .REACT_APP_EBS_MRA_INVOICE_TRANSMISSION_ENDPOINT,
                            {
                              ...payload,
                            },
                            {
                              headers: { ...headers },
                            }
                          );

                          if (responseData) {
                            console.log("responseData: ", responseData);
                            // store response Data
                            await storeResponseData(
                              responseData,
                              company?.companyId,
                              null,
                              "schedule",
                              null,
                              invoicesToBeSent
                            );
                          }
                        } catch (error) {
                          console.log("error: ", error);
                          console.log("response: ", error?.response);
                          console.log("sda: ", error?.response?.data);
                          if (error?.response & error?.response?.data) {
                            console.log(
                              "Error:: ",
                              JSON.stringify(
                                error?.response?.data?.ErrorMessages
                              )
                            );
                          }

                          let errorString = "";
                          if (
                            error?.response?.data?.errorMessages &&
                            error?.response?.data?.errorMessages?.length > 0
                          ) {
                            error?.response?.data?.errorMessages.forEach(
                              (message) => {
                                const errorText = `Error code: ${message?.code}. Error description: ${message?.description}`;

                                errorString = errorString + errorText;
                              }
                            );
                          }

                          invoicesToBeSent.forEach(async (invoiceData) => {
                            // store error
                            await admin
                              .firestore()
                              .collection("company")
                              .doc(company?.companyId)
                              .collection(invoiceData?.documentType)
                              .doc(invoiceData?.documentData?.docString)
                              .set(
                                {
                                  mraCompliantStatus: "error",
                                  mraCompliantMessage:
                                    `${error?.message} - ${errorString}` || "",
                                  mraCompliantDateTime: new Date(),
                                },
                                { merge: true }
                              )
                              .then(() => {
                                console.log("Error stored successfully");
                              });
                          });
                        }
                      }
                    });
                  }
                });
              }
            }
          });
        }
      });
  });

async function groupById(array) {
  return await new Promise((resolve) => {
    const grouped = array.reduce((acc, current) => {
      const { companyId, ...rest } = current;
      if (!acc[companyId]) {
        acc[companyId] = { companyId, items: [] };
      }
      acc[companyId].items.push(rest);
      return acc;
    }, {});

    resolve(Object.values(grouped));
  });
}

async function storeInvoiceErrorMessage(
  companyIdSelected,
  documentTypeId,
  invoices,
  details
) {
  invoices.forEach(async (invoiceData) => {
    // store error
    await admin
      .firestore()
      .collection("company")
      .doc(companyIdSelected)
      .collection(documentTypeId)
      .doc(invoiceData?.data?.docString)
      .set(
        {
          ...details,
        },
        { merge: true }
      )
      .then(() => {
        console.log("Error stored successfully");
      });
  });
}

async function storeMultipleCompanyInvoiceErrorMessage(
  allCompanyPendingDocs,
  details
) {
  allCompanyPendingDocs.forEach(async (companyDoc) => {
    // store error
    await admin
      .firestore()
      .collection("company")
      .doc(companyDoc?.companyId)
      .collection(companyDoc?.documentType)
      .doc(companyDoc?.documentId)
      .set(
        {
          ...details,
        },
        { merge: true }
      )
      .then(() => {
        console.log("Error stored successfully");
      });
  });
}

// check if token is present or has been expired
async function checkToken(user) {
  return await new Promise((resolve) => {
    if (user?.ebs_mra_token && user?.ebs_mra_token_expiryDate) {
      // Expiry date datetime string
      const expiryDatetimeString = user?.ebs_mra_token_expiryDate;

      // Parse the datetime string using Moment.js
      const expiryDatetime = moment(expiryDatetimeString, "YYYYMMDD HH:mm:ss");

      // Subtract 4 hours from the expiry datetime
      const fourHoursBefore = expiryDatetime.clone().subtract(1, "hours");

      console.log("1 hour before expiry date: ", fourHoursBefore);

      // Current date and time
      const currentDatetime = moment();

      // Check if the current datetime is before the result
      const isBefore = currentDatetime.isBefore(fourHoursBefore);

      console.log("isBefore: ", isBefore);

      if (isBefore) {
        resolve(true);
      } else {
        resolve(false);
      }
    } else {
      resolve(false);
    }
  });
}

async function getEbsAuthenticationDetails(user, scheduler) {
  return await new Promise(async (resolve) => {
    // read MRA certificate public key file
    const certificatePublicKey = fs.readFileSync("PublicKey.crt", "utf8");

    // get token
    // Generate a random 32-byte (256-bit) AES key
    const aesKey = crypto.randomBytes(32);

    // Encode AES key to a Base64-encoded string
    const aesKeyBase64 = aesKey.toString("base64");

    // request payload
    const requestPayload = {
      username: process.env.REACT_APP_EBS_MRA_USERNAME,
      password: process.env.REACT_APP_EBS_MRA_PASSWORD,
      encryptKey: aesKeyBase64,
      refreshToken: true,
    };

    // convert request payload to string
    const payloadTokenString = JSON.stringify(requestPayload);

    // Create a public key object from PEM string
    const publicKey =
      forge.pki.certificateFromPem(certificatePublicKey).publicKey;

    // Encrypt the JSON string with RSA
    const encryptedData = forge.util.encode64(
      publicKey.encrypt(payloadTokenString)
    );

    const responseToken = await axios.post(
      process.env.REACT_APP_EBS_MRA_TOKEN_ENDPOINT,
      {
        requestId: uuidv4(),
        payload: encryptedData,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "1800",
          "Access-Control-Allow-Headers": "content-type",
          "Access-Control-Allow-Methods":
            "PUT, POST, GET, DELETE, PATCH, OPTIONS",
          ebsMraId: process.env.REACT_APP_EBS_MRA_ID,
          username: process.env.REACT_APP_EBS_MRA_USERNAME,
        },
      }
    );

    if (responseToken) {
      if (responseToken?.data?.status === "SUCCESS") {
        if (scheduler) {
          resolve({
            error: false,
            ebs_mra_key: responseToken?.data?.key,
            ebs_encrypt_key: aesKeyBase64,
            ebs_mra_token: responseToken?.data?.token,
          });
        } else {
          admin
            .firestore()
            .collection("users")
            .doc(user?.id)
            .set(
              {
                ...responseToken?.data,
                aesKeyBase64: aesKeyBase64, // encrypt key used to encrypt the JSON
              },
              { merge: true }
            )
            .then(() => {
              console.log("update completed");

              resolve({
                error: false,
                ebs_mra_key: responseToken?.data?.key,
                ebs_encrypt_key: aesKeyBase64,
                ebs_mra_token: responseToken?.data?.token,
              });
            })
            .catch((error) => {
              console.log("Error occured while fetching token");
              resolve({
                error: true,
                message: `Error occured while fetching token: $${error?.message}`,
              });
            });
        }
      } else if (responseToken?.data?.status === "ERROR") {
        const errorArray = responseToken?.data?.errors || [];
        var errorReceived = "";
        if (errorArray?.length > 0) {
          errorReceived = errorArray[0];
        }

        resolve({
          error: true,
          message: `Error: ${errorReceived || ""}`,
        });
      }
    } else {
      resolve({
        error: true,
        message: `Error occured while fetching token, response Token is undefined`,
      });
    }
  });
}

async function getPreviousNoteHash(
  companyIdSelected,
  documentTypeId,
  invoiceTypeDescId,
  brn
) {
  return await new Promise(async (resolve) => {
    // fetch the latest invoice with same type of invoice as the selected invoice to be sent for finalisation
    // for example, fetch latest invoice with type 'STD' if the selected invoice to be finalised has type 'STD'
    await admin
      .firestore()
      .collection("company")
      .doc(companyIdSelected)
      .collection(documentTypeId)
      .where("invoiceTypeDesc.id", "==", invoiceTypeDescId)
      .get()
      .then((result) => {
        if (result && result?.docs && result?.docs?.length > 0) {
          let allDocs = [];
          result?.docs.forEach((doc) => {
            allDocs.push({ ...doc?.data() });
          });
          // allDocs.sort(dynamicSort("id"));

          const jsDateCreated = allDocs[0]?.docDateTimeCreated
            ? allDocs[0]?.docDateTimeCreated.toDate()
            : new Date();

          if (jsDateCreated) {
            //Previous Invoice Hash = (Date & Time + Invoice Amount + BRN + invoice number) of previous invoice)
            const dateTime = moment(jsDateCreated).format("yyyyMMDD HHmmss");
            const invoiceAmount = allDocs[0]?.docTotal || 0;
            const invoiceNumber = allDocs[0]?.docString || "";

            let previousNoteHashString = `${dateTime}${invoiceAmount}${brn}${invoiceNumber}`;

            // Create a SHA-256 hash
            const hash = crypto.createHash("sha256");

            // Update the hash with your input string
            hash.update(previousNoteHashString);

            // Get the hashed data as a Buffer
            const hashedData = hash.digest();

            // Convert the Buffer to a hexadecimal representation
            const hexadecimalRepresentation = hashedData.toString("hex");

            resolve({
              error: false,
              value: hexadecimalRepresentation,
            });
          }
        } else {
          // send the default value requested by MRA guidelines
          resolve({
            error: false,
            value: "0",
          });
        }
      })
      .catch((error) => {
        console.error(
          "Error occured while retrieving previous invoice based on type chosen:",
          error
        );
        resolve({
          error: true,
          message: `Error occured while retrieving previous invoice based on type chosen: ${error?.message}`,
        });
      });
  });
}

async function getInvoiceDataJson(
  invoiceData,
  previousNoteHashValue,
  companyDetails,
  clientDocumentObjectSelected
) {
  return await new Promise((resolve) => {
    // get invoice doc issued date
    const timestamp = invoiceData?.data?.docIssuedDateTime;

    // Convert Firestore timestamp to milliseconds
    const milliseconds =
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;

    // Create a new Date object using the milliseconds
    let issueDate = new Date(milliseconds);

    // format date
    const issuedDateTimeFormat = moment(issueDate).format("yyyyMMDD HH:mm:ss");

    // get all particulars
    let itemList = [];
    if (
      invoiceData?.data?.docParticulars &&
      invoiceData?.data?.docParticulars?.length > 0
    ) {
      invoiceData?.data?.docParticulars.forEach((particular) => {
        itemList.push({
          itemNo: particular?.rowOrder?.toString(),
          taxCode: particular?.rowTaxCode?.id || "",
          nature: particular?.rowNature?.id || "SERVICES",
          productCodeMra: "pdtCode", // May be published on MRA website. Leave blank for the time being
          productCodeOwn: "pdtOwn",
          currency: "MUR",
          itemDesc: particular?.rowDescription || "",
          quantity: particular?.rowQty?.toString() || "",
          unitPrice: particular?.rowUnitPrice?.toString() || "",
          discount: particular?.rowDiscountAmount?.toString() || "",
          discountedValue: particular?.rowDiscountedAmount?.toString() || "",
          amtWoVatCur: particular?.rowDiscountedAmount?.toString() || "",
          amtWoVatMur: particular?.rowDiscountedAmount?.toString() || "",
          vatAmt: particular?.rowVatAmount?.toString() || "",
          totalPrice: particular?.rowTotalAmount?.toString() || "",
        });
      });
    }

    const MRAObject = [
      {
        invoiceCounter:
          invoiceData?.data?.ebsGlobalInvoiceCounterReached?.invoiceCounter ||
          "",
        transactionType: invoiceData?.data?.transactionType?.id || "",
        personType: companyDetails?.data?.vatOrNonVatRegistered?.id || "",
        invoiceTypeDesc: invoiceData?.data?.invoiceTypeDesc?.id || "",
        currency: "MUR",
        invoiceIdentifier: invoiceData?.data?.docString,
        invoiceRefIdentifier:
          invoiceData?.data?.invoiceTypeDesc?.id === "CRN" ||
          invoiceData?.data?.invoiceTypeDesc?.id === "DRN"
            ? invoiceData?.data?.invoiceRefIdentifier
            : "",
        previousNoteHash: previousNoteHashValue || "0",
        reasonStated: invoiceData?.data?.docReasonStated || "", // "Testing phase",
        totalVatAmount: Number(invoiceData?.data?.docVatFee || 0).toFixed(2), // (2 d.p)
        totalAmtWoVatCur: Number(invoiceData?.data?.docSubTotal || 0).toFixed(
          2
        ), // total amount without VAT (2 d.p)
        totalAmtWoVatMur: Number(invoiceData?.data?.docSubTotal || 0).toFixed(
          2
        ), // Total Amount without VAT in MUR (2 d.p)
        totalAmtPaid: Number(invoiceData?.data?.docTotal || 0).toFixed(2), // totalAmtPaid = invoiceTotal - downPayment - discountTotalAmount (2 d.p)
        invoiceTotal: Number(invoiceData?.data?.docTotal || 0).toFixed(2),
        discountTotalAmount: invoiceData?.data?.discountTotalAmount
          ? Number(invoiceData?.data?.discountTotalAmount).toFixed(2)
          : "0",
        dateTimeInvoiceIssued: issuedDateTimeFormat, // yyyyMMDD HH:mm:ss
        seller: {
          name: companyDetails?.data?.name || "",
          tradeName: companyDetails?.data?.name || "",
          tan: companyDetails?.data?.tan || "",
          brn: companyDetails?.data?.brn || "",
          businessAddr: companyDetails?.data?.address || "",
          businessPhoneNo: companyDetails?.data?.phoneNumber || "",
          ebsCounterNo: "1",
          cashierID: "",
        },
        buyer: {
          name: clientDocumentObjectSelected?.data?.name,
          tan: clientDocumentObjectSelected?.data?.tan || "",
          brn: clientDocumentObjectSelected?.data?.brn || "",
          businessAddr: clientDocumentObjectSelected?.data?.address || "",
          buyerType: clientDocumentObjectSelected?.data?.buyerType?.id || "",
          nic: clientDocumentObjectSelected?.data?.nic || "",
        },
        itemList: itemList,
        salesTransactions: invoiceData?.data?.docSalesTransaction?.id || "CASH",
      },
    ];

    resolve(MRAObject);
  });
}

async function getMultipleInvoiceDataJson(
  type,
  invoicesWithPreviousHash,
  companyDetails,
  clientDocumentObjectSelected
) {
  return await new Promise((resolve) => {
    let finalInvoiceList = [];
    invoicesWithPreviousHash.forEach((invoiceData) => {
      let documentData =
        type === "multiple-company"
          ? invoiceData?.documentData
          : invoiceData?.data;

      let companyData =
        type === "multiple-company"
          ? invoiceData?.companyData
          : companyDetails?.data;

      let clientData =
        type === "multiple-company"
          ? invoiceData?.clientData
          : clientDocumentObjectSelected?.data;

      // get invoice doc issued date
      const timestamp = documentData.docIssuedDateTime;

      let issuedDateTimeFormat = "";

      if (timestamp?.seconds && timestamp?.nanoseconds) {
        // Convert Firestore timestamp to milliseconds
        const milliseconds =
          timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;

        // Create a new Date object using the milliseconds
        let issueDate = new Date(milliseconds);

        // format date
        issuedDateTimeFormat = moment(issueDate).format("yyyyMMDD HH:mm:ss");
      } else {
        issuedDateTimeFormat = moment(new Date()).format("yyyyMMDD HH:mm:ss");
      }

      // get all particulars
      let itemList = [];

      let particularsList = documentData?.docParticulars;

      if (particularsList && particularsList?.length > 0) {
        particularsList.forEach((particular) => {
          itemList.push({
            itemNo: particular?.rowOrder?.toString(),
            taxCode: particular?.rowTaxCode?.id || "",
            nature: particular?.rowNature?.id || "SERVICES",
            productCodeMra: "pdtCode", // May be published on MRA website. Leave blank for the time being
            productCodeOwn: "pdtOwn",
            currency: "MUR",
            itemDesc: particular?.rowDescription || "",
            quantity: particular?.rowQty?.toString() || "",
            unitPrice: particular?.rowUnitPrice?.toString() || "",
            discount: particular?.rowDiscountAmount?.toString() || "",
            discountedValue: particular?.rowDiscountedAmount?.toString() || "",
            amtWoVatCur: particular?.rowDiscountedAmount?.toString() || "",
            amtWoVatMur: particular?.rowDiscountedAmount?.toString() || "",
            vatAmt: particular?.rowVatAmount?.toString() || "",
            totalPrice: particular?.rowTotalAmount?.toString() || "",
          });
        });
      }

      const MRAObject = {
        invoiceCounter:
          documentData?.ebsGlobalInvoiceCounterReached?.invoiceCounter || "",
        transactionType: documentData?.transactionType?.id || "",
        personType: companyData?.vatOrNonVatRegistered?.id || "",
        invoiceTypeDesc: documentData?.invoiceTypeDesc?.id || "",
        currency: "MUR",
        invoiceIdentifier: documentData?.docString,
        invoiceRefIdentifier:
          documentData?.invoiceTypeDesc?.id === "CRN" ||
          documentData?.invoiceTypeDesc?.id === "DRN"
            ? documentData?.invoiceRefIdentifier
            : "",
        previousNoteHash: invoiceData?.previousNoteHashValue || "0",
        reasonStated: documentData?.docReasonStated || "", // "Testing phase",
        totalVatAmount: Number(documentData?.docVatFee || 0).toFixed(2), // (2 d.p)
        totalAmtWoVatCur: Number(documentData?.docSubTotal || 0).toFixed(2), // total amount without VAT (2 d.p)
        totalAmtWoVatMur: Number(documentData?.docSubTotal || 0).toFixed(2), // Total Amount without VAT in MUR (2 d.p)
        totalAmtPaid: Number(documentData?.docTotal || 0).toFixed(2), // totalAmtPaid = invoiceTotal - downPayment - discountTotalAmount (2 d.p)
        invoiceTotal: Number(documentData?.docTotal || 0).toFixed(2),
        discountTotalAmount: documentData?.discountTotalAmount
          ? Number(documentData?.discountTotalAmount).toFixed(2)
          : "0",
        dateTimeInvoiceIssued: issuedDateTimeFormat, // yyyyMMDD HH:mm:ss
        seller: {
          name: companyData?.name || "",
          tradeName: companyData?.name || "",
          tan: companyData?.tan || "",
          brn: companyData?.brn || "",
          businessAddr: companyData?.address || "",
          businessPhoneNo: companyData?.phoneNumber || "",
          ebsCounterNo: "1",
          cashierID: "",
        },
        buyer: {
          name: clientData?.name,
          tan: clientData?.tan || "",
          brn: clientData?.brn || "",
          businessAddr: clientData?.address || "",
          buyerType: clientData?.buyerType?.id || "",
          nic: clientData?.nic || "",
        },
        itemList: itemList,
        salesTransactions: documentData?.docSalesTransaction?.id || "CASH",
      };

      finalInvoiceList.push(MRAObject);
    });

    resolve(finalInvoiceList);
  });
}

async function storeResponseData(
  response,
  companyIdSelected,
  documentTypeId,
  type,
  invoiceId,
  invoices
) {
  const responseData = response?.data;
  let mraFinalisationData = {
    responseId: responseData?.responseId || "",
    responseDateTime: responseData?.responseDateTime || "",
    requestId: responseData?.requestId || "",
    status: responseData?.status || "",
    environment: responseData?.environment,
    infoMessages: responseData?.infoMessages || [],
    errorMessages: responseData?.errorMessages || [],
    fiscalisedInvoices: responseData?.fiscalisedInvoices || [],
  };

  let errorString = "";
  let infoString = "";
  let warningString = "";

  // error messages
  if (
    mraFinalisationData?.errorMessages &&
    mraFinalisationData?.errorMessages?.length > 0
  ) {
    mraFinalisationData?.errorMessages.forEach((message) => {
      const errorText = `Error code: ${message?.code}. Error description: ${message?.description}`;

      console.log(errorText);
      errorString = errorString + errorText + ", ";
    });
  }

  // info message
  if (
    mraFinalisationData?.infoMessages &&
    mraFinalisationData?.infoMessages?.length > 0
  ) {
    mraFinalisationData?.infoMessages.forEach((message) => {
      const infoText = `Info code: ${message?.code}. Info description: ${message?.description}`;

      console.log(infoText);
      infoString = infoString + infoText + ", ";
    });
  }

  console.log("invoices: ", JSON.stringify(invoices));
  console.log(
    "mraFinalisationData?.fiscalisedInvoices: ",
    JSON.stringify(mraFinalisationData?.fiscalisedInvoices)
  );

  // fisacalisedInvoices message
  if (
    mraFinalisationData?.fiscalisedInvoices &&
    mraFinalisationData?.fiscalisedInvoices?.length > 0
  ) {
    mraFinalisationData?.fiscalisedInvoices.forEach((fiscalisedInvoice) => {
      // error message
      if (
        fiscalisedInvoice?.errorMessages &&
        fiscalisedInvoice?.errorMessages?.length > 0
      ) {
        fiscalisedInvoice?.errorMessages.forEach((message) => {
          const fiscalisedErrorText = `Ficalised Invoice ${fiscalisedInvoice?.invoiceIdentifier}, Error code: ${message?.code}. Error description: ${message?.description}`;

          console.log(fiscalisedErrorText);

          errorString = errorString + fiscalisedErrorText + ", ";
        });
      }

      // warning message
      if (
        fiscalisedInvoice?.warningMessages &&
        fiscalisedInvoice?.warningMessages?.length > 0
      ) {
        const warningText = `Ficalised Invoice ${fiscalisedInvoice?.invoiceIdentifier}, Warning code: ${message?.code}. Warning description: ${message?.description}`;

        fiscalisedInvoice?.warningMessages.forEach((message) => {
          console.log(warningText);

          warningString = warningString + warningText + ", ";
        });
      }
    });
  }

  if (mraFinalisationData?.status === "SUCCESS") {
    if (type === "single") {
      admin
        .firestore()
        .collection("company")
        .doc(companyIdSelected)
        .collection(documentTypeId)
        .doc(invoiceId)
        .set(
          {
            mraFinalisationData: { ...mraFinalisationData },
            mraCompliantStatus: "completed",
            mraCompliantMessage: "",
            mraErrorMessages: "",
            mraInfoMessages: "",
            mraWarningMessages: "",
            mraFinalisationError: null,
            mraCompliantDateTime: new Date(),
          },
          { merge: true }
        )
        .then(() => {
          console.log("Response stored successfully");
        })
        .catch((error) => {
          console.log(
            `Error occured while saving finalisation object: ${
              error?.message || ""
            }`
          );
        });
    } else {
      invoices.forEach((invoice) => {
        let documentTypeIdValue = "";
        let documentIdValue = "";
        if (type === "schedule") {
          documentTypeIdValue = invoice?.documentType;
          documentIdValue = invoice?.documentId;
        } else {
          documentTypeIdValue = documentTypeId;
          documentIdValue = invoice?.data?.docString;
        }

        admin
          .firestore()
          .collection("company")
          .doc(companyIdSelected)
          .collection(documentTypeIdValue)
          .doc(documentIdValue)
          .set(
            {
              mraFinalisationData: { ...mraFinalisationData },
              mraCompliantStatus: "completed",
              mraCompliantMessage: "",
              mraErrorMessages: "",
              mraInfoMessages: "",
              mraWarningMessages: "",
              mraFinalisationError: null,
              mraCompliantDateTime: new Date(),
            },
            { merge: true }
          )
          .then(() => {
            console.log("Response stored successfully");
          })
          .catch((error) => {
            console.log(
              `Error occured while saving finalisation object: ${
                error?.message || ""
              }`
            );
          });
      });
    }
  } else {
    if (type === "single") {
      admin
        .firestore()
        .collection("company")
        .doc(companyIdSelected)
        .collection(documentTypeId)
        .doc(invoiceId)
        .set(
          {
            mraFinalisationData: { ...mraFinalisationData },
            mraCompliantStatus: "error",
            mraCompliantMessage: "",
            mraErrorMessages: errorString || "",
            mraInfoMessages: infoString || "",
            mraWarningMessages: warningString || "",
            mraCompliantDateTime: new Date(),
          },
          { merge: true }
        )
        .then(() => {
          console.log("Response stored successfully");
        })
        .catch((error) => {
          console.log(
            `Error occured while saving finalisation object: ${
              error?.message || ""
            }`
          );
        });
    } else if (type === "multiple") {
      invoices.forEach((invoice) => {
        let documentTypeIdValue = "";
        let documentIdValue = "";
        if (type === "schedule") {
          documentTypeIdValue = invoice?.documentType;
          documentIdValue = invoice?.documentId;
        } else {
          documentTypeIdValue = documentTypeId;
          documentIdValue = invoice?.data?.docString;
        }

        admin
          .firestore()
          .collection("company")
          .doc(companyIdSelected)
          .collection(documentTypeIdValue)
          .doc(documentIdValue)
          .set(
            {
              mraFinalisationData: { ...mraFinalisationData },
              mraCompliantStatus: "error",
              mraCompliantMessage: "",
              mraErrorMessages: errorString || "",
              mraInfoMessages: infoString || "",
              mraWarningMessages: warningString || "",
              mraCompliantDateTime: new Date(),
            },
            { merge: true }
          )
          .then(() => {
            console.log("Response stored successfully");
          })
          .catch((error) => {
            console.log(
              `Error occured while saving finalisation object: ${
                error?.message || ""
              }`
            );
          });
      });
    }
  }
}

function decryptKeyReceivedFromMRA(aesAlgorithm, mraEncryptedKey) {
  const decipher = crypto.createDecipheriv("aes-256-ecb", aesAlgorithm, "");
  decipher.setAutoPadding(true);
  let decrypted = decipher.update(mraEncryptedKey, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function encryptInvoice(obj, encryptKey) {
  const cipher = crypto.createCipheriv("aes-256-ecb", encryptKey, "");
  cipher.setAutoPadding(true);

  let encryptedData;
  // Encryption will be done in a memory stream through a CryptoStream object
  const cipherChunks = [];
  cipherChunks.push(cipher.update(JSON.stringify(obj), "utf8", "base64"));
  cipherChunks.push(cipher.final("base64"));
  encryptedData = cipherChunks.join("");

  return encryptedData;
}

// Defining key
const key = crypto.randomBytes(32);

// Defining iv
const iv = crypto.randomBytes(16);

// An encrypt function
function encrypt(text) {
  // Creating Cipheriv with its parameter
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

  // Updating text
  let encrypted = cipher.update(text);

  // Using concatenation
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Returning iv and encrypted data
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

// A decrypt function
function decrypt(text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");

  // Creating Decipher
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);

  // Updating encrypted text
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // returns data after decryption
  return decrypted.toString();
}

/* function decryptKey(mraKey, aesKeyBase64) {
  const aesKey = Buffer.from(aesKeyBase64, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    aesKey,
    Buffer.alloc(16).fill(0)
  );

  let toDecrypt = mraKey.toString("utf8");

  console.log("toDecrypt: ", toDecrypt);

  let decryptedKey = decipher.update(toDecrypt, "hex", "utf8");
  decryptedKey += decipher.final("utf8");
  return decryptedKey;
}

function encryptData(obj, publicKey) {
  try {
    // Generate a random symmetric key for AES encryption
    const aesKey = crypto.randomBytes(32); // 32 bytes for AES-256

    // Encrypt the data with AES
    const aesCipher = crypto.createCipheriv(
      "aes-256-ecb",
      aesKey,
      Buffer.alloc(0)
    ); // ECB mode doesn't use IV

    aesCipher.setAutoPadding(true); // Use PKCS7 padding

    let encryptedData = aesCipher.update(JSON.stringify(obj), "utf8", "base64");
    encryptedData += aesCipher.final("base64");

    const b64_publicKey = Buffer.from(
      "v+hOjYMV6qA7yd8p/Ewt8GQr8S6d+ZsUQPlw3/H1bhp6ohq+hp9lDj48uoU33W9W"
    ).toString("base64");
    const pemKey = `
-----BEGIN PUBLIC KEY-----
${b64_publicKey}
-----END PUBLIC KEY-----
`;

    const encryptedAesKey = crypto.publicEncrypt(
      {
        key: pemKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      aesKey
    );

    return Buffer.concat([
      encryptedAesKey,
      Buffer.from(encryptedData),
    ]).toString("base64");
  } catch (err) {
    console.log(err);
  }
}
 */
function roleIsValid(role) {
  const validRoles = [
    "super-admin",
    "Admin",
    "employee_admin",
    "employee",
    "admin_member",
    "Secretary",
    "SalePerson",
  ]; // To be adapted with your own list of roles
  return validRoles.includes(role);
}

exports.scheduledFirestoreBackups = functions.pubsub
  .schedule("0 0 * * 2,4,6")
  .onRun((context) => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const databaseName = client.databasePath(projectId, "(default)");

    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        // Leave collectionIds empty to export all collections
        // or set to a list of collection IDs to export,
        // collectionIds: ['users', 'posts']
        collectionIds: [],
      })
      .then((responses) => {
        const response = responses[0];
        console.log(`Operation Name: ${response["name"]}`);
        return;
      })
      .catch((err) => {
        console.error(err);
        throw new Error("Export operation failed");
      });
  });

async function calculateSHA256(data) {
  // Encode the data as UTF-8
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  // Calculate the SHA-256 hash
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);

  // Convert the hash buffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}
