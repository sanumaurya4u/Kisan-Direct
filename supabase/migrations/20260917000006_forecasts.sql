-- 1. Create demand_forecasts table
CREATE TABLE public.demand_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    region TEXT NOT NULL,
    forecast_date DATE NOT NULL,
    forecast_period_start DATE NOT NULL,
    forecast_period_end DATE NOT NULL,
    predicted_quantity NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    confidence NUMERIC,
    trend TEXT CHECK (trend IN ('increasing', 'decreasing', 'stable')),
    is_demo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demand_forecasts ENABLE ROW LEVEL SECURITY;

-- Forecasts are public/viewable by any authenticated user for market insights
CREATE POLICY "Forecasts are viewable by authenticated users"
    ON public.demand_forecasts FOR SELECT
    USING (auth.role() = 'authenticated');
