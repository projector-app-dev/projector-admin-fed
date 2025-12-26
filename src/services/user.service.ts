import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, db, functions } from "../config/firebase";
import type { ErrorType, UserType } from "./common.type";

const DOCUMENT_NAME = "users";

export const addUserDocument = async (
  props: UserType,
  password: string,
  setError: (error: ErrorType) => void
): Promise<string | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      props.email,
      password
    );
    const user = userCredential.user;
    const docRef = await addDoc(collection(db, DOCUMENT_NAME), {
      name: props.name,
      phone: props.phone,
      email: props.email,
      accountId: user.uid,
      status: "Активний",
    });
    return docRef.id;
  } catch (error) {
    if (error instanceof FirebaseError) {
      setError({
        errorCode: error.code,
        errorMessage: error.message,
      });
    }
    return null;
  }
};

export const deleteUserDocument = async (id: string): Promise<void> => {
  const docRef = doc(db, DOCUMENT_NAME, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const deleteUserAccount = httpsCallable(functions, "deleteUserAccount");
    await deleteUserAccount({ uid: docSnap.data().accountId });
    await updateDoc(docRef, { status: "Звільнений" });
  }
};

export const getUserById = async (id: string): Promise<UserType | null> => {
  try {
    const docRef = doc(db, DOCUMENT_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        name: docSnap.data().name,
        phone: docSnap.data().phone,
        email: docSnap.data().email,
      } as UserType;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const isUserAdminByUid = async (uid: string): Promise<boolean> => {
  try {
    const docRef = doc(db, "admin", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists()
  } catch (error) {
    return false;
  }
};

export const getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, DOCUMENT_NAME));
  return querySnapshot.docs.map((document) => {
    return {
      id: document.id,
      ... document.data(),
    } as UserType;
  });
};

export const getUserByUid = async (uid: string): Promise<UserType | null> => {
  try {
    const createdQuery = query(
      collection(db, DOCUMENT_NAME),
      where("accountId", "==", uid)
    );
    const querySnapshot = await getDocs(createdQuery);
    return querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        name: doc.data().name,
        phone: doc.data().phone,
        email: doc.data().email,
      } as UserType;
    })?.[0];
  } catch (error) {
    return null;
  }
};

export const updateUserDocument = async (
  props: UserType
): Promise<string | null> => {
  try {
    const docRef = doc(db, DOCUMENT_NAME, props.id);
    await updateDoc(docRef, { name: props.name, phone: props.phone });
    return docRef.id;
  } catch (error) {
    return null;
  }
};
