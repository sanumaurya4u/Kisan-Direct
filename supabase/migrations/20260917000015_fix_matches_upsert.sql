-- Migration 15: Fix Matches Table Unique Constraint & Insert RLS Policy
-- 1. Add Unique constraint on (requirement_id, listing_id) for PostgREST upsert
ALTER TABLE public.matches 
  DROP CONSTRAINT IF EXISTS matches_requirement_listing_unique;

ALTER TABLE public.matches 
  ADD CONSTRAINT matches_requirement_listing_unique UNIQUE (requirement_id, listing_id);

-- 2. Add INSERT policy on matches table
DROP POLICY IF EXISTS "Participants can insert matches" ON public.matches;
CREATE POLICY "Participants can insert matches"
  ON public.matches FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT buyer_id FROM public.buyer_requirements WHERE id = requirement_id
    ) OR
    auth.uid() IN (
      SELECT seller_id FROM public.listings WHERE id = listing_id
    ) OR
    public.is_admin()
  );
