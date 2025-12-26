import type { Timestamp } from "firebase/firestore";

export interface ErrorType {
  errorCode: string;
  errorMessage: string;
}

export interface ProjectType {
  id: string;
  name: string;
  shortName: string;
  description?: string;
  startDate: Timestamp;
  endDate: Timestamp;
  clients?: string[];
}

export interface ClientType {
  id: string;
  code: string;
  surnameNameLastName?: string;
  name: string;
  lastName: string;
  surname: string;
  email: string;
  phone: string;
  birthDate: Timestamp;
  address?: string;
  userIdCreated: string;
}

export interface HistoryType {
  id: string;
  createdAt: Timestamp;
  record: string;
  files?: HistoryFileType[];
}

export interface HistoryFileType {
  link: string;
  name: string;
}

export interface UserType {
  id: string;
  name: string;
  phone: string;
  email: string;
  status?: string;
  accountId?: string;
}
