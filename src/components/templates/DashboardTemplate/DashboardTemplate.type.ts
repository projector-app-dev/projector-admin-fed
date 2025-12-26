import type { ProjectType } from "../../../services/common.type";
import type { SidePanelLinkType } from "../../organisms/SidePanel/SidePanel.type";

export interface DashboardTemplateType {
    config?: ProjectType[]
    isSidePanelLinksShown: boolean
    sidePanelLinks: SidePanelLinkType[]
    isProjectSelectorShown: boolean
    navTitle: string
}