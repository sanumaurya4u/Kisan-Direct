import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../features/auth/AuthContext';
import { buyerService } from '../../features/buyer/buyerService';
import { listingsService, type Product } from '../../features/listings/listingsService';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import {
  ArrowLeft,
  ShoppingBag,
  Scale,
  IndianRupee,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';

const reqSchema = z.object({
  product_id: z.string().min(1, { message: "Product is required" }),
  required_quantity: z.coerce.number().positive({ message: "Quantity must be greater than 0" }),
  target_price_per_unit: z.coerce.number().positive().optional(),
  target_location: z.string().min(1, { message: "Location is required" }),
  required_by: z.string().min(1, { message: "Date is required" }),
  status: z.enum(['open', 'cancelled']),
});

type ReqFormValues = z.infer<typeof reqSchema>;

export function RequirementForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<ReqFormValues>({
    resolver: zodResolver(reqSchema),
    defaultValues: {
      status: 'open',
      target_location: 'Azadpur Central Depot, Delhi NCR',
      required_by: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }
  });

  const watchQuantity = watch('required_quantity') || 0;
  const watchPrice = watch('target_price_per_unit') || 0;
  const watchProductId = watch('product_id');

  const selectedProduct = products.find(p => p.id === watchProductId);
  const projectedBudget = (Number(watchQuantity) || 0) * (Number(watchPrice) || 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodData = await listingsService.getProducts();
        setProducts(prodData);

        if (isEditing && id) {
          const req = await buyerService.getRequirementById(id);
          reset({
            product_id: req.product_id,
            required_quantity: req.required_quantity,
            target_price_per_unit: req.target_price_per_unit,
            target_location: req.target_location,
            required_by: req.required_by,
            status: req.status as 'open' | 'cancelled',
          });
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load data");
      }
    };
    fetchData();
  }, [id, isEditing, reset]);

  const onSubmit = async (data: ReqFormValues) => {
    if (!profile) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        ...data,
        buyer_id: profile.id,
        remaining_quantity: data.required_quantity,
      };

      if (isEditing && id) {
        const updatePayload = { ...data };
        await buyerService.updateRequirement(id, updatePayload);
      } else {
        await buyerService.createRequirement(payload);
      }
      
      navigate('/buyer/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save requirement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-xs font-semibold text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Buyer Portal
        </button>
      </div>

      {/* Main Form Card */}
      <Card className="border-gray-200/80 shadow-kisan-card rounded-2xl overflow-hidden bg-white">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 sm:p-8">
          <div className="flex items-center space-x-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Institutional Procurement • थोक मांग मांगपत्र</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isEditing ? 'Modify Procurement Requirement' : 'Publish Bulk Procurement Demand'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1.5 max-w-xl">
            Broadcast your wholesale agricultural demand to thousands of verified farmers and FPOs. AI matches direct producers within seconds.
          </p>
        </div>

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {/* Step 1: Crop Demanded */}
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-2">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
                  Crop & Grade Demanded
                </h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_id" className="font-semibold text-gray-800 text-sm">
                  Commodity Needed <span className="text-red-500">*</span>
                </Label>
                <Select id="product_id" {...register('product_id')} className="h-11">
                  <option value="">Select commodity...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </Select>
                {errors.product_id && (
                  <p className="text-xs font-medium text-red-600">{errors.product_id.message}</p>
                )}
              </div>
            </div>

            {/* Step 2: Volume & Price */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-gray-100 pb-2">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
                  Volume & Target Procurement Rate
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="required_quantity" className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-gray-400" />
                    Required Volume ({selectedProduct?.unit || 'Units'}) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="required_quantity"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 5000"
                    {...register('required_quantity')}
                    className="h-11 text-base font-bold text-gray-900"
                  />
                  {errors.required_quantity && (
                    <p className="text-xs font-medium text-red-600">{errors.required_quantity.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_price_per_unit" className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-gray-400" />
                    Target Price per {selectedProduct?.unit || 'Unit'} (₹)
                  </Label>
                  <Input
                    id="target_price_per_unit"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 26.00 (Optional)"
                    {...register('target_price_per_unit')}
                    className="h-11 text-base font-bold text-blue-700"
                  />
                </div>
              </div>

              {projectedBudget > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-blue-800 font-semibold uppercase tracking-wider">
                      Target Procurement Outlay
                    </div>
                    <div className="text-2xl font-black text-blue-900">
                      ₹{projectedBudget.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="text-xs text-blue-700 bg-white/80 px-3 py-1.5 rounded-lg border border-blue-200">
                    Direct Farmgate Sourcing
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Destination & Date */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-gray-100 pb-2">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">3</span>
                  Fulfillment Location & Delivery Deadline
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target_location" className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Delivery Receiving Depot <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="target_location"
                    {...register('target_location')}
                    placeholder="e.g. Azadpur Central Hub, Delhi NCR"
                    className="h-11"
                  />
                  {errors.target_location && (
                    <p className="text-xs font-medium text-red-600">{errors.target_location.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="required_by" className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Required Delivery Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="required_by"
                    type="date"
                    {...register('required_by')}
                    className="h-11"
                  />
                  {errors.required_by && (
                    <p className="text-xs font-medium text-red-600">{errors.required_by.message}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="status" className="font-semibold text-gray-800 text-sm">
                    Requirement Status
                  </Label>
                  <Select id="status" {...register('status')} className="h-11">
                    <option value="open">Open (Accepting Farmer Matches)</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                </div>
              )}
            </div>

            {/* Matching Guarantee info */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-900">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">AI Direct Matchmaker:</span> As soon as you publish, Kisan Direct’s intelligent routing algorithm evaluates all farmgate listings within your logistical radius and scores compatibility based on quality, quantity, and price.
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row justify-end items-center gap-3 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
              >
                {isLoading ? 'Publishing...' : isEditing ? 'Update Requirement' : 'Publish Requirement & Run AI Matching'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

