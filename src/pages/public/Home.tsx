import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-8">
      <section className="text-center py-16 bg-primary/10 rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Direct from Farm to Market
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8">
          Kisan Direct connects farmers and FPOs directly with consumers and bulk buyers, ensuring transparent pricing and optimized logistics.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => navigate('/marketplace')}>
            Explore Marketplace
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
            Join Platform
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>For Farmers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">Get better realization for your produce by selling directly to verified buyers.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>For Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">Source fresh agricultural products with transparent pricing and reliable logistics.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">Leverage demand forecasting to make informed agricultural and purchasing decisions.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
