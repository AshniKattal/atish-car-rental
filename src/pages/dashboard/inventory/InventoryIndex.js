import {
  Autocomplete,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { lazy, Suspense, useState } from "react";
import Page from "src/components/Page";
import useSettings from "src/hooks/useSettings";
import ManageInventory from "./manage-inventory/ManageInventory";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import { selectDocument } from "src/features/documentSlice";
import { useSelector } from "react-redux";
import ManageCategory from "./manage-cateogry/ManageCategory";

const CompanyClientSelection = lazy(() =>
  import("src/components/selection-component/CompanyClientSelection")
);

export default function InventoryIndex() {
  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const { companyDetails } = useSelector(selectDocument);

  const [selectedTable, setSelectedTable] = useState(null);

  const tableOptions = [
    { collectionName: "inventory", title: "Inventory" },
    { collectionName: "category", title: "Category" },
  ];

  return (
    <>
      <Page title="Inventory">
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
                <Typography variant="h3">Inventory section</Typography>
              </Stack>
            </Grid>

            <Suspense fallback={<></>}>
              <CompanyClientSelection type={"inventory"} />
            </Suspense>

            <Grid item xs={12} md={4}>
              <Autocomplete
                size="small"
                label="Please select table"
                id="table-drop-down"
                options={tableOptions}
                value={selectedTable || null}
                renderInput={(params) => (
                  <TextField {...params} label="Please select table" />
                )}
                onChange={(e, value, reason) => {
                  if (
                    reason !== "removeOption" &&
                    reason !== "clear" &&
                    value
                  ) {
                    setSelectedTable(value);
                  } else if (reason === "removeOption" || reason === "clear") {
                    setSelectedTable(null);
                  }
                }}
                getOptionLabel={(option) => option?.title || ""}
                renderOption={(props, option) => (
                  <li {...props} key={option?.collectionName}>
                    <span>{option?.title || ""}</span>
                  </li>
                )}
                disabled={!companyDetails}
              />
            </Grid>

            {selectedTable && selectedTable?.collectionName === "inventory" ? (
              <Grid item xs={12} md={12}>
                <ManageInventory />
              </Grid>
            ) : selectedTable &&
              selectedTable?.collectionName === "category" ? (
              <Grid item xs={12} md={12}>
                <ManageCategory />
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </Container>
      </Page>
    </>
  );
}
