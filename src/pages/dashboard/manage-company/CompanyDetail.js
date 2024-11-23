import React, { useState, useEffect, lazy, Suspense, useRef } from "react";
import db from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCompanyList,
  setCompanyList,
} from "../../../features/companySlice";
import { setLoading } from "../../../features/globalSlice";
import { dynamicSort } from "../../../components/core-functions/SelectionCoreFunctions";
import { Container } from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import { useSnackbar } from "notistack";
import useSettings from "src/hooks/useSettings";

const CreateCompanyDialog = lazy(() => import("./CreateCompanyDialog"));
const UpdateCompanyDialog = lazy(() => import("./UpdateCompanyDialog"));
const TableCRUDTemplate = lazy(() =>
  import("../../../components/table/TableCRUDTemplate")
);

const CompanyDetail = () => {
  const { themeStretch } = useSettings();

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { companyList } = useSelector(selectCompanyList);
  const [us_a_companyList, set_us_a_companyList] = useState([]);

  const init_companies_temp = useRef();

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
    vatOrNonVatRegistered: null,
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
    bankIban: "",
    bankSwiftCode: "",
    MRATemplateFlag: null,
    displayMRAFiscalisationButton: false,
    documentTemplate: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");

  const headers = [
    // { id: "list", label: "List" },
    { id: "update", label: "Update" },
    { id: "delete", label: "Delete" },
    { id: "name", label: "Name" },
    { id: "MRATemplateFlag", label: "Apply MRA new template" },
    { id: "displayMRAFiscalisationButton", lable: "Display MRA Send Button" },
    { id: "vatOrNonVatRegistered", label: "VAT/Non-VAT Registered" },
    { id: "vatPercentage", label: "VAT_Percentage" },
    { id: "imageName", label: "Image_Logo" },
    { id: "imageSig", label: "Image_Sig." },
    { id: "stampName", label: "Stamp_Pic" },
    { id: "companyType", label: "Type" },
    // { id: "natureOfBusiness", label: "Nature_Of_Business" },
    // { id: "incorDate", label: "Date_Of_Incorporation" },
    // { id: "payeRegNo", label: "PAYE_Reg_No" },

    { id: "tan", label: "VAT" },
    { id: "brn", label: "BRN" },
    // { id: "nic", label: "NIC" },
    { id: "address", label: "Address" },
    // { id: "country", label: "Country" },
    { id: "contactNumber", label: "Contact_Number" },
    { id: "mobileNumber", label: "Mobile_Number" },
    { id: "email", label: "Email" },
    { id: "beneficiaryName", label: "Beneficiary_Name" },
    { id: "bankName", label: "Bank_Name" },
    { id: "bankAccNo", label: "Bank_Account_No" },
    { id: "bankIban", label: "Bank IBAN" },
    { id: "bankSwiftCode", label: "Bank Swift Code" },
    // { id: 'absenceTariff', label: 'Absence_sum' },
  ];

  useEffect(() => {
    init_companies_temp.current();
  }, []);

  const initializeCompanies = async () => {
    if (user?.id !== "") {
      dispatch(setLoading(true));

      await db
        .collection("company")
        .orderBy("name", "asc")
        .get()
        .then((querySnapshot) => {
          var arr = [];
          var companyListRedux = [];

          if (querySnapshot.docs && querySnapshot.docs.length > 0) {
            querySnapshot.docs.forEach((doc) => {
              /* if (
                (doc.id !== "companyIds" &&
                  doc.id !== process.env.REACT_APP_PROTECTED_COMPANY) ||
                (doc.id !== "companyIds" &&
                  doc.id === process.env.REACT_APP_PROTECTED_COMPANY &&
                  user?.id === process.env.REACT_APP_PROTECTED_USER)
              ) { */
              if (
                (user?.role === "super-admin" ||
                  (user?.a_comp &&
                    user?.a_comp?.length > 0 &&
                    user?.a_comp.find((comp) => comp.id === doc.id))) &&
                doc?.id !== "companyIds"
              ) {
                if (
                  user?.permissions?.viewCompChk?.assignedCompanyId.includes(
                    doc.id
                  )
                ) {
                  arr.push({
                    id: doc?.id,
                    data: doc?.data(),
                    name: doc?.data()?.name || "",
                    MRATemplateFlag: doc?.data()?.MRATemplateFlag
                      ? JSON.stringify(doc?.data()?.MRATemplateFlag)
                      : null,
                    displayMRAFiscalisationButton:
                      doc?.data()?.displayMRAFiscalisationButton || false,
                    vatOrNonVatRegistered: doc?.data()?.vatOrNonVatRegistered
                      ? JSON.stringify(doc?.data()?.vatOrNonVatRegistered)
                      : null,
                    vatPercentage: doc?.data()?.vatPercentage || 0,
                    imageName: doc?.data()?.imageName || "",
                    imageSig: doc?.data()?.imageSig || "",
                    imageUrl: doc?.data()?.imageUrl || "",
                    sigUrl: doc?.data()?.sigUrl || "",
                    stampName: doc?.data()?.stampName || "",
                    stampUrl: doc?.data()?.stampUrl || "",
                    companyType: doc?.data()?.companyType || "",
                    // natureOfBusiness: doc.data().natureOfBusiness,
                    // incorDate: doc.data().incorDate,
                    // payeRegNo: doc.data().payeRegNo,

                    tan: doc?.data()?.tan || "",
                    brn: doc?.data()?.brn || "",
                    // nic: doc.data().nic,
                    address: doc?.data()?.address || "",
                    // country: doc.data().country,
                    contactNumber: doc?.data()?.contactNumber || "",
                    mobileNumber: doc?.data()?.mobileNumber || "",
                    email: doc?.data()?.email || "",
                    // absenceTariff: doc?.data()?.absenceTariff || [],
                    beneficiaryName: doc?.data()?.beneficiaryName || "",
                    bankName: doc?.data()?.bankName || "",
                    bankAccNo: doc?.data()?.bankAccNo || "",
                    bankIban: doc?.data()?.bankIban || "",
                    bankSwiftCode: doc?.data()?.bankSwiftCode || "",
                    documentTemplate: doc?.data()?.documentTemplate || "",
                  });

                  companyListRedux.push({
                    id: doc.id,
                    name: doc.data().name,
                    data: { ...doc.data() },
                  });
                }
              }
            });
            arr.sort(dynamicSort("name"));

            set_us_a_companyList(arr);

            dispatch(setCompanyList(companyListRedux));

            dispatch(setLoading(false));
          } else {
            set_us_a_companyList([]);

            dispatch(setCompanyList([]));

            dispatch(setLoading(false));
          }
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while fetching companies: ${err?.message}`,
            { variant: "error" }
          );
        });
    } else {
      enqueueSnackbar(
        "Your session has been terminated due to greater than 30 minutes of inactivity. Please log in again.",
        { variant: "error" }
      );
    }
  };

  init_companies_temp.current = initializeCompanies;

  const handleCloseDialog = () => {
    setCompanyDetails({
      name: "",
      vatPercentage: 0,
      imageName: "",
      imageSig: "",
      imageUrl: "",
      sigUrl: "",
      stampName: "",
      stampUrl: "",
      companyType: "",
      // natureOfBusiness: "",
      // incorDate: "",
      // payeRegNo: "",
      vatOrNonVatRegistered: null,
      tan: "",
      address: "",
      // country: "",
      email: "",
      contactNumber: "",
      mobileNumber: "",
      brn: "",
      // nic: "",
      // absenceTariff: [],
      beneficiaryName: "",
      bankName: "",
      bankAccNo: "",
      bankIban: "",
      bankSwiftCode: "",
      MRATemplateFlag: null,
      displayMRAFiscalisationButton: false,
      documentTemplate: "",
    });
    setOpenDialog(false);
  };

  const addBtnFunc = () => {
    setDialogType("add");
    setOpenDialog(true);
    setCompanyDetails({
      name: "",
      vatPercentage: 0,
      imageName: "",
      imageSig: "",
      imageUrl: "",
      sigUrl: "",
      stampName: "",
      stampUrl: "",
      companyType: "",
      // natureOfBusiness: "",
      // incorDate: "",
      // payeRegNo: "",
      vatOrNonVatRegistered: null,
      tan: "",
      address: "",
      // country: "",
      email: "",
      contactNumber: "",
      mobileNumber: "",
      brn: "",
      // nic: "",
      // absenceTariff: [],
      beneficiaryName: "",
      bankName: "",
      bankAccNo: "",
      bankIban: "",
      bankSwiftCode: "",
      documentTemplate: "",

      // this flag will allow new MRA template
      MRATemplateFlag: null,
      displayMRAFiscalisationButton: false,
    });
  };

  const updateBtnFunc = (id, data) => {
    setDialogType("update");
    setOpenDialog(true);
    setCompanyDetails({
      id: id,
      name: data?.name || "",
      vatPercentage: data?.vatPercentage || 0,
      MRATemplateFlag: data?.MRATemplateFlag || null,
      displayMRAFiscalisationButton:
        data?.displayMRAFiscalisationButton || false,
      /*  ? JSON.parse(data?.MRATemplateFlag)
        : null, */
      vatOrNonVatRegistered: data?.vatOrNonVatRegistered || null /* 
        ? JSON.parse(data?.vatOrNonVatRegistered)
        : null, */,
      imageName: data?.imageName || "",
      imageSig: data?.imageSig || "",
      imageUrl: data?.imageUrl || "",
      sigUrl: data?.sigUrl || "",
      stampName: data?.stampName || "",
      stampUrl: data?.stampUrl || "",
      companyType: data?.companyType || "",
      // natureOfBusiness: data?.natureOfBusiness,
      // incorDate: data?.incorDate,
      // payeRegNo: data?.payeRegNo,

      tan: data?.tan || "",
      address: data?.address || "",
      // country: data?.country,
      email: data?.email || "",
      contactNumber: data?.contactNumber || "",
      mobileNumber: data?.mobileNumber || "",
      brn: data?.brn || "",
      // nic: data?.nic,
      // absenceTariff: data?.absenceTariff || [],
      beneficiaryName: data?.beneficiaryName || "",
      bankName: data?.bankName || "",
      bankAccNo: data?.bankAccNo || "",
      bankIban: data?.bankIban || "",
      bankSwiftCode: data?.bankSwiftCode || "",
      documentTemplate: data?.documentTemplate || "",
    });
  };

  const deleteBtnFunc = async (id) => {
    dispatch(setLoading(true));

    await db
      .collection("company")
      .doc(id)
      .delete()
      .then(async () => {
        let promiseResult = await new Promise((resolve) => {
          let companyListArr = [...companyList];
          let companyListArrLength = companyListArr.length;
          let idIndex = 0;
          for (let i = 0; i < companyListArrLength; i++) {
            if (companyListArr[i].id === id) {
              idIndex = i;
            }
          }
          companyListArr.splice(idIndex, 1);
          companyListArr.sort(dynamicSort("name"));
          resolve(companyListArr);
        });

        if (promiseResult) {
          await db
            .collection("company")
            .doc("companyIds")
            .set({ companyIdArray: promiseResult }, { merge: true })
            .then(() => {
              initializeCompanies();

              enqueueSnackbar("Row deleted successfully", {
                variant: "success",
              });
              dispatch(setLoading(false));
            })
            .catch((err) => {
              enqueueSnackbar(
                `Error occured while deleting company: ${err?.message}`,
                {
                  variant: "error",
                }
              );
              dispatch(setLoading(false));
            });
        }
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while deleting company: ${err?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  };

  return (
    <Container maxWidth={themeStretch ? false : "xl"}>
      {/*  <div
        style={{
          display: !user?.permissions?.viewCompChk ? "" : "none",
        }}
      >
        <Alert severity="error">
          Sorry, you do not have access to this section. Please contact Admin
          for more info. Thank you.
        </Alert>
      </div>

      <div
        style={{
          display: user?.permissions?.viewCompChk ? "" : "none",
        }}
      > */}
      <Suspense fallback={<p></p>}>
        <TableCRUDTemplate
          type="company"
          headers={headers}
          aCollection={us_a_companyList}
          addBtnDisplay={user?.role === "super-admin" ? true : false}
          addBtnLabel={"Create a company"}
          addBtnFunc={addBtnFunc}
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          emptyColMsg={
            "Sorry, not a single company has been created yet. Please create a company."
          }
          updateBtnDisplay={true}
          deleteBtnDisplay={true}
          updateBtnFunc={updateBtnFunc}
          deleteBtnFunc={deleteBtnFunc}
        />
      </Suspense>

      <div>
        {dialogType && dialogType === "add" ? (
          <Suspense fallback={<p></p>}>
            <CreateCompanyDialog
              openDialog={openDialog}
              handleCloseDialog={handleCloseDialog}
              companyDetails={companyDetails}
              setCompanyDetails={setCompanyDetails}
              initializeCompanies={initializeCompanies}
            />
          </Suspense>
        ) : (
          <Suspense fallback={<p></p>}>
            <UpdateCompanyDialog
              openDialog={openDialog}
              handleCloseDialog={handleCloseDialog}
              companyDetails={companyDetails}
              setCompanyDetails={setCompanyDetails}
              initializeCompanies={initializeCompanies}
            />
          </Suspense>
        )}
      </div>
      {/*       </div> */}
    </Container>
  );
};

export default CompanyDetail;
