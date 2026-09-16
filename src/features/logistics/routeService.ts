import { supabase } from '../../lib/supabase';

// Mock function to geocode string locations to lat/lng for demo purposes, 
// since we don't have a real geocoding API in this hackathon.
export const getMockCoordinates = (location: string): { lat: number; lng: number } => {
  const hash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Base coordinates around central India
  const baseLat = 21.0;
  const baseLng = 79.0;
  
  // Use string hash to create deterministic offsets
  const latOffset = (hash % 100) / 20; // -5 to +5 degrees
  const lngOffset = ((hash * 3) % 100) / 20; // -5 to +5 degrees
  
  return {
    lat: baseLat + latOffset * (hash % 2 === 0 ? 1 : -1),
    lng: baseLng + lngOffset * (hash % 3 === 0 ? 1 : -1)
  };
};

export const routeService = {
  async saveDemoRoute(jobId: string, distanceKm: number, durationMinutes: number) {
    const { data, error } = await supabase
      .from('routes')
      .insert({
        logistics_job_id: jobId,
        distance_km: distanceKm,
        duration_minutes: durationMinutes,
        optimization_method: 'demo_straight_line',
        is_demo: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getRouteForJob(jobId: string) {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('logistics_job_id', jobId)
      .single();
      
    if (error && error.code !== 'PGRST116') { // not found is ok
      throw error;
    }
    return data;
  }
};
