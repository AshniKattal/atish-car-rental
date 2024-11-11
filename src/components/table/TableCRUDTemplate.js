import { Fragment, useState } from "react";
import CurrencyFormat from "react-currency-format";
// import { makeStyles, withStyles } from '@mui/styles';
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TableSortLabel,
  TablePagination,
  Typography,
  Tooltip,
  IconButton,
  Card,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  useTheme,
} from "@mui/material";
import Scrollbar from "../Scrollbar";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import useAuth from "../../hooks/useAuth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Label from "../Label";
import Iconify from "../Iconify";
import {
  handleMailCustomSurvey,
  handleViewDownloadCustomSurvey,
} from "../core-functions/SelectionCoreFunctions";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setLoading } from "src/features/globalSlice";
import Image from "../Image";
import moment from "moment";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableTitle: {
    fontWeight: "bold",
  },
  tableBtnOption: {
    cursor: "pointer",
  },
  tableRow: {
    cursor: "pointer",
  },
  tableCell: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    //display: "block",
    overflow: "hidden",
  },
  tableCellLeft: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    //display: "block",
    overflow: "hidden",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  tableCellRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});

const StyledHeaderTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor:
    theme?.palette?.mode === "light"
      ? theme?.palette?.primary.light
      : theme?.palette?.mode === "dark"
      ? theme.palette.primary.dark
      : "transparent",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor:
      theme?.palette?.mode === "light"
        ? theme?.palette?.primary.lighter
        : theme?.palette?.mode === "dark"
        ? theme.palette.primary.darker
        : "transparent",
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { headers, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead style={{ width: "100%" }}>
      <StyledHeaderTableRow>
        {headers &&
          headers.map((headCell, index) => (
            <TableCell
              style={{
                whiteSpace: "nowrap",
                width:
                  headCell.label === "List" ||
                  headCell.label === "View" ||
                  headCell.label === "Update" ||
                  headCell.label === "Delete"
                    ? 75
                    : undefined,
              }}
              key={index}
              align={headCell.label === "Delete" ? "right" : "center"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              {headCell.label === "List" ||
              headCell.label === "View" ||
              headCell.label === "Update" ||
              headCell.label === "Delete" ? (
                headCell.label
              ) : (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}
      </StyledHeaderTableRow>
    </TableHead>
  );
}

const TableCRUDTemplate = ({
  companyId,
  type,
  headers,
  aCollection,
  viewOption,
  viewBtnFunc,
  addBtnDisplay,
  addBtnLabel,
  addBtnFunc,
  emptyColMsg,
  updateBtnDisplay,
  updateBtnFunc,
  deleteBtnDisplay,
  deleteBtnFunc,
  documentType,
  logo,
  companyDetails,
  fetchClientSurvey,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const [deleteId, setDeleteId] = useState("");
  const [deleteData, setDeleteData] = useState({});
  const [openDel, setOpenDel] = useState(false);

  const [us_b_openAbsenceTarifDlg, set_us_b_openAbsenceTarifDlg] =
    useState(false);
  const [us_a_absenceTariff, set_us_a_absenceTariff] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = aCollection.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, aCollection.length - page * rowsPerPage);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: addBtnDisplay ? "" : "none",
          width: "100%",
          paddingBottom: "2rem",
        }}
      >
        <Button
          startIcon={<AddIcon />}
          onClick={() => addBtnFunc()}
          color="primary"
          variant="contained"
          disabled={
            type === "client" &&
            user?.permissions?.createClientChk?.assignedCompanyId.includes(
              companyId
            )
              ? false
              : type === "company" /* &&
                user?.permissions?.createCompChk?.assignedCompanyId.includes(
                  companyId
                ) */
              ? false
              : type === "admin" &&
                user?.permissions?.createAdminChk?.assignedCompanyId.includes(
                  companyId
                )
              ? false
              : type === "survey" ||
                type === "vehicles" ||
                type === "inventory" ||
                type === "category" ||
                type === "bugsBeGoneCustomCheckboxManagement"
              ? false
              : true
          }
        >
          {addBtnLabel}
        </Button>
      </div>

      <div className={classes.root}>
        <Card>
          <Stack sx={{ mt: 1.5, p: 1.5 }}>
            {aCollection && aCollection.length === 0 ? (
              <>
                <div style={{ width: "100%", padding: "2em" }}>
                  <Typography
                    variant="h6"
                    component="h4"
                    style={{ fontSize: "1.2em", color: "red" }}
                    color="secondary"
                  >
                    {emptyColMsg}
                  </Typography>
                </div>
              </>
            ) : (
              <Scrollbar>
                <TableContainer>
                  <Table
                    border={1}
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size="medium"
                    aria-label="enhanced table"
                  >
                    <EnhancedTableHead
                      classes={classes}
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={aCollection.length}
                      headers={headers}
                    />
                    <TableBody>
                      {aCollection &&
                        aCollection.length !== 0 &&
                        stableSort(aCollection, getComparator(order, orderBy))
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((object, index) => {
                            let arr = [];
                            for (const property in object) {
                              for (let i = 0; i < headers.length; i++) {
                                if (headers[i].id === property) {
                                  arr.push({
                                    id: headers[i].id,
                                    value: `${object[property]}`,
                                  });
                                  break;
                                }
                              }
                            }

                            if (
                              type !== "company" ||
                              (type === "company" &&
                                user?.permissions?.viewCompChk?.assignedCompanyId.includes(
                                  object.id
                                ))
                            ) {
                              return (
                                <Fragment key={index}>
                                  <StyledTableRow tabIndex={-1}>
                                    {type !== "company" ? (
                                      <TableCell
                                        className={classes.tableCellLeft}
                                        align="center"
                                        size="small"
                                      >
                                        {index + 1 + ")"}
                                      </TableCell>
                                    ) : (
                                      <></>
                                    )}

                                    {viewOption ? (
                                      <TableCell align="center" size="small">
                                        <Tooltip title="View">
                                          <IconButton color="primary">
                                            <VisibilityIcon
                                              onClick={() =>
                                                viewBtnFunc(
                                                  object.id,
                                                  object.data
                                                )
                                              }
                                            />
                                          </IconButton>
                                        </Tooltip>
                                      </TableCell>
                                    ) : (
                                      <></>
                                    )}

                                    {updateBtnDisplay ? (
                                      <TableCell align="center" size="small">
                                        <Tooltip title="Update">
                                          <span>
                                            <IconButton
                                              color="primary"
                                              disabled={
                                                type === "client" &&
                                                user?.permissions?.updateClientChk?.assignedCompanyId.includes(
                                                  companyId
                                                )
                                                  ? false
                                                  : type === "company" &&
                                                    user?.permissions?.updateCompChk?.assignedCompanyId.includes(
                                                      object.id
                                                    )
                                                  ? false
                                                  : type === "admin" &&
                                                    user?.permissions?.updateAdminChk?.assignedCompanyId.includes(
                                                      companyId
                                                    )
                                                  ? false
                                                  : type === "survey" ||
                                                    type === "vehicles" ||
                                                    type === "inventory" ||
                                                    type === "category" ||
                                                    type ===
                                                      "bugsBeGoneCustomCheckboxManagement"
                                                  ? false
                                                  : true
                                              }
                                              onClick={() =>
                                                updateBtnFunc(
                                                  object.id,
                                                  object.data
                                                )
                                              }
                                            >
                                              <EditIcon
                                                className={
                                                  classes.tableBtnOption
                                                }
                                              />
                                            </IconButton>
                                          </span>
                                        </Tooltip>
                                      </TableCell>
                                    ) : (
                                      ""
                                    )}
                                    {deleteBtnDisplay ? (
                                      <TableCell
                                        className={classes.tableCellRight}
                                        align="right"
                                        size="small"
                                      >
                                        <Tooltip title="Delete">
                                          <span>
                                            <IconButton
                                              color="error"
                                              disabled={
                                                type === "client" &&
                                                user?.permissions?.deleteClientChk?.assignedCompanyId.includes(
                                                  companyId
                                                )
                                                  ? false
                                                  : type === "company" &&
                                                    user?.permissions?.deleteCompChk?.assignedCompanyId.includes(
                                                      object.id
                                                    )
                                                  ? false
                                                  : type === "admin" &&
                                                    user?.permissions?.deleteAdminChk?.assignedCompanyId.includes(
                                                      companyId
                                                    )
                                                  ? false
                                                  : type === "survey" ||
                                                    type === "vehicles" ||
                                                    type === "inventory" ||
                                                    type === "category" ||
                                                    type ===
                                                      "bugsBeGoneCustomCheckboxManagement"
                                                  ? false
                                                  : true
                                              }
                                              onClick={() => {
                                                setDeleteId(object?.id);
                                                setDeleteData(object?.data);
                                                setOpenDel(true);
                                              }}
                                            >
                                              <DeleteIcon
                                                className={
                                                  classes.tableBtnOption
                                                }
                                              />
                                            </IconButton>
                                          </span>
                                        </Tooltip>
                                      </TableCell>
                                    ) : (
                                      ""
                                    )}

                                    {arr &&
                                      arr?.map((obj, indexSec) => {
                                        if (obj?.id === "dateTimeCreated") {
                                          return (
                                            <TableCell
                                              className={classes.tableCell}
                                              key={indexSec}
                                              align="center"
                                              size="small"
                                            >
                                              {object?.data?.dateTimeCreated
                                                ? moment(
                                                    object?.data?.dateTimeCreated.toDate()
                                                  ).format(
                                                    "DD-MM-YYYY HH:mm:ss"
                                                  ) || ""
                                                : ""}
                                            </TableCell>
                                          );
                                        } else if (
                                          obj?.id === "featuredImage"
                                        ) {
                                          return (
                                            <TableCell
                                              className={classes.tableCell}
                                              key={indexSec}
                                              align="center"
                                              size="small"
                                            >
                                              <Stack
                                                spacing={1}
                                                direction={"row"}
                                                alignItems={"center"}
                                                justifyContent={"center"}
                                              >
                                                {object?.data &&
                                                object?.data?.featuredImage
                                                  ?.length > 0
                                                  ? object?.data?.featuredImage.map(
                                                      (image, index) => (
                                                        <>
                                                          <Box
                                                            key={index}
                                                            sx={{
                                                              px: 0.2,
                                                              overflowX:
                                                                "scroll",
                                                            }}
                                                          >
                                                            <Image
                                                              disabledEffect
                                                              alt="thumb image"
                                                              src={
                                                                image?.downloadURL
                                                              }
                                                              sx={{
                                                                width: 50,
                                                                height: 50,
                                                                borderRadius: 1.5,
                                                                border: `solid 2px ${theme.palette.primary.main}`,
                                                              }}
                                                            />
                                                          </Box>
                                                        </>
                                                      )
                                                    )
                                                  : ""}
                                              </Stack>
                                            </TableCell>
                                          );
                                        } else if (
                                          obj &&
                                          obj.id === "sendEmail"
                                        ) {
                                          return (
                                            <TableCell
                                              className={classes.tableCell}
                                              key={indexSec}
                                              align="center"
                                              size="small"
                                              style={{
                                                whiteSpace: "nowrap",
                                                background:
                                                  object?.data
                                                    ?.emailAlreadySent === true
                                                    ? "#befed5"
                                                    : "transparent",
                                              }}
                                            >
                                              <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={async () => {
                                                  dispatch(setLoading(true));
                                                  let mailResponse =
                                                    await handleMailCustomSurvey(
                                                      companyDetails,
                                                      "sendEmail",
                                                      object?.data,
                                                      documentType?.id,
                                                      logo
                                                    );

                                                  if (mailResponse?.error) {
                                                    enqueueSnackbar(
                                                      mailResponse?.message,
                                                      { variant: "error" }
                                                    );
                                                    dispatch(setLoading(false));
                                                  } else if (
                                                    !mailResponse?.error
                                                  ) {
                                                    enqueueSnackbar(
                                                      mailResponse?.message,
                                                      { variant: "success" }
                                                    );

                                                    await fetchClientSurvey(
                                                      companyDetails?.id,
                                                      documentType?.id
                                                    );
                                                    dispatch(setLoading(false));
                                                  }
                                                }}
                                              >
                                                Send Email
                                              </Button>
                                            </TableCell>
                                          );
                                        } else if (
                                          obj &&
                                          obj.id === "viewDownloadPdf"
                                        ) {
                                          return (
                                            <TableCell
                                              className={classes.tableCell}
                                              key={indexSec}
                                              align="center"
                                              size="small"
                                            >
                                              <Stack
                                                spacing={2}
                                                direction={"row"}
                                                alignItems={"center"}
                                              >
                                                <IconButton
                                                  color="primary"
                                                  onClick={() =>
                                                    handleViewDownloadCustomSurvey(
                                                      companyDetails,
                                                      "view",
                                                      {
                                                        ...object?.data,
                                                        id: object?.id,
                                                      },
                                                      documentType?.id,
                                                      logo
                                                    )
                                                  }
                                                >
                                                  <Iconify
                                                    icon={"carbon:view"}
                                                  />
                                                </IconButton>

                                                <IconButton
                                                  color="primary"
                                                  onClick={() =>
                                                    handleViewDownloadCustomSurvey(
                                                      companyDetails,
                                                      "download",
                                                      {
                                                        ...object?.data,
                                                        id: object?.id,
                                                      },
                                                      documentType?.id,
                                                      logo
                                                    )
                                                  }
                                                >
                                                  <Iconify
                                                    icon={"eva:download-fill"}
                                                  />
                                                </IconButton>
                                              </Stack>
                                            </TableCell>
                                          );
                                        } else if (obj && obj.id === "status") {
                                          return (
                                            <TableCell
                                              className={classes.tableCell}
                                              key={indexSec}
                                              align="center"
                                              size="small"
                                            >
                                              <Label
                                                variant="filled"
                                                sx={{
                                                  minWidth: 100,
                                                  minHeight: 30,
                                                }}
                                                color={
                                                  obj.value === "Pending"
                                                    ? "warning"
                                                    : obj.value === "Confirmed"
                                                    ? "success"
                                                    : obj.value === "Rejected"
                                                    ? "error"
                                                    : "default"
                                                }
                                              >
                                                {obj.value}
                                              </Label>
                                            </TableCell>
                                          );
                                        } else if (
                                          obj &&
                                          obj.id === "actualBasicSalary"
                                        ) {
                                          return (
                                            <TableCell
                                              className={classes.tableCell}
                                              key={indexSec}
                                              align="center"
                                              size="small"
                                            >
                                              {obj &&
                                              obj.value === undefined ? (
                                                ""
                                              ) : obj && obj.value ? (
                                                <CurrencyFormat
                                                  value={Math.round(
                                                    Number(obj.value)
                                                  )}
                                                  displayType={"text"}
                                                  thousandSeparator={true}
                                                />
                                              ) : (
                                                ""
                                              )}
                                            </TableCell>
                                          );
                                        } else if (
                                          obj &&
                                          (obj.id === "vatOrNonVatRegistered" ||
                                            obj.id === "buyerType")
                                        ) {
                                          return (
                                            <TableCell
                                              className={classes.tableCell}
                                              key={indexSec}
                                              align="center"
                                              size="small"
                                            >
                                              {obj &&
                                              JSON.parse(obj?.value) !== null
                                                ? JSON.parse(obj?.value)?.title
                                                : "Not yet defined"}
                                            </TableCell>
                                          );
                                        } else if (
                                          obj &&
                                          obj.id === "MRATemplateFlag"
                                        ) {
                                          return (
                                            <TableCell
                                              className={classes.tableCell}
                                              key={indexSec}
                                              align="center"
                                              size="small"
                                            >
                                              {obj && JSON.parse(obj?.value)
                                                ? JSON.parse(obj?.value)?.title
                                                : "Not yet defined"}
                                            </TableCell>
                                          );
                                        } else if (
                                          type === "inventory" &&
                                          obj?.id === "category"
                                        ) {
                                          return (
                                            <TableCell
                                              className={classes.tableCell}
                                              key={indexSec}
                                              align="center"
                                              size="small"
                                            >
                                              {obj && JSON.parse(obj?.value)
                                                ? JSON.parse(obj?.value)?.title
                                                : ""}
                                            </TableCell>
                                          );
                                        } else if (
                                          obj?.id === "categoryDisplay"
                                        ) {
                                          return (
                                            <TableCell
                                              className={classes.tableCell}
                                              key={indexSec}
                                              align="center"
                                              size="small"
                                            >
                                              {obj &&
                                              JSON.parse(obj?.value) &&
                                              JSON.parse(obj?.value)?.length > 0
                                                ? JSON.parse(obj?.value)?.map(
                                                    (category) =>
                                                      category?.serviceName +
                                                      ", "
                                                  )
                                                : ""}
                                            </TableCell>
                                          );
                                        } else {
                                          return (
                                            <TableCell
                                              className={classes.tableCell}
                                              key={indexSec}
                                              align="center"
                                              size="small"
                                            >
                                              {obj && obj.value === undefined
                                                ? ""
                                                : obj && obj.value
                                                ? obj.value
                                                : ""}
                                            </TableCell>
                                          );
                                        }
                                      })}
                                  </StyledTableRow>
                                </Fragment>
                              );
                            } else return <></>;
                          })}
                      {/*  {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={16} />
                        </TableRow>
                      )} */}
                    </TableBody>
                  </Table>
                </TableContainer>
                {aCollection && aCollection.length >= 1 ? (
                  <TablePagination
                    rowsPerPageOptions={[50, 100, 150]}
                    component="div"
                    count={aCollection?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, page) => setPage(page)}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                ) : (
                  ""
                )}
              </Scrollbar>
            )}
          </Stack>
        </Card>
      </div>

      <>
        <Dialog
          open={us_b_openAbsenceTarifDlg}
          keepMounted
          onClose={() => set_us_b_openAbsenceTarifDlg(false)}
          aria-labelledby="delete"
          aria-describedby="delete"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="deleteConfirm" align="center">
            <Typography>Absence total summary</Typography>
          </DialogTitle>
          <DialogContent style={{ minHeight: "auto" }} align="center">
            <br />
            <Typography>
              Quantity applicable for all employees after 1 year of employment
            </Typography>
            <br />

            {us_a_absenceTariff?.length > 0 ? (
              <TableContainer>
                <Table border={1}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Absence type</TableCell>
                      <TableCell>Total number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {us_a_absenceTariff?.map((o_abc, index) => (
                      <TableRow key={index}>
                        <TableCell>{o_abc?.txt}</TableCell>
                        <TableCell>{o_abc?.qty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>
                You have not yet provided any details about absences. Please
                update company to provide absence details.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                set_us_b_openAbsenceTarifDlg(false);
                set_us_a_absenceTariff([]);
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>

      <>
        <Dialog
          open={openDel}
          keepMounted
          onClose={() => setOpenDel(false)}
          aria-labelledby="delete"
          aria-describedby="delete"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="deleteConfirm" align="center">
            <Typography>
              <b>Delete confirmation</b>
            </Typography>
          </DialogTitle>
          <DialogContent style={{ minHeight: "auto" }} align="center">
            <br />
            <Typography>Are you sure you want to delete this data ?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                deleteBtnFunc(deleteId, deleteData);
                setDeleteId("");
                setDeleteData({});
                setOpenDel(false);
              }}
            >
              Delete
            </Button>
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                setOpenDel(false);
                setDeleteId("");
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </div>
  );
};

export default TableCRUDTemplate;
