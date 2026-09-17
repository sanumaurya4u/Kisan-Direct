import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../features/auth/AuthContext';
import { listingsService, type Product } from '../../features/listings/listingsService';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import {
  Sprout,
  UploadCloud,
  Sparkles,
  MapPin,
  IndianRupee,
  Scale,
  ArrowLeft,
  Lightbulb,
} from 'lucide-react';

const listingSchema = z.object({
  product_id: z.string().min(1, { message: "Product is required" }),
  quantity: z.coerce.number().positive({ message: "Quantity must be greater than 0" }),
  price_per_unit: z.coerce.number().positive({ message: "Price must be greater than 0" }),
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      status: 'active',
      location_name: 'Nashik, Maharashtra',
    }
  });

  const watchQuantity = watch('quantity') || 0;
  const watchPrice = watch('price_per_unit') || 0;
  const watchProductId = watch('product_id');

  const selectedProduct = products.find(p => p.id === watchProductId);
  const projectedRevenue = (Number(watchQuantity) || 0) * (Number(watchPrice) || 0);

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
          if (listing.image_url) {
            setImagePreview(listing.image_url);
          }
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load data");
      }
    };
    fetchData();
  }, [id, isEditing, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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
        available_quantity: data.quantity,
        image_url
      };

      if (isEditing && id) {
        const updatePayload = { ...data, image_url: image_url || undefined };
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
    <div className="container mx-auto p-4 md:p-8 max-w-3xl space-y-6">
      {/* Top Breadcrumb / Return */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-xs font-semibold text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </button>
        <Link to="/farmer/sell-smart">
          <Badge variant="success" className="text-xs py-1 px-2.5 cursor-pointer">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Check AI Recommended Prices
          </Badge>
        </Link>
      </div>

      {/* Main Card */}
      <Card className="border-gray-200/80 shadow-kisan-card rounded-2xl overflow-hidden bg-white">
        {/* Banner header with agricultural style */}
        <div className="bg-gradient-to-r from-[#14532D] to-[#166534] text-white p-6 sm:p-8">
          <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sprout className="w-4 h-4" />
            <span>Direct Farm Listing • अपनी फसल लिस्ट करें</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isEditing ? 'Edit Produce Lot' : 'Publish Harvest Lot to Marketplace'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 max-w-xl">
            List directly to verified institutional buyers and retail chains across India. Zero middlemen cut, instant direct payment.
          </p>
        </div>

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {/* Section 1: Produce Category & Product */}
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-2">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-primary flex items-center justify-center text-xs font-bold">1</span>
                  Produce Details (फसल विवरण)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_id" className="font-semibold text-gray-800 text-sm">
                    Select Crop / Commodity <span className="text-red-500">*</span>
                  </Label>
                  <Select id="product_id" {...register('product_id')} className="h-11">
                    <option value="">Choose your crop...</option>
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

                <div className="space-y-2">
                  <Label htmlFor="grade" className="font-semibold text-gray-800 text-sm">
                    Produce Grade / Quality
                  </Label>
                  <Input
                    id="grade"
                    {...register('grade')}
                    placeholder="e.g. Grade A, Sharbati, Organic"
                    className="h-11"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Grade A', 'Organic', 'Export Quality', 'Grade B'].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setValue('grade', preset)}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-primary transition-colors"
                      >
                        +{preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Quantity & Expected Farmgate Price */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-gray-100 pb-2">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-primary flex items-center justify-center text-xs font-bold">2</span>
                  Volume & Farmgate Price (मात्रा और कीमत)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-gray-400" />
                    Available Volume ({selectedProduct?.unit || 'Units'}) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 1000"
                    {...register('quantity')}
                    className="h-11 text-base font-bold text-gray-900"
                  />
                  {errors.quantity && (
                    <p className="text-xs font-medium text-red-600">{errors.quantity.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_per_unit" className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-gray-400" />
                    Farmgate Price per {selectedProduct?.unit || 'Unit'} (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price_per_unit"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 28.50"
                    {...register('price_per_unit')}
                    className="h-11 text-base font-bold text-primary"
                  />
                  {errors.price_per_unit && (
                    <p className="text-xs font-medium text-red-600">{errors.price_per_unit.message}</p>
                  )}
                </div>
              </div>

              {/* Real-time Projected Earnings Card */}
              {projectedRevenue > 0 && (
                <div className="bg-[#F0FDF4] border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                      Expected Total Farm Realization (संभावित कुल आय)
                    </div>
                    <div className="text-2xl font-black text-primary">
                      ₹{projectedRevenue.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="text-right text-xs text-emerald-700 bg-white/80 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <span className="font-bold">₹0 Mandi Commission</span> • 100% Direct to You
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Farm Origin & Status */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-gray-100 pb-2">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-primary flex items-center justify-center text-xs font-bold">3</span>
                  Farm Location & Availability (स्थान व स्थिति)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location_name" className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Farmgate / Warehouse Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location_name"
                    {...register('location_name')}
                    placeholder="e.g. Dindori Taluk, Nashik, Maharashtra"
                    className="h-11"
                  />
                  {errors.location_name && (
                    <p className="text-xs font-medium text-red-600">{errors.location_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="font-semibold text-gray-800 text-sm">
                    Listing Visibility Status
                  </Label>
                  <Select id="status" {...register('status')} className="h-11">
                    <option value="active">Active (Visible to All Buyers)</option>
                    <option value="paused">Paused (Temporarily Hidden)</option>
                    <option value="sold_out">Sold Out</option>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 4: Harvest Photo */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-gray-100 pb-2">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-primary flex items-center justify-center text-xs font-bold">4</span>
                  Produce Photo (फसल की फोटो — Optional)
                </h2>
              </div>

              <div className="border-2 border-dashed border-gray-300 hover:border-primary/60 rounded-2xl p-6 text-center transition-colors bg-gray-50/50">
                {imagePreview ? (
                  <div className="space-y-3">
                    <img
                      src={imagePreview}
                      alt="Crop preview"
                      className="w-40 h-32 object-cover rounded-xl mx-auto shadow-md border"
                    />
                    <div className="flex items-center justify-center space-x-3">
                      <label htmlFor="image-upload" className="cursor-pointer text-xs font-bold text-primary hover:underline">
                        Change photo
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-primary mx-auto flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      Upload photo of your actual harvested lot
                    </div>
                    <p className="text-xs text-gray-500">
                      High-resolution photos increase buyer inquiry rates by up to 40%.
                    </p>
                    <label
                      htmlFor="image-upload"
                      className="inline-block mt-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs"
                    >
                      Browse Files
                    </label>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Farmer Tip */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Farmer Direct Guarantee:</span> When buyers accept your listing, Kisan Direct locks the agreed rate in an escrow ledger. You receive payment directly to your bank upon verified farmgate dispatch.
              </div>
            </div>

            {/* Action Buttons */}
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
                className="w-full sm:w-auto px-8 shadow-kisan-hover font-bold"
              >
                {isLoading ? 'Saving Listing...' : isEditing ? 'Update Listing' : 'Publish Listing'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

