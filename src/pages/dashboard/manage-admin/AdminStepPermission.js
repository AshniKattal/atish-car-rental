import {
  Button,
  Checkbox,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getPermissions } from "../permisssions/Permissions";
import useAuth from "src/hooks/useAuth";
import { Fragment, useEffect, useRef, useState } from "react";
import db from "src/firebase";

export default function AdminStepPermission({
  adminDetails,
  setAdminDetails,
  type,
  dialogType,
}) {
  const { user } = useAuth();

  const temp_getAllCompanies_superAdmin = useRef();

  const temp_getDefaultPermissionsRef = useRef();

  const [permissionState, setPermissionState] = useState([]);

  const [companyList, setCompanyList] = useState([]);

  const [groupedPermissionsById, setGroupedPermissionsById] = useState([]);

  useEffect(() => {
    temp_getAllCompanies_superAdmin.current();
  }, [user]);

  useEffect(() => {
    temp_getDefaultPermissionsRef.current();
  }, []);

  async function getDefaultPermissions() {
    let newPermissionList = await getPermissions();

    if (newPermissionList && newPermissionList?.length > 0) {
      const groupedById = Object.values(
        [...newPermissionList].reduce((acc, obj) => {
          const key = obj.id;

          // If the key doesn't exist in the accumulator, create it
          if (!acc[key]) {
            acc[key] = [];
          }

          // Push the current object into the corresponding group
          acc[key].push(obj);

          return acc;
        }, {})
      );

      if (dialogType === "update") {
        // apply user permissions
        let newPermissionListWithSavedData = [];
        let userPermission = adminDetails?.sysFunc || [];
        newPermissionList.forEach((permission) => {
          // if (adminDetails?.role === "super-admin") {
          if (userPermission && userPermission?.length > 0) {
            let savedCompanyIds =
              userPermission.find(
                (savedPermission) => savedPermission?.name === permission?.name
              )?.assignedCompanyId || [];

            newPermissionListWithSavedData.push({
              ...permission,
              assignedCompanyId: savedCompanyIds,
            });
          } else {
            newPermissionListWithSavedData.push({ ...permission });
          }
          /*   } else {
            if (userPermission && userPermission?.length > 0) {
              let checkedPermission = userPermission.find(
                (savedPermission) => savedPermission[permission?.name] === true
              );

              const companyIds = adminDetails?.a_comp.map((comp) => comp.id);

              if (checkedPermission) {
                newPermissionListWithSavedData.push({
                  ...permission,
                  assignedCompanyId: [...(companyIds || [])],
                });
              } else {
                newPermissionListWithSavedData.push({
                  ...permission,
                  assignedCompanyId: [],
                });
              }
            } else {
              newPermissionListWithSavedData.push({ ...permission });
            }
          } */
        });

        setAdminDetails({
          ...adminDetails,
          sysFunc: newPermissionListWithSavedData,
        });

        setPermissionState([...newPermissionListWithSavedData]);
      } else {
        let clonePermissions = [];

        newPermissionList.forEach((permission) => {
          clonePermissions.push({ ...permission });
        });

        setAdminDetails({
          ...adminDetails,
          sysFunc: [...newPermissionList],
        });

        setPermissionState([...newPermissionList]);
      }

      setGroupedPermissionsById(groupedById);
    }
  }

  temp_getDefaultPermissionsRef.current = getDefaultPermissions;

  async function getAllCompaniesForSuperAdmin() {
    if (type === "super-admin" && user && user?.role === "super-admin") {
      // get all companies
      await db
        .collection("company")
        .get()
        .then((querySnapshot) => {
          if (
            querySnapshot &&
            querySnapshot.docs &&
            querySnapshot.docs.length > 0
          ) {
            let arr = [];
            querySnapshot.docs.forEach((doc) => {
              if (doc?.id !== "companyIds" && doc?.data()?.name) {
                arr.push({
                  id: doc.id,
                  name: doc?.data()?.name,
                });
              }
            });
            setCompanyList(arr);
          }
        });
    } else if (type !== "super-admin") {
      setCompanyList([...(adminDetails?.a_comp || [])]);
    }
  }

  temp_getAllCompanies_superAdmin.current = getAllCompaniesForSuperAdmin;

  function handleChkChange(value, companyId, state) {
    let newPermissionState = [...permissionState];

    let index = newPermissionState.findIndex(
      (newState) => newState?.name === state?.name
    );

    let newCompanyArray = [
      ...(newPermissionState[index]?.assignedCompanyId || []),
    ];

    if (value) {
      // add company
      newCompanyArray.push(companyId);
      newCompanyArray = [...new Set(newCompanyArray)];
    } else {
      // remove company
      if (newCompanyArray?.length > 0) {
        newCompanyArray = newCompanyArray.filter(
          (compId) => compId !== companyId
        );
      }
    }

    newPermissionState[index] = {
      ...newPermissionState[index],
      assignedCompanyId: newCompanyArray,
    };

    setPermissionState(newPermissionState);

    setAdminDetails({
      ...adminDetails,
      sysFunc: newPermissionState,
    });
  }

  function assignShortcut(companyId, value) {
    let newPermissionState = [];

    permissionState.forEach((state) => {
      let newCompanyArray = [...(state?.assignedCompanyId || [])];
      if (value) {
        // add company
        newCompanyArray.push(companyId);
        newCompanyArray = [...new Set(newCompanyArray)];
      } else {
        // remove company
        if (newCompanyArray?.length > 0) {
          newCompanyArray = newCompanyArray.filter(
            (compId) => compId !== companyId
          );
        }
      }

      newPermissionState.push({
        ...state,
        assignedCompanyId: newCompanyArray,
      });
    });

    setPermissionState(newPermissionState);

    setAdminDetails({
      ...adminDetails,
      sysFunc: newPermissionState,
    });
  }

  return (
    <>
      <Typography variant="h5">Permissions</Typography>
      <TableContainer>
        <Table border={1} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell size="small" style={{ minWidth: "200px" }}>
                <b>Overall section</b>
              </TableCell>

              <TableCell size="small" style={{ minWidth: "300px" }}>
                <b>Functionalities</b>
              </TableCell>

              {companyList?.length > 0 ? (
                companyList?.map((comp, index) => (
                  <TableCell align="center" size="small" key={index}>
                    <Stack
                      spacing={1}
                      direction={"column"}
                      justifyContent={"flex-end"}
                      sx={{ height: "100%" }}
                    >
                      {`${comp?.name || ""}`}

                      {user?.role === "super-admin" ? (
                        <>
                          <Divider />
                          <Stack
                            spacing={1}
                            direction={"row"}
                            alignItems={"flex-end"}
                            justifyContent={"center"}
                            sx={{ height: "100%" }}
                          >
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={() => assignShortcut(comp.id, true)}
                            >
                              All
                            </Button>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={() => assignShortcut(comp.id, false)}
                            >
                              None
                            </Button>
                          </Stack>
                        </>
                      ) : (
                        <></>
                      )}
                    </Stack>
                  </TableCell>
                ))
              ) : (
                <></>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedPermissionsById?.map(
              (permissionByIdArray, indexPermissionlist) => (
                <Fragment key={indexPermissionlist}>
                  {permissionByIdArray.map((permission, indexPermission) => {
                    let display = false;

                    if (
                      // display all if user is super admin
                      user?.role === "super-admin" ||
                      // display all none super admin and bugs be gone options
                      (permissionByIdArray[0]?.id !== "super-admin" &&
                        permissionByIdArray[0]?.id !== "bugsBeGone") ||
                      // display bugs be gone option only if user has been assigned this company
                      (permissionByIdArray[0]?.id === "bugsBeGone" &&
                        adminDetails?.a_comp &&
                        adminDetails?.a_comp?.length > 0 &&
                        adminDetails?.a_comp?.find(
                          (comp) =>
                            comp?.id ===
                            process.env.REACT_APP_CUSTOM_BUGSBEGONE_ID
                        ))
                    ) {
                      display = true;
                    }

                    if (display) {
                      return (
                        <TableRow key={indexPermission}>
                          {indexPermission === 0 ? (
                            <TableCell
                              size="small"
                              rowSpan={permissionByIdArray[0]?.rowSpan}
                            >
                              <b>{permissionByIdArray[0]?.title}</b>
                            </TableCell>
                          ) : (
                            <></>
                          )}

                          <TableCell
                            size="small"
                            style={{ whiteSpace: "nowrap", padding: 10 }}
                          >
                            {permission?.func}
                          </TableCell>

                          {companyList?.length > 0 ? (
                            companyList?.map((comp, compIndex) => (
                              <TableCell
                                size="small"
                                key={compIndex}
                                align="center"
                              >
                                <Checkbox
                                  checked={
                                    permissionState
                                      ?.find(
                                        (state) =>
                                          state?.name === permission?.name
                                      )
                                      ?.assignedCompanyId.includes(comp?.id)
                                      ? true
                                      : false
                                  }
                                  onChange={(e) =>
                                    handleChkChange(
                                      e.target.checked,
                                      comp?.id,
                                      permissionState?.find(
                                        (state) =>
                                          state?.name === permission?.name
                                      )
                                    )
                                  }
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </TableCell>
                            ))
                          ) : (
                            <></>
                          )}
                        </TableRow>
                      );
                    } else return <></>;
                  })}
                </Fragment>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
