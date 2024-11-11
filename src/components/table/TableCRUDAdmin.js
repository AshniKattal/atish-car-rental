import { Fragment, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Card,
  Stack,
} from "@mui/material";
import Scrollbar from "../Scrollbar";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material/styles";
import useAuth from "src/hooks/useAuth";

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
              key={index}
              align={headCell.label === "Delete" ? "right" : "center"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              {headCell.label === "Update" || headCell.label === "Delete" ? (
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

const TableCRUDAdmin = ({
  companyId,
  type,
  headers,
  aCollection,
  addBtnDisplay,
  addBtnLabel,
  addBtnFunc,
  emptyColMsg,
  updateBtnDisplay,
  updateBtnFunc,
  deleteBtnDisplay,
  deleteBtnFunc,
}) => {
  const { user } = useAuth();

  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPermisDialog, setShowPermisDialog] = useState(false);
  const [permissionArr, setPermissionArr] = useState([]);

  const [deleteId, setDeleteId] = useState("");
  const [openDel, setOpenDel] = useState(false);

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
            type === "super-admin" ||
            (type === "admin" &&
              user?.permissions?.createAdminChk?.assignedCompanyId?.includes(
                companyId
              ))
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

                            return (
                              <Fragment key={index}>
                                <StyledTableRow tabIndex={-1}>
                                  <TableCell
                                    className={classes.tableCellLeft}
                                    align="center"
                                    size="small"
                                  >
                                    {index + 1 + ")"}
                                  </TableCell>
                                  {updateBtnDisplay ? (
                                    <TableCell align="center" size="small">
                                      <Tooltip title="Update ?">
                                        <IconButton
                                          color="primary"
                                          disabled={
                                            type === "super-admin" ||
                                            (type === "admin" &&
                                              user?.permissions?.updateAdminChk?.assignedCompanyId?.includes(
                                                companyId
                                              ))
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
                                            className={classes.tableBtnOption}
                                          />
                                        </IconButton>
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
                                      <Tooltip title="Delete ?">
                                        <IconButton
                                          color="error"
                                          disabled={
                                            type === "super-admin" ||
                                            (type === "admin" &&
                                              user?.permissions?.deleteAdminChk?.assignedCompanyId?.includes(
                                                companyId
                                              ))
                                              ? false
                                              : true
                                          }
                                          onClick={() => {
                                            setDeleteId(object.id);
                                            setOpenDel(true);
                                          }}
                                        >
                                          <DeleteIcon
                                            className={classes.tableBtnOption}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                    </TableCell>
                                  ) : (
                                    ""
                                  )}
                                  {arr &&
                                    arr?.map((obj, indexSec) => {
                                      if (obj && obj.id === "sysFunc") {
                                        return (
                                          <TableCell
                                            className={classes.tableCell}
                                            key={indexSec}
                                            align="center"
                                            size="small"
                                          >
                                            <Button
                                              variant="contained"
                                              color="primary"
                                              onClick={() => {
                                                setPermissionArr(
                                                  JSON.parse(obj.value)
                                                );
                                                setShowPermisDialog(true);
                                              }}
                                            >
                                              View
                                            </Button>
                                          </TableCell>
                                        );
                                      } else if (obj && obj.id === "a_comp") {
                                        return (
                                          <TableCell
                                            className={classes.tableCell}
                                            key={indexSec}
                                            align="center"
                                            size="small"
                                          >
                                            {object?.a_comp?.length > 0 &&
                                              object?.a_comp?.map((o_val) => (
                                                <>{`${o_val?.name}, `}</>
                                              ))}
                                          </TableCell>
                                        );
                                      } else if (
                                        obj &&
                                        obj.id === "a_empNotAllow"
                                      ) {
                                        return (
                                          <TableCell
                                            className={classes.tableCell}
                                            key={indexSec}
                                            align="center"
                                            size="small"
                                          >
                                            {object?.a_empNotAllow?.length >
                                              0 &&
                                              object?.a_empNotAllow?.map(
                                                (o_val) => (
                                                  <>{`${o_val?.name}, `}</>
                                                )
                                              )}
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
                          })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={16} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                {aCollection && aCollection.length >= 1 ? (
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
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
          open={showPermisDialog}
          keepMounted
          onClose={() => setShowPermisDialog(false)}
          aria-labelledby="privacypolicy"
          aria-describedby="privacypolicy"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="privacypolicyTitle" align="center">
            <Typography>
              <b>System Function</b>
            </Typography>
          </DialogTitle>
          <DialogContent style={{ minHeight: "auto" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>System Function</b>
                    </TableCell>
                    <TableCell>
                      <b>Access</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissionArr &&
                    permissionArr?.map((permis, index) => (
                      <TableRow key={index}>
                        <TableCell>{permis && permis.func}</TableCell>
                        <TableCell>
                          {permis && permis.name && permis[permis.name] ? (
                            <CheckCircleIcon
                              fontSize="large"
                              style={{ color: "#99d066" }}
                            />
                          ) : (
                            <CancelIcon
                              fontSize="large"
                              style={{ color: "#f44336" }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowPermisDialog(false)}
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
                deleteBtnFunc(deleteId);
                setDeleteId("");
                setOpenDel(false);
              }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="secondary"
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

export default TableCRUDAdmin;
