import PropTypes from "prop-types";
import { Autocomplete, Grid, TextField } from "@mui/material";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDocument,
  setClientDocumentIdSelected,
  setClientDocumentObjectSelected,
  setCompanyDetails,
  setCompanyIdSelected,
  setReportDocType,
} from "../../features/documentSlice";
import { selectCompanyList } from "src/features/companySlice";

CompanyClientSelection.propTypes = {
  type: PropTypes.string.isRequired,
  actionType: PropTypes.string,
};

function CompanyClientSelection({ type, actionType }) {
  const dispatch = useDispatch();

  const { companyList } = useSelector(selectCompanyList);

  const { companyDetails } = useSelector(selectDocument);

  const handleSelectChange = async (e, value, reason, type) => {
    e.preventDefault();
    if (reason !== "removeOption" && reason !== "clear" && value) {
      if (type === "company") {
        // redux company id
        dispatch(setCompanyIdSelected(value.id));

        // redux company object
        dispatch(setCompanyDetails(value));

        // reset client selection
        dispatch(setClientDocumentIdSelected(undefined));
        dispatch(setClientDocumentObjectSelected(null));

        dispatch(setReportDocType(""));

        // retrieve all clients associated with the selected company
        // await initializeClientList(value.id);
      }
    } else if (reason === "removeOption" || reason === "clear") {
      if (type === "company") {
        // reset company id
        dispatch(setCompanyIdSelected(undefined));

        // reset company details
        dispatch(setCompanyDetails(null));

        // reset client selection
        dispatch(setClientDocumentIdSelected(undefined));
        dispatch(setClientDocumentObjectSelected(null));

        dispatch(setReportDocType(""));
      }
    }
  };

  return (
    <>
      <Grid item xs={12} md={12}>
        <Autocomplete
          ListboxProps={{ style: { maxHeight: "70vh" } }}
          size="small"
          label="Please choose a company"
          id="company-drop-down"
          options={companyList || []}
          value={companyDetails || null}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Please choose a company"
              InputLabelProps={{ required: true }}
            />
          )}
          required
          onChange={(e, value, reason) =>
            handleSelectChange(e, value, reason, "company")
          }
          getOptionLabel={(option) => option?.name || ""}
          disabled={type === "report" && !actionType}
        />
      </Grid>
    </>
  );
}

export default memo(CompanyClientSelection);
