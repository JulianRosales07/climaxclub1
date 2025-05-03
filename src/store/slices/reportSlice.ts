import { StateCreator } from 'zustand';
import { SalesReport } from '../../types';
import { reportService } from '../../services/reportService';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';
import { StoreState } from '../useStore';

export interface ReportState {
  reports: SalesReport[];
}

export interface ReportActions {
  loadReports: () => Promise<void>;
  addReport: (report: Omit<SalesReport, 'id'>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
}

export type ReportSlice = ReportState & ReportActions;

export const createReportSlice: StateCreator<StoreState> = (set, get) => ({
  reports: [],
  
  loadReports: async () => {
    try {
      const reports = await reportService.getAll();
      set({ reports });
    } catch (error) {
      console.error('Error loading reports:', error);
      set({ reports: [] });
      toast.error('Error al cargar los reportes');
    }
  },
  
  addReport: async (report) => {
    try {
      // First, update the products' stock in the database
      const products = get().products;
      const stockUpdates = report.sales.reduce((acc, sale) => {
        const product = products.find(p => p.id === sale.productId);
        if (product && product.quantity !== null) {
          if (!acc[product.id]) {
            acc[product.id] = { ...product, quantity: product.quantity };
          }
          acc[product.id].quantity -= sale.quantity;
        }
        return acc;
      }, {} as Record<string, typeof products[0]>);

      // Update each product's stock in the database
      await Promise.all(
        Object.values(stockUpdates).map(product => 
          productService.update(product)
        )
      );

      // Then save the report
      const newReport = await reportService.add(report);
      set((state) => ({
        reports: [newReport, ...state.reports],
        // Update products in the local state
        products: state.products.map(product => {
          const updatedProduct = stockUpdates[product.id];
          return updatedProduct || product;
        })
      }));

      toast.success('Reporte generado exitosamente');
    } catch (error) {
      console.error('Error adding report:', error);
      toast.error('Error al generar el reporte');
      throw error;
    }
  },
  
  deleteReport: async (id) => {
    try {
      await reportService.delete(id);
      set((state) => ({
        reports: state.reports.filter((r) => r.id !== id),
      }));
      toast.success('Reporte eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Error al eliminar el reporte');
    }
  },
});