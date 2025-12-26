import Dashboard from "../../templates/DashboardTemplate/DashboardTemplate";
import { useAppContext } from "../../../contexts/AppContext/AppContext";
import type { SidePanelLinkType } from "../../organisms/SidePanel/SidePanel.type";
import InfoIcon from "@mui/icons-material/Info";
import GroupIcon from '@mui/icons-material/Group';

const ProjectsDashboard = () => {
  const { projects, selectedProject } = useAppContext();
  const sidePanelLinks: SidePanelLinkType[] = [
    {
      name: "Опис проєкту",
      icon: <InfoIcon />,
      link: `/projects/${selectedProject}`,
    },
    {
      name: "Клієнти проєкту",
      icon: <GroupIcon />,
      link: `/projects/${selectedProject}/clients`,
    },
  ];
  return (
    <Dashboard
      navTitle="Проєкти"
      config={projects}
      sidePanelLinks={sidePanelLinks}
      isSidePanelLinksShown={selectedProject !== ""}
      isProjectSelectorShown={true}
    />
  );
};

export default ProjectsDashboard;
