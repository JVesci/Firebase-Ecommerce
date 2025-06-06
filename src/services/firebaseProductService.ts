import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { Product } from "../types";

const productsRef = collection(db, "products");

export const fetchProducts = async () => {
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
    await addDoc(productsRef, product);
};

export const updateProduct = async (id: string, updatedData: Partial<Product>) => {
    const productDoc = doc(db, "products", id);
    await updateDoc(productDoc, updatedData);
};

export const deleteProduct = async (id: string) => {
    const productDoc = doc(db, "products", id);
    await deleteDoc(productDoc);
};