import { useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { VehiclesList } from './VehiclesList';
import { JobsList } from './JobsList';

export function LogisticsDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'my' | 'vehicles'>('pending');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Logistics Dashboard</h1>
        <p className="text-gray-500">Welcome back, {profile?.full_name}</p>
      </div>

      <div className="flex space-x-1 border-b mb-6">
        <button
          className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('pending')}
        >
          Available Jobs
        </button>
        <button
          className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'my' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('my')}
        >
          My Active Jobs
        </button>
        <button
          className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'vehicles' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('vehicles')}
        >
          My Fleet
        </button>
      </div>

      <div>
        {activeTab === 'pending' && <JobsList type="pending" />}
        {activeTab === 'my' && <JobsList type="my" />}
        {activeTab === 'vehicles' && <VehiclesList />}
      </div>
    </div>
  );
}
