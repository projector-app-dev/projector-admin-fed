import type { ProjectType } from "../../services/common.type"

export interface AppContextType {
    selectedProject: string
    setSelectedProject: (id: string) => void 
    projects: ProjectType[]
    setProjects: (projects: ProjectType[]) => void
    loading: boolean
    setLoading: (loading: boolean) => void
}