import { StateCreator } from 'zustand';
import { SalesReport } from '../../types';
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

const REPORTS_STORAGE_KEY = 'bar_inventory_reports';

export const createReportSlice: StateCreator<StoreState> = (set, get) => ({
  reports: [],
  
  loadReports: async () => {
    try {
      const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
      const reports = storedReports ? JSON.parse(storedReports) : [];
      set({ reports });
    } catch (error) {
      console.error('Error loading reports:', error);
      set({ reports: [] });
      toast.error('Error al cargar los reportes');
    }
  },
  
  addReport: async (report) => {
    try {
      const newReport = {
        ...report,
        id: crypto.randomUUID(),
      };

      const currentReports = get().reports;
      const updatedReports = [newReport, ...currentReports];
      
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
      set({ reports: updatedReports });

      toast.success('Reporte generado exitosamente');
    } catch (error) {
      console.error('Error adding report:', error);
      toast.error('Error al generar el reporte');
      throw error;
    }
  },
  
  deleteReport: async (id) => {
    try {
      const currentReports = get().reports;
      const updatedReports = currentReports.filter((r) => r.id !== id);
      
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
      set({ reports: updatedReports });
      
      toast.success('Reporte eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Error al eliminar el reporte');
    }
  },
});