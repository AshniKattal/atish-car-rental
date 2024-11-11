import { Page, View, Text, Image, Document } from "@react-pdf/renderer";
//
import styles from "./PdfStyle";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import moment from "moment";
import BulletPointPng from "../bugsBeGone-images/bulletPoint.png";
import { useCallback } from "react";

// ----------------------------------------------------------------------

export default function ContractAgreementTemplatePdf({
  companyDetails,
  surveyDetail,
  defaultCheckBoxOptions,
  logo,
  preparedBySignatureImg,
  clientSignatureImg,
  parsedHtml,
}) {
  const headerComponent = () => {
    return (
      <View style={styles.headerContractAgreement}>
        <Image
          source={logo}
          style={{
            width: "50px",
            height: "50px",
            backgroundSize: "cover",
          }}
        />
        <Text
          style={{
            marginTop: "5px",
            borderBottom: "0.5px solid black",
          }}
        ></Text>
      </View>
    );
  };

  const footerComponent = (pageNum) => {
    return (
      <View style={[styles.footerContractAgreement, styles.gridContainer]}>
        <View style={styles.col30}>
          <Text style={{ fontSize: "10px" }}>
            {/*  Date:{" "}
            {surveyDetail?.dateCreated
              ? moment(surveyDetail?.dateCreated.toDate()).format("DD/MM/YYYY")
              : ""} */}{" "}
          </Text>
        </View>

        <View style={styles.col40}>
          <Text style={{ fontSize: "10px", textAlign: "center" }}>
            Agreement no.
            {` ${surveyDetail?.id}`}
          </Text>
        </View>

        <View style={styles.col30}>
          <Text
            style={{ fontSize: "10px", textAlign: "center" }}
          >{`${pageNum} of 6`}</Text>
        </View>
      </View>
    );
  };

  const onDocumentLoadError = useCallback((error) => {
    console.error(error);
  }, []);

  const onDocumentLoadProgress = useCallback((progressData) => {
    console.log(
      "Loading a document",
      progressData.total
        ? progressData.loaded / progressData.total
        : "(unknown progress)"
    );
  }, []);

  return (
    <Document
      onLoadError={onDocumentLoadError}
      onSourceError={onDocumentLoadError}
      onLoadProgress={onDocumentLoadProgress}
    >
      <Page size="A4" style={styles.pageContractAgreement} wrap={false}>
        {/* Header */}
        {headerComponent()}

        {/* Page Content */}
        <View style={styles.contentContractAgreement}>
          <View style={[styles.gridContainer]}>
            <View style={styles.col12}>
              <Text style={[styles.alignRight, styles.pr4]}>
                PEST CONTROL AGREEMENT
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb8]}>
            <View style={styles.col80}>
              <Text>{companyDetails?.data?.name || ""}</Text>
              <Text>BRN: {companyDetails?.data?.brn || ""}</Text>
              <Text>ADDRESS: {companyDetails?.data?.address || ""}</Text>
              <Text>
                Phone:{" "}
                {`${companyDetails?.data?.mobileNumber || ""} ${
                  companyDetails?.data?.phoneNumber
                    ? `/ ${companyDetails?.data?.phoneNumber || ""}`
                    : ""
                }`}
              </Text>
              <Text>EMAIL: {companyDetails?.data?.email || ""}</Text>
            </View>
            <View style={styles.col20}>
              <Text>
                Agreement no:{" "}
                <span style={{ textDecoration: "underline", minWidth: "50px" }}>
                  {surveyDetail?.id || ""}
                </span>
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <View style={styles.col12}>
              <Text style={[styles.alignCenter, styles.boldNewTable]}>
                PARTICULAR CONDITIONS
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <View style={styles.col12}>
              <Text style={[styles.alignCenter]}>
                These particular conditions are to be read in conjunction with
                the Terms & Conditions
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <View style={styles.col12}>
              <Text style={[styles.alignLeft, styles.boldNewTable]}>
                Definitions
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb8]}>
            <View style={styles.col20}>
              <Text style={[styles.alignLeft]}>The Service Provider: </Text>
            </View>
            <View style={styles.col80}>
              <Text style={[styles.alignLeft, styles.boldNewTable]}>
                {companyDetails?.data?.name || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <View style={styles.col20}>
              <Text style={[styles.alignLeft]}>The Customer: </Text>
            </View>
            <View style={styles.col80}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.customerName
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.customerName || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <View style={styles.col20}>
              <Text style={[styles.alignLeft]}>ID: </Text>
            </View>
            <View style={styles.col80}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.nic
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.nic || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <View style={styles.col20}>
              <Text style={[styles.alignLeft]}>BRN: </Text>
            </View>
            <View style={styles.col35}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.brn
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.brn || ""}
              </Text>
            </View>
            <View style={styles.col15}>
              <Text style={[styles.alignLeft]}>VAT (if applicable): </Text>
            </View>
            <View style={styles.col35}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.tan
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.tan || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <View style={styles.col20}>
              <Text style={[styles.alignLeft]}>Address: </Text>
            </View>
            <View style={styles.col80}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.address
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.address || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <View style={styles.col20}>
              <Text style={[styles.alignLeft]}>Phone no: </Text>
            </View>
            <View style={styles.col80}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.contactNumber
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.contactNumber || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <View style={styles.col20}>
              <Text style={[styles.alignLeft]}>Email address: </Text>
            </View>
            <View style={styles.col80}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.email
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.email || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <View style={styles.col20}>
              <Text style={[styles.alignLeft]}>Representative: </Text>
            </View>
            <View style={styles.col35}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.representative
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.representative || ""}
              </Text>
            </View>
            <View style={styles.col10}>
              <Text style={[styles.alignLeft]}>Designation: </Text>
            </View>
            <View style={styles.col35}>
              <Text
                style={
                  surveyDetail?.designation
                    ? styles.underline
                    : styles.underlineSimulation
                }
              >
                {surveyDetail?.designation || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <View style={styles.col20}>
              <Text style={[styles.alignLeft]}>Quote ref: </Text>
            </View>
            <View style={styles.col80}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.quoteRef
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.quoteRef || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <View style={styles.col20}>
              <Text style={[styles.alignLeft]}>Site address: </Text>
            </View>
            <View style={styles.col80}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.siteAddress
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.siteAddress || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb8]}>
            <Text style={[styles.alignLeft, styles.boldNewTable]}>
              Period of Contract and frequency of Services
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <View style={[styles.col20]}>
              <Text style={[styles.alignLeft]}>Contract period: </Text>
            </View>
            <View style={[styles.col80]}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.commencementPeriod
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.commencementPeriod || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <View style={[styles.col20]}>
              <Text style={[styles.alignLeft]}>Terms: </Text>
            </View>
            <View style={[styles.col80]}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.terms
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.terms || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <View style={[styles.col20]}>
              <Text style={[styles.alignLeft]}>Service type: </Text>
            </View>
            <View style={[styles.col80]}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.serviceType
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.serviceType || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <View style={[styles.col20]}>
              <Text style={[styles.alignLeft]}>No. of intervention: </Text>
            </View>
            <View style={[styles.col80]}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.noOfIntervention
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.noOfIntervention || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <View style={[styles.col20]}>
              <Text style={[styles.alignLeft]}>Installation requirement: </Text>
            </View>
            <View style={[styles.col80]}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.installationRequirement
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.installationRequirement || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text>To be provided by customer on site if needed</Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <View style={[styles.col20]}>
              <Text style={[styles.alignLeft]}>Additionals: </Text>
            </View>
            <View style={[styles.col80]}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.additional
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.additional || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb8]}>
            <Text style={[styles.alignLeft, styles.boldNewTable]}>Cost</Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <View style={[styles.col20]}>
              <Text style={[styles.alignLeft]}>Annual Total amount: </Text>
            </View>
            <View style={[styles.col80]}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.annualTotalAmt
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.annualTotalAmt || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <View style={[styles.col20]}>
              <Text style={[styles.alignLeft]}>Terms of Payment: </Text>
            </View>
            <View style={[styles.col80]}>
              <Text
                style={[
                  styles.alignLeft,
                  surveyDetail?.termsOfPayment
                    ? styles.underline
                    : styles.underlineSimulation,
                ]}
              >
                {surveyDetail?.termsOfPayment || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb8]}>
            <Text style={[styles.alignLeft]}>
              Bank details of Service Provider
            </Text>
          </View>

          <View style={[styles.gridContainer]}>
            <View style={[styles.col20]}>
              <Text style={[styles.alignLeft]}>Name: </Text>
            </View>
            <View style={[styles.col80]}>
              <Text style={[styles.alignLeft]}>
                {companyDetails?.data?.beneficiaryName || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer]}>
            <View style={[styles.col20]}>
              <Text style={[styles.alignLeft]}>Bank Name: </Text>
            </View>
            <View style={[styles.col80]}>
              <Text style={[styles.alignLeft]}>
                {companyDetails?.data?.bankName || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer]}>
            <View style={[styles.col20]}>
              <Text style={[styles.alignLeft]}>Account no.: </Text>
            </View>
            <View style={[styles.col80]}>
              <Text style={[styles.alignLeft]}>
                {companyDetails?.data?.bankAccNo || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer]}>
            <View style={[styles.col20]}>
              <Text style={[styles.alignLeft]}>IBAN: </Text>
            </View>
            <View style={[styles.col80]}>
              <Text style={[styles.alignLeft]}>
                {companyDetails?.data?.bankIban || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer]}>
            <View style={[styles.col20]}>
              <Text style={[styles.alignLeft]}>SWIFT Code: </Text>
            </View>
            <View style={[styles.col80]}>
              <Text style={[styles.alignLeft]}>
                {companyDetails?.data?.bankSwiftCode || ""}
              </Text>
            </View>
          </View>

          {/* End of content */}
        </View>

        {/* Footer */}
        {footerComponent(1)}
      </Page>

      {/* Page 2 */}
      <Page size="A4" style={styles.pageContractAgreement} wrap={false}>
        {/* Header */}
        {headerComponent()}

        {/* Page Content */}
        <View style={styles.contentContractAgreement}>
          <View style={[styles.gridContainer, styles.mb15]}>
            <Text style={[styles.boldNewTable]}>Description of treatment</Text>
          </View>

          {parsedHtml?.treatmentDefinition &&
          parsedHtml?.treatmentDefinition?.length > 0 ? (
            <View>
              {parsedHtml?.treatmentDefinition?.map((htmlTag, mainIndex) => {
                if (htmlTag?.tag === undefined) {
                  return (
                    <View style={[styles.mb8]} key={mainIndex}>
                      <Text>{""}</Text>
                    </View>
                  );
                }
                if (htmlTag?.tag === "span") {
                  let newText = htmlTag?.text.replace(/&nbsp;|\t/g, " ");

                  return (
                    <View style={[styles.mb4]} key={mainIndex}>
                      <Text>{newText || ""}</Text>
                    </View>
                  );
                }
                if (htmlTag?.tag === "strong") {
                  let newText = htmlTag?.text.replace(/&nbsp;|\t/g, " ");

                  return (
                    <View
                      style={[styles.mb4, styles.boldNewTable]}
                      key={mainIndex}
                    >
                      <Text>{newText || ""}</Text>
                    </View>
                  );
                } else if (htmlTag?.tag === "ul") {
                  const regex =
                    /<li class=\"ql-align-justify\"><span style=\"background-color: transparent;\">(.*?)<\/span><\/li>|<li>(.*?)<\/li>|/g;
                  const matches = [...htmlTag?.text.matchAll(regex)].map(
                    (match) => match[1]
                  );
                  return (
                    <View style={[styles.mb10]} key={mainIndex}>
                      {matches &&
                        matches?.length > 0 &&
                        matches?.map((text, index) => {
                          if (text) {
                            let newText = text.replace(/&nbsp;|\t/g, " ");
                            return (
                              <View style={[styles.gridContainer]} key={index}>
                                <Image
                                  source={BulletPointPng}
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    backgroundSize: "cover",
                                  }}
                                />

                                <Text style={[styles.mb4]}>{newText}</Text>
                              </View>
                            );
                          } else return <Text key={index}>{""}</Text>;
                        })}
                    </View>
                  );
                } else if (htmlTag?.tag === "ol") {
                  const regex =
                    /<li class=\"ql-align-justify\"><span style=\"background-color: transparent;\">(.*?)<\/span><\/li>|<li>(.*?)<\/li>|/g;
                  const matches = [...htmlTag?.text.matchAll(regex)].map(
                    (match) => match[1]
                  );
                  return (
                    <View style={[styles.mb10]} key={mainIndex}>
                      {matches &&
                        matches?.length > 0 &&
                        matches?.map((text, index) => {
                          if (text) {
                            let newText = text.replace(/&nbsp;|\t/g, "");
                            return (
                              <View
                                style={[styles.gridContainer, styles.mb4]}
                                key={index}
                              >
                                <Text>{`${index + 1}. ${newText}`}</Text>
                              </View>
                            );
                          } else {
                            return <Text key={index}>{""}</Text>;
                          }
                        })}
                    </View>
                  );
                } else return <View key={mainIndex}></View>;
              })}
            </View>
          ) : (
            <View></View>
          )}

          {/*    <View style={[styles.gridContainer, styles.mb15]}>
            <Text>{surveyDetail?.treatmentDefinition || ""}</Text>
          </View> */}

          {parsedHtml?.specialMentions &&
          parsedHtml?.specialMentions?.length > 0 ? (
            <View>
              {parsedHtml?.specialMentions?.map((htmlTag, mainIndex) => {
                if (htmlTag?.tag === "p") {
                  let htmlSplit = htmlTag?.text.split("<br>");

                  return (
                    <View key={mainIndex}>
                      {htmlSplit.map((text, index) => {
                        if (text) {
                          return (
                            <View style={[styles.mb4]} key={index}>
                              <Text>{text}</Text>
                            </View>
                          );
                        } else
                          return (
                            <View key={index}>
                              <Text>{""}</Text>
                            </View>
                          );
                      })}
                    </View>
                  );
                } else if (htmlTag?.tag === "ul") {
                  const regex = /<li>(.*?)<\/li>/g;
                  const matches = [...htmlTag?.text.matchAll(regex)].map(
                    (match) => match[1]
                  );
                  return (
                    <View style={[styles.mb10]} key={mainIndex}>
                      {matches &&
                        matches?.length > 0 &&
                        matches?.map((text, index) => (
                          <View style={[styles.gridContainer]} key={index}>
                            <Image
                              source={BulletPointPng}
                              style={{
                                width: "10px",
                                height: "10px",
                                backgroundSize: "cover",
                              }}
                            />

                            <Text style={[styles.mb4]}>{text}</Text>
                          </View>
                        ))}
                    </View>
                  );
                } else if (htmlTag?.tag === "ol") {
                  const regex = /<li>(.*?)<\/li>/g;
                  const matches = [...htmlTag?.text.matchAll(regex)].map(
                    (match) => match[1]
                  );
                  return (
                    <View style={[styles.mb10]} key={mainIndex}>
                      {matches &&
                        matches?.length > 0 &&
                        matches?.map((text, index) => (
                          <View
                            style={[styles.gridContainer, styles.mb4]}
                            key={index}
                          >
                            <Text>{`${index + 1}. ${text}`}</Text>
                          </View>
                        ))}
                    </View>
                  );
                } else return <View key={mainIndex}></View>;
              })}
            </View>
          ) : (
            <View></View>
          )}

          {/*    <View style={[styles.gridContainer, styles.mb15]}>
            <Text>{surveyDetail?.specialMentions || ""}</Text>
          </View> */}
        </View>

        {/* Footer */}
        {footerComponent(2)}
      </Page>

      {/* Page 3 */}
      <Page size="A4" style={styles.pageContractAgreement} wrap={false}>
        {/* Header */}
        {headerComponent()}

        {/* Page Content */}
        <View style={styles.contentContractAgreement}>
          <View style={[styles.gridContainer, styles.mb15]}>
            <Text style={[styles.boldNewTable, styles.alignCenter]}>
              GENERAL TERMS AND CONDITIONS
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.boldNewTable, styles.alignLeft]}>General</Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              Acceptance of this Agreement includes acceptance of the Particular
              Conditions and General Terms and conditions, unless otherwise
              agreed in advance by the Service Provider and the Customer in
              writing.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <Text>
              Based on the nature of your requested Services, some clauses may
              not be applicable to your contract (like equipment,
              termination...)
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.boldNewTable, styles.alignLeft]}>
              Services
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (i) The proposed treatment only applies to the pest species named
              in the Particular Condition.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (ii) The Service Provider only uses the Pest Management
              agents/products approved by the Department of Primary Industry
              and/or the Mauritius Pesticides and Veterinary Medicines Authority
              (DCCB) and registered for use within the Mauritian Territories.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (iii) The Services shall be conducted during normal working hours
              (08.30 am - 4.30 pm on weekdays) and 08.30 am - 2 pm on Saturdays.
              The rate shall be reviewed and adjusted shall the Customer request
              that the Services be carried out outside the normal hours.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (iv) whilst reasonable care will be taken by the Service Provider
              representative, this agreement does not provide for any repairs or
              whatsoever during the installation of equipment where applicable
              or the proper execution of the Services.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (v) In the event the Customer request for any additional scope of
              Services after approval of this agreement, a new quotation shall
              be emitted subsequently
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <Text>
              (vi) Either party may request a review or adjustment of the
              Services during the agreement and such adjustment shall only be
              done upon written agreement by both parties
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.boldNewTable, styles.alignLeft]}>
              Terms of Payment
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (i) Unless specific written arrangements have been provided or
              mentioned in Particular Conditions , the full contract price shall
              be due and recoverable by Service Provider on commencement of
              works and/or the installation of the Equipment.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (ii) Shall the Service Provider not be able to perform the
              Services due to the unavailability of the Customer for any
              particular month(s) for whatsoever reasons, the payment for that
              same period shall still be paid by the Customer and cannot be
              transferred to a later period.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (iii) If during the course of the program it is found that
              structural or environmental conditions prevent us from performing
              any sections of the Management Program, as quoted, then the terms
              of the Service Period or the cost of your investment may need to
              be reviewed.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (iv) If any amount to be paid by the Customer is due for a period
              of 30 days, the Service Provider reserves the right to give the
              Customer a written notice to terminate this Agreement. Unless the
              unpaid amount is paid prior to the expiration date of the said
              notice.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (v) Monthly interest may be charged on all overdue accounts
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (vi) The Customer has no right to withhold payment of any amounts
              due under this Agreement by reason of any claim or counterclaim it
              may have or alleges to have against the Service Provider or
              otherwise which is not related to the Services.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <Text>
              (vii) In the event of recovery through an attorney-at-law, all
              legal charges and fees shall be payable by the Customer
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.boldNewTable, styles.alignLeft]}>
              Completion
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (i) The Customer shall provide access to the Service Provider’s
              representatives to perform the Services at any reasonable time or
              as specified in the Particular conditions and to provide all
              necessary facilities that the Service Provider may reasonably
              require to perform the Services.
            </Text>
          </View>
        </View>

        {/* Footer */}
        {footerComponent(3)}
      </Page>

      {/* Page 4 */}
      <Page size="A4" style={styles.pageContractAgreement} wrap={false}>
        {/* Header */}
        {headerComponent()}

        {/* Page Content */}
        <View style={styles.contentContractAgreement}>
          <View style={[styles.gridContainer, styles.mb15]}>
            <Text>
              (ii) The Service Provider shall take all reasonable precautions
              but shall not be held liable should staining of timbers, fabrics,
              wall coverings, floor coverings or any other articles occur or
              damage to furniture or other fixtures and fittings which must be
              moved by the Service Provider in order to carry out the Services.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.boldNewTable, styles.alignLeft]}>
              The Equipment
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (i) All equipment being placed at the Customer’s premises belongs
              to the Service Provider
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (ii) The Customer agrees not to sell, transfer, or dispose of the
              Service Provider's equipment and must insure against any damage or
              injury caused by the equipment's use.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (iii)The Customer must notify the Service Provider of any claims
              or damages concerning the equipment and adhere to legal and safety
              requirements related to its use.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (iv) The Service Provider will conduct necessary repairs on the
              equipment, provided the Customer fulfills their obligations and
              the damages aren't due to intentional acts or negligence by the
              Customer.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (v) The Customer should permit authorized individuals from the
              Service Provider to inspect the equipment at their premises. If
              the Service Provider cannot retrieve its equipment after the
              agreement ends, the Customer may be charged for unreturned items.
              The Service Provider isn't liable for restoring the premises after
              equipment removal.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <Text>
              (vi) If, upon termination of this Agreement, the Service Provider
              is not authorized or able to retake possession of its property,
              the Service Provider has the right to invoice the Customer for
              repair or replacement costs of damaged equipment caused by the
              Customer, payable immediately.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.boldNewTable, styles.alignLeft]}>
              Health and Safety
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (i) The Customer shall take all reasonable steps to ensure that
              the advice and instructions given by the Service Provider to
              protect the health and safety of people and animals living or
              working on the Premises during and after the provision of the
              Services are strictly respected.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (ii) The Service Provider shall take no responsibility, nor
              warranty expressed or implied, for any damage or consequential
              losses that may occur as the result of past, current or future
              pest activity if there is any negligence from the Customer or the
              Customer ignores any advice from the Service Provider.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (iii) The Customer shall insure against injury (including death)
              to any person from the negligence of the Customer.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (iv) The Customer shall cover all food items and all food utensils
              prior to a treatment, as directed.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (v) The Customer shall avoid contact with treated surfaces until
              the insecticide has dried. This could take two (2) to twenty-four
              (24) hours in some cases.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (vi) On external treatments close all doors and windows during the
              treatment and keep closed until the odor has cleared. This could
              take three (3) to twenty-four (24) hours in some cases. This is
              done to avoid any odor entering the building.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <Text>
              (vii) The Customer shall advise the Service Provider and its
              employees of any hazards that may be encountered whilst working on
              the Premises.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.boldNewTable, styles.alignLeft]}>
              Term/Termination
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (i) This Agreement shall commence on the Contract period”
              mentioned in the Particular Conditions and shall continue for one
              (1) year (the “Initial Term”), unless otherwise stated under “The
              Term” in the Particular Conditions
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (ii) This Agreement shall automatically renew annually, after the
              termination of the Initial Term, and every year thereafter unless
              either party provides thirty (30) days written notice of
              termination prior to the end of the Initial Term or subsequent
              term thereafter.
            </Text>
          </View>
        </View>

        {/* Footer */}
        {footerComponent(4)}
      </Page>

      {/* Page 5 */}
      <Page size="A4" style={styles.pageContractAgreement} wrap={false}>
        {/* Header */}
        {headerComponent()}

        {/* Page Content */}
        <View style={styles.contentContractAgreement}>
          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (iii) Either party may at any time, by written notice, terminate
              this Agreement immediately if the other party commits a material
              breach of any term of this Agreement and such breach (if capable
              of remedy) is not remedied within the time limit stipulated in the
              formal notice requiring that the breach be remedied, without
              prejudice to any other remedy it may have at law.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              (iv) Upon termination of this present Agreement for whatsoever
              reason, the Service Provider shall immediately cease providing the
              Services.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <Text>
              (v) If the Customer purports to terminate this Agreement before
              the expiration of the Term or if the Service Provider terminates
              this Agreement in the circumstances set out in clause (iii), then
              the Customer shall pay to the Service Provider upon receipt of the
              invoice, by way of liquidation and agreed damages, all costs due
              until the end.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.boldNewTable, styles.alignLeft]}>
              Amendment to Terms of the Agreement
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <Text>
              No amendment, variation, extension, exclusion or cancellation of
              this present Agreement shall be binding unless confirmed in
              writing by an authorized agent of both parties, unless terminated
              in accordance with these terms and conditions.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.boldNewTable, styles.alignLeft]}>
              Severability
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <Text>
              If any term or provision of the Agreement is or becomes illegal,
              invalid, or unenforceable in whole or in part, the legality,
              validity, and enforceability of the remaining provisions of the
              Agreement shall not be affected or impaired."
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.boldNewTable, styles.alignLeft]}>
              Entire Agreement and enforceability of terms and conditions
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb10]}>
            <Text>
              This Agreement constitutes the entire agreement between the
              parties. The Customer shall not rely on any statement warranty of
              another entity other than the Service Provider which might be
              inconsistent with these terms and conditions, unless confirmed by
              the Service Provider in writing.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <Text>
              These terms and conditions, along with any other mutually
              agreed-upon written conditions, will take precedence over any
              conflicting terms that may arise."
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.boldNewTable, styles.alignLeft]}>
              Data Privacy Policy
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <Text>
              The Customer grants permission to the Service Provider to collect
              and process their email address for future use. The Customer
              agrees that the Service Provider send promotional and marketing
              materials as well as newsletters via email to the email address
              provided by the Customer. The Customer retains the right to refuse
              or withdraw this authorization at any time by notifying the
              Service Provider using the contact details specified in this
              Agreement.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.boldNewTable, styles.alignLeft]}>Notices</Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.alignLeft, styles.italic]}>
              Giving Notice:
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <Text style={[styles.alignLeft]}>
              Any notice or communication must be in written form. It should be
              delivered by hand, sent via prepaid registered mail, or registered
              mail. Notices must be addressed to the concerned party.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.alignLeft, styles.italic]}>
              Receiving notice:
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <Text style={[styles.alignLeft]}>
              Any notice or other communication under this Agreement shall only
              be effective upon receipt, either upon delivery by hand or if by
              post will be deemed served on the fourth (4th) business day after
              the date of posting, or if sent by facsimile will be deemed to
              have been served on the business day following the date of
              transmission.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <Text style={[styles.alignLeft]}>
              It's crucial to adhere to these guidelines when providing or
              receiving notices or communications within the agreement, ensuring
              that the proper methods are followed to guarantee their
              effectiveness and acknowledgment by the concerned parties.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.boldNewTable, styles.alignLeft]}>
              Force Majeure
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <Text style={[styles.alignLeft]}>
              Neither party will be liable for any failure or delay in
              performing its obligations where such failure or delay results
              from any cause beyond that party's reasonable control.
            </Text>
          </View>
        </View>

        {/* Footer */}
        {footerComponent(5)}
      </Page>

      {/* Page 6 */}
      <Page size="A4" style={styles.pageContractAgreement} wrap={false}>
        {/* Header */}
        {headerComponent()}

        {/* Page Content */}
        <View style={styles.contentContractAgreement}>
          <View style={[styles.gridContainer, styles.mb4]}>
            <Text style={[styles.boldNewTable, styles.alignLeft]}>
              Applicable Law
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb40]}>
            <Text style={[styles.alignLeft]}>
              The terms and conditions and the contract shall be governed by and
              construed in accordance with the laws of the Republic of
              Mauritius.
            </Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <Text
              style={{
                marginTop: "5px",
                borderBottom: "0.5px solid black",
              }}
            ></Text>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <View style={[styles.col6, styles.mb15]}>
              <Text>
                Agreement no.{" "}
                <span
                  style={{
                    width: "100px",
                    borderBottom: "1px solid #dcdcdc",
                    display: "inline-block",
                    height: "12px",
                  }}
                >
                  {surveyDetail?.id}
                </span>
              </Text>
            </View>
            <View style={[styles.col6, styles.mb15]}>
              <Text>
                {`Date. ${
                  surveyDetail?.signatureDate?.seconds
                    ? moment(surveyDetail?.signatureDate.toDate()).format(
                        "DD/MM/YYYY"
                      )
                    : surveyDetail?.signatureDate
                    ? surveyDetail?.signatureDate
                    : ""
                }`}
                {/* <span
                  style={{
                    width: "100px",
                    borderBottom: "1px solid #dcdcdc",
                    display: "inline-block",
                    height: "12px",
                  }}
                >
                  {surveyDetail?.dateCreated
                    ? moment(surveyDetail?.dateCreated.toDate()).format(
                        "DD/MM/YYYY"
                      )
                    : ""}
                </span> */}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <View style={[styles.col6, styles.mb15]}>
              <Text>On Behalf of:</Text>
            </View>
            <View style={[styles.col6, styles.mb15]}>
              <Text>On Behalf of: {companyDetails?.data?.name || ""}</Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb8]}>
            <View style={[styles.col6, styles.pr4]}>
              <View style={[styles.gridContainer]}>
                <View style={styles.col20}>
                  <Text style={[styles.alignLeft]}>Full name: </Text>
                </View>
                <View style={styles.col80}>
                  <Text
                    style={[
                      styles.alignLeft,
                      surveyDetail?.clientSigName
                        ? styles.underline
                        : styles.underlineSimulation,
                      styles.pr4,
                    ]}
                  >
                    {surveyDetail?.clientSigName || ""}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.col6]}>
              <View style={[styles.gridContainer]}>
                <View style={styles.col20}>
                  <Text style={[styles.alignLeft]}>Full name: </Text>
                </View>
                <View style={styles.col80}>
                  <Text
                    style={[
                      styles.alignLeft,
                      surveyDetail?.preparedByName
                        ? styles.underline
                        : styles.underlineSimulation,
                    ]}
                  >
                    {surveyDetail?.preparedByName || ""}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mt8]} wrap={true}>
            <View
              style={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text style={styles.h5}>{`Client: ${
                surveyDetail?.clientSigName || ""
              }`}</Text>

              {clientSignatureImg ? (
                <Image
                  source={clientSignatureImg}
                  style={{
                    width: 60,
                    height: 40,
                    backgroundSize: "cover",
                  }}
                />
              ) : (
                <View></View>
              )}
            </View>

            <View
              style={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text style={styles.h5}>{`Prepared By: ${
                surveyDetail?.preparedByName || ""
              }`}</Text>

              {preparedBySignatureImg ? (
                <Image
                  source={preparedBySignatureImg}
                  style={{
                    width: 60,
                    height: 40,
                    backgroundSize: "cover",
                  }}
                />
              ) : (
                <View></View>
              )}
            </View>
          </View>
        </View>

        {/* Footer */}
        {footerComponent(6)}
      </Page>
    </Document>
  );
}
