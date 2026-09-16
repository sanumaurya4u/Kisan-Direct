import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons not showing in React due to Vite/Webpack paths
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  pickup: { lat: number; lng: number; label: string } | null;
  drop: { lat: number; lng: number; label: string } | null;
}

// Helper component to adjust bounds to fit both markers
function MapBounds({ pickup, drop }: MapProps) {
  const map = useMap();
  useEffect(() => {
    if (pickup && drop) {
      const bounds = L.latLngBounds([pickup.lat, pickup.lng], [drop.lat, drop.lng]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (pickup) {
      map.setView([pickup.lat, pickup.lng], 13);
    } else if (drop) {
      map.setView([drop.lat, drop.lng], 13);
    }
  }, [map, pickup, drop]);
  return null;
}

export function RouteMap({ pickup, drop }: MapProps) {
  // Default center if no coords
  const center: [number, number] = [20.5937, 78.9629]; // India center
  
  const hasRoute = pickup && drop;
  const polylineCoords: [number, number][] = hasRoute 
    ? [[pickup.lat, pickup.lng], [drop.lat, drop.lng]] 
    : [];

  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]}>
            <Popup><strong>Pickup:</strong> {pickup.label}</Popup>
          </Marker>
        )}
        {drop && (
          <Marker position={[drop.lat, drop.lng]}>
            <Popup><strong>Drop-off:</strong> {drop.label}</Popup>
          </Marker>
        )}
        {hasRoute && (
          <Polyline positions={polylineCoords} color="blue" weight={3} dashArray="5, 10" />
        )}
        <MapBounds pickup={pickup} drop={drop} />
      </MapContainer>
    </div>
  );
}
