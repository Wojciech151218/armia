/**
 * Server-side Google Maps component using Static Maps API
 * 
 * TRADE-OFFS:
 * ✅ Can be rendered server-side (better SEO, faster initial load)
 * ✅ No JavaScript required for initial render
 * ✅ Lower API costs (Static Maps is cheaper)
 * 
 * ❌ NO interactivity (no panning, zooming, clicking)
 * ❌ NO markers interaction
 * ❌ NO user interactions at all
 * ❌ Static image only - cannot be made interactive later
 * ❌ Limited customization compared to JavaScript API
 */

interface GoogleMapStaticProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  width?: number;
  height?: number;
  markers?: Array<{ lat: number; lng: number; label?: string; color?: string }>;
  apiKey?: string;
}

export default function GoogleMapStatic({
  center = { lat: 52.2297, lng: 21.0122 },
  zoom = 10,
  width = 800,
  height = 500,
  markers = [],
  apiKey,
}: GoogleMapStaticProps) {
  // This can be a Server Component (no "use client" needed)
  const key = apiKey || process.env.GOOGLE_CLOUD_API_KEY || "";

  if (!key) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <p className="text-yellow-700 dark:text-yellow-400">
          Google Maps API key not found. Please set GOOGLE_CLOUD_API_KEY environment variable.
        </p>
      </div>
    );
  }

  // Build markers parameter for Static Maps API
  const markersParam = markers
    .map((marker) => {
      const color = marker.color || "red";
      const label = marker.label ? `|${marker.label}` : "";
      return `color:${color}${label}|${marker.lat},${marker.lng}`;
    })
    .join("&markers=");

  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=${zoom}&size=${width}x${height}&markers=${markersParam}&key=${key}`;

  return (
    <div className="h-full w-full">
      <img
        src={staticMapUrl}
        alt="Map"
        className="h-full w-full rounded-lg object-cover"
        width={width}
        height={height}
      />
    </div>
  );
}
