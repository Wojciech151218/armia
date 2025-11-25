"use client";

import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { ReactNode, useMemo } from "react";
import ErrorDisplay from "../utils/ErrorDisplay";

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

export interface GoogleMapDisplayProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; label?: string }>;
  children?: ReactNode;
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
}

export default function GoogleMapDisplay({
  center = { lat: 52.2297, lng: 21.0122 }, // Default to Warsaw, Poland
  zoom = 10,
  markers = [],
  children,
  onMapClick,
}: GoogleMapDisplayProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY || process.env.GOOGLE_CLOUD_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || "",
    libraries,
  });

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
    }),
    []
  );

  if (loadError) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-700 dark:text-red-400">
          <ErrorDisplay error="Error loading Google Maps. Please check your API key." />
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-zinc-800">
        <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <ErrorDisplay error="Google Maps API Error" />
    );
  }

  return (
    <div className="h-full w-full" style={{ cursor: 'crosshair' }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={mapOptions}
        zoom={zoom}
        center={center}
        onClick={onMapClick}
      >
        {markers.map((marker, index) => (
          <Marker
            key={`${marker.lat}-${marker.lng}-${index}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            label={marker.label}
          />
        ))}
        {children}
      </GoogleMap>
    </div>
  );
}

