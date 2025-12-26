import dayjs, { Dayjs } from "dayjs";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../config/firebase";
import type { ClientType, HistoryType, ProjectType } from "./common.type";
import { deleteObject, listAll, ref } from "firebase/storage";

const DOCUMENT_NAME = "clients";

export const addClientDocument = async (
  props: ClientType
): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, DOCUMENT_NAME), {
      code: props.code,
      address: props.address,
      userIdCreated: props.userIdCreated,
      name: props.name,
      lastName: props.lastName,
      surname: props.surname,
      phone: props.phone,
      email: props.email,
      birthDate: props.birthDate,
    });
    return docRef.id;
  } catch (error) {
    return null;
  }
};

export const getHistoryRecordById = async (
  projectId: string,
  clientId: string,
  historyId: string
): Promise<HistoryType | null> => {
  try {
    const docRef = doc(
      db,
      `${DOCUMENT_NAME}/${clientId}/projects/${projectId}/history`,
      historyId
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        createdAt: docSnap.data().createdAt,
        record: docSnap.data().record,
        files: docSnap.data().files,
      } as HistoryType;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const addClientHistory = async (
  projectId: string,
  clientId: string,
  userId: string,
  record: string
): Promise<string | null> => {
  try {
    const docRef = await addDoc(
      collection(
        db,
        `${DOCUMENT_NAME}/${clientId}/projects/${projectId}/history`
      ),
      {
        record: record,
        userId: userId,
        projectId: projectId,
        createdAt: serverTimestamp(),
      }
    );
    return docRef.id;
  } catch (error) {
    return null;
  }
};

export const updateClientHistory = async (
  projectId: string,
  clientId: string,
  historyId: string,
  fileName: string,
  downloadLink: string
): Promise<void> => {
  const docRef = doc(
    db,
    `${DOCUMENT_NAME}/${clientId}/projects/${projectId}/history`,
    historyId
  );
  await updateDoc(docRef, {
    files: arrayUnion({ link: downloadLink, name: fileName }),
  });
};

export const updateClientHistoryRecord = async (
  projectId: string,
  clientId: string,
  historyId: string,
  record: string,
  createdAt: Timestamp,
): Promise<void> => {
  const docRef = doc(
    db,
    `${DOCUMENT_NAME}/${clientId}/projects/${projectId}/history`,
    historyId
  );
  await updateDoc(docRef, {
    record: record,
    createdAt: createdAt,
  });
};

export const deleteClientHistory = async (
  projectId: string,
  clientId: string,
  historyId: string
): Promise<void> => {
  const folderRef = ref(
    storage,
    `/uploads/projects/${projectId}/clients/${clientId}/history/${historyId}`
  );

  await listAll(folderRef).then((listResults) => {
    const deletePromises = listResults.items.map((itemRef) => {
      return deleteObject(itemRef);
    });
    Promise.all(deletePromises)
      .then(() => {
        console.log("Folder contents deleted successfully");
      })
      .catch((error) => {
        console.log("Folder contents deleted successfully error:", error);
      });
  });
  await deleteDoc(
    doc(
      db,
      DOCUMENT_NAME,
      `${clientId}/projects/${projectId}/history/${historyId}`
    )
  );
};

export const deleteClientDocument = async (id: string): Promise<void> => {
  const docRef = doc(db, DOCUMENT_NAME, id);
  const projectsCollectionRef = collection(docRef, "projects");
  const querySnapshot = await getDocs(projectsCollectionRef);
  for (const docum of querySnapshot.docs) {
    const projectDocRef = doc(db, "projects", docum.id);
    await updateDoc(projectDocRef, {
      clients: arrayRemove(id),
    });
    const clientProject = doc(projectsCollectionRef, docum.id);
    const historySnapshot = await getDocs(collection(clientProject, "history"));
    for (const history of historySnapshot.docs) {
      await deleteClientHistory(docum.id, id, history.id)
    }
    await deleteDoc(clientProject)
  }
  await deleteDoc(docRef);
};

export const getClientById = async (id: string): Promise<ClientType | null> => {
  try {
    const docRef = doc(db, DOCUMENT_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        code: docSnap.data().code,
        address: docSnap.data().address,
        userIdCreated: docSnap.data().userIdCreated,
        surname: docSnap.data().surname,
        name: docSnap.data().name,
        lastName: docSnap.data().lastName,
        email: docSnap.data().email,
        phone: docSnap.data().phone,
        birthDate: docSnap.data().birthDate,
      } as ClientType;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getProjectsByClientId = async (
  id: string
): Promise<ProjectType[]> => {
  return getDocs(collection(db, DOCUMENT_NAME, id, "projects"))
    .then((querySnapshot) => {
      const promises = querySnapshot.docs.map(async (docy) => {
        const docRef = doc(db, "projects", docy.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return {
            id: docSnap.id,
            shortName: docSnap.data().shortName,
            name: "",
          } as ProjectType;
        }
      });
      return Promise.all(promises).then((values) => {
        const result: ProjectType[] = [];
        values.forEach((value) => {
          if (value) {
            result.push(value);
          }
        });
        return result;
      });
    })
    .catch(() => []);
};

export const updateClientDocument = async (
  props: ClientType,
  selectedClientProjects?: string[],
  clientProjects?: ProjectType[]
): Promise<string | null> => {
  try {
    const docRef = doc(db, DOCUMENT_NAME, props.id);
    await updateDoc(docRef, {
      surname: props.surname,
      name: props.name,
      lastName: props.lastName,
      email: props.email,
      phone: props.phone,
      birthDate: props.birthDate,
      code: props.code,
      address: props.address,
    });
    const projectsCollectionRef = collection(docRef, "projects");
    if (selectedClientProjects) {
      if (clientProjects) {
        const projectsIdToDelete = clientProjects
          .filter(
            (project) =>
              !selectedClientProjects.some(
                (projetctId) => projetctId === project.id
              )
          )
          .map((project) => project.id);
        for (const docId of projectsIdToDelete) {
          await deleteDoc(doc(projectsCollectionRef, docId));
          const projectDocRef = doc(db, "projects", docId);
          await updateDoc(projectDocRef, {
            clients: arrayRemove(props.id),
          });
        }
      }
      for (const docId of selectedClientProjects) {
        await setDoc(doc(projectsCollectionRef, docId), {});
        const projectDocRef = doc(db, "projects", docId);
        await updateDoc(projectDocRef, {
          clients: arrayUnion(props.id),
        });
      }
    }

    return docRef.id;
  } catch (error) {
    return null;
  }
};

export const createCode = (
  name: string,
  lastName: string,
  surname: string,
  birthDate: Dayjs
): string => {
  return `${
    surname.slice(0, 2).toUpperCase() +
    name.slice(0, 2).toUpperCase() +
    lastName.slice(0, 2).toUpperCase()
  }${birthDate.date()}${birthDate.year()}`;
};

export const getStringFromTimestamp = (timestamp: Timestamp): string | null => {
  return timestamp ? dayjs(timestamp.toDate()).format("DD.MM.YYYY") : null;
};

export const convertTimestampIntoDateAndTimeString = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  const mm = date.getMonth();
  const dd = date.getDate();
  const yyyy = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return hours + ":" + minutes + " " + dd + "." + mm + "." + yyyy;
};
