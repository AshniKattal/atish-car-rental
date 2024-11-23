import { Suspense, lazy, useEffect } from "react";
import { Navigate, useRoutes, useLocation } from "react-router-dom";
// layouts
import DashboardLayout from "../layouts/dashboard";
import LogoOnlyLayout from "../layouts/LogoOnlyLayout";
// guards
import GuestGuard from "../guards/GuestGuard";
import AdminGuard from "../guards/AdminGuard";
// components
import LoadingScreen from "../components/LoadingScreen";
// hooks
import useAuth from "../hooks/useAuth";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { selectSnackbar } from "../features/snackbarSlice";
import RestrictedOnlyAdmin from "../guards/RestrictedOnlyAdmin";

// import Home from "src/pages/home/Home";

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense
      fallback={<LoadingScreen isDashboard={pathname.includes("/dashboard")} />}
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router({ ownerTemplate }) {
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const snackbar = useSelector(selectSnackbar);

  useEffect(() => {
    // snackbar to display the error and success messages
    if (snackbar && snackbar.message !== "" && snackbar.variant !== "") {
      let variant = snackbar?.variant;
      enqueueSnackbar(snackbar?.message, { variant });
    }
  }, [snackbar, enqueueSnackbar]);

  return useRoutes([
    {
      path: "auth",
      children: [
        {
          path: "login",
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: "register",
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        { path: "login-unprotected", element: <Login /> },
        { path: "register-unprotected", element: <Register /> },
        { path: "reset-password", element: <ResetPassword /> },
        { path: "verify", element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: "dashboard",
      element: (
        <AdminGuard>
          <DashboardLayout />
        </AdminGuard>
      ),
      children: [
        {
          element: (
            <Navigate
              to={
                user &&
                user.id !== "" &&
                (user.role === "super-admin" ||
                  user.role === "Admin" ||
                  user.role === "Secretary" ||
                  user.role === "SalePerson" ||
                  user.role === "client")
                  ? "/dashboard/app1"
                  : "" /* PATH_AFTER_LOGIN */
              }
              replace
            />
          ),
          index: true,
        },
        /*  {
          path: "app",
          element: (
            <AdminGuard>
              <GeneralApp />
            </AdminGuard>
          ),
        }, */
        {
          path: "app1",
          element: (
            <AdminGuard>
              <GeneralApp1 />
            </AdminGuard>
          ),
        },
        /*  {
          path: "docsurvey",
          element: (
            <AdminGuard>
              <ClientSurveyDetail />
            </AdminGuard>
          ),
        },
        {
          path: "document",
          element: (
            <AdminGuard>
              <DocumentIndex />
            </AdminGuard>
          ),
        }, */
        /* {
          path: "deletedDocuments",
          element: (
            <AdminGuard>
              <DeletedDocumentIndex />
            </AdminGuard>
          ),
        }, */
        /* {
          path: "mra-unfiscalised-documents",
          element: (
            <AdminGuard>
              <MRAUnfiscalisedDocumentIndex />
            </AdminGuard>
          ),
        },
        {
          path: "invoice",
          element: (
            <AdminGuard>
              <InvoiceIndex />
            </AdminGuard>
          ),
        }, */

        /* {
          path: "inventory",
          element: (
            <AdminGuard>
              <InventoryIndex />
            </AdminGuard>
          ),
        }, */
        {
          path: "payment",
          element: (
            <AdminGuard>
              <PaymentIndex />
            </AdminGuard>
          ),
        },
        /* {
          path: "expense",
          element: (
            <AdminGuard>
              <ExpenseIndex />
            </AdminGuard>
          ),
        }, */
        /* {
          path: "converted-proforma",
          element: (
            <AdminGuard>
              <ConvertedProformaIndex />
            </AdminGuard>
          ),
        }, */
        {
          path: "report",
          element: (
            <AdminGuard>
              <ReportIndex />
            </AdminGuard>
          ),
        },
        /*  {
          path: "calendar",
          element: (
            <AdminGuard>
              <CalendarIndex />
            </AdminGuard>
          ),
        }, */
        {
          path: "company",
          element: (
            <AdminGuard>
              <CompanyDetail />
            </AdminGuard>
          ),
        },
        {
          path: "client",
          element: (
            <AdminGuard>
              <ClientDetail />
            </AdminGuard>
          ),
        },
        {
          path: "bankStatementConversion",
          element: (
            <AdminGuard>
              <BankStatementConversionDetail />
            </AdminGuard>
          ),
        },
        {
          path: "my-account-admin",
          element: (
            <AdminGuard>
              <UserAccount />
            </AdminGuard>
          ),
        },

        {
          path: "booking-vehicles",
          element: (
            <AdminGuard>
              <BookingVehiclesList />
            </AdminGuard>
          ),
        },

        {
          path: "vehicles",
          element: (
            <AdminGuard>
              <VehicleDetail />
            </AdminGuard>
          ),
        },

        {
          path: "contracts",
          element: (
            <AdminGuard>
              <ContractDetail />
            </AdminGuard>
          ),
        },

        /*  {
          path: "bugsbegone-checkbox-management",
          element: (
            <AdminGuard>
              <BugsBeGoneCustomCheckboxManagementDetail />
            </AdminGuard>
          ),
        }, */

        {
          path: "administrators",
          element: (
            <AdminGuard>
              <AdminDetail />
            </AdminGuard>
          ),
        },
        {
          path: "superadministrators",
          element: (
            <RestrictedOnlyAdmin>
              <SuperAdminDetail />
            </RestrictedOnlyAdmin>
          ),
        },
      ],
    },

    // Main Routes
    {
      path: "*",
      element: <LogoOnlyLayout />,
      children: [
        /* {
          path: "home",
          element: <Home />,
        }, */
        {
          path: "privacy-policy",
          element: <PrivacyPolicy />,
        },
        { path: "500", element: <Page500 /> },
        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: "/",
      element: (
        <Suspense fallback={<></>}>
          <MainLayout />
        </Suspense>
      ),
      children: [
        {
          element:
            process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH === "carrentalatish" &&
            user?.id ? (
              <HomeCarRental />
            ) : ownerTemplate === process.env.REACT_APP_OWNER_SLARKS &&
              user?.id ? (
              <Navigate to="/dashboard/app1" />
            ) : ownerTemplate === process.env.REACT_APP_OWNER_SLARKS ? (
              <Home />
            ) : process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH ===
              "carrentalatish" ? (
              <HomeCarRental />
            ) : (
              ""
            ),
          index: true,
        },
        {
          path: "service-detail",
          element: <EcommerceProductDetailsServices />,
        },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

// IMPORT COMPONENTS
const MainLayout = Loadable(lazy(() => import("../layouts/main")));
// Authentication
const Login = Loadable(lazy(() => import("../pages/auth/Login")));
const Register = Loadable(lazy(() => import("../pages/auth/Register")));
const Home = Loadable(lazy(() => import("../pages/home/Home")));
const PrivacyPolicy = Loadable(lazy(() => import("../pages/PrivacyPolicy")));
const ResetPassword = Loadable(
  lazy(() => import("../pages/auth/ResetPassword"))
);
const VerifyCode = Loadable(lazy(() => import("../pages/auth/VerifyCode")));
// Dashboard
/* const GeneralApp = Loadable(
  lazy(() => import("../pages/dashboard/GeneralApp"))
); */
const GeneralApp1 = Loadable(
  lazy(() => import("../pages/dashboard/GeneralApp1"))
);
const ClientSurveyDetail = Loadable(
  lazy(() => import("../pages/dashboard/client-survey/ClientSurveyDetail"))
);
const DocumentIndex = Loadable(
  lazy(() => import("../pages/dashboard/document/DocumentIndex"))
);
const DeletedDocumentIndex = Loadable(
  lazy(() => import("../pages/dashboard/deleted-document/DeletedDocumentIndex"))
);
const MRAUnfiscalisedDocumentIndex = Loadable(
  lazy(() =>
    import(
      "../pages/dashboard/mra-unfiscalised-document/MRAUnfiscalisedDocumentIndex"
    )
  )
);
const InvoiceIndex = Loadable(
  lazy(() => import("../pages/dashboard/invoice/InvoiceIndex"))
);
const InventoryIndex = Loadable(
  lazy(() => import("../pages/dashboard/inventory/InventoryIndex"))
);
const PaymentIndex = Loadable(
  lazy(() => import("../pages/dashboard/payment/PaymentIndex"))
);
const ExpenseIndex = Loadable(
  lazy(() => import("../pages/dashboard/expense/ExpenseIndex"))
);
const ConvertedProformaIndex = Loadable(
  lazy(() =>
    import("../pages/dashboard/converted-proforma/ConvertedProformaIndex")
  )
);
const ReportIndex = Loadable(
  lazy(() => import("../pages/dashboard/report/ReportIndex"))
);
const CalendarIndex = Loadable(
  lazy(() => import("../pages/dashboard/calendar/CalendarIndex"))
);
const CompanyDetail = Loadable(
  lazy(() => import("../pages/dashboard/manage-company/CompanyDetail"))
);
const ClientDetail = Loadable(
  lazy(() => import("../pages/dashboard/manage-client/ClientDetail"))
);
const BankStatementConversionDetail = Loadable(
  lazy(() =>
    import(
      "../pages/dashboard/bankStatementConversion/BankStatementConversionDetail"
    )
  )
);
const AdminDetail = Loadable(
  lazy(() => import("../pages/dashboard/manage-admin/AdminDetail"))
);
const SuperAdminDetail = Loadable(
  lazy(() => import("../pages/dashboard/manage-super-admin/SuperAdminDetail"))
);
const UserAccount = Loadable(
  lazy(() => import("../pages/dashboard/UserAccount"))
);
const Page500 = Loadable(lazy(() => import("../pages/Page500")));
const NotFound = Loadable(lazy(() => import("../pages/Page404")));

// car rental atish project
const HomeCarRental = Loadable(
  lazy(() => import("../pages/car-rental-atish/car-rental/HomeCarRental"))
);
const EcommerceProductDetailsServices = Loadable(
  lazy(() =>
    import("../pages/dashboard/ecommerce/EcommerceProductDetailsServices")
  )
);
const VehicleDetail = Loadable(
  lazy(() =>
    import("src/pages/car-rental-atish/car-rental/vehicle-detail/VehicleDetail")
  )
);
const ContractDetail = Loadable(
  lazy(() =>
    import(
      "src/pages/car-rental-atish/car-rental/contract-detail/ContractDetail"
    )
  )
);
const BookingVehiclesList = Loadable(
  lazy(() =>
    import("src/pages/car-rental-atish/car-rental/booking/BookingVehiclesList")
  )
);

// bugs be gone project
const BugsBeGoneCustomCheckboxManagementDetail = Loadable(
  lazy(() =>
    import(
      "src/pages/dashboard/bugsBeGone-custom-checkbox-management/BugsBeGoneCustomCheckboxManagementDetail"
    )
  )
);
