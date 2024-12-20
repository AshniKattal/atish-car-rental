// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = "/auth";
const ROOTS_DASHBOARD = "/dashboard";

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, "/login"),
  loginUnprotected: path(ROOTS_AUTH, "/login-unprotected"),
  register: path(ROOTS_AUTH, "/register"),
  registerUnprotected: path(ROOTS_AUTH, "/register-unprotected"),
  resetPassword: path(ROOTS_AUTH, "/reset-password"),
  verify: path(ROOTS_AUTH, "/verify"),
};

export const PATH_PAGE = {
  home: "/home",
  privacyPolicy: "/privacy-policy",
  comingSoon: "/coming-soon",
  maintenance: "/maintenance",
  pricing: "/pricing",
  payment: "/payment",
  about: "/about-us",
  contact: "/contact-us",
  faqs: "/faqs",
  page404: "/404",
  page500: "/500",
  components: "/components",
  serviceDetail: "/service-detail",
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    // app: path(ROOTS_DASHBOARD, "/app"),
    app1: path(ROOTS_DASHBOARD, "/app1"),
    clientSurvey: path(ROOTS_DASHBOARD, "/docsurvey"),
    document: path(ROOTS_DASHBOARD, "/document"),
    deletedDocuments: path(ROOTS_DASHBOARD, "/deletedDocuments"),
    contracts: path(ROOTS_DASHBOARD, "/contracts"),
    mraUnfiscalisedDocuments: path(
      ROOTS_DASHBOARD,
      "/mra-unfiscalised-documents"
    ),
    bankStatementConversion: path(ROOTS_DASHBOARD, "/bankStatementConversion"),
    invoice: path(ROOTS_DASHBOARD, "/invoice"),
    inventory: path(ROOTS_DASHBOARD, "/inventory"),
    payment: path(ROOTS_DASHBOARD, "/payment"),
    expense: path(ROOTS_DASHBOARD, "/expense"),
    convertedProforma: path(ROOTS_DASHBOARD, "/converted-proforma"),
    report: path(ROOTS_DASHBOARD, "/report"),
    calendar: path(ROOTS_DASHBOARD, "/calendar"),
    company: path(ROOTS_DASHBOARD, "/company"),
    client: path(ROOTS_DASHBOARD, "/client"),
    admin: path(ROOTS_DASHBOARD, "/admin"),
    admin_account: path(ROOTS_DASHBOARD, "/my-account-admin"),
    administrators: path(ROOTS_DASHBOARD, "/administrators"),
    superadministrators: path(ROOTS_DASHBOARD, "/superadministrators"),
    ecommerce: path(ROOTS_DASHBOARD, "/ecommerce"),
    analytics: path(ROOTS_DASHBOARD, "/analytics"),
    banking: path(ROOTS_DASHBOARD, "/banking"),
    booking: path(ROOTS_DASHBOARD, "/booking"),
    bugsBeGoneCheckboxManagement: path(
      ROOTS_DASHBOARD,
      "/bugsbegone-checkbox-management"
    ),
  },
  customCarRental: {
    booking: path(ROOTS_DASHBOARD, "/booking-vehicles"),
    vehicles: path(ROOTS_DASHBOARD, "/vehicles"),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, "/mail"),
    all: path(ROOTS_DASHBOARD, "/mail/all"),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, "/chat"),
    new: path(ROOTS_DASHBOARD, "/chat/new"),
    conversation: path(ROOTS_DASHBOARD, "/chat/:conversationKey"),
  },
  calendar: path(ROOTS_DASHBOARD, "/calendar"),
  kanban: path(ROOTS_DASHBOARD, "/kanban"),
  user: {
    root: path(ROOTS_DASHBOARD, "/user"),
    profile: path(ROOTS_DASHBOARD, "/user/profile"),
    cards: path(ROOTS_DASHBOARD, "/user/cards"),
    list: path(ROOTS_DASHBOARD, "/user/list"),
    newUser: path(ROOTS_DASHBOARD, "/user/new"),
    editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, "/user/account"),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, "/e-commerce"),
    shop: path(ROOTS_DASHBOARD, "/e-commerce/shop"),
    product: path(ROOTS_DASHBOARD, "/e-commerce/product/:name"),
    productById: path(
      ROOTS_DASHBOARD,
      "/e-commerce/product/nike-air-force-1-ndestrukt"
    ),
    list: path(ROOTS_DASHBOARD, "/e-commerce/list"),
    newProduct: path(ROOTS_DASHBOARD, "/e-commerce/product/new"),
    editById: path(
      ROOTS_DASHBOARD,
      "/e-commerce/product/nike-blazer-low-77-vintage/edit"
    ),
    checkout: path(ROOTS_DASHBOARD, "/e-commerce/checkout"),
    invoice: path(ROOTS_DASHBOARD, "/e-commerce/invoice"),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, "/blog"),
    posts: path(ROOTS_DASHBOARD, "/blog/posts"),
    post: path(ROOTS_DASHBOARD, "/blog/post/:title"),
    postById: path(
      ROOTS_DASHBOARD,
      "/blog/post/apply-these-7-secret-techniques-to-improve-event"
    ),
    newPost: path(ROOTS_DASHBOARD, "/blog/new-post"),
  },
};

export const PATH_DOCS = "https://docs-minimals.vercel.app/introduction";
