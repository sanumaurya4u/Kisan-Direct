import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { buyerService, type BuyerRequirement } from '../../features/buyer/buyerService';
import { matchEngine } from '../../features/matching/matchEngine';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Plus, Edit, Search } from 'lucide-react';

export function BuyerDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [matchingId, setMatchingId] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      buyerService.getMyRequirements(profile.id)
        .then(setRequirements)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [profile]);

  const handleFindMatches = async (req: BuyerRequirement) => {
    setMatchingId(req.id);
    try {
      await matchEngine.runMatchingForRequirement(req);
      navigate(`/buyer/dashboard/requirements/${req.id}/matches`);
    } catch (err) {
      console.error(err);
      alert("Failed to run matching engine.");
    } finally {
      setMatchingId(null);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bulk Buyer Dashboard</h1>
          <p className="text-gray-500">Welcome back, {profile?.full_name}</p>
        </div>
        <div className="flex space-x-2">
          <Link to="/buyer/orders">
            <Button variant="outline">My Orders</Button>
          </Link>
          <Link to="/buyer/dashboard/requirements/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Post Requirement
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">My Requirements</h2>
        {isLoading ? (
          <p>Loading requirements...</p>
        ) : requirements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You haven't posted any requirements yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Target Price</TableHead>
                <TableHead>Required By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requirements.map(req => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.products?.name}</TableCell>
                  <TableCell>{req.required_quantity} {req.products?.unit}</TableCell>
                  <TableCell>{req.target_price_per_unit ? `₹${req.target_price_per_unit}` : 'Any'}</TableCell>
                  <TableCell>{req.required_by}</TableCell>
                  <TableCell>
                    <Badge variant={req.status === 'open' ? 'success' : 'secondary'}>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {req.status === 'open' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleFindMatches(req)}
                        disabled={matchingId === req.id}
                      >
                        <Search className="w-4 h-4 mr-1" /> 
                        {matchingId === req.id ? 'Matching...' : 'Matches'}
                      </Button>
                    )}
                    <Link to={`/buyer/dashboard/requirements/${req.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
