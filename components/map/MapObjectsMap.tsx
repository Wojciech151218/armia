"use client";

import { useCallback, useMemo, useState } from "react";
import { OverlayView } from "@react-google-maps/api";
import GoogleMapDisplay from "./GoogleMap";
import MapObjectMapper from "../utils/MapObjectMapper";
import { MapObject, MapObjectBuilder, MapObjectType } from "@/lib/MapObject";
import AddButton from "./AddButton";

const DEFAULT_CENTER = { lat: 52.2297, lng: 21.0122 }; // Warsaw fallback

interface MapObjectsMapProps {
  objects: Array<MapObject>;
  center?: { lat: number; lng: number };
  zoom?: number;
  showDefaultMarkers?: boolean;
  buildObject: (object: MapObjectBuilder) => void;
}

const MapObjectsMap = ({
  objects,
  center,
  zoom = 10,
  showDefaultMarkers = false,
  buildObject,
}: MapObjectsMapProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pendingObjectType, setPendingObjectType] = useState<MapObjectType | null>(null);

  const handleSelectType = useCallback((type: MapObjectType) => {
    setPendingObjectType(type);
    setIsMenuOpen(false);
  }, []);

  const handleCancelPlacement = useCallback(() => {
    setPendingObjectType(null);
  }, []);

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!pendingObjectType || !event.latLng) {
        return;
      }

      buildObject({
        objectType: pendingObjectType,
        latitude: event.latLng.lat(),
        longitude: event.latLng.lng(),
      });

    },
    [buildObject, pendingObjectType]
  );

  const computedCenter = useMemo(() => {
    if (center) {
      return center;
    }

    if (objects.length === 0) {
      return DEFAULT_CENTER;
    }

    const aggregated = objects.reduce(
      (acc, object) => {
        acc.lat += object.object.latitude;
        acc.lng += object.object.longitude;
        return acc;
      },
      { lat: 0, lng: 0 }
    );

    return {
      lat: aggregated.lat / objects.length,
      lng: aggregated.lng / objects.length,
    };
  }, [center, objects]);

  const markers = showDefaultMarkers
    ? objects.map((object, index) => ({
        lat: object.object.latitude,
        lng: object.object.longitude,
        label: `${index + 1}`,
      }))
    : [];

  return (
    <div className="relative h-full w-full" style={{ cursor: 'crosshair' }}>
      <GoogleMapDisplay center={computedCenter} zoom={zoom} markers={markers} onMapClick={handleMapClick}>
        {objects.map((object, index) => (
          <OverlayView
            key={`map-object-${index}-${object.object.latitude}-${object.object.longitude}`}
            position={{ lat: object.object.latitude, lng: object.object.longitude }}
            mapPaneName="overlayMouseTarget"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-zinc-200 bg-white/90 p-2 text-xs text-zinc-800 shadow-md backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100">
              <MapObjectMapper {...object} />
            </div>
          </OverlayView>
        ))}
      </GoogleMapDisplay>

      <AddButton
        isOpen={isMenuOpen}
        pendingType={pendingObjectType}
        onToggle={() => setIsMenuOpen((prev) => !prev)}
        onSelectType={handleSelectType}
        onCancelPlacement={handleCancelPlacement}
      />
    </div>
  );
};

export default MapObjectsMap;

