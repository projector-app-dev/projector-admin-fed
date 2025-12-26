import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext/AppContext";
import type { UserType } from "../../../services/common.type";
import { getUserById } from "../../../services/user.service";
import DocumentInfoTemplate from "../../templates/DocumentInfoTemplate/DocumentInfoTemplate";

const UserInfoPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<UserType | null>(null);
  const { loading, setLoading } = useAppContext();

  useEffect(() => {
    setLoading(true);

    if (userId) {
      getUserById(userId)
        .then((user) => {
          if (user) {
            setUser(user);
          }
        })
        .catch(() => setUser(null));
    }

    setLoading(false);
  }, []);

  return (
    <DocumentInfoTemplate
      documentTitel={"Інформaція про користувача"}
      isButtonsShown={false}
      buttonLabel={""}
    >
      {user ? (
        <>
          <Divider />
          <Box paddingLeft={1} paddingTop={1}>
            <Typography variant="subtitle2">ПІБ</Typography>
            <Divider />
            <Typography variant="h6" gutterBottom>
              {user.name || "-"}
            </Typography>
          </Box>
          <Box paddingLeft={1} paddingTop={1}>
            <Typography variant="subtitle2">Мобільний</Typography>
            <Divider />
            <Typography variant="h6" gutterBottom>
              {user.phone || "-"}
            </Typography>
          </Box>
          <Box paddingLeft={1} paddingTop={1}>
            <Typography variant="subtitle2">Емейл</Typography>
            <Divider />
            <Typography variant="h6" gutterBottom>
              {user.email || "-"}
            </Typography>
          </Box>
        </>
      ) : !loading ? (
        <Alert severity="error">Щось пішло не так</Alert>
      ) : null}
    </DocumentInfoTemplate>
  );
};

export default UserInfoPage;
