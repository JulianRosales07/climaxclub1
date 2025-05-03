import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product, Category } from '../types';

const COLLECTION_NAME = 'products';
const productsRef = collection(db, COLLECTION_NAME);

export const productService = {
  async getAll(): Promise<Product[]> {
    try {
      const snapshot = await getDocs(productsRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        category: doc.data().category as Category,
        quantity: doc.data().quantity ?? null,
        price: Number(doc.data().price),
      } as Product));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async add(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      // Ensure data types are correct before adding to Firestore
      const productData = {
        name: product.name,
        category: product.category,
        description: product.description || '',
        price: Number(product.price),
        quantity: product.quantity !== undefined ? Number(product.quantity) : null,
        imageUrl: product.imageUrl || null,
        minStock: product.minStock ? Number(product.minStock) : null,
        supplier: product.supplier || null,
        leadTime: product.leadTime ? Number(product.leadTime) : null,
      };

      const docRef = await addDoc(productsRef, productData);
      
      return {
        id: docRef.id,
        ...productData,
      } as Product;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  async update(product: Product): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, product.id);
      const { id, ...updateData } = product;
      
      // Ensure data types are correct before updating
      const productData = {
        ...updateData,
        price: Number(updateData.price),
        quantity: updateData.quantity !== undefined ? Number(updateData.quantity) : null,
        minStock: updateData.minStock ? Number(updateData.minStock) : null,
        leadTime: updateData.leadTime ? Number(updateData.leadTime) : null,
      };

      await updateDoc(docRef, productData);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async getByCategory(category: Category): Promise<Product[]> {
    try {
      const q = query(productsRef, where("category", "==", category));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        category: doc.data().category as Category,
        quantity: doc.data().quantity ?? null,
        price: Number(doc.data().price),
      } as Product));
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  async getLowStock(): Promise<Product[]> {
    try {
      const snapshot = await getDocs(productsRef);
      return snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          category: doc.data().category as Category,
          quantity: doc.data().quantity ?? null,
          price: Number(doc.data().price),
        } as Product))
        .filter(product => 
          product.quantity !== null && 
          product.minStock !== undefined && 
          product.quantity <= product.minStock
        );
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      throw error;
    }
  }
};