import type { UserType } from "../../../services/common.type"

export interface NavLinkType {
    title: string
    path: string
}

export interface NavBarType {
    title: string
    navLinks?: any[]
    currentUser: UserType | null
}