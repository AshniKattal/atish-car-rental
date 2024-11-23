// @mui
import { Box, Card, Container, Grid, Typography } from "@mui/material";
// hooks
// import useAuth from "../../hooks/useAuth";
import useSettings from "../../hooks/useSettings";
// components
import Page from "../../components/Page";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "../../routes/paths";
import useResponsive from "../../hooks/useResponsive";
import { useDispatch, useSelector } from "react-redux";
import {
  setDocumentType,
  setCompanyDetails,
  setClientList,
  selectDocument,
  setCompanyIdSelected,
} from "../../features/documentSlice";
import { useEffect, useRef } from "react";
import db from "src/firebase";
import { useSnackbar } from "notistack";
import { setLoading } from "../../features/globalSlice";
import useAuth from "../../hooks/useAuth";
import { selectCompanyList } from "../../features/companySlice";

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();

  const { themeStretch } = useSettings();

  const { enqueueSnackbar } = useSnackbar();

  const isDesktop = useResponsive("up", "md");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { companyList, companyIdSelected } = useSelector(selectCompanyList);

  const { documents } = useSelector(selectDocument);

  const initCompanyDetailRef = useRef();

  useEffect(() => {
    if (!companyIdSelected) {
      initCompanyDetailRef.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initCompanyDetails() {
    if (
      companyList &&
      companyList?.length === 1 &&
      user &&
      user?.role !== "client"
    ) {
      dispatch(setLoading(true));
      let companyId = companyList[0].id;
      dispatch(setCompanyIdSelected(companyId));
      dispatch(setCompanyDetails({ ...companyList[0] }));

      // get list of clients for this company
      await db
        .collection("company")
        .doc(process.env.REACT_APP_COMPANY_ID)
        .collection("client")
        .orderBy("name", "asc")
        .get()
        .then((queryDocs) => {
          if (queryDocs?.docs?.length > 0) {
            let arr = [];
            queryDocs?.docs.forEach((doc) => {
              arr.push({
                id: doc?.id,
                name: doc?.data()?.name,
                data: { ...doc?.data() },
              });
            });
            dispatch(setClientList(arr));
            dispatch(setLoading(false));
          } else {
            dispatch(setClientList([]));
            dispatch(setLoading(false));
            enqueueSnackbar(`No clients retrieved`, {
              variant: "warning",
            });
          }
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while fetching list of clients: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  }

  initCompanyDetailRef.current = initCompanyDetails;

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : "xl"}>
        {/** document creation grid container */}
        <Grid
          container
          spacing={3}
          justifyContent="center"
          //alignItems={"center"}
        >
          {documents &&
            documents?.length > 0 &&
            documents?.map((document, index) => (
              <Grid item xs={6} sm={4} md={3} key={index} align="center">
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (
                      !user?.permissions[document.access] &&
                      !user?.permissions[document.createPermission] &&
                      !user?.permissions[document.updatePermission]
                    ) {
                      enqueueSnackbar(
                        "You have no access to this section. Please call an admin.",
                        { variant: "error" }
                      );
                    } else {
                      dispatch(
                        setDocumentType({
                          ...document,
                        })
                      );
                      navigate(PATH_DASHBOARD.general.document);
                    }
                  }}
                >
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h4">
                      {document?.title || ""}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
        </Grid>
        <br />
        <hr />
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} align="center">
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1.5,
                cursor: "pointer",
                width: isDesktop ? "40%" : undefined,
              }}
              onClick={() => {
                /*  if (!user.permissions.accessPaymentExpense) {
                  enqueueSnackbar(
                    "You have no access to this section. Please call an admin.",
                    { variant: "error" }
                  );
                } else { */
                navigate(PATH_DASHBOARD.general.deletedDocuments);
                //  }
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4">Deleted documents</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <br />
        <hr />
        <br />
        {/* <Grid container spacing={3}>
          <Grid item xs={12} md={12} align="center">
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1.5,
                cursor: "pointer",
                width: isDesktop ? "40%" : undefined,
              }}
              onClick={() => {
                navigate(PATH_DASHBOARD.general.mraUnfiscalisedDocuments);
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4">MRA unfiscalised documents</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <br />
        <hr />
        <br /> */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} align="center">
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1.5,
                cursor: "pointer",
                width: isDesktop ? "40%" : undefined,
              }}
              onClick={() => {
                if (!user.permissions.accessPaymentExpense) {
                  enqueueSnackbar(
                    "You have no access to this section. Please call an admin.",
                    { variant: "error" }
                  );
                } else {
                  navigate(PATH_DASHBOARD.general.payment);
                }
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4">Payment/Expense</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <br />
        <hr />
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} align="center">
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1.5,
                cursor: "pointer",
                width: isDesktop ? "40%" : undefined,
              }}
              onClick={() => {
                if (!user.permissions.accessReport) {
                  enqueueSnackbar(
                    "You have no access to this section. Please call an admin.",
                    { variant: "error" }
                  );
                } else {
                  navigate(PATH_DASHBOARD.general.report);
                }
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4">Report</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <br />
        <hr />
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} align="center">
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1.5,
                cursor: "pointer",
                width: isDesktop ? "40%" : undefined,
              }}
              onClick={() => navigate(PATH_DASHBOARD.general.calendar)}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4">Calendar</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
