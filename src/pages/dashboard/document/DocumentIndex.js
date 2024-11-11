import { lazy, Suspense, useEffect, useRef, useState } from "react";
// @mui
import { Button, Container, Grid, Stack, Typography } from "@mui/material";
// hooks
// import useAuth from "../../hooks/useAuth";
import useSettings from "../../../hooks/useSettings";
// components
import Page from "../../../components/Page";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { setUpdateInvData } from "../../../features/invoiceSectionSlice";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { selectDocument } from "../../../features/documentSlice";
import useAuth from "../../../hooks/useAuth";

const CompanyClientSelection = lazy(() =>
  import("../../../components/selection-component/CompanyClientSelection")
);

const DocumentInputDetails = lazy(() =>
  import("../../../components/document/DocumentInputDetails")
);

const InvViewDetails = lazy(() =>
  import("../../../components/invoice-view-details/InvViewDetails")
);

// ----------------------------------------------------------------------

export default function DocumentIndex() {
  const { user } = useAuth();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { themeStretch } = useSettings();

  const { companyIdSelected, documentType, clientDocumentObjectSelected } =
    useSelector(selectDocument);

  const [us_actionChoice, set_us_actionChoice] = useState(""); //"create", "view"

  const temp_checkDocumentType = useRef();

  useEffect(() => {
    temp_checkDocumentType.current();
  }, []);

  function checkDocumentType() {
    if (!documentType) {
      navigate(PATH_DASHBOARD.general.app1);
    }
  }

  temp_checkDocumentType.current = checkDocumentType;

  return (
    <Page title="Document">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Stack spacing={3} direction="row" alignItems={"center"}>
              <Button
                startIcon={<KeyboardBackspaceIcon />}
                variant="outlined"
                color="primary"
                onClick={() => navigate(PATH_DASHBOARD.general.app1)}
              >
                Back
              </Button>
              <Typography variant="h4">
                {`${documentType?.title || ""} section`}
              </Typography>
            </Stack>
          </Grid>

          <Suspense fallback={<></>}>
            <CompanyClientSelection
              type={"document"}
              actionChoice={us_actionChoice}
            />
          </Suspense>

          <Grid item xs={12} md={12}>
            <Stack spacing={3} direction={"row"}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  dispatch(setUpdateInvData(undefined));
                  set_us_actionChoice("create");
                }}
                disabled={
                  !companyIdSelected ||
                  !clientDocumentObjectSelected ||
                  !user?.permissions[
                    documentType?.createPermission
                  ]?.assignedCompanyId?.includes(companyIdSelected)
                }
              >
                {`Create ${documentType?.title || ""}`}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => set_us_actionChoice("view")}
                disabled={
                  !companyIdSelected ||
                  !clientDocumentObjectSelected ||
                  !user?.permissions[
                    documentType?.viewPermission
                  ]?.assignedCompanyId?.includes(companyIdSelected)
                }
              >
                {`View/Download ${documentType?.title || ""}`}
              </Button>
            </Stack>
          </Grid>

          {companyIdSelected &&
            clientDocumentObjectSelected &&
            us_actionChoice === "create" && (
              <Suspense fallback={<></>}>
                <DocumentInputDetails
                  action={"add"}
                  set_us_actionChoice={set_us_actionChoice}
                />
              </Suspense>
            )}

          {companyIdSelected &&
            clientDocumentObjectSelected !== undefined &&
            us_actionChoice === "view" && (
              <Suspense fallback={<></>}>
                <InvViewDetails />
              </Suspense>
            )}
        </Grid>
      </Container>
    </Page>
  );
}
