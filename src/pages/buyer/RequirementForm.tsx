import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../features/auth/AuthContext';
import { buyerService } from '../../features/buyer/buyerService';
import { listingsService, type Product } from '../../features/listings/listingsService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';

const reqSchema = z.object({
  product_id: z.string().min(1, { message: "Product is required" }),
  required_quantity: z.coerce.number().positive(),
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

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReqFormValues>({
    resolver: zodResolver(reqSchema),
    defaultValues: {
      status: 'open'
    }
  });

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
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Requirement' : 'Post Bulk Requirement'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{errorMsg}</div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="product_id">Product</Label>
              <Select id="product_id" {...register('product_id')}>
                <option value="">Select a product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
                ))}
              </Select>
              {errors.product_id && <p className="text-sm text-red-600">{errors.product_id.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="required_quantity">Quantity Needed</Label>
                <Input id="required_quantity" type="number" step="0.01" {...register('required_quantity')} />
                {errors.required_quantity && <p className="text-sm text-red-600">{errors.required_quantity.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_price_per_unit">Target Price (₹) - Optional</Label>
                <Input id="target_price_per_unit" type="number" step="0.01" {...register('target_price_per_unit')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target_location">Delivery Location</Label>
                <Input id="target_location" {...register('target_location')} />
                {errors.target_location && <p className="text-sm text-red-600">{errors.target_location.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="required_by">Required By Date</Label>
                <Input id="required_by" type="date" {...register('required_by')} />
                {errors.required_by && <p className="text-sm text-red-600">{errors.required_by.message}</p>}
              </div>
            </div>

            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select id="status" {...register('status')}>
                  <option value="open">Open</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
            )}

            <div className="pt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Post Requirement'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
