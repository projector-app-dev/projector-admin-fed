import InfoIcon from "@mui/icons-material/Info";
import type { SidePanelLinkType } from "../../organisms/SidePanel/SidePanel.type";
import Dashboard from "../../templates/DashboardTemplate/DashboardTemplate";

const ReportDashboard = () => {
    const sidePanelLinks: SidePanelLinkType[] = [
      {
        name: "Згенерувати",
        icon: <InfoIcon />,
        link: "/report/generate",
      },
    ];
  return (
    <Dashboard
      navTitle="Звіт"
      isSidePanelLinksShown={true}
      isProjectSelectorShown={false}
      sidePanelLinks={sidePanelLinks}    />
  );
};

export default ReportDashboard;
