import { Sale, Product, DemandPrediction } from '../types';
import { startOfDay, subDays, isWithinInterval } from 'date-fns';

export function calculateDailyDemand(sales: Sale[], productId: string, days: number = 30): number[] {
  const dailyDemand: number[] = [];
  const endDate = startOfDay(new Date());
  
  for (let i = 0; i < days; i++) {
    const currentDate = subDays(endDate, i);
    const nextDate = subDays(endDate, i - 1);
    
    const dailySales = sales.filter(sale => 
      sale.productId === productId &&
      sale.status === 'paid' &&
      isWithinInterval(new Date(sale.date), {
        start: currentDate,
        end: nextDate
      })
    );
    
    const totalQuantity = dailySales.reduce((sum, sale) => sum + sale.quantity, 0);
    dailyDemand.unshift(totalQuantity);
  }
  
  return dailyDemand;
}

export function predictDemand(product: Product, sales: Sale[]): DemandPrediction {
  const dailyDemand = calculateDailyDemand(sales, product.id);
  
  // Calcular promedio móvil ponderado
  const weights = dailyDemand.map((_, index) => index + 1);
  const weightSum = weights.reduce((a, b) => a + b, 0);
  
  const weightedAverage = dailyDemand.reduce((sum, demand, index) => 
    sum + (demand * weights[index]), 0) / weightSum;
  
  // Calcular desviación estándar para el nivel de confianza
  const variance = dailyDemand.reduce((sum, demand) => 
    sum + Math.pow(demand - weightedAverage, 2), 0) / dailyDemand.length;
  const stdDev = Math.sqrt(variance);
  
  // Calcular nivel de confianza (0-1)
  const confidence = 1 - (stdDev / (weightedAverage || 1));
  
  // Calcular cantidad sugerida de reorden
  const leadTime = product.leadTime || 7; // default 7 días
  const safetyStock = Math.ceil(stdDev * 1.645); // 90% nivel de servicio
  const suggestedOrder = Math.ceil(weightedAverage * leadTime) + safetyStock;
  
  return {
    productId: product.id,
    predictedDemand: weightedAverage,
    confidence: Math.max(0, Math.min(1, confidence)),
    suggestedOrder,
  };
}