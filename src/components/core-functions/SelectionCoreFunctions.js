import db from "../../firebase";
import moment from "moment";
import InvPdf from "../invoice-pdf/InvPdf";
import InvTransportTemplatePdf from "../invoice-pdf/transport-custom/InvTransportTemplatePdf";
import InvFlexitransTemplatePdf from "../invoice-pdf/flexitrans-custom/InvFlexitransTemplatePdf";
import { Document, pdf } from "@react-pdf/renderer";
import AtishPrintTemplatePdf from "./AtishPrintTemplatePdf";
import AtishPrintTemplateRectoPdf from "./AtishPrintTemplateRectoPdf";
import SurveyTemplatePdf from "./bugsBeGone-pdf/SurveyTemplatePdf";
import ServiceReportTemplatePdf from "./bugsBeGone-pdf/ServiceReportTemplatePdf";
import ContractAgreementTemplatePdf from "./bugsBeGone-pdf/ContractAgreementTemplatePdf";
import emailjs from "@emailjs/browser";

export function dynamicSort(property) {
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

export function dynamicSortNumber(property) {
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
      Number(a[property]) < Number(b[property])
        ? -1
        : Number(a[property]) > Number(b[property])
        ? 1
        : 0;
    return result * sortOrder;
  };
}

export function dynamicSortDesc(property) {
  var sortOrder = -1;
  /* if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  } */
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

export async function getCompanies(userId, a_comp, role) {
  return new Promise((resolve) => {
    db.collection("company")
      .orderBy("name", "asc")
      .get()
      .then((querySnapshot) => {
        if (querySnapshot?.docs?.length > 0) {
          let arr = [];
          querySnapshot?.docs?.forEach((comp) => {
            /*  if (
              (comp.id !== "companyIds" &&
                comp.id !== process.env.REACT_APP_PROTECTED_COMPANY) ||
              (comp.id !== "companyIds" &&
                comp.id === process.env.REACT_APP_PROTECTED_COMPANY &&
                userId === process.env.REACT_APP_PROTECTED_USER)
            ) { */
            if (
              (role === "super-admin" ||
                (a_comp &&
                  a_comp?.length > 0 &&
                  a_comp.find((company) => company.id === comp.id))) &&
              comp?.id !== "companyIds"
            ) {
              arr.push({
                id: comp.id,
                name: comp.data().name,
                data: { ...comp.data() },
              });
            }
            //  }
          });
          arr.sort(dynamicSort("name"));
          resolve(arr);
        } else {
          resolve([]);
        }
      })
      .catch((err) => {
        resolve({
          error: true,
          msg: err?.message,
          variant: "error",
        });
      });
  });
}

export function ValidateEmail(inputText) {
  var mailformat =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (inputText.match(mailformat)) {
    return true;
  } else {
    return false;
  }
}

export function ValidatePassword(inputText) {
  if (inputText.length < 6) {
    return false;
  } else {
    return true;
  }
}

export function ValidateEmptyInput(inputTextArr) {
  let counter = 0;
  inputTextArr.forEach((element) => {
    if (element === "") {
      return false;
    } else {
      counter++;
    }
  });

  if (counter === inputTextArr.length) {
    return true;
  }
}

export async function getBillToDefaultValue(clientDocumentObjectSelected) {
  return await new Promise((resolve) => {
    let defaultValue = clientDocumentObjectSelected?.data?.name || "";
    if (clientDocumentObjectSelected?.data?.tan) {
      defaultValue =
        defaultValue + `\nVat no: ${clientDocumentObjectSelected?.data?.tan}`;
    }
    if (clientDocumentObjectSelected?.data?.brn) {
      defaultValue =
        defaultValue + `\nBRN: ${clientDocumentObjectSelected?.data?.brn}`;
    }
    if (clientDocumentObjectSelected?.data?.email) {
      defaultValue =
        defaultValue + `\nEmail: ${clientDocumentObjectSelected?.data?.email}`;
    }
    if (clientDocumentObjectSelected?.data?.address) {
      defaultValue =
        defaultValue +
        `\nAddress: ${clientDocumentObjectSelected?.data?.address}`;
    }
    resolve(defaultValue);
  });
}

export async function getParticularsDefaultValue(companyId, documentTemplate) {
  return await new Promise(async (resolve) => {
    await db
      .collection("company")
      .doc(companyId)
      .collection("particulars")
      .get()
      .then(async (querySnapshot) => {
        if (querySnapshot?.docs?.length > 0) {
          let arr = [];
          querySnapshot?.docs.forEach((doc) => {
            if (documentTemplate === "transport") {
              let valueListOptions = doc?.data()?.valueList || [];
              if (valueListOptions?.length > 1) {
                valueListOptions = [...new Set(valueListOptions)];
                valueListOptions.sort();
              }

              arr.push({
                orderNum: doc?.data()?.orderNum || "",
                id: doc.id,
                isChecked: true,
                title: doc?.data()?.title,
                customDetail: "",
                selectedValue: "",
                valueList: valueListOptions,
                amount: 0,
              });

              arr.sort(dynamicSort("orderNum"));
            } else if (documentTemplate === "flexitrans") {
              arr.push(doc?.data()?.rowDescription || "");

              arr.sort();
            }
          });

          resolve(arr);
        } else {
          await db
            .collection("particulars")
            .get()
            .then((querySnapshot) => {
              if (querySnapshot?.docs?.length > 0) {
                let arr = [];
                querySnapshot?.docs.forEach((doc) => {
                  let valueListOptions = doc?.data()?.valueList || [];
                  if (valueListOptions?.length > 1) {
                    valueListOptions = [...new Set(valueListOptions)];
                    valueListOptions.sort();
                  }

                  arr.push({
                    orderNum: doc?.data()?.orderNum || "",
                    id: doc.id,
                    isChecked: true,
                    title: doc?.data()?.title,
                    customDetail: "",
                    selectedValue: "",
                    valueList: valueListOptions,
                    amount: 0,
                  });
                });

                arr.sort(dynamicSort("orderNum"));

                resolve(arr);
              } else {
                resolve([]);
              }
            });
        }
      });
  });
}

export async function checkIfCustomDocumentIdPresentInDB(
  docCustomIdNumber,
  companyId,
  documentId
) {
  return await new Promise(async (resolve) => {
    const customDocumentIdToNumber = Number(docCustomIdNumber);
    const documentNumber = customDocumentIdToNumber.toString();

    let documentNumberDocString = await formatDocumentIdNumber(
      customDocumentIdToNumber
    );

    if (documentNumberDocString) {
      // check if document is greater than document number reached
      await db
        .collection("company")
        .doc(companyId)
        .collection(documentId)
        .doc("documentIndex")
        .get()
        .then(async (doc) => {
          if (
            doc?.data()?.documentIndex &&
            Number(doc?.data()?.documentIndex) <= Number(docCustomIdNumber)
          ) {
            resolve({
              error: true,
              message:
                "The custom document id you entered, is greater or equal to the document number reached.",
            });
          } else {
            // Check if document number already exist in database
            await db
              .collection("company")
              .doc(companyId)
              .collection(documentId)
              .doc(documentNumberDocString)
              .get()
              .then((doc) => {
                if (doc.exists) {
                  resolve({
                    error: true,
                    message:
                      "The custom document id you entered, is already present in the database.",
                  });
                } else {
                  resolve({
                    error: false,
                    documentNumber: documentNumber,
                    documentNumberDocString: documentNumberDocString,
                  });
                }
              })
              .catch((error) => {
                resolve({
                  error: true,
                  message: `Error occured while checking if custom document id is already present in db: ${error?.message}`,
                });
              });
          }
        });
    } else {
      resolve({
        error: true,
        message: "Document Id Number could not be formatted.",
      });
    }
  });
}

export async function incrementEBSGlobalInvoiceCounter({ companyIdSelected }) {
  return await new Promise((resolve) => {
    var documentDocRef = db
      .collection("company")
      .doc(companyIdSelected)
      .collection("EBSInvoiceCounter")
      .doc("invoiceCounter");

    db.runTransaction((transaction) => {
      return transaction.get(documentDocRef).then((sfDoc) => {
        if (!sfDoc.exists) {
          // throw "Document does not exist!";
          transaction.update(documentDocRef, {
            invoiceCounter: 1,
          });
          return 1;
        }

        var newInvoiceCounter = Number(sfDoc.data().invoiceCounter) + 1;
        transaction.update(documentDocRef, {
          invoiceCounter: newInvoiceCounter,
        });
        return newInvoiceCounter;
      });
    })
      .then(async (newInvoiceCounter) => {
        resolve({ error: false, invoiceCounter: newInvoiceCounter });
      })
      .catch((error) => {
        resolve({ error: true, message: error?.message || "" });
      });
  });
}

export async function toDataUrl(url) {
  return await new Promise(async (resolveUrl) => {
    if (url === "") {
      resolveUrl("");
    } else {
      try {
        const data = await fetch(url);
        const blob = await data.blob();
        resolveUrl(
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const base64data = reader.result;
              resolve(base64data);
            };
          })
        );
      } catch (e) {
        console.log(e);
      }
    }
  });
}

