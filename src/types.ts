import { readFileSync, writeFileSync } from 'fs';

export type Category = 'Licores' | 'Cócteles' | 'Granizados' | 'Shots' | 'Cervezas' | 'Hervidos' | 'Bebidas';

export interface Product {
  id: string;
  name: string;
  category: Category;
  quantity: number | null;
  price: number;
  minStock?: number;
  supplier?: string;
  leadTime?: number;
  imageUrl?: string;
  description?: string;
}

const DB_PATH = './db.json';

// Helper function to read products from JSON file
const readProducts = (): Product[] => {
  try {
    const data = readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data) as Product[];
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

// Helper function to write products to JSON file
const writeProducts = (products: Product[]): void => {
  try {
    writeFileSync(DB_PATH, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing products:', error);
  }
};

// CRUD Operations
export const getAllProducts = (): Product[] => {
  return readProducts();
};

export const getProductById = (id: string): Product | undefined => {
  const products = readProducts();
  return products.find((product) => product.id === id);
};

export const createProduct = (newProduct: Omit<Product, 'id'>): Product => {
  const products = readProducts();
  const id = `prod${products.length + 1}`; // Simple ID generation (replace with UUID in production)
  const product: Product = { id, ...newProduct };
  products.push(product);
  writeProducts(products);
  return product;
};

export const updateProduct = (id: string, updatedData: Partial<Omit<Product, 'id'>>): Product | undefined => {
  const products = readProducts();
  const productIndex = products.findIndex((product) => product.id === id);
  if (productIndex === -1) return undefined;
  const updatedProduct = { ...products[productIndex], ...updatedData };
  products[productIndex] = updatedProduct;
  writeProducts(products);
  return updatedProduct;
};

export const deleteProduct = (id: string): boolean => {
  const products = readProducts();
  const productIndex = products.findIndex((product) => product.id === id);
  if (productIndex === -1) return false;
  products.splice(productIndex, 1);
  writeProducts(products);
  return true;
};