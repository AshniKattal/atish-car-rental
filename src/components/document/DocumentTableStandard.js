import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Scrollbar from "../Scrollbar";
import DeleteIcon from "@mui/icons-material/Delete";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import useAuth from "src/hooks/useAuth";
import SearchIcon from "@mui/icons-material/Search";

export default function DocumentTableStandard({
  companyDetails,
  documentDetails,
  setDocumentDetails,
  documentType,
  savedDescriptions,
  set_us_openDialog,
  set_us_openDialogSKUCodeSearch,
  set_us_openDialogContractAgreementSearch,
  handleInputChange,
  handleOrderChange,
  handleIsVatableChange,
  deleteParticular,
  setSelectedRowIndex,
  companyMRATemplateFlag,
  displayDiscountColumns,
  set_displayDiscountColumns,
  defaultParticularOptions,
}) {
  /**
   * check if company chosen require old or new table template
   * template may alter depending on action -> add or update
   * if action === add -> check if company's MRATemplateFlag is true to apply new template or not
   * if action === update -> check if MRATemplateApplied to verify if the updated invoice has been saved with new template
   */

  const { user } = useAuth();

  const { docParticulars } = documentDetails;

  function addNewRow() {
    // add new row -> increment order number
    let newDocParticulars = [...docParticulars];
    newDocParticulars.push({
      rowOrder: docParticulars?.length + 1,
      rowQty: "",
      rowDescription: "",
      rowUnitPrice: "",
      rowAmount: "",
      rowDiscountAmount: "",
      rowDiscountedAmount: "",
      rowIsVatable: documentType?.id === "invoice" ? false : true,
      rowVatAmount: "",
      rowTotalAmount: "",
      rowTaxCode: null,
      rowNature: null,
      rowVatCheckBoxDisabled: false,
    });
    setDocumentDetails({
      ...documentDetails,
      docParticulars: newDocParticulars,
    });
  }

  return (
    <>
      <Grid item xs={12} md={12} style={{ width: "100%" }}>
        <Card style={{ width: "100%" }}>
          <Stack sx={{ padding: "20px", width: "100%" }}>
            {companyMRATemplateFlag ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    set_displayDiscountColumns(!displayDiscountColumns)
                  }
                  style={{ width: "300px" }}
                >
                  {displayDiscountColumns
                    ? "Hide discount columns"
                    : "Show discount columns"}
                </Button>
                <br />
              </>
            ) : (
              <></>
            )}

            <Scrollbar>
              <TableContainer>
                <Table style={{ width: "100%" }} border={1}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        size="small"
                        align="center"
                        style={{ width: "20px", whiteSpace: "nowrap" }}
                      />
                      <TableCell
                        size="small"
                        align="center"
                        style={{ width: "20px", whiteSpace: "nowrap" }}
                      >
                        Order
                      </TableCell>
                      <TableCell
                        size="small"
                        align="center"
                        style={{ whiteSpace: "nowrap", minWidth: "300px" }}
                      >
                        Description
                      </TableCell>

                      {companyMRATemplateFlag ? (
                        <>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap", minWidth: "200px" }}
                          >
                            Nature
                          </TableCell>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap", minWidth: "200px" }}
                          >
                            Tax Code
                          </TableCell>
                        </>
                      ) : (
                        <></>
                      )}
                      <TableCell
                        size="small"
                        style={{
                          whiteSpace: "nowrap",
                          minWidth: "100px",
                        }}
                        align="center"
                      >
                        Quantity
                      </TableCell>
                      <TableCell
                        size="small"
                        align="center"
                        style={{
                          whiteSpace: "nowrap",
                          minWidth: "150px",
                        }}
                      >
                        Unit Price
                      </TableCell>

                      <TableCell
                        size="small"
                        align="center"
                        style={{
                          whiteSpace: "nowrap",
                          minWidth: "150px",
                        }}
                      >
                        Amount
                      </TableCell>

                      {companyDetails?.data?.documentTemplate ===
                      "smart_promote" ? (
                        <>
                          <TableCell
                            size="small"
                            align="center"
                            style={{
                              whiteSpace: "nowrap",
                              minWidth: "150px",
                            }}
                          >
                            Discount
                          </TableCell>

                          <TableCell
                            size="small"
                            align="center"
                            style={{
                              whiteSpace: "nowrap",
                              minWidth: "150px",
                            }}
                          >
                            Discounted Amt
                          </TableCell>
                        </>
                      ) : companyMRATemplateFlag ? (
                        <>
                          {displayDiscountColumns ? (
                            <>
                              <TableCell
                                size="small"
                                align="center"
                                style={{
                                  whiteSpace: "nowrap",
                                  minWidth: "150px",
                                }}
                              >
                                Discount
                              </TableCell>

                              <TableCell
                                size="small"
                                align="center"
                                style={{
                                  whiteSpace: "nowrap",
                                  minWidth: "150px",
                                }}
                              >
                                Discounted Amt
                              </TableCell>
                            </>
                          ) : (
                            <></>
                          )}

                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap", minWidth: "150px" }}
                          >
                            Vat
                          </TableCell>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap", minWidth: "150px" }}
                          >
                            Total MUR
                          </TableCell>
                        </>
                      ) : (
                        <></>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {docParticulars &&
                      docParticulars?.length > 0 &&
                      docParticulars?.map((particular, index) => (
                        <TableRow key={index}>
                          <TableCell
                            size="small"
                            align="center"
                            style={{
                              whiteSpace: "nowrap",
                            }}
                          >
                            <IconButton
                              color="error"
                              onClick={() => deleteParticular(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <TextField
                              variant="outlined"
                              name="orderNum"
                              id="orderNum"
                              type="number"
                              value={particular?.rowOrder || ""}
                              size="small"
                              onChange={(event) =>
                                handleOrderChange(event.target.value, index)
                              }
                              fullWidth
                            />
                          </TableCell>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <Stack spacing={1} direction="row">
                              {companyDetails?.data?.documentTemplate ===
                              "flexitrans" ? (
                                <Autocomplete
                                  size="small"
                                  fullWidth
                                  value={particular?.rowDescription || null}
                                  onChange={(event, newValue) => {
                                    handleInputChange(
                                      newValue,
                                      index,
                                      "rowDescription"
                                    );
                                  }}
                                  inputValue={particular?.rowDescription || ""}
                                  onInputChange={(event, newInputValue) => {
                                    handleInputChange(
                                      newInputValue,
                                      index,
                                      "rowDescription"
                                    );
                                  }}
                                  options={defaultParticularOptions || []}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="outlined"
                                      multiline
                                      minRows={1}
                                    />
                                  )}
                                />
                              ) : (
                                <TextField
                                  variant="outlined"
                                  name="rowDescription"
                                  id="rowDescription"
                                  type="text"
                                  value={particular?.rowDescription || ""}
                                  onChange={(event) =>
                                    handleInputChange(
                                      event.target.value,
                                      index,
                                      "rowDescription"
                                    )
                                  }
                                  size="small"
                                  fullWidth
                                  multiline
                                  minRows={1}
                                />
                              )}

                              {companyDetails?.id ===
                              process.env.REACT_APP_CUSTOM_SMART_PROMOTE_ID ? (
                                <Tooltip title="Search SKU Code">
                                  <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={() => {
                                      setSelectedRowIndex(index);
                                      set_us_openDialogSKUCodeSearch(true);
                                    }}
                                  >
                                    <SearchIcon />
                                  </IconButton>
                                </Tooltip>
                              ) : companyDetails?.id ===
                                process.env.REACT_APP_CUSTOM_BUGSBEGONE_ID ? (
                                <Tooltip title="Search Contract Agreement">
                                  <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={() => {
                                      setSelectedRowIndex(index);
                                      set_us_openDialogContractAgreementSearch(
                                        true
                                      );
                                    }}
                                  >
                                    <SearchIcon />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <></>
                              )}

                              <Tooltip title="Search already used description">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => {
                                    setSelectedRowIndex(index);
                                    set_us_openDialog(true);
                                  }}
                                  style={{
                                    display:
                                      savedDescriptions &&
                                      savedDescriptions?.length > 0
                                        ? ""
                                        : "none",
                                  }}
                                >
                                  <ManageSearchIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>

                          {companyMRATemplateFlag ? (
                            <>
                              <TableCell size="small" align="center">
                                <Autocomplete
                                  ListboxProps={{
                                    style: { maxHeight: "70vh" },
                                  }}
                                  size="small"
                                  label="Nature"
                                  id="nature-drop-down"
                                  options={
                                    process.env.REACT_APP_EBS_NATURE_VALUES
                                      ? JSON.parse(
                                          process.env
                                            .REACT_APP_EBS_NATURE_VALUES
                                        )
                                      : []
                                  }
                                  value={particular?.rowNature || null}
                                  renderInput={(params) => (
                                    <TextField {...params} label="Nature" />
                                  )}
                                  required
                                  onChange={(e, value, reason) => {
                                    e.preventDefault();
                                    if (
                                      reason !== "removeOption" &&
                                      reason !== "clear" &&
                                      value
                                    ) {
                                      handleInputChange(
                                        value,
                                        index,
                                        "rowNature"
                                      );
                                    } else if (
                                      reason === "removeOption" ||
                                      reason === "clear"
                                    ) {
                                      handleInputChange(
                                        null,
                                        index,
                                        "rowNature"
                                      );
                                    }
                                  }}
                                  getOptionLabel={(option) =>
                                    option?.title || ""
                                  }
                                  fullWidth
                                />
                              </TableCell>
                              <TableCell size="small" align="center">
                                <Autocomplete
                                  ListboxProps={{
                                    style: { maxHeight: "70vh" },
                                  }}
                                  size="small"
                                  label="Tax Code"
                                  id="tax-code-drop-down"
                                  options={
                                    process.env.REACT_APP_EBS_TAX_CODE_VALUES
                                      ? JSON.parse(
                                          process.env
                                            .REACT_APP_EBS_TAX_CODE_VALUES
                                        )
                                      : []
                                  }
                                  value={particular?.rowTaxCode || null}
                                  renderInput={(params) => (
                                    <TextField {...params} label="Tax Code" />
                                  )}
                                  required
                                  onChange={(e, value, reason) => {
                                    e.preventDefault();
                                    if (
                                      reason !== "removeOption" &&
                                      reason !== "clear" &&
                                      value
                                    ) {
                                      handleInputChange(
                                        value,
                                        index,
                                        "rowTaxCode"
                                      );
                                    } else if (
                                      reason === "removeOption" ||
                                      reason === "clear"
                                    ) {
                                      handleInputChange(
                                        null,
                                        index,
                                        "rowTaxCode"
                                      );
                                    }
                                  }}
                                  getOptionLabel={(option) =>
                                    option?.title || ""
                                  }
                                  fullWidth
                                />
                              </TableCell>
                            </>
                          ) : (
                            <></>
                          )}
                          <TableCell
                            size="small"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <TextField
                              variant="outlined"
                              name="qty"
                              id="qty"
                              type="text"
                              value={particular?.rowQty || ""}
                              size="small"
                              onChange={(event) =>
                                handleInputChange(
                                  event.target.value,
                                  index,
                                  "rowQty"
                                )
                              }
                              fullWidth
                            />
                          </TableCell>

                          <TableCell size="small" align="center">
                            <TextField
                              variant="outlined"
                              name="unitPrice"
                              id="unitPrice"
                              type="text"
                              value={particular?.rowUnitPrice || ""}
                              size="small"
                              onChange={(event) =>
                                handleInputChange(
                                  event.target.value,
                                  index,
                                  "rowUnitPrice"
                                )
                              }
                              fullWidth
                              inputProps={{ style: { width: "100%" } }}
                            />
                          </TableCell>

                          <TableCell size="small" align="center">
                            <Typography>
                              {particular?.rowAmount || ""}
                            </Typography>
                          </TableCell>

                          {companyDetails?.data?.documentTemplate ===
                          "smart_promote" ? (
                            <>
                              <TableCell size="small" align="center">
                                <TextField
                                  variant="outlined"
                                  name="rowDiscountAmount"
                                  id="rowDiscountAmount"
                                  type="text"
                                  value={particular?.rowDiscountAmount || ""}
                                  size="small"
                                  onChange={(event) =>
                                    handleInputChange(
                                      event.target.value,
                                      index,
                                      "rowDiscountAmount"
                                    )
                                  }
                                  fullWidth
                                />
                              </TableCell>

                              <TableCell size="small" align="center">
                                <Typography>
                                  {particular?.rowDiscountedAmount || ""}
                                </Typography>
                              </TableCell>
                            </>
                          ) : companyMRATemplateFlag ? (
                            <>
                              {displayDiscountColumns ? (
                                <>
                                  <TableCell size="small" align="center">
                                    <TextField
                                      variant="outlined"
                                      name="rowDiscountAmount"
                                      id="rowDiscountAmount"
                                      type="number"
                                      value={
                                        particular?.rowDiscountAmount || ""
                                      }
                                      size="small"
                                      onChange={(event) =>
                                        handleInputChange(
                                          event.target.value,
                                          index,
                                          "rowDiscountAmount"
                                        )
                                      }
                                      fullWidth
                                    />
                                  </TableCell>

                                  <TableCell size="small" align="center">
                                    <Typography>
                                      {particular?.rowDiscountedAmount || ""}
                                    </Typography>
                                  </TableCell>
                                </>
                              ) : (
                                <></>
                              )}

                              <TableCell size="small" align="center">
                                <Stack
                                  spacing={1}
                                  direction="row"
                                  alignItems={"center"}
                                  justifyContent={"center"}
                                >
                                  <Tooltip title="Apply or remove Vat">
                                    <Checkbox
                                      checked={
                                        particular?.rowIsVatable === undefined
                                          ? true
                                          : particular?.rowIsVatable
                                      }
                                      onChange={(event) =>
                                        handleIsVatableChange(
                                          index,
                                          event.target.checked
                                        )
                                      }
                                      disabled={
                                        particular?.rowVatCheckBoxDisabled ||
                                        false
                                      }
                                    />
                                  </Tooltip>

                                  <Typography>
                                    {particular?.rowVatAmount || ""}
                                  </Typography>
                                </Stack>
                              </TableCell>

                              <TableCell size="small" align="center">
                                <Typography>
                                  {particular?.rowTotalAmount || ""}
                                </Typography>
                              </TableCell>
                            </>
                          ) : (
                            <></>
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={() => addNewRow()}
              >
                Add new row
              </Button>
            </Scrollbar>
          </Stack>
        </Card>
      </Grid>
    </>
  );
}
