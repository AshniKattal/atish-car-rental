import { lazy, Suspense, useState } from "react";
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
import {
  selectInvoiceSection,
  setUpdateInvData,
} from "../../../features/invoiceSectionSlice";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const CompanyClientSelection = lazy(() =>
  import("../../../components/selection-component/CompanyClientSelection")
);

const InvInputDetails = lazy(() =>
  import("../../../components/invoice-input-details/InvInputDetails")
);

const InvViewDetails = lazy(() =>
  import("../../../components/invoice-view-details/InvViewDetails")
);
// ----------------------------------------------------------------------

export default function InvoiceIndex() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { themeStretch } = useSettings();

  const { companyInvSelected, clientInvSelected } =
    useSelector(selectInvoiceSection);

  const [us_actionChoice, set_us_actionChoice] = useState(""); //"create", "view"

  return (
    <Page title="Invoice">
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
              <Typography variant="h3">Invoice section</Typography>
            </Stack>
          </Grid>

          <Suspense fallback={<></>}>
            <CompanyClientSelection
              type={"invoice"}
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
                disabled={!companyInvSelected || !clientInvSelected}
              >
                create invoice
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => set_us_actionChoice("view")}
                disabled={!companyInvSelected || !clientInvSelected}
              >
                View/Download invoice
              </Button>
            </Stack>
          </Grid>

          {companyInvSelected !== undefined && us_actionChoice === "view" && (
            <Suspense fallback={<></>}>
              <InvViewDetails />
            </Suspense>
          )}

          {companyInvSelected !== undefined &&
            clientInvSelected !== undefined &&
            us_actionChoice === "create" && (
              <Suspense fallback={<></>}>
                <InvInputDetails
                  action={"add"}
                  set_us_actionChoice={set_us_actionChoice}
                />
              </Suspense>
            )}
        </Grid>
      </Container>
    </Page>
  );
}
