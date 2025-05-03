import { Product, Sale, SalesReport, InventoryMovement } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { getStorageData, setStorageData } from '../utils/storage';
import { startOfDay, subDays, subMonths } from 'date-fns';

// Database initialization
export const initializeDB = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    if (!localStorage.getItem(key)) {
      setStorageData(key, []);
    }
  });
};

// Products
export const getProducts = (): Product[] => {
  return getStorageData<Product[]>(STORAGE_KEYS.PRODUCTS, []);
};

export const addProduct = (product: Omit<Product, 'id'>): Product => {
  const products = getProducts();
  const newProduct = { ...product, id: crypto.randomUUID() };
  setStorageData(STORAGE_KEYS.PRODUCTS, [...products, newProduct]);
  return newProduct;
};

export const updateProduct = (product: Product): void => {
  const products = getProducts();
  const updatedProducts = products.map(p => p.id === product.id ? product : p);
  setStorageData(STORAGE_KEYS.PRODUCTS, updatedProducts);
};

export const deleteProduct = (id: string): void => {
  const products = getProducts();
  setStorageData(STORAGE_KEYS.PRODUCTS, products.filter(p => p.id !== id));
};

// Sales
export const getSales = (): Sale[] => {
  return getStorageData<Sale[]>(STORAGE_KEYS.SALES, []);
};

export const addSale = (sale: Omit<Sale, 'id' | 'date'>): Sale => {
  const sales = getSales();
  const newSale = {
    ...sale,
    id: crypto.randomUUID(),
    date: new Date().toISOString()
  };
  
  setStorageData(STORAGE_KEYS.SALES, [...sales, newSale]);
  return newSale;
};

export const updateSale = (sale: Sale): void => {
  const sales = getSales();
  const updatedSales = sales.map(s => s.id === sale.id ? sale : s);
  setStorageData(STORAGE_KEYS.SALES, updatedSales);
};

export const deleteSale = (id: string): void => {
  const sales = getSales();
  setStorageData(STORAGE_KEYS.SALES, sales.filter(s => s.id !== id));
};

// Reports
export const getReports = (): SalesReport[] => {
  return getStorageData<SalesReport[]>(STORAGE_KEYS.REPORTS, []);
};

export const deleteReport = (id: string): void => {
  const reports = getReports();
  setStorageData(STORAGE_KEYS.REPORTS, reports.filter(r => r.id !== id));
};

export const closeDailySales = (): void => {
  const sales = getSales().filter(sale => sale.status === 'paid');
  if (sales.length === 0) return;

  const reports = getReports();
  const productSales = sales.reduce((acc, sale) => {
    if (!acc[sale.productId]) {
      acc[sale.productId] = { quantity: 0, totalSales: 0 };
    }
    acc[sale.productId].quantity += sale.quantity;
    acc[sale.productId].totalSales += sale.totalPrice;
    return acc;
  }, {} as Record<string, { quantity: number; totalSales: number }>);

  const topProducts = Object.entries(productSales)
    .map(([productId, data]) => ({
      productId,
      quantity: data.quantity,
      totalSales: data.totalSales,
    }))
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5);

  const newReport: SalesReport = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    sales: [...sales],
    totalAmount: sales.reduce((sum, sale) => sum + sale.totalPrice, 0),
    topProducts,
  };

  setStorageData(STORAGE_KEYS.REPORTS, [...reports, newReport]);
  const pendingSales = getSales().filter(sale => sale.status === 'pending');
  setStorageData(STORAGE_KEYS.SALES, pendingSales);
};

// Movements
export const getMovements = (): InventoryMovement[] => {
  return getStorageData<InventoryMovement[]>(STORAGE_KEYS.MOVEMENTS, []);
};

export const addMovement = (movement: Omit<InventoryMovement, 'id' | 'date'>): InventoryMovement => {
  const movements = getMovements();
  const newMovement = {
    ...movement,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };

  setStorageData(STORAGE_KEYS.MOVEMENTS, [...movements, newMovement]);
  return newMovement;
};

export const updateMovement = (movement: InventoryMovement): void => {
  const movements = getMovements();
  const updatedMovements = movements.map(m => m.id === movement.id ? movement : m);
  setStorageData(STORAGE_KEYS.MOVEMENTS, updatedMovements);
};

export const deleteMovement = (id: string): void => {
  const movements = getMovements();
  setStorageData(STORAGE_KEYS.MOVEMENTS, movements.filter(m => m.id !== id));
};

// Make sure all functions are exported
export {
  initializeDB,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getSales,
  addSale,
  updateSale,
  deleteSale,
  getReports,
  deleteReport,
  closeDailySales,
  getMovements,
  addMovement,
  updateMovement,
  deleteMovement,
};