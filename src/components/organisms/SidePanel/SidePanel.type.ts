import type { ProjectType } from "../../../services/common.type";

export interface SidePanelType {
    config?: ProjectType[]
    isSidePanelLinksShown: boolean
    sidePanelLinks: SidePanelLinkType[]
    isProjectSelectorShown: boolean
}

export interface SidePanelLinkType {
    name: string
    icon: React.ReactNode
    link: string
}