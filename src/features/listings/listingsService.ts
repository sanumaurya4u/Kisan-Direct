import { supabase } from '../../lib/supabase';

export interface Product {
  id: string;
  name: string;
  unit: string;
  category_id: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  product_id: string;
  quantity: number;
  available_quantity: number;
  price_per_unit: number;
  grade?: string;
  harvest_date?: string;
  available_from?: string;
  location_name: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  status: 'active' | 'paused' | 'sold_out' | 'expired';
  created_at: string;
  products?: {
    name: string;
    unit: string;
  };
}

export const listingsService = {
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    if (error) throw error;
    return data as Product[];
  },

  async getMyListings(sellerId: string) {
    const { data, error } = await supabase
      .from('listings')
      .select('*, products(name, unit)')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Listing[];
  },

  async getListingById(id: string) {
    const { data, error } = await supabase
      .from('listings')
      .select('*, products(name, unit)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Listing;
  },

  async createListing(listingData: Partial<Listing>) {
    const { data, error } = await supabase
      .from('listings')
      .insert(listingData)
      .select()
      .single();
    if (error) throw error;
    return data as Listing;
  },

  async updateListing(id: string, listingData: Partial<Listing>) {
    const { data, error } = await supabase
      .from('listings')
      .update(listingData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Listing;
  },

  async deleteListing(id: string) {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `listings/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
