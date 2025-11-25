"use client";

import { useCallback, useMemo, useState } from "react";
import { OverlayView } from "@react-google-maps/api";
import GoogleMapDisplay from "./GoogleMap";
import MapObjectMapper from "../utils/MapObjectMapper";
import { MapObject, MapObjectBuilder, MapObjectType } from "@/lib/MapObject";
import AddButton from "./AddButton";

const DEFAULT_CENTER = { lat: 52.2297, lng: 21.0122 }; // Warsaw fallback

interface MapObjectsMapProps {
  mapObjects: Array<MapObject>;
  center?: { lat: number; lng: number };
  zoom?: number;
  showDefaultMarkers?: boolean;
  buildObject: (object: MapObjectBuilder) => void;
}

const MapObjectsMap = ({
  mapObjects,
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

    if (mapObjects.length === 0) {
      return DEFAULT_CENTER;
    }

    const aggregated = mapObjects.reduce(
      (acc, mapObject) => {
        acc.lat += mapObject.object.latitude;
        acc.lng += mapObject.object.longitude;
        return acc;
      },
      { lat: 0, lng: 0 }
    );

    return {
      lat: aggregated.lat / mapObjects.length,
      lng: aggregated.lng / mapObjects.length,
    };
  }, [center, mapObjects]);

  const markers = showDefaultMarkers
    ? mapObjects.map((mapObject, index) => ({
        lat: mapObject.object.latitude,
        lng: mapObject.object.longitude,
        label: `${index + 1}`,
      }))
    : [];

  return (
    <div className="map-objects-map">
      <GoogleMapDisplay center={computedCenter} zoom={zoom} markers={markers} onMapClick={handleMapClick}>
        {mapObjects.map((mapObject, index) => (
          <OverlayView
            key={`map-object-${index}-${mapObject.object.latitude}-${mapObject.object.longitude}`}
            position={{ lat: mapObject.object.latitude, lng: mapObject.object.longitude }}
            mapPaneName="overlayMouseTarget"
          >
            <div className="map-objects-map-marker">
              <MapObjectMapper mapObject={mapObject} />
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

