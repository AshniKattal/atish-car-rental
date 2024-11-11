import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import React from "react";
import CurrencyFormat from "react-currency-format";

function StatementTable({
  companyId,
  clientId,
  clientName,
  statementRows,
  us_fromDate,
  us_ToDate,
  totalStatement,
}) {
  return (
    <TableContainer>
      <Table border={1}>
        <TableBody>
          <TableRow>
            <TableCell
              size="small"
              align="center"
              colSpan={
                companyId &&
                companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID &&
                clientId &&
                process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS &&
                process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS.includes(
                  clientId
                )
                  ? 6
                  : (companyId &&
                      companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID) ||
                    (companyId &&
                      companyId === process.env.REACT_APP_CUSTOM_SOREFAN_ID)
                  ? 5
                  : 4
              }
              style={{
                fontWeight: "bolder",
                whiteSpace: "nowrap",
              }}
            >
              {`STATEMENT OF ACCOUNT FOR ${clientName || ""} FROM ${
                us_fromDate || ""
              } TO ${us_ToDate || ""}`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              size="small"
              align="center"
              style={{
                fontWeight: "bolder",
                whiteSpace: "nowrap",
              }}
            />
            <TableCell
              size="small"
              align="center"
              style={{
                fontWeight: "bolder",
                whiteSpace: "nowrap",
              }}
            >
              Date
            </TableCell>
            <TableCell
              size="small"
              align="center"
              style={{
                fontWeight: "bolder",
                whiteSpace: "nowrap",
              }}
            >
              Invoice Number
            </TableCell>
            {companyId &&
            companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID ? (
              <>
                <TableCell
                  size="small"
                  align="center"
                  style={{
                    fontWeight: "bolder",
                    whiteSpace: "nowrap",
                  }}
                >
                  Customer's
                </TableCell>

                {clientId &&
                process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS &&
                process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS.includes(
                  clientId
                ) ? (
                  <TableCell
                    size="small"
                    align="center"
                    style={{
                      fontWeight: "bolder",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Job Ref
                  </TableCell>
                ) : (
                  <></>
                )}
              </>
            ) : companyId &&
              companyId === process.env.REACT_APP_CUSTOM_SOREFAN_ID ? (
              <TableCell
                size="small"
                align="center"
                style={{
                  fontWeight: "bolder",
                  whiteSpace: "nowrap",
                }}
              >
                Remarks
              </TableCell>
            ) : (
              <></>
            )}

            <TableCell
              size="small"
              align="center"
              style={{
                fontWeight: "bolder",
                whiteSpace: "nowrap",
              }}
            >
              Amount
            </TableCell>
          </TableRow>

          {statementRows &&
            statementRows?.length > 0 &&
            statementRows?.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  size="small"
                  align="center"
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  size="small"
                  align="center"
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {row?.date !== undefined && row?.date !== null
                    ? row?.date
                    : ""}
                </TableCell>
                <TableCell
                  size="small"
                  align="center"
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {row?.receiptNumber !== undefined &&
                  row?.receiptNumber !== null
                    ? row?.receiptNumber
                    : ""}
                </TableCell>
                {companyId &&
                companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID ? (
                  <>
                    <TableCell
                      size="small"
                      align="center"
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row?.customerName || ""}
                    </TableCell>

                    {clientId &&
                    process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS &&
                    process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS.includes(
                      clientId
                    ) ? (
                      <TableCell
                        size="small"
                        align="center"
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row?.invJobRef || ""}
                      </TableCell>
                    ) : (
                      <></>
                    )}
                  </>
                ) : companyId &&
                  companyId === process.env.REACT_APP_CUSTOM_SOREFAN_ID ? (
                  <TableCell
                    size="small"
                    align="center"
                    style={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row?.docRemarks || ""}
                  </TableCell>
                ) : (
                  <></>
                )}

                <TableCell
                  size="small"
                  align="center"
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {/*                   {row?.amount !== undefined && row?.amount !== null
                    ? row?.amount
                    : ""} */}

                  <CurrencyFormat
                    value={Number(row?.amount || 0).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            {companyId &&
            companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID ? (
              <TableCell></TableCell>
            ) : (
              <></>
            )}
            {companyId &&
            companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID &&
            clientId &&
            process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS &&
            process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS.includes(
              clientId
            ) ? (
              <TableCell></TableCell>
            ) : (
              <></>
            )}
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            {companyId &&
            (companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID ||
              companyId === process.env.REACT_APP_CUSTOM_SOREFAN_ID) ? (
              <TableCell></TableCell>
            ) : (
              <></>
            )}
            {companyId &&
            companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID &&
            clientId &&
            process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS &&
            process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS.includes(
              clientId
            ) ? (
              <TableCell></TableCell>
            ) : (
              <></>
            )}
            <TableCell
              size="small"
              align="center"
              style={{
                whiteSpace: "nowrap",
                fontWeight: "bolder",
              }}
            >
              TOTAL
            </TableCell>
            <TableCell
              size="small"
              align="center"
              style={{
                whiteSpace: "nowrap",
                fontWeight: "bolder",
              }}
            >
              {/*      {totalStatement} */}
              <CurrencyFormat
                value={Number(totalStatement || 0).toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StatementTable;
