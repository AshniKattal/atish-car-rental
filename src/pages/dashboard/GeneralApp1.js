import { m } from "framer-motion";
import { MotionContainer, varFade } from "../../components/animate";
// @mui
import {
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
// hooks
// import useAuth from "../../hooks/useAuth";
import useSettings from "../../hooks/useSettings";
// components
import Page from "../../components/Page";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "../../routes/paths";

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
import "./GeneralApp.css";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CarRentalAtishCustomDashboardSections from "./car-rental-atish-custom-dashboard-sections/CarRentalAtishCustomDashboardSections";
import BugsBeGoneCustomCheckboxManagementSections from "./bugsBeGone-custom-checkbox-management/BugsBeGoneCustomCheckboxManagementSections";
import { selectTemplate } from "src/features/templateSlice";
/* import {
  handleViewDownloadAtish,
  handleViewDownloadAtishRecto,
} from "src/components/core-functions/SelectionCoreFunctions"; */

// ----------------------------------------------------------------------

export default function GeneralApp1() {
  const { template } = useSelector(selectTemplate);

  const { user } = useAuth();

  const { themeStretch } = useSettings();

  const { enqueueSnackbar } = useSnackbar();

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
        .doc(companyId)
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
      <MotionContainer>
        <Container maxWidth={themeStretch ? false : "xl"}>
          {/*  <Button
            variant="contained"
            color="primary"
            onClick={() => handleViewDownloadAtish("view")}
          >
            Generate
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleViewDownloadAtishRecto("view")}
          >
            Generate recto
          </Button> */}

          {/** document creation grid container */}
          <Grid container spacing={3}>
            {user &&
            user?.role !== "client" &&
            template !== process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH ? (
              <Grid item xs={12} md={6}>
                <m.div variants={varFade().inUp} className="cardDiv">
                  <Card className="cardContainer">
                    <Stack spacing={2}>
                      <Typography variant="subtitle1">
                        Document (Create, update, delete or view)
                      </Typography>

                      <Grid container spacing={1}>
                        {documents &&
                          documents?.length > 0 &&
                          documents?.map((document, index) => (
                            <Grid
                              item
                              xs={6}
                              sm={4}
                              md={
                                document?.id === "purchase_order" ||
                                document?.id === "credit_note" ||
                                document?.id === "debit_note" ||
                                document?.id === "cash_transaction"
                                  ? 4
                                  : 3
                              }
                              key={index}
                              align="center"
                            >
                              <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                onClick={() => {
                                  dispatch(
                                    setDocumentType({
                                      ...document,
                                    })
                                  );
                                  navigate(PATH_DASHBOARD.general.document);
                                }}
                              >
                                {document?.title || ""}
                              </Button>
                            </Grid>
                          ))}

                        {user?.a_comp &&
                        user?.a_comp?.length > 0 &&
                        user?.a_comp?.filter(
                          (comp) =>
                            comp.id ===
                            process.env.REACT_APP_CUSTOM_BUGSBEGONE_ID
                        )?.length > 0 ? (
                          <Grid item xs={6} sm={4} md={4} align="center">
                            <Button
                              variant="outlined"
                              color="primary"
                              fullWidth
                              onClick={() => {
                                /* dispatch(
                                  setDocumentType({
                                    ...document,
                                  })
                                ); */
                                navigate(PATH_DASHBOARD.general.clientSurvey);
                              }}
                            >
                              Bugs Be Gone
                            </Button>
                          </Grid>
                        ) : (
                          <></>
                        )}
                      </Grid>
                    </Stack>
                  </Card>
                </m.div>
              </Grid>
            ) : (
              ""
            )}

            {user &&
            user?.role !== "client" &&
            template !== process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH ? (
              <Grid item xs={12} md={3}>
                <m.div variants={varFade().inUp} className="cardDiv">
                  <Card
                    className="cardContainer clickable"
                    onClick={() => {
                      navigate(PATH_DASHBOARD.general.deletedDocuments);
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography variant="h6">Deleted documents</Typography>

                      <Stack
                        spacing={1}
                        direction={"row"}
                        alignItems={"flex-start"}
                      >
                        <PlayCircleOutlineIcon />
                        <Typography variant="body1">
                          View recently deleted documents
                        </Typography>
                      </Stack>
                    </Stack>
                  </Card>
                </m.div>
              </Grid>
            ) : (
              <></>
            )}

            {user &&
            user?.role !== "client" &&
            template !== process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH ? (
              <Grid item xs={12} md={3}>
                <m.div variants={varFade().inUp} className="cardDiv">
                  <Card
                    className="cardContainer clickable"
                    onClick={() => {
                      navigate(PATH_DASHBOARD.general.convertedProforma);
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography variant="h6">Converted proforma</Typography>

                      <Stack
                        spacing={1}
                        direction={"row"}
                        alignItems={"flex-start"}
                      >
                        <PlayCircleOutlineIcon />
                        <Typography variant="body1">
                          View recently converted proforma
                        </Typography>
                      </Stack>
                    </Stack>
                  </Card>
                </m.div>
              </Grid>
            ) : (
              <></>
            )}

            {user?.a_comp &&
            user?.a_comp?.length > 0 &&
            user?.a_comp.filter(
              (comp) => comp?.id === process.env.REACT_APP_RHL_ID
            )?.length > 0 ? (
              <CarRentalAtishCustomDashboardSections />
            ) : (
              <></>
            )}

            {user?.a_comp &&
            user?.a_comp?.length > 0 &&
            user?.a_comp?.filter(
              (comp) => comp.id === process.env.REACT_APP_CUSTOM_BUGSBEGONE_ID
            )?.length > 0 ? (
              <BugsBeGoneCustomCheckboxManagementSections />
            ) : (
              <></>
            )}

            {user?.a_comp &&
            user?.a_comp?.length > 0 &&
            user?.a_comp?.filter(
              (comp) =>
                comp?.id === process.env.REACT_APP_CUSTOM_SMART_PROMOTE_ID
            )?.length > 0 ? (
              <Grid item xs={12} md={4}>
                <m.div variants={varFade().inUp} className="cardDiv">
                  <Card
                    className="cardContainer clickable"
                    onClick={() => {
                      navigate(PATH_DASHBOARD.general.inventory);
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography variant="h6">Inventory</Typography>

                      <Stack
                        spacing={1}
                        direction={"row"}
                        alignItems={"flex-start"}
                      >
                        <PlayCircleOutlineIcon />
                        <Typography variant="body1">
                          Manage your stock
                        </Typography>
                      </Stack>
                    </Stack>
                  </Card>
                </m.div>
              </Grid>
            ) : (
              <></>
            )}

            {user &&
            user?.role !== "client" &&
            template !== process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH ? (
              <Grid
                item
                xs={12}
                md={
                  user?.role === "super-admin" ||
                  user?.a_comp?.filter(
                    (comp) =>
                      comp?.id === process.env.REACT_APP_CUSTOM_SMART_PROMOTE_ID
                  )?.length > 0
                    ? 4
                    : 6
                }
              >
                <m.div variants={varFade().inUp} className="cardDiv">
                  <Card
                    className="cardContainer clickable"
                    onClick={() => {
                      navigate(PATH_DASHBOARD.general.payment);
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography variant="h6">Add payment</Typography>

                      <Stack
                        spacing={1}
                        direction={"row"}
                        alignItems={"flex-start"}
                      >
                        <PlayCircleOutlineIcon />
                        <Typography variant="body1">
                          Make full/partial payment
                        </Typography>
                      </Stack>

                      <Stack
                        spacing={1}
                        direction={"row"}
                        alignItems={"flex-start"}
                      >
                        <PlayCircleOutlineIcon />
                        <Typography variant="body1">
                          Upload receipt of payment
                        </Typography>
                      </Stack>
                    </Stack>
                  </Card>
                </m.div>
              </Grid>
            ) : (
              <></>
            )}

            {user &&
            user?.role !== "client" &&
            template !== process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH ? (
              <Grid
                item
                xs={12}
                md={
                  user?.role === "super-admin" ||
                  user?.a_comp?.filter(
                    (comp) =>
                      comp?.id === process.env.REACT_APP_CUSTOM_SMART_PROMOTE_ID
                  )?.length > 0
                    ? 4
                    : 6
                }
              >
                <m.div variants={varFade().inUp} className="cardDiv">
                  <Card
                    className="cardContainer clickable"
                    onClick={() => {
                      navigate(PATH_DASHBOARD.general.expense);
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography variant="h6">Add Expense</Typography>

                      <Stack
                        spacing={1}
                        direction={"row"}
                        alignItems={"flex-start"}
                      >
                        <PlayCircleOutlineIcon />
                        <Typography variant="body1">
                          Make expense amount
                        </Typography>
                      </Stack>

                      <Stack
                        spacing={1}
                        direction={"row"}
                        alignItems={"flex-start"}
                      >
                        <PlayCircleOutlineIcon />
                        <Typography variant="body1">
                          Upload receipt of expense
                        </Typography>
                      </Stack>
                    </Stack>
                  </Card>
                </m.div>
              </Grid>
            ) : (
              <></>
            )}

            {user &&
            user?.role !== "client" &&
            template !== process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH ? (
              <Grid item xs={12} md={8}>
                <m.div variants={varFade().inUp} className="cardDiv">
                  <Card
                    className="cardContainer clickable"
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
                    <Stack spacing={2}>
                      <Typography variant="h6">Report</Typography>

                      <Stack
                        spacing={1}
                        direction={"row"}
                        alignItems={"flex-start"}
                      >
                        <PlayCircleOutlineIcon />
                        <Typography variant="body1">
                          Get Statement of account
                        </Typography>
                      </Stack>

                      <Stack
                        spacing={1}
                        direction={"row"}
                        alignItems={"flex-start"}
                      >
                        <PlayCircleOutlineIcon />
                        <Typography variant="body1">
                          Total sales, vat amount
                        </Typography>
                      </Stack>
                    </Stack>
                  </Card>
                </m.div>
              </Grid>
            ) : (
              <></>
            )}

            {user &&
            user?.role !== "client" &&
            template !== process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH ? (
              <Grid item xs={12} md={4}>
                <m.div variants={varFade().inUp} className="cardDiv">
                  <Card
                    className="cardContainer clickable"
                    onClick={() => navigate(PATH_DASHBOARD.general.calendar)}
                  >
                    <Stack spacing={2}>
                      <Typography variant="h6">Calendar</Typography>

                      <Stack
                        spacing={1}
                        direction={"row"}
                        alignItems={"flex-start"}
                      >
                        <PlayCircleOutlineIcon />
                        <Typography variant="body1">Plan your work</Typography>
                      </Stack>
                    </Stack>
                  </Card>
                </m.div>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </Container>
      </MotionContainer>
    </Page>
  );
}
