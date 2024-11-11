import { combineReducers } from "redux";
// import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// slices
import snackbarReducer from "../features/snackbarSlice";
import globalReducer from "../features/globalSlice";
import companyReducer from "../features/companySlice";
import adminReducer from "../features/adminSlice";
import profileReducer from "../features/profileSlice";
import memberReducer from "../features/memberSlice";
import invoiceSectionReducer from "../features/invoiceSectionSlice";
import paymentSectionReducer from "../features/paymentSectionSlice";
import reportSectionReducer from "../features/reportSectionSlice";
import documentReducer from "../features/documentSlice";
import templateReducer from "../features/templateSlice";
import carRentalReducer from "./slices/carRental";
import serviceReducer from "./slices/service";
import registerReducer from "../features/registerSlice";
import bookingReducer from "../features/bookingSlice";

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  whitelist: [],
};

const rootReducer = combineReducers({
  snackbar: snackbarReducer,
  global: globalReducer,
  company: companyReducer,
  admin: adminReducer,
  profile: profileReducer,
  member: memberReducer,
  invoiceSection: invoiceSectionReducer,
  paymentSection: paymentSectionReducer,
  reportSection: reportSectionReducer,
  document: documentReducer,
  template: templateReducer,
  carRental: carRentalReducer,
  service: serviceReducer,
  register: registerReducer,
  booking: bookingReducer,
  /*  company: persistReducer(
    { key: "company", storage, keyPrefix: "redux-" },
    companyReducer
  ),
  admin: persistReducer(
    { key: "admin", storage, keyPrefix: "redux-" },
    adminReducer
  ),
  profile: persistReducer(
    { key: "profile", storage, keyPrefix: "redux-" },
    profileReducer
  ),
  member: persistReducer(
    { key: "member", storage, keyPrefix: "redux-" },
    memberReducer
  ),
  invoiceSection: persistReducer(
    { key: "invoiceSection", storage, keyPrefix: "redux-" },
    invoiceSectionReducer
  ),
  paymentSection: persistReducer(
    { key: "paymentSection", storage, keyPrefix: "redux-" },
    paymentSectionReducer
  ),
  reportSection: persistReducer(
    { key: "reportSection", storage, keyPrefix: "redux-" },
    reportSectionReducer
  ),
  document: persistReducer(
    { key: "document", storage, keyPrefix: "redux-" },
    documentReducer
  ), */
});

export { rootPersistConfig, rootReducer };
