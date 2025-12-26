import Dashboard from "../../templates/DashboardTemplate/DashboardTemplate";
import type { SidePanelLinkType } from "../../organisms/SidePanel/SidePanel.type";
import InfoIcon from "@mui/icons-material/Info";

const UserDashboard = () => {
  const sidePanelLinks: SidePanelLinkType[] = [
    {
      name: "Усі Користувачі",
      icon: <InfoIcon />,
      link: "/users/all",
    },
  ];
  return (
    <Dashboard
      navTitle="Користувачі"
      sidePanelLinks={sidePanelLinks}
      isSidePanelLinksShown={true}
      isProjectSelectorShown={false}
    />
  );
};

export default UserDashboard;
