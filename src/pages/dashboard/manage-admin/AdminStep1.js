import { Autocomplete, Grid, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import db from "src/firebase";
import useAuth from "src/hooks/useAuth";

export default function AdminStep1({
  adminDetails,
  setAdminDetails,
  selectedCompanies,
  set_selectedCompanies,
  type,
  dialogType,
}) {
  const { user } = useAuth();

  const [allCompanies, setAllCompanies] = useState([]);

  const temp_getAllCompanies_superAdmin = useRef();

  useEffect(() => {
    temp_getAllCompanies_superAdmin.current();
  }, [type, user]);

  async function getAllCompaniesForSuperAdmin() {
    if (user?.role === "super-admin") {
      // get all companies as autocomplete options
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
            setAllCompanies(arr);
          }
        });
    } else {
      if (dialogType === "add") {
        // for other admins -> display only their companies as options
        setAllCompanies([...(user?.a_comp || [])]);
      } else if (dialogType === "update") {
        setAllCompanies([...(adminDetails?.a_comp || [])]);
      }
    }

    // display saved options (for update only)
    if (set_selectedCompanies && dialogType === "update") {
      if (adminDetails?.a_comp) {
        set_selectedCompanies([...(adminDetails?.a_comp || [])]);
      } else {
        set_selectedCompanies([]);
      }
    }
  }

  temp_getAllCompanies_superAdmin.current = getAllCompaniesForSuperAdmin;

  const handleSelectChange = async (e, value) => {
    e.preventDefault();
    setAdminDetails({
      ...adminDetails,
      a_comp: value,
    });
    set_selectedCompanies(value);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          variant="outlined"
          size="small"
          required
          fullWidth
          name="firstName"
          label="First Name"
          type="text"
          id="firstName"
          value={adminDetails?.firstName || ""}
          onChange={(event) => {
            setAdminDetails({
              ...adminDetails,
              firstName: event.target.value,
            });
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          variant="outlined"
          size="small"
          required
          fullWidth
          name="lastName"
          label="Last Name"
          type="text"
          id="lastName"
          value={adminDetails?.lastName || ""}
          onChange={(event) => {
            setAdminDetails({
              ...adminDetails,
              lastName: event.target.value,
            });
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          variant="outlined"
          size="small"
          required
          fullWidth
          name="contactNumber"
          label="Contact Number"
          type="text"
          id="contactNumber"
          value={adminDetails?.contactNumber || ""}
          onChange={(event) => {
            setAdminDetails({
              ...adminDetails,
              contactNumber: event.target.value,
            });
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          variant="outlined"
          size="small"
          required
          fullWidth
          name="email"
          label="Email Address"
          type="text"
          id="email"
          value={adminDetails?.email || ""}
          onChange={(event) => {
            setAdminDetails({
              ...adminDetails,
              email: event.target.value,
            });
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          variant="outlined"
          size="small"
          required
          fullWidth
          name="password"
          label="Password"
          type="text"
          id="password"
          value={adminDetails?.password || ""}
          onChange={(event) => {
            setAdminDetails({
              ...adminDetails,
              password: event.target.value,
            });
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Autocomplete
          ListboxProps={{ style: { maxHeight: "70vh" } }}
          size="small"
          label="Access"
          id="access-drop-down"
          options={[true, false]}
          value={adminDetails?.access || null}
          renderInput={(params) => <TextField {...params} label="Access" />}
          required
          onChange={(e, value, reason) => {
            e.preventDefault();
            if (reason !== "removeOption" && reason !== "clear" && value) {
              setAdminDetails({
                ...adminDetails,
                access: value,
              });
            } else if (reason === "removeOption" || reason === "clear") {
              setAdminDetails({
                ...adminDetails,
                access: false,
              });
            }
          }}
          getOptionLabel={(option) =>
            option === true ? "Allow access" : "Restrict access"
          }
          fullWidth
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Autocomplete
          size="small"
          label="Role"
          id="role-drop-down"
          options={["Admin", "Secretary", "SalePerson"]}
          value={adminDetails?.role || null}
          renderInput={(params) => (
            <TextField {...params} label="Role" required />
          )}
          required
          onChange={(e, value, reason) => {
            e.preventDefault();
            if (reason !== "removeOption" && reason !== "clear" && value) {
              setAdminDetails({
                ...adminDetails,
                role: value,
              });
            } else if (reason === "removeOption" || reason === "clear") {
              setAdminDetails({
                ...adminDetails,
                role: false,
              });
            }
          }}
          getOptionLabel={(option) => option}
          fullWidth
        />
      </Grid>

      {/* {(user && user?.role === "super-admin" && type === "admin") ||
      user?.role === "super-admin" ? ( */}
      <Grid item xs={12} md={6}>
        <Autocomplete
          multiple
          size="small"
          label="Please choose a company"
          id="company-drop-down"
          options={allCompanies}
          value={selectedCompanies || []}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Please choose a company"
              InputLabelProps={{ required: true }}
            />
          )}
          required
          onChange={(e, value, reason) => handleSelectChange(e, value, reason)}
          getOptionLabel={(option) => option?.name}
          fullWidth
        />
      </Grid>
      {/* ) : (
        <></>
      )} */}
    </Grid>
  );
}
