import type { ReactNode } from "react";

export interface DocumentInfoTemplateType {
    documentTitel: string
    children: ReactNode
    isButtonsShown: boolean
    buttonLabel?: string
    onClickButton?: (event: React.MouseEvent<HTMLElement>) => void
}