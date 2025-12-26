import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import AppContext from "../contexts/AppContext/AppContext";
import type { ProjectType } from "../services/common.type";
import { getAllProjectDocuments } from "../services/projects.service";
import { useAuthContext } from "../contexts/AuthContext/AuthContext";
import { Outlet } from "react-router-dom";

const AppProvider = () => {
  const { user } = useAuthContext();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      getAllProjectDocuments().then((projects) => setProjects(projects));
      setLoading(false);
    }
  }, [isLoading]);

  if (isLoading) {
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
    <AppContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        projects,
        setProjects,
        loading: isLoading,
        setLoading,
      }}
    >
      {!isLoading && <Outlet />}
    </AppContext.Provider>
  );
};

export default AppProvider;
