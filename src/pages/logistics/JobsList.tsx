import { useEffect, useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import {
  logisticsService,
  type LogisticsJob,
  type Vehicle,
  DEFAULT_LOGISTICS_PARTNER_ID,
  DEFAULT_DEMO_JOBS,
  DEFAULT_DEMO_VEHICLES,
} from '../../features/logistics/logisticsService';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { MapPin, Truck, Map as MapIcon } from 'lucide-react';
import { RouteMap } from '../../components/ui/Map';
import { getMockCoordinates } from '../../features/logistics/routeService';

export function JobsList({ type }: { type: 'pending' | 'my' }) {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<LogisticsJob[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [viewingRouteFor, setViewingRouteFor] = useState<LogisticsJob | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const partnerId = profile?.id || DEFAULT_LOGISTICS_PARTNER_ID;

    try {
      const [jobsData, vehiclesData] = await Promise.all([
        type === 'pending'
          ? logisticsService.getPendingJobs()
          : logisticsService.getMyJobs(partnerId),
        logisticsService.getMyVehicles(partnerId).catch(() => [])
      ]);

      if (jobsData && jobsData.length > 0) {
        setJobs(jobsData);
      } else {
        setJobs(DEFAULT_DEMO_JOBS[type] || []);
      }

      if (vehiclesData && vehiclesData.length > 0) {
        const available = vehiclesData.filter(v => v.availability_status === 'available');
        setVehicles(available.length > 0 ? available : vehiclesData);
      } else {
        setVehicles(DEFAULT_DEMO_VEHICLES.filter(v => v.availability_status === 'available'));
      }
    } catch (err) {
      console.error('Error fetching jobs, falling back to demo data:', err);
      setJobs(DEFAULT_DEMO_JOBS[type] || []);
      setVehicles(DEFAULT_DEMO_VEHICLES.filter(v => v.availability_status === 'available'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile?.id, type]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAccept = async (jobId: string) => {
    const partnerId = profile?.id || DEFAULT_LOGISTICS_PARTNER_ID;
    const vId = selectedVehicle[jobId] || (vehicles.length > 0 ? vehicles[0].id : undefined);
    if (!vId) {
      alert("Please select a vehicle first.");
      return;
    }
    try {
      await logisticsService.acceptJob(jobId, partnerId, vId);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to accept job.');
    }
  };

  const handleUpdateStatus = async (jobId: string, status: LogisticsJob['status'], vId?: string) => {
    try {
      await logisticsService.updateJobStatus(jobId, status, vId);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 bg-white rounded-xl border border-gray-200 shadow-xs">
        <LoadingSpinner text={type === 'pending' ? 'Loading available jobs...' : 'Loading active shipments...'} />
      </div>
    );
  }

  if (jobs.length === 0) return (
    <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
      {type === 'pending' ? 'No pending jobs available.' : 'You have no active jobs.'}
    </div>
  );

  return (
    <div className="space-y-4">
      {jobs.map(job => (
        <Card key={job.id}>
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">Job #{job.id.slice(0, 8)}</h3>
                  {job.orders?.total_amount ? (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                      Consignment: ₹{job.orders.total_amount.toLocaleString()}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  {job.estimated_distance_km ? (
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      {job.estimated_distance_km} km
                    </Badge>
                  ) : null}
                  <Badge variant={job.status === 'pending' ? 'secondary' : job.status === 'delivered' ? 'success' : 'default'}>
                    {job.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-700">Pickup</p>
                    <p>{job.pickup_location}</p>
                    <p className="text-gray-500 text-xs">Seller: {job.orders?.seller?.full_name || 'Verified Farmer Partner'}</p>
                  </div>
                </div>
                <div className="border-l-2 border-dashed border-gray-300 ml-2 h-4 my-1"></div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-700">Drop-off</p>
                    <p>{job.drop_location}</p>
                    <p className="text-gray-500 text-xs">Buyer: {job.orders?.buyer?.full_name || 'FreshRetail Distribution Hub'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-64 flex flex-col justify-end border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 space-y-3">
              {type === 'pending' && (
                <>
                  <div className="space-y-1">
                    <Label className="text-xs">Assign Vehicle</Label>
                    <Select 
                      value={selectedVehicle[job.id] || ''} 
                      onChange={e => setSelectedVehicle({...selectedVehicle, [job.id]: e.target.value})}
                    >
                      <option value="">Select a vehicle...</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.vehicle_number} ({v.capacity_kg}kg)</option>
                      ))}
                    </Select>
                  </div>
                  <Button onClick={() => handleAccept(job.id)}>Accept Job</Button>
                </>
              )}

              {type === 'my' && job.status !== 'delivered' && job.status !== 'cancelled' && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 mb-2 flex items-center">
                    <Truck className="w-4 h-4 mr-1"/> Assigned Vehicle ID: {job.vehicle_id?.slice(0,8)}
                  </div>
                  {job.status === 'assigned' && (
                    <Button className="w-full" onClick={() => handleUpdateStatus(job.id, 'picked_up')}>Mark Picked Up</Button>
                  )}
                  {job.status === 'picked_up' && (
                    <Button className="w-full" onClick={() => handleUpdateStatus(job.id, 'in_transit')}>Mark In Transit</Button>
                  )}
                  {job.status === 'in_transit' && (
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus(job.id, 'delivered', job.vehicle_id)}>Mark Delivered</Button>
                  )}
                </div>
              )}
              
              <Button 
                variant="outline" 
                className="w-full mt-2" 
                onClick={() => setViewingRouteFor(viewingRouteFor?.id === job.id ? null : job)}
              >
                <MapIcon className="w-4 h-4 mr-2" />
                {viewingRouteFor?.id === job.id ? 'Hide Route' : 'View Route'}
              </Button>
            </div>
          </CardContent>
          
          {/* Map Section */}
          {viewingRouteFor?.id === job.id && (
            <div className="p-4 border-t bg-gray-50">
              <h4 className="font-semibold mb-4">Route Preview (Demo)</h4>
              <RouteMap 
                pickup={{ 
                  lat: job.pickup_latitude || getMockCoordinates(job.pickup_location).lat,
                  lng: job.pickup_longitude || getMockCoordinates(job.pickup_location).lng,
                  label: job.pickup_location
                }}
                drop={{ 
                  lat: job.drop_latitude || getMockCoordinates(job.drop_location).lat,
                  lng: job.drop_longitude || getMockCoordinates(job.drop_location).lng,
                  label: job.drop_location
                }}
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
