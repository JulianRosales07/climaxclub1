export type UserRole = 'client' | 'employee' | 'admin';

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

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: 'efectivo' | 'nequi' | 'datafono';
  date: string;
  status: 'pending' | 'paid';
  tableNumber?: string;
}

export interface CashReconciliation {
  id: string;
  expectedCash: number;
  actualCash: number;
  difference: number;
  nequiTotal: number;
  cardTotal: number;
  notes?: string;
  timestamp: string;
}

export interface SalesReport {
  id: string;
  date: string;
  sales: Sale[];
  totalAmount: number;
  topProducts: {
    productId: string;
    quantity: number;
    totalSales: number;
  }[];
  reconciliation?: CashReconciliation;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  quantity: number;
  type: 'prestamo' | 'recepcion';
  date: string;
  notes?: string;
  returnDate?: string;
  status: 'pending' | 'returned';
  receivedFrom?: string;
}

export interface DemandPrediction {
  productId: string;
  predictedDemand: number;
  confidence: number;
  suggestedOrder: number;
}