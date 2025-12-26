import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import type { ProjectType } from "./common.type";

const DOCUMENT_NAME = "projects";

export const getAllProjectDocuments = async () => {
  const querySnapshot = await getDocs(collection(db, DOCUMENT_NAME));
  return querySnapshot.docs.map((document) => {
    return {
      id: document.id,
      name: document.data().name,
      shortName: document.data().shortName,
    } as ProjectType;
  });
};

export const addProjectDocument = async (
  props: ProjectType
): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, DOCUMENT_NAME), {
      name: props.name,
      shortName: props.shortName,
      description: props.description,
      startDate: props.startDate,
      endDate: props.endDate,
    });
    return docRef.id;
  } catch (error) {
    return null;
  }
};

export const updateProjectDocument = async (
  props: ProjectType
): Promise<string | null> => {
  try {
    const docRef = doc(db, DOCUMENT_NAME, props.id)
    await updateDoc(docRef, {
      name: props.name,
      shortName: props.shortName,
      description: props.description,
      startDate: props.startDate,
      endDate: props.endDate,
    });

    return docRef.id;
  } catch (error) {
    return null;
  }
};

export const deleteProjectDocument = async (id: string): Promise<void> => {
  const docRef = doc(db, DOCUMENT_NAME, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await deleteDoc(doc(db, DOCUMENT_NAME, id));
  }
};

export const getProjectById = async (
  id: string
): Promise<ProjectType | null> => {
  try {
    const docRef = doc(db, DOCUMENT_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        name: docSnap.data().name,
        shortName: docSnap.data().shortName,
        description: docSnap.data()?.description,
        startDate: docSnap.data().startDate,
        endDate: docSnap.data().endDate,
        clients: docSnap.data().clients,
      } as ProjectType;
    }
    return null;
  } catch (error) {
    return null;
  }
};
