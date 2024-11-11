import PropTypes from "prop-types";
// @mui
import { styled } from "@mui/material/styles";
import { List, Box, ListSubheader } from "@mui/material";
//
import { NavListRoot } from "./NavList";
import useAuth from "../../../hooks/useAuth";
import { Fragment } from "react";

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => (
  <ListSubheader disableSticky disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.overline,
  paddingTop: theme.spacing(3),
  paddingLeft: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  isCollapse: PropTypes.bool,
  navConfig: PropTypes.array,
};

export default function NavSectionVertical({
  navConfig,
  isCollapse = false,
  ...other
}) {
  const { user } = useAuth();
  return (
    <Box {...other}>
      {navConfig.map((group, index) => {
        if (group?.type?.includes(user.role)) {
          return (
            <List key={group.subheader} disablePadding sx={{ px: 2 }}>
              {/*  {group.items.find(
                (item) =>
                  item?.permissions &&
                  user?.permissions[item.permissions] === true
              ) ? ( */}
              <ListSubheaderStyle
                sx={{
                  ...(isCollapse && {
                    opacity: 0,
                  }),
                }}
              >
                {group.subheader}
              </ListSubheaderStyle>
              {/*   ) : (
                <></>
              )} */}

              {group.items.map((list, index) => {
                if (
                  user?.role === "super-admin" ||
                  (list?.title === "super admins" &&
                    user?.role === "super-admin") ||
                  (list?.title === "BugsBeGone Docs" &&
                    user?.a_comp?.find(
                      (comp) =>
                        comp.id === process.env.REACT_APP_CUSTOM_BUGSBEGONE_ID
                    )) ||
                  (list?.title !== "BugsBeGone Docs" &&
                    list?.title !== "super admins")
                ) {
                  return (
                    <NavListRoot
                      key={index}
                      list={list}
                      isCollapse={isCollapse}
                    />
                  );
                } else return <Fragment key={index}></Fragment>;
              })}
            </List>
          );
        } else return <Fragment key={index}></Fragment>;
      })}
    </Box>
  );
}
