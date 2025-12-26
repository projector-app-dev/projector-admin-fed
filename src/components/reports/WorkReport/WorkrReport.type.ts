import type { Dayjs } from "dayjs";

export interface WorkReportType {
    projectName?: string,
    userName?: string,
    mainText?: string,
    summeryText?: string,
    records: RecordType[],
    startData?: Dayjs | null,
    endData?: Dayjs | null,
}

export interface RecordType {
    clientCode: string,
    record: string,
    data: string,
}