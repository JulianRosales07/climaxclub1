import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (date: string | Date, formatStr: string = "d 'de' MMMM, HH:mm"): string => {
  return format(new Date(date), formatStr, { locale: es });
};

export const formatQuantity = (quantity: number | null): string => {
  if (quantity === null) return 'N/A';
  return quantity.toString();
};