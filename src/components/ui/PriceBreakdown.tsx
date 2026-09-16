import { IndianRupee, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  subtotal: number;
  estimatedLogistics: number;
  platformFee: number;
  totalAmount: number;
  farmerRealization: number;
  className?: string;
  isSellerView?: boolean;
}

export function PriceBreakdown({
  subtotal,
  estimatedLogistics,
  platformFee,
  totalAmount,
  farmerRealization,
  className = '',
  isSellerView = false
}: Props) {
  return (
    <div className={`bg-white border rounded-xl overflow-hidden shadow-sm ${className}`}>
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
        <h4 className="font-semibold flex items-center text-gray-800">
          <IndianRupee className="w-4 h-4 mr-1 text-gray-500" />
          Transaction Economics
        </h4>
        <div className="flex items-center text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-medium border border-green-200">
          <ShieldCheck className="w-3 h-3 mr-1" />
          0% Platform Fee
        </div>
      </div>
      
      <div className="p-4 space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Base Crop Value</span>
          <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        
        <div className="flex justify-between items-center text-gray-500">
          <span className="flex items-center">
            <Truck className="w-3.5 h-3.5 mr-1.5" /> Est. Logistics
          </span>
          <span>+ ₹{estimatedLogistics.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between items-center text-gray-500">
          <span>Platform Fee (Subsidized)</span>
          <span className="text-green-600">₹{platformFee}</span>
        </div>

        <div className="pt-3 border-t flex justify-between items-center font-bold text-base">
          <span>{isSellerView ? 'Buyer Pays (Total)' : 'Total Payable Estimate'}</span>
          <span>₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {isSellerView && (
        <div className="bg-green-50 p-4 border-t border-green-100 flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-900">Net Farmer Realization: ₹{farmerRealization.toLocaleString('en-IN')}</p>
            <p className="text-xs text-green-700 mt-0.5">You keep 100% of the crop value. Logistics are paid directly to the transporter.</p>
          </div>
        </div>
      )}
    </div>
  );
}
