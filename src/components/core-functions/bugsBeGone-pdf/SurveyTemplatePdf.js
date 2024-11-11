import { Page, View, Text, Image, Document } from "@react-pdf/renderer";
//
import styles from "../PdfStyle";

import CheckBoxCheckedImg from "../bugsBeGone-images/CheckBoxCheckedImg.png";
import CheckBoxUnCheckedImg from "../bugsBeGone-images/CheckBoxUnCheckedImg.png";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import moment from "moment";

// ----------------------------------------------------------------------

export default function SurveyTemplatePdf({
  companyDetails,
  surveyDetail,
  defaultCheckBoxOptions,
  logo,
  preparedBySignatureImg,
  clientSignatureImg,
}) {
  const controlOfCheckboxList1 = defaultCheckBoxOptions?.controlOfCheckboxList1;

  const controlOfCheckboxList2 = defaultCheckBoxOptions?.controlOfCheckboxList2;

  const controlOfCheckboxList3 = defaultCheckBoxOptions?.controlOfCheckboxList3;

  const controlOfCheckboxList4 = defaultCheckBoxOptions?.controlOfCheckboxList4;

  const infestationCheckboxList =
    defaultCheckBoxOptions?.infestationCheckboxList;

  const controlVectorCheckboxList1 =
    defaultCheckBoxOptions?.controlVectorCheckboxList1;

  const controlVectorCheckboxList2 =
    defaultCheckBoxOptions?.controlVectorCheckboxList2;

  const locationTreatedCheckboxList1 =
    defaultCheckBoxOptions?.locationTreatedCheckboxList1;

  const locationTreatedCheckboxList2 =
    defaultCheckBoxOptions?.locationTreatedCheckboxList2;

  const locationTreatedCheckboxList3 =
    defaultCheckBoxOptions?.locationTreatedCheckboxList3;

  const recommendationCheckboxList =
    defaultCheckBoxOptions?.recommendationCheckboxList;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        <View
          style={[
            styles.gridContainer,
            styles.gridContainerMainTitle,
            styles.mb8,
          ]}
        >
          <View style={styles.alignCenter}>
            <Text style={styles.h4}>SURVEY</Text>
          </View>
        </View>

        <View style={[styles.gridContainer]}>
          <View style={styles.col6}>
            {logo ? (
              <Image
                source={logo}
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundSize: "cover",
                  paddingRight: "10px",
                }}
              />
            ) : (
              <View></View>
            )}
          </View>

          <View style={styles.col6}>
            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>Email: </span>
              {companyDetails?.data?.email || ""}
            </Text>

            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>Tel: </span>
              {`${companyDetails?.data?.mobileNumber || ""} ${
                companyDetails?.data?.phoneNumber
                  ? `/ ${companyDetails?.data?.phoneNumber || ""}`
                  : ""
              }`}
            </Text>

            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>Address: </span>
              {companyDetails?.data?.address || ""}
            </Text>
          </View>
        </View>

        <View style={styles.underline}></View>

        <View style={[styles.gridContainer, styles.mt8]}>
          <View style={styles.col8}>
            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>Customer: </span>
              {surveyDetail?.customerName || ""}
            </Text>

            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>Address: </span>
              {surveyDetail?.address || ""}
            </Text>

            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>Email: </span>
              {surveyDetail?.email || ""}
            </Text>
          </View>

          <View style={styles.col4}>
            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>Date: </span>
              {surveyDetail?.dateCreated
                ? moment(surveyDetail?.dateCreated.toDate()).format(
                    "DD/MM/YYYY"
                  )
                : ""}
            </Text>

            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>Time: </span>
              {surveyDetail?.time || ""}
            </Text>

            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>Phone: </span>
              {surveyDetail?.phone || ""}
            </Text>
          </View>
        </View>

        <View style={styles.underline}></View>

        <View style={[styles.gridContainer, styles.mt8, styles.mb8]}>
          <Text style={styles.h5}>Control of:</Text>
        </View>

        <View style={[styles.gridContainer, styles.mb4]}>
          {controlOfCheckboxList1 &&
            controlOfCheckboxList1?.length > 0 &&
            controlOfCheckboxList1?.map((control, index) => (
              <View style={styles.col16Custom} key={index}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  {surveyDetail?.controlOf &&
                  surveyDetail?.controlOf[control?.name] === true ? (
                    <Image
                      source={CheckBoxCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  ) : (
                    <Image
                      source={CheckBoxUnCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  )}
                  <Text sx={{ marginRight: "10px" }}>
                    {control?.title || ""}
                  </Text>
                </View>
              </View>
            ))}
        </View>
        <View style={[styles.gridContainer, styles.mb4]}>
          {controlOfCheckboxList2 &&
            controlOfCheckboxList2?.length > 0 &&
            controlOfCheckboxList2?.map((control, index) => (
              <View style={styles.col16Custom} key={index}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  {surveyDetail?.controlOf &&
                  surveyDetail?.controlOf[control?.name] === true ? (
                    <Image
                      source={CheckBoxCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  ) : (
                    <Image
                      source={CheckBoxUnCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  )}
                  <Text sx={{ marginRight: "10px" }}>
                    {control?.title || ""}
                  </Text>
                </View>
              </View>
            ))}
        </View>
        <View style={[styles.gridContainer, styles.mb4]}>
          {controlOfCheckboxList3 &&
            controlOfCheckboxList3?.length > 0 &&
            controlOfCheckboxList3?.map((control, index) => (
              <View style={styles.col16Custom} key={index}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  {surveyDetail?.controlOf &&
                  surveyDetail?.controlOf[control?.name] === true ? (
                    <Image
                      source={CheckBoxCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  ) : (
                    <Image
                      source={CheckBoxUnCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  )}
                  <Text sx={{ marginRight: "10px" }}>
                    {control?.title || ""}
                  </Text>
                </View>
              </View>
            ))}
        </View>
        <View style={[styles.gridContainer, styles.mb4]}>
          {controlOfCheckboxList4 &&
            controlOfCheckboxList4?.length > 0 &&
            controlOfCheckboxList4?.map((control, index) => (
              <View style={styles.col16Custom} key={index}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  {surveyDetail?.controlOf &&
                  surveyDetail?.controlOf[control?.name] === true ? (
                    <Image
                      source={CheckBoxCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  ) : (
                    <Image
                      source={CheckBoxUnCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  )}
                  <Text sx={{ marginRight: "10px" }}>
                    {control?.title || ""}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        <View style={[styles.gridContainer, styles.mb8]}>
          <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
            <span style={styles.body3Bold}>Other: </span>
            {surveyDetail?.otherControlOf || ""}
          </Text>
        </View>

        <View style={styles.underline}></View>

        <View style={[styles.gridContainer, styles.mb8, styles.mt8]}>
          <Text style={styles.h5}>Infestation:</Text>
        </View>

        <View style={[styles.gridContainer, styles.mb4]}>
          {infestationCheckboxList &&
            infestationCheckboxList?.length > 0 &&
            infestationCheckboxList?.map((control, index) => (
              <View style={styles.col16Custom} key={index}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  {surveyDetail?.infestation &&
                  surveyDetail?.infestation[control?.name] === true ? (
                    <Image
                      source={CheckBoxCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  ) : (
                    <Image
                      source={CheckBoxUnCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  )}
                  <Text sx={{ marginRight: "10px" }}>
                    {control?.title || ""}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        <View style={[styles.gridContainer, styles.mb8]}>
          <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
            <span style={styles.body3Bold}>Infestation note: </span>
            {surveyDetail?.infestationNote || ""}
          </Text>
        </View>

        <View style={styles.underline}></View>

        <View style={[styles.gridContainer, styles.mb4, styles.mt8]}>
          <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
            <span style={styles.body3Bold}>Type of Cockroaches: </span>
            {surveyDetail?.typeOfCockroach || ""}
          </Text>
        </View>

        <View style={[styles.gridContainer, styles.mb4]}>
          <View style={styles.col6}>
            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>Type of Termite: </span>
              {surveyDetail?.typeOfTermite || ""}
            </Text>
          </View>
          <View style={styles.col30}>
            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>(Qty) Bait: </span>
              {surveyDetail?.typeOfTermiteBait || ""}
            </Text>
          </View>
          <View style={styles.col30}>
            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>(Rs): </span>
              {surveyDetail?.typeOfTermiteTotal || ""}
            </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb8]}>
          <View style={styles.col30}>
            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>Sol Treatment (m2): </span>
              {surveyDetail?.solTreatmentmeter || ""}
            </Text>
          </View>
          <View style={styles.col30}>
            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>(ft): </span>
              {surveyDetail?.solTreatmentFt || ""}
            </Text>
          </View>
          <View style={styles.col30}>
            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>(Unit Price): </span>
              {surveyDetail?.solTreatmentUnitPrice || ""}
            </Text>
          </View>
          <View style={styles.col30}>
            <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
              <span style={styles.body3Bold}>Total: </span>
              {surveyDetail?.solTreatmentTotal || ""}
            </Text>
          </View>
        </View>

        <View style={styles.underline}></View>

        <View style={[styles.gridContainer, styles.mb8, styles.mt8]}>
          <Text style={styles.h5}>Control Vector Service Request:</Text>
        </View>

        <View style={[styles.gridContainer, styles.mb4]}>
          {controlVectorCheckboxList1 &&
            controlVectorCheckboxList1?.length > 0 &&
            controlVectorCheckboxList1?.map((control, index) => (
              <View style={styles.col16Custom} key={index}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  {surveyDetail?.controlVector &&
                  surveyDetail?.controlVector[control?.name] === true ? (
                    <Image
                      source={CheckBoxCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  ) : (
                    <Image
                      source={CheckBoxUnCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  )}
                  <Text sx={{ marginRight: "10px" }}>
                    {control?.title || ""}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        <View style={[styles.gridContainer, styles.mb4]}>
          {controlVectorCheckboxList2 &&
            controlVectorCheckboxList2?.length > 0 &&
            controlVectorCheckboxList2?.map((control, index) => (
              <View style={styles.col16Custom} key={index}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  {surveyDetail?.controlVector &&
                  surveyDetail?.controlVector[control?.name] === true ? (
                    <Image
                      source={CheckBoxCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  ) : (
                    <Image
                      source={CheckBoxUnCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  )}
                  <Text sx={{ marginRight: "10px" }}>
                    {control?.title || ""}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        <View style={styles.underline}></View>

        <View style={[styles.gridContainer, styles.mb8, styles.mt8]}>
          <Text style={styles.h5}>Location Treated:</Text>
        </View>

        <View style={[styles.gridContainer, styles.mb4]}>
          {locationTreatedCheckboxList1 &&
            locationTreatedCheckboxList1?.length > 0 &&
            locationTreatedCheckboxList1?.map((control, index) => (
              <View style={styles.col16Custom} key={index}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  {surveyDetail?.locationTreated &&
                  surveyDetail?.locationTreated[control?.name] === true ? (
                    <Image
                      source={CheckBoxCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  ) : (
                    <Image
                      source={CheckBoxUnCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  )}
                  <Text sx={{ marginRight: "10px" }}>
                    {control?.title || ""}
                  </Text>
                </View>
              </View>
            ))}
        </View>
        <View style={[styles.gridContainer, styles.mb4]}>
          {locationTreatedCheckboxList2 &&
            locationTreatedCheckboxList2?.length > 0 &&
            locationTreatedCheckboxList2?.map((control, index) => (
              <View style={styles.col16Custom} key={index}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  {surveyDetail?.locationTreated &&
                  surveyDetail?.locationTreated[control?.name] === true ? (
                    <Image
                      source={CheckBoxCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  ) : (
                    <Image
                      source={CheckBoxUnCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  )}
                  <Text sx={{ marginRight: "10px" }}>
                    {control?.title || ""}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        <View style={[styles.gridContainer, styles.mb4]}>
          {locationTreatedCheckboxList3 &&
            locationTreatedCheckboxList3?.length > 0 &&
            locationTreatedCheckboxList3?.map((control, index) => (
              <View style={styles.col16Custom} key={index}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  {surveyDetail?.locationTreated &&
                  surveyDetail?.locationTreated[control?.name] === true ? (
                    <Image
                      source={CheckBoxCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  ) : (
                    <Image
                      source={CheckBoxUnCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  )}
                  <Text sx={{ marginRight: "10px" }}>
                    {control?.title || ""}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        <View style={[styles.gridContainer, styles.mb8]}>
          <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
            <span style={styles.body3Bold}>Other: </span>
            {surveyDetail?.otherLocationTreated || ""}
          </Text>
        </View>

        <View style={styles.underline}></View>

        <View style={[styles.gridContainer, styles.mb8, styles.mt8]}>
          <Text style={{ fontSize: "10px", paddingBottom: "2px" }}>
            <span style={styles.body3Bold}>
              Rodent Box (S) 280 (M) 375 Rs:{" "}
            </span>
            {surveyDetail?.rodentBox || ""}
          </Text>
        </View>

        <View style={styles.underline}></View>

        <View style={[styles.gridContainer, styles.mb8, styles.mt8]}>
          <Text style={styles.h5}>Recommendations:</Text>
        </View>

        <View style={[styles.gridContainer, styles.mb4]} wrap={true}>
          {recommendationCheckboxList &&
            recommendationCheckboxList?.length > 0 &&
            recommendationCheckboxList?.map((control, index) => (
              <View style={styles.col16Custom} key={index}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  {surveyDetail?.recommendation &&
                  surveyDetail?.recommendation[control?.name] === true ? (
                    <Image
                      source={CheckBoxCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  ) : (
                    <Image
                      source={CheckBoxUnCheckedImg}
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundSize: "cover",
                      }}
                    />
                  )}
                  <Text sx={{ marginRight: "10px" }}>
                    {control?.title || ""}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        <View style={styles.underline}></View>

        <View
          style={[styles.gridContainer, styles.mb8, styles.mt8]}
          wrap={true}
        >
          <View style={styles.col8}>
            <Text style={{ fontSize: "10px" }}>
              <span style={styles.body3Bold}>
                EVALUATION (How many pieces):{" "}
              </span>
              {surveyDetail?.evaluationPieces || ""}
            </Text>
          </View>
          <View style={styles.col4}>
            <Text style={{ fontSize: "10px" }}>
              <span style={styles.body3Bold}>ESTIMATE (RS): </span>
              {surveyDetail?.estimateAmount || ""}
            </Text>
          </View>
        </View>

        <View style={styles.underline}></View>

        <View style={[styles.gridContainer, styles.mt8]} wrap={true}>
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
                src={preparedBySignatureImg}
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
            <Text style={styles.h5}>{`Client: ${
              surveyDetail?.clientSigName || ""
            }`}</Text>

            {clientSignatureImg ? (
              <Image
                src={clientSignatureImg}
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
      </Page>
    </Document>
  );
}
