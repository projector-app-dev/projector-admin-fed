import type { ReactNode } from "react"

export interface DocumentTemplateType {
    title: string
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    children: ReactNode
}