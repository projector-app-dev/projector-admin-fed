import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NotFoundPage from "../components/pages/NotFoundPage";
import { useAuthContext } from "../contexts/AuthContext/AuthContext";
import UserContext from "../contexts/UserContext/UserContext";
import { isUserAdminByUid } from "../services/user.service";

const UserProvider = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    if (user) {
      isUserAdminByUid(user.uid)
        .then((isAdmin) => setIsAdmin(isAdmin))
        .catch(() => setIsAdmin(false))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: "60%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <UserContext.Provider
      value={{
        isAdmin,
        setIsAdmin,
      }}
    >
      {isAdmin ? <Outlet /> : <NotFoundPage isAdmin />}
    </UserContext.Provider>
  );
};

export default UserProvider;
