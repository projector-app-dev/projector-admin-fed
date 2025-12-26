import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext/AppContext";
import type {
  ClientType,
  ProjectType,
  UserType,
} from "../../../services/common.type";
import DocumentInfoTemplate from "../../templates/DocumentInfoTemplate/DocumentInfoTemplate";
import {
  getClientById,
  getProjectsByClientId,
  getStringFromTimestamp,
} from "../../../services/client.service";
import Chip from "@mui/material/Chip";
import { getUserById } from "../../../services/user.service";

const ClientInfoPage = () => {
  const { clientId } = useParams();
  const [clientProjects, setClientProjects] = useState<ProjectType[]>([]);
  const [client, setClient] = useState<ClientType | null>(null);
  const [userCreated, setUserCreated] = useState<UserType | null>(null);
  const { loading, setLoading } = useAppContext();

  useEffect(() => {
    setLoading(true);

    if (clientId) {
      getClientById(clientId)
        .then((client) => {
          if (client) {
            setClient(client);
            getUserById(client.userIdCreated).then((user) => {
              setUserCreated(user);
            });
          }
        })
        .catch(() => setClient(null));
      getProjectsByClientId(clientId).then((projects) => {
        if (projects.length !== 0) {
          setClientProjects(projects);
        }
      });
    }

    setLoading(false);
  }, []);

  return (
    <DocumentInfoTemplate
      documentTitel={"Інформaція про клієнта"}
      isButtonsShown={false}
      buttonLabel={""}
    >
      {client ? (
        <>
          <Divider />
          <Box paddingLeft={1} paddingTop={1}>
            <Typography variant="subtitle2">Код клієнта</Typography>
            <Divider />
            <Typography variant="h6" gutterBottom>
              {client.code || "-"}
            </Typography>
          </Box>
          <Box paddingLeft={1} paddingTop={1}>
            <Typography variant="subtitle2">ПІБ</Typography>
            <Divider />
            <Typography variant="h6" gutterBottom>
              {`${
                client.surname + " " + client.name + " " + client.lastName
              }` || "-"}
            </Typography>
          </Box>
          <Box paddingLeft={1} paddingTop={1}>
            <Typography variant="subtitle2">Дата народження</Typography>
            <Divider />
            <Typography variant="h6" gutterBottom>
              {getStringFromTimestamp(client.birthDate) || "-"}
            </Typography>
          </Box>
          <Box paddingLeft={1} paddingTop={1}>
            <Typography variant="subtitle2">Телефон</Typography>
            <Divider />
            <Typography variant="h6" gutterBottom>
              {client.phone || "-"}
            </Typography>
          </Box>
          <Box paddingLeft={1} paddingTop={1}>
            <Typography variant="subtitle2">Електронна адреса</Typography>
            <Divider />
            <Typography variant="h6" gutterBottom>
              {client.email || "-"}
            </Typography>
          </Box>
          <Box paddingLeft={1} paddingTop={1}>
            <Typography variant="subtitle2">Адреса</Typography>
            <Divider />
            <Typography variant="h6" gutterBottom>
              {client.address || "-"}
            </Typography>
          </Box>
          <Box paddingLeft={1} paddingTop={1}>
            <Typography variant="subtitle2">Був Створений</Typography>
            <Divider />
            <Typography variant="h6" gutterBottom>
              {userCreated ? userCreated.name : "-"}
            </Typography>
          </Box>
          <Box paddingLeft={1} paddingTop={1}>
            <Typography variant="subtitle2">Проєкти</Typography>
            <Divider />
            <Box paddingTop={1}>
              {clientProjects.length !== 0
                ? clientProjects.map((clientProject) => {
                    return (
                      <Chip label={clientProject.shortName} sx={{ mr: 1 }} />
                    );
                  })
                : "-"}
            </Box>
          </Box>
        </>
      ) : !loading ? (
        <Alert severity="error">Щось пішло не так</Alert>
      ) : null}
    </DocumentInfoTemplate>
  );
};

export default ClientInfoPage;
