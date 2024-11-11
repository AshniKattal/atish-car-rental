import { createSlice } from "@reduxjs/toolkit";

export const documentSlice = createSlice({
  name: "document",
  initialState: {
    documents: [
      {
        id: "quotation",
        title: "Quotation",
        access: "viewQuotation",
        viewPermission: "viewQuotation",
        createPermission: "createQuotation",
        updatePermission: "updateQuotation",
        deletePermission: "deleteQuotation",
      },
      {
        id: "invoice",
        title: "Invoice",
        access: "viewInvoice",
        viewPermission: "viewInvoice",
        createPermission: "createInvoice",
        updatePermission: "updateInvoice",
        deletePermission: "deleteInvoice",
      },
      {
        id: "vat_invoice",
        title: "VAT Invoice",
        access: "viewVatInvoice",
        viewPermission: "viewVatInvoice",
        createPermission: "createVatInvoice",
        updatePermission: "updateVatInvoice",
        deletePermission: "deleteVatInvoice",
      },
      {
        id: "proforma",
        title: "Proforma",
        access: "viewProforma",
        viewPermission: "viewProforma",
        createPermission: "createProforma",
        updatePermission: "updateProforma",
        deletePermission: "deleteProforma",
      },
      {
        id: "purchase_order",
        title: "Purchase order",
        access: "viewPurchaseOrder",
        viewPermission: "viewPurchaseOrder",
        createPermission: "createPurchaseOrder",
        updatePermission: "updatePurchaseOrder",
        deletePermission: "deletePurchaseOrder",
      },
      {
        id: "credit_note",
        title: "Credit note",
        access: "viewCreditNote",
        viewPermission: "viewCreditNote",
        createPermission: "createCreditNote",
        updatePermission: "updateCreditNote",
        deletePermission: "deleteCreditNote",
      },
      {
        id: "debit_note",
        title: "Debit note",
        access: "viewDebitNote",
        viewPermission: "viewDebitNote",
        createPermission: "createDebitNote",
        updatePermission: "updateDebitNote",
        deletePermission: "deleteDebitNote",
      },
      {
        id: "cash_transaction",
        title: "Cash transaction",
        access: "viewCashTransaction",
        viewPermission: "viewCashTransaction",
        createPermission: "createCashTransaction",
        updatePermission: "updateCashTransaction",
        deletePermission: "deleteCashTransaction",
      },
    ],
    documentType: undefined,
    companyDetails: null,
    companyIdSelected: undefined,
    clientDocumentIdSelected: undefined,
    clientDocumentObjectSelected: null,
    clientList: undefined,
    updateDocumentData: undefined,
    paymentDocType: "vat_invoice",
    reportDocType: "vat_invoice",
    deletedDocType: "vat_invoice",
    convertedProformaDocType: null,
  },
  reducers: {
    setDocumentType: (state, action) => {
      state.documentType = action.payload;
    },
    setCompanyDetails: (state, action) => {
      state.companyDetails = action.payload;
    },
    setCompanyIdSelected: (state, action) => {
      state.companyIdSelected = action.payload;
    },
    setClientDocumentIdSelected: (state, action) => {
      state.clientDocumentIdSelected = action.payload;
    },
    setClientDocumentObjectSelected: (state, action) => {
      state.clientDocumentObjectSelected = action.payload;
    },
    setClientList: (state, action) => {
      state.clientList = action.payload;
    },
    setUpdateDocumentData: (state, action) => {
      state.updateDocumentData = action.payload;
    },
    setPaymentDocType: (state, action) => {
      state.paymentDocType = action.payload;
    },
    setReportDocType: (state, action) => {
      state.reportDocType = action.payload;
    },
    setDeletedDocType: (state, action) => {
      state.deletedDocType = action.payload;
    },
    setConvertedProformaDocType: (state, action) => {
      state.convertedProformaDocType = action.payload;
    },
    resetDocument: (state) => {
      state.documents = undefined;
      state.documentType = undefined;
      state.companyDetails = null;
      state.companyIdSelected = undefined;
      state.clientDocumentIdSelected = undefined;
      state.clientDocumentObjectSelected = null;
      state.clientList = undefined;
      state.updateDocumentData = undefined;
      state.paymentDocType = "vat_invoice";
      state.reportDocType = "vat_invoice";
      state.deletedDocType = "vat_invoice";
      state.convertedProformaDocType = null;
    },
  },
});

export const {
  setDocumentType,
  setCompanyDetails,
  setCompanyIdSelected,
  setClientDocumentIdSelected,
  setClientDocumentObjectSelected,
  setClientList,
  setUpdateDocumentData,
  setPaymentDocType,
  setReportDocType,
  setDeletedDocType,
  setConvertedProformaDocType,
  resetDocument,
} = documentSlice.actions;

export const selectDocument = (state) => state.document;

export default documentSlice.reducer;
