import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { SalesReport } from '../types';

const COLLECTION_NAME = 'reports';
const reportsRef = collection(db, COLLECTION_NAME);

const prepareReportData = (report: Omit<SalesReport, 'id'>) => {
  try {
    const reportData = {
      date: serverTimestamp(),
      totalAmount: Number(report.totalAmount),
      sales: report.sales.map(sale => ({
        ...sale,
        totalPrice: Number(sale.totalPrice),
        quantity: Number(sale.quantity),
        date: Timestamp.fromDate(new Date(sale.date))
      })),
      topProducts: report.topProducts.map(product => ({
        productId: product.productId,
        quantity: Number(product.quantity),
        totalSales: Number(product.totalSales)
      }))
    };

    // Only add reconciliation if it exists and has valid data
    if (report.reconciliation && 
        typeof report.reconciliation.expectedCash !== 'undefined' && 
        typeof report.reconciliation.actualCash !== 'undefined') {
      return {
        ...reportData,
        reconciliation: {
          expectedCash: Number(report.reconciliation.expectedCash),
          actualCash: Number(report.reconciliation.actualCash),
          difference: Number(report.reconciliation.difference),
          nequiTotal: Number(report.reconciliation.nequiTotal),
          cardTotal: Number(report.reconciliation.cardTotal),
          timestamp: Timestamp.fromDate(new Date(report.reconciliation.timestamp))
        }
      };
    }

    return reportData;
  } catch (error) {
    console.error('Error preparing report data:', error);
    throw new Error('Error preparing report data');
  }
};

const convertFirestoreReport = (doc: any): SalesReport => {
  try {
    const data = doc.data();
    return {
      id: doc.id,
      date: data.date.toDate().toISOString(),
      totalAmount: Number(data.totalAmount),
      sales: data.sales.map((sale: any) => ({
        ...sale,
        date: sale.date.toDate().toISOString(),
        totalPrice: Number(sale.totalPrice),
        quantity: Number(sale.quantity)
      })),
      topProducts: data.topProducts.map((product: any) => ({
        productId: product.productId,
        quantity: Number(product.quantity),
        totalSales: Number(product.totalSales)
      })),
      reconciliation: data.reconciliation ? {
        ...data.reconciliation,
        expectedCash: Number(data.reconciliation.expectedCash),
        actualCash: Number(data.reconciliation.actualCash),
        difference: Number(data.reconciliation.difference),
        nequiTotal: Number(data.reconciliation.nequiTotal),
        cardTotal: Number(data.reconciliation.cardTotal),
        timestamp: data.reconciliation.timestamp.toDate().toISOString()
      } : undefined
    };
  } catch (error) {
    console.error('Error converting Firestore report:', error);
    throw new Error('Error converting Firestore report');
  }
};

export const reportService = {
  async getAll(): Promise<SalesReport[]> {
    try {
      const q = query(reportsRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(convertFirestoreReport);
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  async add(report: Omit<SalesReport, 'id'>): Promise<SalesReport> {
    try {
      const reportData = prepareReportData(report);
      const docRef = await addDoc(reportsRef, reportData);
      
      return {
        id: docRef.id,
        date: new Date().toISOString(),
        totalAmount: report.totalAmount,
        sales: report.sales,
        topProducts: report.topProducts,
        reconciliation: report.reconciliation
      };
    } catch (error) {
      console.error('Error adding report:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }
};