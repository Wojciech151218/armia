"use client";

import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useMemo } from "react";

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

interface GoogleMapDisplayProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; label?: string }>;
}

export default function GoogleMapDisplay({
  center = { lat: 52.2297, lng: 21.0122 }, // Default to Warsaw, Poland
  zoom = 10,
  markers = [],
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
          Error loading Google Maps. Please check your API key.
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
      <div className="flex h-full w-full items-center justify-center rounded-lg border border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <p className="text-yellow-700 dark:text-yellow-400">
          Google Maps API key not found. Please set NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY or GOOGLE_CLOUD_API_KEY environment variable.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={mapOptions}
        zoom={zoom}
        center={center}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            label={marker.label}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

