import { supabase } from '../../lib/supabase';
import { type Listing } from '../listings/listingsService';

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  requirement_id?: string;
  subtotal: number;
  estimated_logistics_cost?: number;
  platform_fee?: number;
  total_amount: number;
  currency: string;
  delivery_address?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'processing' | 'ready_for_pickup' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  created_at: string;
  buyer?: { full_name: string; phone?: string };
  seller?: { full_name: string; phone?: string };
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  listing_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  products?: { name: string; unit: string };
  listings?: { location_name: string };
}

export const ordersService = {
  async getMyOrders(userId: string, role: string) {
    const column = role === 'farmer' || role === 'fpo' ? 'seller_id' : 'buyer_id';
    
    // We join order_items and profiles to get detailed view
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        buyer:profiles!orders_buyer_id_fkey(full_name, phone),
        seller:profiles!orders_seller_id_fkey(full_name, phone),
        order_items(*, products(name, unit), listings(location_name))
      `)
      .eq(column, userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  },

  async createOrderFromListing(
    listing: Listing, 
    buyerId: string, 
    orderQuantity: number, 
    deliveryAddress: string, 
    requirementId?: string
  ) {
    const breakdown = this.calculatePriceBreakdown(listing.price_per_unit, orderQuantity);

    // 1. Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: buyerId,
        seller_id: listing.seller_id,
        requirement_id: requirementId,
        subtotal: breakdown.subtotal,
        estimated_logistics_cost: breakdown.estimatedLogistics,
        platform_fee: breakdown.platformFee,
        total_amount: breakdown.totalAmount,
        delivery_address: deliveryAddress,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Insert order item
    const { error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        listing_id: listing.id,
        product_id: listing.product_id,
        quantity: orderQuantity,
        unit_price: listing.price_per_unit,
        total_price: breakdown.subtotal
      });

    if (itemError) {
      // rollback order (very simplified, usually use rpc)
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemError;
    }

    return order;
  },

  async acceptOrder(orderId: string) {
    const { error } = await supabase.rpc('accept_order', { target_order_id: orderId });
    if (error) throw error;
  },

  async rejectOrder(orderId: string) {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'rejected' })
      .eq('id', orderId);
    if (error) throw error;
  },

  async updateOrderStatus(orderId: string, status: Order['status']) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (error) throw error;
  },

  calculatePriceBreakdown(pricePerUnit: number, quantity: number, distanceKm: number = 50) {
    const subtotal = pricePerUnit * quantity;
    // Simple heuristic: base logistics + (distance * per_km_rate) + (quantity * weight_rate)
    const estimatedLogistics = 200 + (distanceKm * 15) + (quantity * 2);
    const platformFee = 0; // Highlight 0% fee
    return {
      subtotal,
      estimatedLogistics: Math.round(estimatedLogistics),
      platformFee,
      totalAmount: Math.round(subtotal + estimatedLogistics + platformFee),
      farmerRealization: subtotal
    };
  }
};
