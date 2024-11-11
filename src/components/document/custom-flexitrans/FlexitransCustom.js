import { Grid, TextField } from "@mui/material";

export default function FlexitransCustom({
  classes,
  documentDetails,
  setDocumentDetails,
}) {
  const {
    docShipper,
    docContainerNumber,
    docVesselName,
    docMarkNos,
    docCommodity,
    docHbl,
    docVolume,
    docGrossWeight,
    docPackages,
    docDepot,
  } = documentDetails;

  return (
    <>
      <Grid item xs={12} md={6}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="docShipper"
              label={"Shipper"}
              id="docShipper"
              type="text"
              value={docShipper || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docShipper: event.target.value,
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
              name="docVesselName"
              label={"Vessel"}
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
              name="docMarkNos"
              label={"Mark & Nos"}
              id="docMarkNos"
              type="text"
              value={docMarkNos || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docMarkNos: event.target.value,
                  };
                });
              }}
              InputProps={{ className: classes.input }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="docCommodity"
              label={"Commodity"}
              id="docCommodity"
              type="text"
              value={docCommodity || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docCommodity: event.target.value,
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
              name="docHbl"
              label={"HBL"}
              id="docHbl"
              type="text"
              value={docHbl || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docHbl: event.target.value,
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
              name="docDepot"
              label={"Depot"}
              id="docDepot"
              type="text"
              value={docDepot || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setDocumentDetails((previous) => {
                  return {
                    ...previous,
                    docDepot: event.target.value,
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