export async function handleMailCustomSurvey(
  companyDetails,
  type,
  objectData,
  template,
  logo
) {
  return await new Promise(async (resolve) => {
    let defaultCheckBoxOptions = await getDefaultCheckBoxOptions();

    let preparedBySignatureImg = "";
    let clientSignatureImg = "";

    if (objectData?.preparedBy) {
      preparedBySignatureImg = await toDataUrl(objectData?.preparedBy);
    }

    if (objectData?.clientSig) {
      clientSignatureImg = await toDataUrl(objectData?.clientSig);
    }

    let parsed = null;
    if (template === "contractagreement") {
      let parsedTreatmentDefinition =
        (objectData?.treatmentDefinition &&
          (await parseHTML(objectData?.treatmentDefinition || ""))) ||
        "";

      let parsedSpecialMentions =
        (objectData?.specialMentions &&
          (await parseHTML(objectData?.specialMentions || ""))) ||
        "";

      parsed = {
        treatmentDefinition: parsedTreatmentDefinition,
        specialMentions: parsedSpecialMentions,
      };
    }

    const doc =
      template === "survey" ? (
        <SurveyTemplatePdf
          companyDetails={companyDetails}
          surveyDetail={objectData}
          defaultCheckBoxOptions={defaultCheckBoxOptions}
          logo={logo}
          preparedBySignatureImg={preparedBySignatureImg}
          clientSignatureImg={clientSignatureImg}
        />
      ) : template === "servicereport" ? (
        <ServiceReportTemplatePdf
          companyDetails={companyDetails}
          surveyDetail={objectData}
          defaultCheckBoxOptions={defaultCheckBoxOptions}
          logo={logo}
          preparedBySignatureImg={preparedBySignatureImg}
          clientSignatureImg={clientSignatureImg}
        />
      ) : template === "contractagreement" ? (
        <ContractAgreementTemplatePdf
          companyDetails={companyDetails}
          surveyDetail={objectData}
          defaultCheckBoxOptions={defaultCheckBoxOptions}
          logo={logo}
          preparedBySignatureImg={preparedBySignatureImg}
          clientSignatureImg={clientSignatureImg}
          parsedHtml={parsed}
        />
      ) : null;

    let blobPDF = await pdf(doc).toBlob();

    if (blobPDF) {
      let blobResponse = await new Promise((resolve) => {
        var reader = new FileReader();
        reader.readAsDataURL(blobPDF);

        reader.onloadend = async () => {
          var base64String = reader.result;
          let sFormat = base64String.split(",");
          resolve(sFormat[1]);
        };
      });

      if (blobResponse) {
        let toEmail = objectData?.email || "";
        if (objectData?.email2) {
          toEmail = toEmail + `,${objectData?.email2}`;
        }
        if (objectData?.email3) {
          toEmail = toEmail + `,${objectData?.email3}`;
        }
        if (objectData?.email4) {
          toEmail = toEmail + `,${objectData?.email4}`;
        }

        let emailParameters = {
          from_name: companyDetails?.data?.name,
          to_name: objectData?.customerName || "",
          from_email: companyDetails?.data?.email,
          to_email: toEmail, // objectData?.email || "",
          reply_to: companyDetails?.data?.email,
          subject:
            template === "survey"
              ? `Survey from ${companyDetails?.data?.name}`
              : template === "servicereport"
              ? `Service Report from ${companyDetails?.data?.name}`
              : template === "contractagreement"
              ? `Contract Agreement from ${companyDetails?.data?.name}`
              : "",
          fileName:
            template === "survey"
              ? `Survey.pdf`
              : template === "servicereport"
              ? "Service_Report.pdf"
              : template === "contractagreement"
              ? "Contract_Agreement.pdf"
              : "",
          content: [blobResponse],
          invoiceNumber: objectData?.id,
          documentType:
            template === "survey"
              ? `Survey`
              : template === "servicereport"
              ? "Service Report"
              : template === "contractagreement"
              ? "Contract Agreement"
              : "",
          invoice_number_customerName: `- ${objectData?.id}`,
        };

        emailjs
          .send(
            companyDetails?.data?.serviceKey,
            companyDetails?.data?.templateKey,
            {
              ...emailParameters,
            },
            process.env.REACT_APP_EMAILJS_PUBLIC_KEY
          )
          .then(
            async () => {
              await db
                .collection("company")
                .doc(companyDetails?.id)
                .collection(template)
                .doc(objectData?.id)
                .set({ emailAlreadySent: true }, { merge: true })
                .then(() => {
                  resolve({
                    error: false,
                    message: "Email sent successfully",
                  });
                });
            },
            (error) => {
              resolve({
                error: true,
                message: `Error occured while sending pdf: ${error.text}`,
              });
            }
          );
      }
    }
  });
}

