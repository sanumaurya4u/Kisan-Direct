import { useEffect, useState } from 'react';
import { forecastService, type DemandForecast } from '../../features/analytics/forecastService';
import { DemandForecastChart } from './DemandForecastChart';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { TrendingUp, AlertCircle } from 'lucide-react';

export function AnalyticsDashboard() {
  const [forecasts, setForecasts] = useState<DemandForecast[]>([]);
  const [region, setRegion] = useState('Maharashtra'); // Default for demo
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await forecastService.seedDemoForecastsIfEmpty();
        const data = await forecastService.getForecastsForRegion(region);
        setForecasts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [region]);

  const recentForecasts = forecasts.filter(f => {
    // Just get the closest upcoming month for cards
    const now = new Date();
    const fStart = new Date(f.forecast_period_start);
    return fStart.getMonth() === now.getMonth() || fStart.getMonth() === (now.getMonth() + 1) % 12;
  });
  
  // Deduplicate for simple summary cards
  const summaryCards = [];
  const seen = new Set();
  for (const f of recentForecasts) {
    if (!seen.has(f.product_id)) {
      seen.add(f.product_id);
      summaryCards.push(f);
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Market Analytics & Forecasts</h1>
          <p className="text-gray-500">AI-powered demand predictions to guide your planting decisions.</p>
        </div>
        <div className="w-full md:w-64">
          <Select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Punjab">Punjab</option>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading forecast data...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summaryCards.slice(0, 3).map(f => (
              <Card key={f.id} className="bg-white border-l-4 border-l-primary">
                <CardContent className="p-4 flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full text-primary">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">{f.products?.name} Demand Trend</p>
                    <h3 className="text-xl font-bold">{f.predicted_quantity} {f.unit}</h3>
                    <p className={`text-sm ${f.trend === 'increasing' ? 'text-green-600' : f.trend === 'decreasing' ? 'text-red-600' : 'text-gray-600'}`}>
                      {f.trend.charAt(0).toUpperCase() + f.trend.slice(1)} demand over next 30 days
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>6-Month Demand Forecast ({region})</CardTitle>
            </CardHeader>
            <CardContent>
              <DemandForecastChart data={forecasts} />
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Smart Selling Recommendation</h4>
                <p className="text-sm text-blue-800">
                  Based on historical trends in {region}, {summaryCards.length > 0 ? summaryCards[0].products?.name : 'selected crops'} show strong demand growth. We recommend locking in bulk buyer contracts early for the upcoming harvest season to secure target prices.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
