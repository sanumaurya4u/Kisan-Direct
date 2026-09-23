import { useEffect, useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import {
  logisticsService,
  type Vehicle,
  DEFAULT_LOGISTICS_PARTNER_ID,
  DEFAULT_DEMO_VEHICLES,
} from '../../features/logistics/logisticsService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function VehiclesList() {
  const { profile } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [number, setNumber] = useState('');
  const [type, setType] = useState('Truck');
  const [capacity, setCapacity] = useState('');

  const fetchVehicles = async () => {
    setIsLoading(true);
    const partnerId = profile?.id || DEFAULT_LOGISTICS_PARTNER_ID;
    try {
      const data = await logisticsService.getMyVehicles(partnerId);
      if (data && data.length > 0) {
        setVehicles(data);
      } else {
        setVehicles(DEFAULT_DEMO_VEHICLES);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles, using demo fleet:', err);
      setVehicles(DEFAULT_DEMO_VEHICLES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [profile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const partnerId = profile?.id || DEFAULT_LOGISTICS_PARTNER_ID;
    try {
      await logisticsService.addVehicle({
        owner_id: partnerId,
        vehicle_number: number,
        vehicle_type: type,
        capacity_kg: Number(capacity),
        availability_status: 'available'
      });
      setIsAdding(false);
      setNumber('');
      setCapacity('');
      fetchVehicles();
    } catch (err: any) {
      alert(err.message || 'Failed to add vehicle');
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 bg-white rounded-xl border border-gray-200 shadow-xs">
        <LoadingSpinner text="Loading fleet vehicles..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">My Fleet</h2>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : 'Add Vehicle'}
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader><CardTitle>Register New Vehicle</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Vehicle Number</Label>
                  <Input value={number} onChange={e => setNumber(e.target.value)} required placeholder="e.g. MH-12-AB-1234"/>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={type} onChange={e => setType(e.target.value)}>
                    <option value="Truck">Truck</option>
                    <option value="Mini-Truck">Mini-Truck</option>
                    <option value="Tractor">Tractor</option>
                    <option value="Van">Van</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Capacity (kg)</Label>
                  <Input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} required />
                </div>
              </div>
              <Button type="submit">Save Vehicle</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map(v => (
          <Card key={v.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{v.vehicle_number}</h3>
                <Badge variant={v.availability_status === 'available' ? 'success' : 'secondary'}>
                  {v.availability_status}
                </Badge>
              </div>
              <div className="text-gray-600 text-sm space-y-1">
                <p>Type: {v.vehicle_type}</p>
                <p>Capacity: {v.capacity_kg} kg</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