export async function handleViewDownloadCustomSurvey(
  companyDetails,
  type,
  objectData,
  template,
  logo
) {
  let defaultCheckBoxOptions = await getDefaultCheckBoxOptions();

  let preparedBySignatureImg = "";
  let clientSignatureImg = "";

  if (objectData?.preparedBy) {
    preparedBySignatureImg = await toDataUrl(objectData?.preparedBy);
  }

  if (objectData?.clientSig) {
    clientSignatureImg = await toDataUrl(objectData?.clientSig);
  }

  let parsed = null;
  if (template === "contractagreement") {
    let parsedTreatmentDefinition =
      (objectData?.treatmentDefinition &&
        (await parseHTML(objectData?.treatmentDefinition || ""))) ||
      "";

    let parsedSpecialMentions =
      (objectData?.specialMentions &&
        (await parseHTML(objectData?.specialMentions || ""))) ||
      "";

    parsed = {
      treatmentDefinition: parsedTreatmentDefinition,
      specialMentions: parsedSpecialMentions,
    };
  }

  const doc =
    template === "survey" ? (
      <SurveyTemplatePdf
        companyDetails={companyDetails}
        surveyDetail={objectData}
        defaultCheckBoxOptions={defaultCheckBoxOptions}
        logo={logo}
        preparedBySignatureImg={preparedBySignatureImg}
        clientSignatureImg={clientSignatureImg}
      />
    ) : template === "servicereport" ? (
      <ServiceReportTemplatePdf
        companyDetails={companyDetails}
        surveyDetail={objectData}
        defaultCheckBoxOptions={defaultCheckBoxOptions}
        logo={logo}
        preparedBySignatureImg={preparedBySignatureImg}
        clientSignatureImg={clientSignatureImg}
      />
    ) : template === "contractagreement" ? (
      <ContractAgreementTemplatePdf
        companyDetails={companyDetails}
        surveyDetail={objectData}
        defaultCheckBoxOptions={defaultCheckBoxOptions}
        logo={logo}
        preparedBySignatureImg={preparedBySignatureImg}
        clientSignatureImg={clientSignatureImg}
        parsedHtml={parsed}
      />
    ) : null;

  const blobPdf = pdf(doc);
  blobPdf.updateContainer(doc);
  const result = await blobPdf.toBlob();

  console.log(result);

  if (result) {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(result);

    if (type === "download") {
      link.download =
        template === "survey"
          ? `Survey_${objectData?.customerName || ""}.pdf`
          : `Service_Report_${objectData?.customerName || ""}.pdf`;
      link.click();
    } else if (type === "view") {
      window.open(link.href, "_blank");
    }
  }
}

