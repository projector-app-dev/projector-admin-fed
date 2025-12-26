import { styled } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";
import Profile from "../Profile/Profile";
import type { NavBarType, NavLinkType } from "./NavBar.type";

const ActiveLink = styled(NavLink)({
  "&.active": {
    color: "#18045dff",
  },
});

const NavBar = (props: NavBarType) => {
  const { title, navLinks } = props;

  const navItems = navLinks?.map((nav: NavLinkType) => (
    <Button
      key={nav.title}
      sx={{ my: 2, color: "white", display: "block" }}
      component={ActiveLink}
      to={nav.path}
    >
      <Typography variant="button" sx={{ textAlign: "center" }}>
        {nav.title}
      </Typography>
    </Button>
  ));

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
          {navLinks && (
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              {navItems}
            </Box>
          )}
          {props.currentUser && (
            <Typography variant="h6" noWrap component="div">
              {props.currentUser.name}
            </Typography>
          )}
          <Profile />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
