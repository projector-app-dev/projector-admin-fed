import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext/AppContext";
import { getStringFromTimestamp } from "../../../services/client.service";
import type { ProjectType } from "../../../services/common.type";
import {
  deleteProjectDocument,
  getProjectById,
} from "../../../services/projects.service";
import DocumentInfoTemplate from "../../templates/DocumentInfoTemplate/DocumentInfoTemplate";

const ProjectsInfoPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectType | null>(null);
  const { loading, setLoading } = useAppContext();
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const onClickButton = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    navigate(`/projects/${projectId}/edit`);
  };

  useEffect(() => {
    setLoading(true);

    if (projectId) {
      getProjectById(projectId)
        .then((project) => {
          if (project) {
            setProject(project);
          }
        })
        .catch(() => setProject(null));
    }

    setLoading(false);
  }, []);

  const deleteProject = (project: ProjectType) => {
    if (project.clients && project.clients?.length > 0) {
      setOpenSnackbar(true)
    } else {
      deleteProjectDocument(project.id.toString()).then(() => {
        navigate("/", { replace: true });
        window.location.reload();
      });
    }
  };

  return (
    <DocumentInfoTemplate
      documentTitel={"Інформaція про проєкт"}
      isButtonsShown={project !== null}
      onClickButton={onClickButton}
      buttonLabel="Редагувати"
    >
      {project ? (
        <>
          <Divider />
          <Box
            paddingLeft={1}
            paddingTop={1}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <IconButton
              aria-label="delete"
              onClick={() => deleteProject(project)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          <Box paddingLeft={1} paddingTop={1}>
            <Typography variant="subtitle2">Назва проєкту</Typography>
            <Divider />
            <Typography variant="h6" gutterBottom>
              {project.name || "-"}
            </Typography>
          </Box>
          <Box paddingLeft={1} paddingTop={1}>
            <Typography variant="subtitle2">Коротка назва проєкту</Typography>
            <Divider />
            <Typography variant="h6" gutterBottom>
              {project.shortName || "-"}
            </Typography>
          </Box>
          <Box
            paddingLeft={1}
            paddingTop={1}
            display="flex"
            flexDirection="row"
            justifyContent="space-around"
          >
            <Box>
              <Typography variant="subtitle2">Початок проєкту</Typography>
              <Divider />
              <Typography variant="h6" gutterBottom>
                {getStringFromTimestamp(project.startDate) || "-"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Кінець проєкту</Typography>
              <Divider />
              <Typography variant="h6" gutterBottom>
                {getStringFromTimestamp(project.endDate) || "-"}
              </Typography>
            </Box>
          </Box>
          <Box paddingLeft={1} paddingTop={1}>
            <Typography variant="subtitle2" gutterBottom>
              Опис проєкту
            </Typography>
            <Divider />
            <Typography variant="h6" gutterBottom>
              {project?.description || "-"}
            </Typography>
          </Box>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={openSnackbar}
            autoHideDuration={5000}
            onClose={() => setOpenSnackbar(false)}
          >
            <Alert
              onClose={() => setOpenSnackbar(false)}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {"Не можна видалити, бо в проєкті є клієнти"}
            </Alert>
          </Snackbar>
        </>
      ) : !loading ? (
        <Alert severity="error">Щось пішло не так</Alert>
      ) : null}
    </DocumentInfoTemplate>
  );
};

export default ProjectsInfoPage;
