import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp, query, where, getDocs, orderBy } from 'firebase/firestore';

export const createOrder = async (
    userId: string,
    items: any[],
    total: number
) => {
    return await addDoc(collection(db, 'orders'), {
        userId,
        items,
        total,
        createdAt: Timestamp.now()
    });
};

export const fetchOrdersByUser = async (userId: string) => {
    const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};