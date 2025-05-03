export const STORAGE_KEYS = {
  PRODUCTS: 'bar_inventory_products',
  SALES: 'bar_inventory_sales',
  REPORTS: 'bar_inventory_reports',
  MOVEMENTS: 'bar_inventory_movements',
} as const;

export const PAYMENT_METHODS = {
  CASH: 'efectivo',
  NEQUI: 'nequi',
  CARD: 'datafono',
} as const;

export const CATEGORIES = [
  'Licores',
  'Cócteles',
  'Granizados',
  'Shots',
  'Cervezas',
  'Hervidos',
  'Bebidas',
] as const;

export const NON_INVENTORY_CATEGORIES = ['Cócteles', 'Shots', 'Hervidos'] as const;

export const ANIMATIONS = {
  FADE_IN: 'animate-fadeIn',
  SLIDE_IN: 'animate-slideIn',
  BOUNCE: 'animate-bounce',
  PULSE: 'animate-pulse',
} as const;