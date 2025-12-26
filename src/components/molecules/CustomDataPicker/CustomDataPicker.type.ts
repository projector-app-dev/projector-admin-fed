import type { Dayjs } from "dayjs"

export interface CustomDataPickerType {
    value: Dayjs | null
    setValue: (value: Dayjs | null) => void
    label: string
}