import React from "react";
import CurrencyFormat from "react-currency-format";

function StatementExcel({
  companyId,
  companyName,
  clientId,
  clientName,
  statementRows,
  us_fromDate,
  us_ToDate,
  totalStatement,
}) {
  return (
    <>
      <thead>
        <tr>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            colSpan={
              companyId &&
              companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID &&
              clientId &&
              process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS &&
              process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS.includes(
                clientId
              )
                ? 6
                : companyId &&
                  (companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID ||
                    companyId === process.env.REACT_APP_CUSTOM_SOREFAN_ID)
                ? 5
                : 4
            }
            data-f-bold={true}
            data-a-h="center"
          >
            {companyName || ""}
          </th>
        </tr>
        <tr>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            colSpan={
              companyId &&
              companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID &&
              clientId &&
              process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS &&
              process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS.includes(
                clientId
              )
                ? 6
                : companyId &&
                  (companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID ||
                    companyId === process.env.REACT_APP_CUSTOM_SOREFAN_ID)
                ? 5
                : 4
            }
            data-f-bold={true}
            data-a-h="center"
          >
            {`STATEMENT OF ACCOUNT FOR ${clientName || ""} FROM ${
              us_fromDate || ""
            } TO ${us_ToDate || ""}`}
          </th>
        </tr>
      </thead>
      {/** ------------------------------------------------------------ */}
      <tbody>
        <tr>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          ></td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            Date
          </td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            Invoice Number
          </td>
          {companyId && companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID ? (
            <td
              data-b-a-s="thin"
              data-b-a-c="00000000"
              data-f-bold={true}
              data-a-h="center"
            >
              Customer's
            </td>
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
            <td
              data-b-a-s="thin"
              data-b-a-c="00000000"
              data-f-bold={true}
              data-a-h="center"
            >
              Job Ref
            </td>
          ) : (
            <></>
          )}
          {companyId &&
          companyId === process.env.REACT_APP_CUSTOM_SOREFAN_ID ? (
            <td
              data-b-a-s="thin"
              data-b-a-c="00000000"
              data-f-bold={true}
              data-a-h="center"
            >
              Remarks
            </td>
          ) : (
            <></>
          )}
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            Amount
          </td>
        </tr>
        {/** ------------------------------------------------------------ */}
        {statementRows &&
          statementRows?.length > 0 &&
          statementRows?.map((row, index) => (
            <tr key={index}>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {index + 1}
              </td>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {row?.date !== undefined && row?.date !== null ? row?.date : ""}
              </td>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {row?.receiptNumber !== undefined && row?.receiptNumber !== null
                  ? row?.receiptNumber
                  : ""}
              </td>
              {companyId &&
              companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID ? (
                <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                  {row?.customerName !== undefined && row?.customerName !== null
                    ? row?.customerName
                    : ""}
                </td>
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
                <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                  {row?.invJobRef !== undefined && row?.invJobRef !== null
                    ? row?.invJobRef
                    : ""}
                </td>
              ) : (
                <></>
              )}
              {companyId &&
              companyId === process.env.REACT_APP_CUSTOM_SOREFAN_ID ? (
                <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                  {row?.docRemarks !== undefined && row?.docRemarks !== null
                    ? row?.docRemarks
                    : ""}
                </td>
              ) : (
                <></>
              )}
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {/*  {row?.amount !== undefined && row?.amount !== null
                  ? row?.amount
                  : ""} */}

                <CurrencyFormat
                  value={Number(row?.amount || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </td>
            </tr>
          ))}

        <tr>
          <td></td>
          <td></td>
          <td></td>
          {companyId &&
          (companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID ||
            companyId === process.env.REACT_APP_CUSTOM_SOREFAN_ID) ? (
            <td></td>
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
            <td></td>
          ) : (
            <></>
          )}
          <td></td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          {companyId &&
          (companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID ||
            companyId === process.env.REACT_APP_CUSTOM_SOREFAN_ID) ? (
            <td></td>
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
            <td></td>
          ) : (
            <></>
          )}
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            TOTAL
          </td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            {/*             {totalStatement || 0} */}
            <CurrencyFormat
              value={Number(totalStatement || 0).toFixed(2)}
              displayType={"text"}
              thousandSeparator={true}
            />
          </td>
        </tr>
      </tbody>
    </>
  );
}

export default StatementExcel;
