import { Grid, TextField } from "@mui/material";

export default function WorldLinkCustom({
  classes,
  documentDetails,
  setDocumentDetails,
}) {
  const {
    docContainerNumber,
    docVesselName,
    docVolume,
    docGrossWeight,
    docPackages,
    docBLNumber,
    docSupplier,
    docDescription,
    docPortOfLoading,
    docETA,
    docPlaceOfLanding,
    docRoE,
  } = documentDetails;

  return (
    <>
      <Grid item xs={12} md={6}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="docBLNumber"
              label={"BL Number"}
              id="docBLNumber"
              type="text"
              value={docBLNumber || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docBLNumber: event.target.value,
                  };
                });
              }}
              InputProps={{ className: classes.input }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="docSupplier"
              label={"Supplier"}
              id="docSupplier"
              type="text"
              value={docSupplier || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docSupplier: event.target.value,
                  };
                });
              }}
              InputProps={{ className: classes.input }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="docContainerNumber"
              label={"Container Number"}
              id="docContainerNumber"
              type="text"
              value={docContainerNumber || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docContainerNumber: event.target.value,
                  };
                });
              }}
              InputProps={{ className: classes.input }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="docPackages"
              label={"Packages"}
              id="docPackages"
              type="text"
              value={docPackages || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docPackages: event.target.value,
                  };
                });
              }}
              InputProps={{ className: classes.input }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="docDescription"
              label={"Description"}
              id="docDescription"
              type="text"
              value={docDescription || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docDescription: event.target.value,
                  };
                });
              }}
              InputProps={{ className: classes.input }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="docGrossWeight"
              label={"Gross Weight"}
              id="docGrossWeight"
              type="text"
              value={docGrossWeight || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docGrossWeight: event.target.value,
                  };
                });
              }}
              InputProps={{ className: classes.input }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="docVolume"
              label={"Volume"}
              id="docVolume"
              type="text"
              value={docVolume || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docVolume: event.target.value,
                  };
                });
              }}
              InputProps={{ className: classes.input }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="docPortOfLoading"
              label={"Port Of Loading"}
              id="docPortOfLoading"
              type="text"
              value={docPortOfLoading || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docPortOfLoading: event.target.value,
                  };
                });
              }}
              InputProps={{ className: classes.input }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="docETA"
              label={"ETA"}
              id="docETA"
              type="text"
              value={docETA || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docETA: event.target.value,
                  };
                });
              }}
              InputProps={{ className: classes.input }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="docVesselName"
              label={"Vessel Name"}
              id="docVesselName"
              type="text"
              value={docVesselName || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docVesselName: event.target.value,
                  };
                });
              }}
              InputProps={{ className: classes.input }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="docRoE"
              label={"RoE"}
              id="docRoE"
              type="text"
              value={docRoE || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docRoE: event.target.value,
                  };
                });
              }}
              InputProps={{ className: classes.input }}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="docPlaceOfLanding"
              label={"Place Of Landing"}
              id="docPlaceOfLanding"
              type="text"
              value={docPlaceOfLanding || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docPlaceOfLanding: event.target.value,
                  };
                });
              }}
              InputProps={{ className: classes.input }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
