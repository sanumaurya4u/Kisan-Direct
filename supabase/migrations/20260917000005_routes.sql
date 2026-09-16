-- 1. Create routes table
CREATE TABLE public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    logistics_job_id UUID REFERENCES public.logistics_jobs(id) ON DELETE CASCADE NOT NULL,
    route_geometry JSONB,
    distance_km NUMERIC,
    duration_minutes INTEGER,
    optimization_method TEXT,
    is_demo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logistics partners and admins can view routes"
    ON public.routes FOR SELECT
    USING (
        auth.uid() IN (
            SELECT logistics_partner_id FROM public.logistics_jobs WHERE id = logistics_job_id
        )
        OR auth.role() = 'service_role'
    );

CREATE POLICY "Logistics partners can insert routes"
    ON public.routes FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT logistics_partner_id FROM public.logistics_jobs WHERE id = logistics_job_id
        )
    );
