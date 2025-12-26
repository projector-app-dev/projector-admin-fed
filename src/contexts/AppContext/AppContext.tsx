import { createContext, useContext } from "react";
import type { AppContextType } from "./AppContext.type";
import type { ProjectType } from "../../services/common.type";

export const AppContext = createContext<AppContextType>({
  selectedProject: "",
  setSelectedProject: (_id: string) => {},
  projects: [],
  setProjects: (_projects: ProjectType[]) => {},
  loading: false,
  setLoading: (_loading: boolean) => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppContext;
