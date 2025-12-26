import Dashboard from "../../templates/DashboardTemplate/DashboardTemplate";
import type { SidePanelLinkType } from "../../organisms/SidePanel/SidePanel.type";
import InfoIcon from "@mui/icons-material/Info";

const ClientDashboard = () => {
  const sidePanelLinks: SidePanelLinkType[] = [
    {
      name: "Усі Клієнти",
      icon: <InfoIcon />,
      link: "/clients/all",
    },
  ];
  return (
    <Dashboard
      navTitle="Клієнти"
      sidePanelLinks={sidePanelLinks}
      isSidePanelLinksShown={true}
      isProjectSelectorShown={false}
    />
  );
};

export default ClientDashboard;
