import {
  Autocomplete,
  Button,
  Checkbox,
  Container,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Page from "../../../components/Page";
/* import useSettings from "../../../hooks/useSettings"; */
import axios from "axios";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../features/globalSlice";
import * as XLSX from "xlsx";
import base64js from "base64-js";
import { Fragment, useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";
import DownloadIcon from "@mui/icons-material/Download";
import {
  selectDocument,
  setCompanyDetails,
  setCompanyIdSelected,
} from "src/features/documentSlice";
import { selectCompanyList } from "src/features/companySlice";
import useAuth from "src/hooks/useAuth";
import useSettings from "src/hooks/useSettings";

export default function BankStatementConversionDetail() {
  const { themeStretch } = useSettings();

  const { user } = useAuth();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  /*   const { themeStretch } = useSettings(); */

  const { companyDetails } = useSelector(selectDocument);

  const { companyList } = useSelector(selectCompanyList);

  const [columnDisplay, set_columnDisplay] = useState("All lines");

  const [tableDataOriginal, set_tableDataOriginal] = useState([]);

  const [tableData, set_tableData] = useState([]);

  const [mainCheckBoxes, set_mainCheckBoxes] = useState([]);

  const [searchTransaction, set_searchTransaction] = useState(null);

  const [searchTransactionText, set_searchTransactionText] = useState("");

  const [file, setFile] = useState(null);

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const temp_checkPermission_ref = useRef();

  const [viewPermissionGranted, setViewPermissionGranted] = useState(false);

  useEffect(() => {
    temp_checkPermission_ref.current();
  }, [companyDetails]);

  function checkPermission() {
    if (companyDetails && companyDetails?.id) {
      if (
        !user?.permissions?.uploadBankStatementChk?.assignedCompanyId?.includes(
          companyDetails?.id
        )
      ) {
        enqueueSnackbar(
          "You do not have the permission to upload bank statement",
          { variant: "error" }
        );

        setViewPermissionGranted(false);
      } else {
        setViewPermissionGranted(true);
      }
    }
  }

  temp_checkPermission_ref.current = checkPermission;

  const onFileChange1 = async (e) => {
    if (e.target.files?.length > 0) {
      dispatch(setLoading(true));

      let o_file = e.target.files[0];

      setFile(o_file);

      //convert content of pdf file to base64
      const reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result;
        const base64String = btoa(binaryString);
        callExcelConversionAPI(base64String, o_file?.name);
      };
      reader.readAsBinaryString(o_file);
    }
  };

  const callExcelConversionAPI = (pdfBase64String, fileName) => {
    const payload = {
      Parameters: [
        {
          Name: "File",
          FileValue: {
            Name: fileName,
            Data: pdfBase64String,
          },
        },
        {
          Name: "SingleSheet",
          Value: true,
        },
      ],
    };

    axios
      .post(
        `https://v2.convertapi.com/convert/pdf/to/xlsx?Secret=${process.env.REACT_APP_CONVERT_API_SECRET}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        // handleDownload(response.data.Files[0].FileData, fileName);
        readExcelBase64Data(response.data.Files[0].FileData);
      })
      .catch((error) => {
        let errorMessage = error.response.data.Message;

        enqueueSnackbar(`Error occured while converting pdf: ${errorMessage}`, {
          variant: "error",
        });
        dispatch(setLoading(false));
      });
  };

  function readExcelBase64Data(base64String) {
    const byteArray = base64js.toByteArray(base64String);
    const workbook = XLSX.read(byteArray, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Define options to handle dates correctly
    const options = {
      header: 1, // Keep the header row
      defval: "", // Default value for empty cells
      raw: false, // Parse values instead of raw values
      dateNF: "dd/mm/yyyy", // Date format for parsing
    };

    // const jsonData = XLSX.utils.sheet_to_json(worksheet);
    const jsonData = XLSX.utils.sheet_to_json(worksheet, options).map((row) => {
      return row.map((cell) => {
        if (cell instanceof Date) {
          return cell.toISOString().split("T")[0]; // Convert to 'YYYY-MM-DD' format
        }
        return cell;
      });
    });

    let newData = [];
    jsonData.forEach((row) => {
      newData.push({ checked: true, columns: row });
    });

    let mainCheckBoxesValues = [];
    if (newData?.length > 0) {
      if (newData[0]?.columns?.length > 0) {
        newData[0]?.columns.forEach(() => {
          mainCheckBoxesValues.push({
            checked: true,
          });
        });

        set_mainCheckBoxes(mainCheckBoxesValues);
      }
    }

    set_tableData(newData);

    set_tableDataOriginal(newData);

    dispatch(setLoading(false));
  }

  // const handleDownload = (base64, fileName) => {
  //   // Decode base64 to binary string
  //   const binaryString = atob(base64);

  //   // Convert binary string to an array of 8-bit unsigned integers
  //   const len = binaryString.length;
  //   const bytes = new Uint8Array(len);
  //   for (let i = 0; i < len; i++) {
  //     bytes[i] = binaryString.charCodeAt(i);
  //   }

  //   // Create a Blob from the byte array
  //   const blob = new Blob([bytes], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });

  //   // Create a download link
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `${fileName}.xlsx`;

  //   // Programmatically click the link to trigger the download
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);

  //   enqueueSnackbar("PDF converted to Excel successfully");

  //   dispatch(setLoading(false));
  // };

  function onChangeCheckBox(value, index, type) {
    let newArr =
      type === "mainCol"
        ? [...mainCheckBoxes]
        : type === "row"
        ? [...tableData]
        : [];
    newArr[index] = { ...newArr[index], checked: value };
    if (type === "mainCol") {
      set_mainCheckBoxes(newArr);
    } else if (type === "row") {
      set_tableData(newArr);
    }
  }

  const downloadExcel = async () => {
    let data = await removeUncheckedColRows(mainCheckBoxes, tableData);

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    saveAs(blob, `${file?.name}.xlsx`);
  };

  async function removeUncheckedColRows(headerCheckboxes, innerTableData) {
    return await new Promise((resolve) => {
      let newTableData = [];
      const tableDatalength = innerTableData?.length;
      const headerColLength = headerCheckboxes?.length;

      for (let i = 0; i < tableDatalength; i++) {
        if (innerTableData[i]?.checked) {
          let columns = [];
          for (let j = 0; j < headerColLength; j++) {
            if (headerCheckboxes[j]?.checked) {
              columns.push(innerTableData[i]?.columns[j]);
            }
          }
          newTableData.push([...columns]);
        }
      }

      resolve(newTableData);
    });
  }

  async function onChangeColumnsDisplay(e, value, reason) {
    e.preventDefault();

    if (reason !== "removeOption" && reason !== "clear" && value) {
      let newList = [];
      if (value === "Lines with DEBIT only") {
        newList = await filterByDebitCredit(tableDataOriginal, 4);
      } else if (value === "Lines with CREDIT only") {
        newList = await filterByDebitCredit(tableDataOriginal, 5);
      } else {
        newList = [...tableDataOriginal];
      }

      if (newList?.length > 0 && searchTransaction) {
        newList = newList.filter(
          (row) => row.columns[2] && row.columns[2].includes(searchTransaction)
        );
      }

      set_columnDisplay(value);
      set_tableData(newList);
    } else if (reason === "removeOption" || reason === "clear") {
      let newList = [];
      newList = [...tableDataOriginal];

      if (newList?.length > 0 && searchTransaction) {
        newList = newList.filter(
          (row) => row.columns[2] && row.columns[2].includes(searchTransaction)
        );
      }

      set_columnDisplay(value);
      set_tableData(newList);
    }
  }

  async function onTransactionSearch(e, value, reason) {
    e.preventDefault();

    if (reason !== "removeOption" && reason !== "clear" && value) {
      let newList = [];

      newList = tableDataOriginal.filter(
        (row) => row.columns[2] && row.columns[2].includes(value)
      );

      if (newList?.length > 0 && columnDisplay) {
        if (columnDisplay === "Lines with DEBIT only") {
          newList = await filterByDebitCredit(newList, 4);
        } else if (columnDisplay === "Lines with CREDIT only") {
          newList = await filterByDebitCredit(newList, 5);
        }
      }

      set_tableData(newList);
      set_searchTransaction(value);
    } else if (reason === "removeOption" || reason === "clear") {
      let newList = [];
      newList = [...tableDataOriginal];

      if (newList?.length > 0 && columnDisplay) {
        if (columnDisplay === "Lines with DEBIT only") {
          newList = await filterByDebitCredit(newList, 4);
        } else if (columnDisplay === "Lines with CREDIT only") {
          newList = await filterByDebitCredit(newList, 5);
        }
      }

      set_tableData(newList);
      set_searchTransaction(value);
    }
  }

  async function searchTransactionMethod() {
    set_columnDisplay("ALL Lines");
    set_searchTransaction(null);

    if (!searchTransactionText) {
      set_tableData([...tableDataOriginal]);
    } else {
      let newList = [];

      newList = tableDataOriginal.filter(
        (row) =>
          row.columns[2] &&
          row.columns[2]
            .toLowerCase()
            .includes(searchTransactionText.toLowerCase())
      );

      if (newList?.length > 0 && columnDisplay) {
        if (columnDisplay === "Lines with DEBIT only") {
          newList = await filterByDebitCredit(newList, 4);
        } else if (columnDisplay === "Lines with CREDIT only") {
          newList = await filterByDebitCredit(newList, 5);
        }
      }

      set_tableData(newList);
    }
  }

  async function filterByDebitCredit(tableRows, index) {
    return await new Promise((resolve) => {
      let newList = tableRows.filter(
        (row) =>
          row.columns[index] !== "" &&
          row.columns[index] !== undefined &&
          Number(row.columns[index]) >= 0
      );
      resolve(newList);
    });
  }

  const handleSelectChange = async (e, value, reason, type) => {
    e.preventDefault();
    if (reason !== "removeOption" && reason !== "clear" && value) {
      if (type === "company") {
        // redux company id
        dispatch(setCompanyIdSelected(value.id));

        // redux company object
        dispatch(setCompanyDetails(value));
      }
    } else if (reason === "removeOption" || reason === "clear") {
      if (type === "company") {
        // reset company id
        dispatch(setCompanyIdSelected(undefined));

        // reset company details
        dispatch(setCompanyDetails(null));
      }
    }
  };

  return (
    <>
      <Page title="Document">
        <Container maxWidth={themeStretch ? false : "xl"}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Autocomplete
                ListboxProps={{ style: { maxHeight: "70vh" } }}
                size="small"
                label="Please choose a company"
                id="company-drop-down"
                options={companyList || []}
                value={companyDetails || null}
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
              />
            </Grid>

            {companyDetails && viewPermissionGranted ? (
              <>
                <Grid item xs={12} md={12}>
                  <Typography>Import bank statement pdf</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Stack spacing={2}>
                    <Typography>Upload bank statement</Typography>
                    <Button variant="contained" onClick={handleClick}>
                      Upload file
                    </Button>
                  </Stack>

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={onFileChange1}
                  />
                </Grid>

                {tableDataOriginal && tableDataOriginal?.length > 0 ? (
                  <>
                    <Grid item xs={12} md={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <div align="right">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => downloadExcel()}
                          startIcon={<DownloadIcon />}
                        >
                          Download as Excel
                        </Button>
                      </div>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            name="searchTransactionText"
                            label="Search transaction"
                            id="searchTransactionText"
                            type="text"
                            value={searchTransactionText || ""}
                            size="small"
                            fullWidth
                            onChange={(event) =>
                              set_searchTransactionText(event.target.value)
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => searchTransactionMethod()}
                          >
                            Search
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Autocomplete
                        ListboxProps={{
                          style: { maxHeight: "70vh" },
                        }}
                        size="small"
                        label="Search transaction"
                        id="search-transaction-drop-down"
                        options={
                          tableData && tableData?.length > 0
                            ? tableData.map((row) => row.columns[2] !== "")
                            : []
                        }
                        value={searchTransaction || null}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Search transaction"
                            required
                          />
                        )}
                        onChange={(e, value, reason) =>
                          onTransactionSearch(e, value, reason)
                        }
                        getOptionLabel={(option) => option || ""}
                        renderOption={(props, option) => (
                          <li {...props} key={option?.id}>
                            <span>{option?.name || ""}</span>
                          </li>
                        )}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Autocomplete
                        ListboxProps={{
                          style: { maxHeight: "70vh" },
                        }}
                        size="small"
                        label="Lines to display"
                        id="lines-display-drop-down"
                        options={[
                          "All lines",
                          "Lines with DEBIT only",
                          "Lines with CREDIT only",
                        ]}
                        value={columnDisplay || null}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Lines to display"
                            required
                          />
                        )}
                        onChange={(e, value, reason) =>
                          onChangeColumnsDisplay(e, value, reason)
                        }
                        getOptionLabel={(option) => option || ""}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <TableContainer>
                        <Table border={1}>
                          <TableBody>
                            <TableRow>
                              <TableCell size="small" />
                              {mainCheckBoxes?.map(
                                (mainColumn, indexMainCol) => (
                                  <TableCell
                                    size="small"
                                    align="center"
                                    key={indexMainCol}
                                  >
                                    <Checkbox
                                      checked={mainColumn?.checked}
                                      color="primary"
                                      onChange={(e) =>
                                        onChangeCheckBox(
                                          e.target.checked,
                                          indexMainCol,
                                          "mainCol"
                                        )
                                      }
                                    />
                                  </TableCell>
                                )
                              )}
                            </TableRow>
                            {tableData &&
                              tableData?.length > 0 &&
                              tableData?.map((row, index) => (
                                <TableRow key={index}>
                                  {row && row?.columns?.length > 0 ? (
                                    <Fragment key={index}>
                                      <TableCell size="small" align="left">
                                        <Checkbox
                                          checked={row?.checked}
                                          color="primary"
                                          onChange={(e) =>
                                            onChangeCheckBox(
                                              e.target.checked,
                                              index,
                                              "row"
                                            )
                                          }
                                        />
                                      </TableCell>
                                      {row?.columns?.map((column, indexCol) => (
                                        <Fragment key={indexCol}>
                                          <TableCell size="small" align="left">
                                            {column}
                                          </TableCell>
                                        </Fragment>
                                      ))}
                                    </Fragment>
                                  ) : (
                                    <Fragment key={index}></Fragment>
                                  )}
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Container>
      </Page>
    </>
  );
}