export async function parseHTML(htmlString) {
  return await new Promise((resolve) => {
    let newhtmlString = htmlString.replace(/<\/?p[^>]*>/g, "");

    // Regular expression to match HTML tags
    const tagRegex = /<(\w+)([^>]*)>(.*?)<\/\1>|<(\w+)([^>]*)\/?>/g;
    let match;
    const result = [];

    // Find all matching tags in the string
    while ((match = tagRegex.exec(newhtmlString)) !== null) {
      const [fullMatch, tag, attributes, innerText] = match;

      result.push({
        tag: tag,
        attributes: attributes,
        text: (innerText && innerText?.trim()) || "", // Trim inner text to remove extra spaces/newlines
      });
    }

    resolve(result);
  });
}

export async function handleViewDownload(
  companyDetails,
  clientDocumentObjectSelected,
  doc,
  logo,
  sigImage,
  type,
  clientList
) {
  let clientObject = null;

  if (clientDocumentObjectSelected) {
    clientObject = { ...clientDocumentObjectSelected?.data };
  } else if (clientList && clientList?.length > 0) {
    clientObject =
      clientList.find((client) => client.id === doc?.data?.clientId || "")
        ?.data || null;
  }

  const content = {
    companyChosenObj: {
      id:
        companyDetails?.id && companyDetails?.id !== ""
          ? companyDetails?.id
          : "",
      data: {
        ...companyDetails?.data,
      },
    },
    clientChosenObj: {
      data: {
        ...(clientObject || null),
      },
    },
    invDetails: {
      docTitle: doc?.data?.docTitle || "",
      docType: doc?.data?.docType || "",
      docQuoteNumber: doc?.data?.docQuoteNumber || "",
      docPurchaseOrderNumber: doc?.data?.docPurchaseOrderNumber || "",
      docBillTo: doc?.data?.docBillTo || "",
      docShipTo: doc?.data?.docShipTo || "",
      docTermsAndCondition: doc?.data?.docTermsAndCondition || "",
      invDate: moment(doc?.data?.docDate.toDate()).format("DD-MM-YYYY") || "",
      invParticulars: doc?.data?.docParticulars || [],
      invTotal: doc?.data?.docTotal || 0,
      invoiceString: doc?.data?.docString || "",
      invVatFee: doc?.data?.docVatFee || 0,
      invSubTotal: doc?.data?.docSubTotal || 0,
      paymentStatus: doc?.data?.paymentStatus || "",

      //custom details
      docBLNumber: doc?.data?.docBLNumber || "",
      docSupplier: doc?.data?.docSupplier || "",
      docContainerNumber: doc?.data?.docContainerNumber || "",
      docPackages: doc?.data?.docPackages || "",
      docDescription: doc?.data?.docDescription || "",
      docGrossWeight: doc?.data?.docGrossWeight || "",
      docVolume: doc?.data?.docVolume || "",
      docPortOfLoading: doc?.data?.docPortOfLoading || "",
      docETA: doc?.data?.docETA || "",
      docVesselName: doc?.data?.docVesselName || "",
      docRoE: doc?.data?.docRoE || "",
      docPlaceOfLanding: doc?.data?.docPlaceOfLanding || "",

      attachedPaymentNumber: doc?.data?.attachedPaymentNumber || [],

      // MRA customs
      discountTotalAmount: doc?.data?.discountTotalAmount || "",
      discountedTotalAmount: doc?.data?.discountedTotalAmount || "",

      // transport template
      invJobRef: doc?.data?.invJobRef || "",
      invStorageFee: doc?.data?.invStorageFee || "",
      invScanningFee: doc?.data?.invScanningFee || "",
      invGatePassFee: doc?.data?.invGatePassFee || "",
      invVehicleNo: doc?.data?.invVehicleNo || "",
      transportFees: doc?.data?.transportFees || "",
      transportDesc: doc?.data?.transportDesc || "",
      invApplyVat: doc?.data?.invApplyVat || false,

      // flexitrans customs
      docShipper: doc?.data?.docShipper || "",
      docMarkNos: doc?.data?.docMarkNos || "",
      docCommodity: doc?.data?.docCommodity || "",
      docHbl: doc?.data?.docHbl || "",
      docDepot: doc?.data?.docDepot || "",
    },
    logo: logo || "",
    sigImage: sigImage || "",
  };

  let qrCodeUri = "";
  if (doc?.data?.mraFinalisationData?.fiscalisedInvoices) {
    let qrCode = doc?.data?.mraFinalisationData?.fiscalisedInvoices[0]?.qrCode;

    // Construct data URI data:image/png;base64,
    const dataUri = `data:image/jpeg/png;base64,${qrCode}`;

    qrCodeUri = dataUri;
  }

  try {
    const doc =
      companyDetails?.data?.documentTemplate === "flexitrans" ? (
        <InvFlexitransTemplatePdf
          companyChosenObj={content.companyChosenObj}
          clientChosenObj={content.clientChosenObj}
          invDetails={content.invDetails}
          logo={content.logo}
          sigImage={content.sigImage}
        />
      ) : companyDetails?.data?.documentTemplate === "transport" ? (
        <InvTransportTemplatePdf
          companyChosenObj={content.companyChosenObj}
          clientChosenObj={content.clientChosenObj}
          invDetails={content.invDetails}
          logo={content.logo}
          sigImage={content.sigImage}
        />
      ) : (
        <InvPdf
          // worldlink custom template
          customTemplate1={
            process.env.REACT_APP_CUSTOM_REQUIREMENT_WORLDLINK_EXAMPLE &&
            companyDetails?.id &&
            process.env.REACT_APP_CUSTOM_REQUIREMENT_WORLDLINK_EXAMPLE.includes(
              companyDetails?.id
            )
              ? true
              : false
          }
          // new template with custom MRA changes
          newTemplate={
            companyDetails?.data?.MRATemplateFlag?.value ||
            content?.invDetails?.data?.MRATemplateApplied
              ? true
              : false
          }
          companyChosenObj={content.companyChosenObj}
          clientChosenObj={content.clientChosenObj}
          invDetails={content.invDetails}
          logo={content.logo}
          sigImage={content.sigImage}
          qrCodeUri={qrCodeUri || ""}
        />
      );

    const blobPdf = pdf(doc);
    blobPdf.updateContainer(doc);
    const result = await blobPdf.toBlob();

    console.log(result);

    if (result) {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(result);

      if (type === "download") {
        link.download = `${content?.invDetails?.docTitle}_${
          content?.invDetails?.invoiceString
        }_Bill_to_${
          content?.clientChosenObj?.data?.name || doc?.data?.docBillTo || ""
        }.pdf`;
        link.click();
      } else if (type === "view") {
        window.open(link.href, "_blank");
      }
    }
  } catch (error) {
    console.error(error);
    alert("Error generating PDF");
  }
}

