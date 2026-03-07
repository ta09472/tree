import { Link } from '@tanstack/react-router';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import type { Farm } from '#/data/farms';

type FarmDiscoveryMapProps = {
  farms: Farm[];
  selectedFarmId: string;
  onSelectFarm: (farmId: string) => void;
};

const DEFAULT_CENTER: LatLngExpression = [35.7, 127.8];
const DEFAULT_ZOOM = 7;

function createFarmMarker(availableTrees: number, isSelected: boolean) {
  return L.divIcon({
    className: 'farm-map-pin-wrapper',
    html: `<button class="farm-map-pin${isSelected ? ' is-selected' : ''}" type="button"><span>${availableTrees}</span></button>`,
    iconSize: [48, 48],
    iconAnchor: [24, 44],
    popupAnchor: [0, -38],
  });
}

function MapViewportController({
  farms,
  selectedFarmId,
}: Pick<FarmDiscoveryMapProps, 'farms' | 'selectedFarmId'>) {
  const map = useMap();

  useEffect(() => {
    const selectedFarm = farms.find((farm) => farm._id === selectedFarmId);

    if (selectedFarm) {
      map.flyTo([selectedFarm.location.latitude, selectedFarm.location.longitude], 9, {
        duration: 0.8,
      });
      return;
    }

    const bounds = L.latLngBounds(
      farms.map((farm) => [farm.location.latitude, farm.location.longitude] as [number, number])
    );

    map.fitBounds(bounds, {
      padding: [48, 48],
      maxZoom: DEFAULT_ZOOM,
    });
  }, [farms, map, selectedFarmId]);

  return null;
}

export default function FarmDiscoveryMap({
  farms,
  selectedFarmId,
  onSelectFarm,
}: FarmDiscoveryMapProps) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className="farm-leaflet-map h-[420px] w-full md:h-[560px]"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapViewportController farms={farms} selectedFarmId={selectedFarmId} />

      {farms.map((farm) => (
        <Marker
          key={farm._id}
          position={[farm.location.latitude, farm.location.longitude]}
          icon={createFarmMarker(farm.stats.availableTrees, farm._id === selectedFarmId)}
          eventHandlers={{
            click: () => onSelectFarm(farm._id),
          }}
        >
          <Popup>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{farm.name}</p>
                <p className="text-xs text-muted-foreground">{farm.location.address}</p>
              </div>
              <p className="text-xs text-muted-foreground">{farm.description}</p>
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>{farm.stats.availableTrees}그루 분양 가능</span>
                <Link
                  to="/farms/$farmId"
                  params={{ farmId: farm._id }}
                  className="font-semibold text-primary"
                >
                  상세 보기
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
