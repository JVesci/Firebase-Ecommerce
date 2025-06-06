import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const createUserDocument = async (uid: string, userData: any) => {
    await setDoc(doc(db, 'users', uid), userData);
};

export const getUserDocument = async (uid: string) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
};

export const updateUserDocument = async (uid: string, updatedData: any) => {
    await updateDoc(doc(db, 'users', uid), updatedData);
};

export const deleteUserDocument = async (uid: string) => {
    await deleteDoc(doc(db, 'users', uid));
};