export async function formatDocumentIdNumber(customDocumentIdToNumber) {
  return await new Promise((resolve) => {
    let documentNumberDocString = customDocumentIdToNumber.toString();

    if (documentNumberDocString?.length === 1) {
      documentNumberDocString = `0000${documentNumberDocString}`;
    } else if (documentNumberDocString?.length === 2) {
      documentNumberDocString = `000${documentNumberDocString}`;
    } else if (documentNumberDocString?.length === 3) {
      documentNumberDocString = `00${documentNumberDocString}`;
    } else if (documentNumberDocString?.length === 4) {
      documentNumberDocString = `0${documentNumberDocString}`;
    }

    resolve(documentNumberDocString);
  });
}

export async function handleViewDownloadAtish(type) {
  try {
    const doc = <AtishPrintTemplatePdf />;

    const blobPdf = pdf(doc);
    blobPdf.updateContainer(doc);
    const result = await blobPdf.toBlob();

    console.log(result);

    if (result) {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(result);

      if (type === "view") {
        window.open(link.href, "_blank");
      }
    }
  } catch (error) {
    console.error(error);
    alert("Error generating PDF");
  }
}

export async function handleViewDownloadAtishRecto(
  type,
  clientId,
  bookingDetail
) {
  return await new Promise(async (resolve) => {
    try {
      await db
        .collection("users")
        .doc(clientId)
        .get()
        .then(async (clientDoc) => {
          if (clientDoc.exists) {
            await db
              .collection("vehiclebooking")
              .doc(bookingDetail?.id)
              .get()
              .then(async (bookingDoc) => {
                if (bookingDoc.exists) {
                  const doc = (
                    <Document>
                      <AtishPrintTemplateRectoPdf
                        bookingDetail={bookingDoc?.data()}
                        clientDetail={clientDoc?.data()}
                      />
                      <AtishPrintTemplatePdf />
                    </Document>
                  );

                  const blobPdf = pdf(doc);
                  blobPdf.updateContainer(doc);
                  const result = await blobPdf.toBlob();

                  console.log(result);

                  if (result) {
                    const link = document.createElement("a");
                    link.href = window.URL.createObjectURL(result);

                    if (type === "view") {
                      window.open(link.href, "_blank");
                    } else if (type === "download") {
                      link.download = `Contract_${
                        bookingDoc?.data()?.contractId
                      }.pdf`;
                      link.click();
                    }
                  }
                }
              });
          }
        });
    } catch (error) {
      console.error(error);
      alert("Error generating PDF");
    }
  });
}

