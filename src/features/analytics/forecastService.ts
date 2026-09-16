import { supabase } from '../../lib/supabase';

export interface DemandForecast {
  id: string;
  product_id: string;
  region: string;
  forecast_date: string;
  forecast_period_start: string;
  forecast_period_end: string;
  predicted_quantity: number;
  unit: string;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  products?: { name: string };
}

export const forecastService = {
  async getForecastsForRegion(region: string) {
    const { data, error } = await supabase
      .from('demand_forecasts')
      .select(`
        *,
        products (name)
      `)
      .eq('region', region)
      .order('forecast_period_start', { ascending: true });

    if (error) throw error;
    return data as DemandForecast[];
  },

  async seedDemoForecastsIfEmpty() {
    // Check if empty
    const { count, error } = await supabase
      .from('demand_forecasts')
      .select('*', { count: 'exact', head: true });
      
    if (error) throw error;
    
    if (count === 0) {
      // get some products
      const { data: products } = await supabase.from('products').select('id, name, unit').limit(3);
      if (!products || products.length === 0) return;

      const regions = ['Maharashtra', 'Punjab'];
      const forecastsToInsert = [];
      
      for (const p of products) {
        for (const r of regions) {
          // Generate 6 months of future data
          let baseQty = Math.floor(Math.random() * 5000) + 1000;
          const rand = Math.random();
          let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
          if (rand > 0.6) trend = 'increasing';
          else if (rand < 0.3) trend = 'decreasing';
          
          for (let i = 0; i < 6; i++) {
            const start = new Date();
            start.setMonth(start.getMonth() + i);
            start.setDate(1);
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
            
            if (trend === 'increasing') baseQty += Math.floor(Math.random() * 500);
            else if (trend === 'decreasing') baseQty -= Math.floor(Math.random() * 300);

            forecastsToInsert.push({
              product_id: p.id,
              region: r,
              forecast_date: new Date().toISOString().split('T')[0],
              forecast_period_start: start.toISOString().split('T')[0],
              forecast_period_end: end.toISOString().split('T')[0],
              predicted_quantity: Math.max(0, baseQty),
              unit: p.unit,
              confidence: 80 + Math.floor(Math.random() * 15),
              trend,
              is_demo: true
            });
          }
        }
      }
      
      await supabase.from('demand_forecasts').insert(forecastsToInsert);
    }
  }
};
