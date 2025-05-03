import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, UserRole } from '../types/user';

const COLLECTION_NAME = 'users';
const usersRef = collection(db, COLLECTION_NAME);

export const userService = {
  async getAll(): Promise<User[]> {
    try {
      const snapshot = await getDocs(usersRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastLogin: doc.data().lastLogin?.toDate?.()?.toISOString(),
      } as User));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async add(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      const userData = {
        ...user,
        createdAt: serverTimestamp(),
        active: true,
      };

      const docRef = await addDoc(usersRef, userData);
      return {
        id: docRef.id,
        ...user,
        createdAt: new Date().toISOString(),
      } as User;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  async update(user: User): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, user.id);
      const { id, createdAt, ...updateData } = user;
      
      // Convert dates to Firestore Timestamp
      const firestoreData = {
        ...updateData,
        lastLogin: updateData.lastLogin ? Timestamp.fromDate(new Date(updateData.lastLogin)) : null,
      };

      await updateDoc(docRef, firestoreData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async getByRole(role: UserRole): Promise<User[]> {
    try {
      const q = query(usersRef, where("role", "==", role));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastLogin: doc.data().lastLogin?.toDate?.()?.toISOString(),
      } as User));
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  }
};