export async function getDefaultCheckBoxOptions() {
  return await new Promise((resolve) => {
    const controlOfCheckboxList = [
      { name: "timberPest", title: "Timber pest" },
      { name: "drywoodPest", title: "Drywood pest" },
      { name: "ants", title: "Ants" },
      { name: "geckos", title: "Geckos" },
      { name: "lizard", title: "Lizard" },
      { name: "spiders", title: "Spiders" },
      { name: "rodent", title: "Rodent" },
      { name: "woodworm", title: "Woodworm" },
      { name: "pigeon", title: "Pigeon" },
      { name: "cockroaches", title: "Cockroaches" },
      { name: "americanCockroaches", title: "American Cockroaches" },
      { name: "brownCockroaches", title: "Brown Cockroaches" },
      { name: "germanCockroaches", title: "German Cockroaches" },
      { name: "mosquitoes", title: "Mosquitoes" },
      { name: "fleas", title: "Fleas" },
      { name: "bedbugs", title: "Bed bugs" },
      { name: "termite", title: "Termite" },
      { name: "snake", title: "Snake" },
      { name: "rodent", title: "Rodent" },
    ];

    const controlOfCheckboxList1 = [
      { name: "timberPest", title: "Timber pest" },
      { name: "drywoodPest", title: "Drywood pest" },
      { name: "ants", title: "Ants" },
      { name: "geckos", title: "Geckos" },
      { name: "lizard", title: "Lizard" },
      { name: "spiders", title: "Spiders" },
    ];

    const controlOfCheckboxList2 = [
      { name: "rodent", title: "Rodent" },
      { name: "woodworm", title: "Woodworm" },
      { name: "pigeon", title: "Pigeon" },
      { name: "cockroaches", title: "Cockroaches" },
      { name: "americanCockroaches", title: "American Cockroaches" },
      { name: "brownCockroaches", title: "Brown Cockroaches" },
    ];

    const controlOfCheckboxList3 = [
      { name: "germanCockroaches", title: "German Cockroaches" },
      { name: "mosquitoes", title: "Mosquitoes" },
      { name: "fleas", title: "Fleas" },
      { name: "bedbugs", title: "Bed bugs" },
      { name: "termite", title: "Termite" },
      { name: "snake", title: "Snake" },
    ];

    const controlOfCheckboxList4 = [{ name: "rodent", title: "Rodent" }];

    const infestationCheckboxList = [
      { name: "slight", title: "Slight" },
      { name: "moderate", title: "Moderate" },
      { name: "severe", title: "Severe" },
    ];

    const controlVectorCheckboxList = [
      { name: "fumigation", title: "Fumigation" },
      { name: "mistingControl", title: "Misting Control" },
      { name: "lightSpraying", title: "Light Spraying" },
      { name: "fogging", title: "Fogging" },
      { name: "dusting", title: "Dusting" },
      { name: "glueBoard", title: "Glue Board" },
      { name: "spraying", title: "Spraying" },
    ];

    const controlVectorCheckboxList1 = [
      { name: "fumigation", title: "Fumigation" },
      { name: "mistingControl", title: "Misting Control" },
      { name: "lightSpraying", title: "Light Spraying" },
      { name: "fogging", title: "Fogging" },
      { name: "dusting", title: "Dusting" },
      { name: "glueBoard", title: "Glue Board" },
    ];

    const controlVectorCheckboxList2 = [
      { name: "spraying", title: "Spraying" },
    ];

    const locationTreatedCheckboxList = [
      { name: "bedrooms", title: "Bedrooms" },
      { name: "toiletAndBathroom", title: "Toilet & Bathroom" },
      { name: "drain", title: "Drain" },
      { name: "livingDiningRoom", title: "Living Dining Room" },
      { name: "gardenLawn", title: "Garden/Lawn" },
      { name: "roofConstruction", title: "Roof Construction" },
      { name: "house", title: "House" },
      { name: "offices", title: "Offices" },
      { name: "showroom", title: "Showroom" },
      { name: "factory", title: "Factory" },
      { name: "restaurant", title: "Restaurant" },
      { name: "villa", title: "Villa" },
      { name: "shop", title: "Shop" },
      { name: "stores", title: "Stores" },
      { name: "snack", title: "Snack" },
      { name: "school", title: "School" },
    ];

    const locationTreatedCheckboxList1 = [
      { name: "bedrooms", title: "Bedrooms" },
      { name: "toiletAndBathroom", title: "Toilet & Bathroom" },
      { name: "drain", title: "Drain" },
      { name: "livingDiningRoom", title: "Living Dining Room" },
      { name: "gardenLawn", title: "Garden/Lawn" },
      { name: "roofConstruction", title: "Roof Construction" },
    ];

    const locationTreatedCheckboxList2 = [
      { name: "house", title: "House" },
      { name: "offices", title: "Offices" },
      { name: "showroom", title: "Showroom" },
      { name: "factory", title: "Factory" },
      { name: "restaurant", title: "Restaurant" },
      { name: "villa", title: "Villa" },
    ];

    const locationTreatedCheckboxList3 = [
      { name: "shop", title: "Shop" },
      { name: "stores", title: "Stores" },
      { name: "snack", title: "Snack" },
      { name: "school", title: "School" },
    ];

    const recommendationCheckboxList = [
      { name: "contratOneYear", title: "Contract of 1 year" },
      { name: "serviceOneOff", title: "Service 1 off" },
    ];

    const routineCheckboxList = [
      { name: "complaint", title: "Complaint" },
      { name: "job", title: "Job" },
      { name: "initialFlushOut", title: "Initial Flush Out" },
      { name: "spotCheck", title: "Spot Check" },
    ];

    resolve({
      controlOfCheckboxList: controlOfCheckboxList,
      controlOfCheckboxList1: controlOfCheckboxList1,
      controlOfCheckboxList2: controlOfCheckboxList2,
      controlOfCheckboxList3: controlOfCheckboxList3,
      controlOfCheckboxList4: controlOfCheckboxList4,
      infestationCheckboxList: infestationCheckboxList,
      controlVectorCheckboxList: controlVectorCheckboxList,
      controlVectorCheckboxList1: controlVectorCheckboxList1,
      controlVectorCheckboxList2: controlVectorCheckboxList2,
      locationTreatedCheckboxList: locationTreatedCheckboxList,
      locationTreatedCheckboxList1: locationTreatedCheckboxList1,
      locationTreatedCheckboxList2: locationTreatedCheckboxList2,
      locationTreatedCheckboxList3: locationTreatedCheckboxList3,
      recommendationCheckboxList: recommendationCheckboxList,
      routineCheckboxList: routineCheckboxList,
    });
  });
}
