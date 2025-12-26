import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import { useNavigate } from "react-router-dom";
import type { ErrorType } from "../../../services/common.type";
import {
  generateFirebaseAuthErrorMessage,
  logOut,
} from "../../../services/authorization.service";
import { useAuthContext } from "../../../contexts/AuthContext/AuthContext";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Profile = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [error, setError] = React.useState<null | ErrorType>(null);
  const [openAlert, setOpenAllert] = React.useState<boolean>(false);
  const { setUser } = useAuthContext();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogOut = () => {
    setAnchorEl(null);
    setError(null);

    logOut(setError).then((isLogOut) => {
      if (isLogOut) {
        setUser(null);
        navigate("/login");
      }
    });

    if (error) {
      setOpenAllert(true);
    }
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleLogOut}>Вийти</MenuItem>
      </Menu>
      {error && (
        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          onClose={() => setOpenAllert(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenAllert(false)}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {generateFirebaseAuthErrorMessage(error)}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default Profile;
