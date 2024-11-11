// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
//MUI icons
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import GroupIcon from "@mui/icons-material/Group";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

// ----------------------------------------------------------------------

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    type: ["super-admin", "Admin", "Secretary", "SalePerson"],
    subheader: "general",
    items: [
      {
        title: "Home",
        path: PATH_DASHBOARD.general.app1,
        icon: <HomeIcon />,
        type: ["super-admin", "Admin", "Secretary", "SalePerson"],
        permissions: "viewAllSectionChk",
      },
      /* {
        title: "BugsBeGone Docs",
        path: PATH_DASHBOARD.general.clientSurvey,
        icon: <InsertDriveFileIcon />,
        type: ["super-admin", "Admin", "Secretary", "SalePerson"],
        permissions: "viewAllClientSurveyChk",
      }, */
      {
        title: "Bank Statement Conversion",
        path: PATH_DASHBOARD.general.bankStatementConversion,
        icon: <AccountBalanceIcon />,
        type: ["super-admin", "Admin", "Secretary", "SalePerson"],
        permissions: "uploadBankStatementChk",
      },
      {
        title: "Company",
        path: PATH_DASHBOARD.general.company,
        icon: <LocationCityIcon />,
        type: ["super-admin", "Admin", "Secretary", "SalePerson"],
        permissions: "viewCompChk",
      },
      {
        title: "Client",
        path: PATH_DASHBOARD.general.client,
        icon: <GroupIcon />,
        type: ["super-admin", "Admin", "Secretary", "SalePerson"],
        permissions: "viewClientChk",
      },
      {
        title: "administrators",
        path: PATH_DASHBOARD.general.administrators,
        icon: <AdminPanelSettingsIcon />,
        type: ["super-admin", "Admin", "Secretary", "SalePerson"],
        permissions: "viewAdminChk",
      },
      {
        title: "super admins",
        path: PATH_DASHBOARD.general.superadministrators,
        icon: <AdminPanelSettingsIcon />,
        type: ["super-admin"],
        permissions: "viewAdminChk",
      },
    ],
  },
];

export default navConfig;
