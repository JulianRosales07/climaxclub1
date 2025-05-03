import { create } from 'zustand';
import { ProductSlice, createProductSlice } from './slices/productSlice';
import { SaleSlice, createSaleSlice } from './slices/saleSlice';
import { MovementSlice, createMovementSlice } from './slices/movementSlice';
import { ReportSlice, createReportSlice } from './slices/reportSlice';
import { UserSlice, createUserSlice } from './slices/userSlice';

export interface StoreState extends ProductSlice, SaleSlice, MovementSlice, ReportSlice, UserSlice {}

export const useStore = create<StoreState>()((set, get) => ({
  ...createProductSlice(set, get),
  ...createSaleSlice(set, get),
  ...createMovementSlice(set, get),
  ...createReportSlice(set, get),
  ...createUserSlice(set, get),
}));