import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketplaceService } from '../../features/marketplace/marketplaceService';
import { ordersService } from '../../features/orders/ordersService';
import { useAuth } from '../../features/auth/AuthContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  MapPin,
  Search,
  ShoppingCart,
  Leaf,
  LayoutGrid,
  List,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface MarketplaceItem {
  id: string;
  seller_id: string;
  product_id: string;
  quantity: number;
  available_quantity: number;
  price_per_unit: number;
  grade?: string;
  location_name: string;
  image_url?: string;
  status: string;
  created_at: string;
  profiles?: { full_name: string; role: string };
  products?: {
    name: string;
    unit: string;
    category_id?: string;
    product_categories?: { id: string; name: string };
  };
}

export function Marketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Order Placement Modal State
  const [selectedListing, setSelectedListing] = useState<MarketplaceItem | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(10);
  const [deliveryAddress, setDeliveryAddress] = useState('FreshRetail Central Warehouse, Azadpur Mandi, Delhi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  const fetchListings = () => {
    setIsLoading(true);
    marketplaceService
      .getActiveListings()
      .then((data) => setListings(data as MarketplaceItem[]))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Filter and sort listings
  const filteredListings = listings
    .filter((item) => {
      const q = searchQuery.toLowerCase();
      const cropName = item.products?.name?.toLowerCase() || '';
      const location = item.location_name?.toLowerCase() || '';
      const matchesSearch = cropName.includes(q) || location.includes(q);

      const categoryName = item.products?.product_categories?.name?.toLowerCase() || '';
      const matchesCategory =
        selectedCategory === 'all' || categoryName.includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price_per_unit - b.price_per_unit;
      if (sortBy === 'price_desc') return b.price_per_unit - a.price_per_unit;
      if (sortBy === 'qty_desc') return b.available_quantity - a.available_quantity;
      return 0; // default/recommended
    });

  const handleOpenOrderModal = (item: MarketplaceItem) => {
    setSelectedListing(item);
    setOrderQuantity(Math.min(10, item.available_quantity || 10));
    setOrderSuccessId(null);
  };

  const handlePlaceOrder = async () => {
    if (!selectedListing) return;

    if (!user) {
      alert('Please log in as a Buyer or Consumer to place an order.');
      navigate('/login');
      return;
    }

    setIsPlacingOrder(true);
    try {
      // Cast item to Listing shape expected by ordersService
      const order = await ordersService.createOrderFromListing(
        selectedListing as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        user.id,
        orderQuantity,
        deliveryAddress
      );
      setOrderSuccessId(order.id);
      fetchListings(); // Refresh stock
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please check console for details.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Price calculation for modal
  const priceBreakdown = selectedListing
    ? ordersService.calculatePriceBreakdown(selectedListing.price_per_unit, orderQuantity)
    : null;

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
        <div>
          <Badge variant="success" className="text-xs mb-1.5 font-semibold">Direct Marketplace</Badge>
          <h1 className="text-3xl font-extrabold text-gray-900">Fresh Produce Marketplace</h1>
          <p className="text-sm text-gray-600 mt-1">
            Sourced directly from verified farmers & FPOs across Maharashtra, Punjab, and Haryana.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/analytics')}
            className="text-xs border-emerald-300 text-emerald-800"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            AI Demand Forecast
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/buyer/dashboard/requirements/new')}
            className="text-xs shadow-xs"
          >
            + Post Bulk Requirement
          </Button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-4">
        {/* Row 1: Search & Sort */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search crop name (e.g. Tomato, Onion) or harvest location..."
              className="pl-10 h-10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center space-x-1.5 text-xs text-gray-500">
              <span className="font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-medium"
              >
                <option value="recommended">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="qty_desc">Quantity: High to Low</option>
              </select>
            </div>

            <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-gray-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-xs text-primary' : 'text-gray-400'}`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-xs text-primary' : 'text-gray-400'}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Category Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-gray-400 font-medium mr-1">Category:</span>
          {['all', 'vegetables', 'fruits', 'grains'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full capitalize font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'All Produce' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Produce Catalog */}
      {isLoading ? (
        <div className="py-16">
          <LoadingSpinner text="Fetching active market listings..." />
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900">No Produce Lots Found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            No active lots match your search query. Try clearing your filters or check back shortly.
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col border-gray-200"
            >
              {/* Image Banner */}
              <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.products?.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-primary">
                    <Leaf className="w-12 h-12 text-green-300" />
                  </div>
                )}
                {item.grade && (
                  <Badge variant="outline" className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-xs font-bold shadow-xs">
                    {item.grade}
                  </Badge>
                )}
              </div>

              {/* Card Body */}
              <CardContent className="p-5 flex flex-col flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{item.products?.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                      {item.location_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-primary block">
                      ₹{item.price_per_unit}
                    </span>
                    <span className="text-[11px] text-gray-500 font-normal">
                      per {item.products?.unit}
                    </span>
                  </div>
                </div>

                {/* Stock Details */}
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs flex justify-between items-center text-gray-600">
                  <span>Available Stock:</span>
                  <span className="font-bold text-gray-900">
                    {item.available_quantity} {item.products?.unit}
                  </span>
                </div>

                {/* Seller Attribution */}
                <div className="text-[11px] text-gray-400 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span>Sold by: <strong className="text-gray-700">{item.profiles?.full_name}</strong></span>
                  <span className="flex items-center text-emerald-600 font-medium">
                    <ShieldCheck className="w-3 h-3 mr-0.5" /> Direct
                  </span>
                </div>

                {/* Direct Action Button */}
                <div className="pt-2 mt-auto">
                  <Button
                    className="w-full h-10 font-bold shadow-xs flex items-center justify-center gap-2"
                    onClick={() => handleOpenOrderModal(item)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now / Place Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100 shadow-xs">
          {filteredListings.map((item) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-gray-50/50">
              <div className="flex items-center space-x-4">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.products?.name} className="w-16 h-16 rounded-xl object-cover border" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-green-50 text-primary flex items-center justify-center">
                    <Leaf className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-base text-gray-900">{item.products?.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span>{item.location_name}</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-[10px]">{item.grade || 'Grade A'}</Badge>
                    <span>•</span>
                    <span>Seller: {item.profiles?.full_name}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">₹{item.price_per_unit} / {item.products?.unit}</div>
                  <div className="text-xs text-gray-500">{item.available_quantity} {item.products?.unit} in stock</div>
                </div>
                <Button size="sm" onClick={() => handleOpenOrderModal(item)}>
                  <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Order
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DIRECT PURCHASE & ORDER MODAL */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-gray-900 text-lg">Direct Farm Purchase</h3>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {orderSuccessId ? (
                /* Success Confirmation State */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-primary rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Order Successfully Placed!</h4>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto">
                    Your direct purchase has been registered with the seller. A logistics dispatch job will automatically trigger upon seller acceptance.
                  </p>
                  <div className="p-3 bg-gray-50 rounded-xl font-mono text-xs text-gray-700 border">
                    Order ID: <strong>{orderSuccessId}</strong>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedListing(null)}
                    >
                      Back to Marketplace
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => navigate('/buyer/orders')}
                    >
                      View in My Orders →
                    </Button>
                  </div>
                </div>
              ) : (
                /* Order Configuration Form */
                <>
                  {/* Crop Summary */}
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 border">
                    <div className="w-12 h-12 rounded-lg bg-green-100 text-primary flex items-center justify-center font-bold">
                      <Leaf className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{selectedListing.products?.name}</h4>
                      <p className="text-xs text-gray-500">
                        {selectedListing.location_name} • Sold by {selectedListing.profiles?.full_name}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <Label htmlFor="orderQty">Order Quantity ({selectedListing.products?.unit})</Label>
                      <span className="text-gray-500">
                        Max available: <strong>{selectedListing.available_quantity} {selectedListing.products?.unit}</strong>
                      </span>
                    </div>
                    <Input
                      id="orderQty"
                      type="number"
                      min={1}
                      max={selectedListing.available_quantity}
                      value={orderQuantity}
                      onChange={(e) =>
                        setOrderQuantity(
                          Math.max(1, Math.min(selectedListing.available_quantity, Number(e.target.value) || 1))
                        )
                      }
                      className="font-bold text-sm h-10"
                    />
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-1.5">
                    <Label htmlFor="delAddress">Delivery Hub / Address</Label>
                    <Input
                      id="delAddress"
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter warehouse or delivery location"
                      className="text-sm h-10"
                    />
                  </div>

                  {/* Price Transparency Breakdown */}
                  {priceBreakdown && (
                    <div className="p-4 rounded-xl border border-green-200 bg-green-50/50 space-y-2 text-xs">
                      <div className="font-bold text-primary uppercase tracking-wider text-[11px] mb-1">
                        Transparent Price Ledger (0% Platform Fee)
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Produce Subtotal ({orderQuantity} × ₹{selectedListing.price_per_unit})</span>
                        <span className="font-semibold">₹{priceBreakdown.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Estimated Farmgate Freight (50 km)</span>
                        <span>₹{priceBreakdown.estimatedLogistics.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Kisan Direct Platform Fee</span>
                        <span>₹0.00 (0% Middleman)</span>
                      </div>
                      <div className="pt-2 border-t border-green-200 flex justify-between items-center text-sm font-bold text-gray-900">
                        <span>Total Payable Amount</span>
                        <span className="text-lg text-primary">₹{priceBreakdown.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    className="w-full h-11 text-sm font-bold shadow-md"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? 'Creating Order in Supabase...' : `Confirm Purchase (₹${priceBreakdown?.totalAmount.toLocaleString('en-IN')})`}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
