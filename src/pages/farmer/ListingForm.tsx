import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../features/auth/AuthContext';
import { listingsService, type Product } from '../../features/listings/listingsService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';

const listingSchema = z.object({
  product_id: z.string().min(1, { message: "Product is required" }),
  quantity: z.coerce.number().positive(),
  price_per_unit: z.coerce.number().positive(),
  grade: z.string().optional(),
  location_name: z.string().min(1, { message: "Location is required" }),
  status: z.enum(['active', 'paused', 'sold_out']),
});

type ListingFormValues = z.infer<typeof listingSchema>;

export function ListingForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      status: 'active'
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodData = await listingsService.getProducts();
        setProducts(prodData);

        if (isEditing && id) {
          const listing = await listingsService.getListingById(id);
          reset({
            product_id: listing.product_id,
            quantity: listing.quantity,
            price_per_unit: listing.price_per_unit,
            grade: listing.grade || '',
            location_name: listing.location_name,
            status: listing.status as 'active' | 'paused' | 'sold_out',
          });
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load data");
      }
    };
    fetchData();
  }, [id, isEditing, reset]);

  const onSubmit = async (data: ListingFormValues) => {
    if (!profile) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      let image_url = undefined;
      if (imageFile) {
        image_url = await listingsService.uploadImage(imageFile);
      }

      const payload = {
        ...data,
        seller_id: profile.id,
        available_quantity: data.quantity, // Setting available equal to initial quantity
        image_url
      };

      if (isEditing && id) {
        // If editing, we shouldn't overwrite available_quantity blindly if it's already sold partially,
        // but for simplicity in this phase, we update it. In a real app, logic is more complex.
        const updatePayload = { ...data, image_url: image_url || undefined }; // Keep existing image if no new one
        await listingsService.updateListing(id, updatePayload);
      } else {
        await listingsService.createListing(payload);
      }
      
      const dashboardPath = profile.role === 'fpo' ? '/fpo/dashboard' : '/farmer/dashboard';
      navigate(dashboardPath);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save listing");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Listing' : 'Create New Listing'}</CardTitle>
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
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" step="0.01" {...register('quantity')} />
                {errors.quantity && <p className="text-sm text-red-600">{errors.quantity.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_per_unit">Price per Unit (₹)</Label>
                <Input id="price_per_unit" type="number" step="0.01" {...register('price_per_unit')} />
                {errors.price_per_unit && <p className="text-sm text-red-600">{errors.price_per_unit.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade (Optional)</Label>
              <Input id="grade" {...register('grade')} placeholder="e.g. Grade A, Organic" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location_name">Location</Label>
              <Input id="location_name" {...register('location_name')} placeholder="Farm/Warehouse location" />
              {errors.location_name && <p className="text-sm text-red-600">{errors.location_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" {...register('status')}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="sold_out">Sold Out</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image (Optional)</Label>
              <Input 
                id="image" 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setImageFile(e.target.files[0]);
                  }
                }} 
              />
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Listing'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
