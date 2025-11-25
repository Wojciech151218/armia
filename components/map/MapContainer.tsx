"use client";
import { useState } from "react";
import MapObjectsMap from "./MapObjectsMap";
import Menu from "./menu/Menu";
import { MapObject, MapObjectBuilder } from "@/lib/MapObject";

interface MapContainerProps {
  objects: MapObject[];
  center?: { lat: number; lng: number };
  zoom?: number;
  title?: string;
}

const MapContainer = ({
  objects,
  center,
  zoom = 10,
  title = "Map View",
}: MapContainerProps) => {
  const [activeObject, setActiveObject] = useState<MapObjectBuilder | undefined>();

  const handleAddObject = (object: MapObjectBuilder) => {
    setActiveObject(object);
  };
  return (
    <div className="flex h-full gap-4">
      {/* Left Menu */}
      <Menu className="flex-1" mapObject={activeObject} />

      {/* Right Map - Square shape constrained by height */}
      <div className="h-full aspect-square rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900 overflow-hidden flex-shrink-0">
        <h2 className="mb-4 text-2xl font-semibold text-black dark:text-zinc-50 text-center">
          {title}
        </h2>
        <div className="h-[calc(100%-4rem)] overflow-hidden rounded-lg">
          <MapObjectsMap
            objects={objects}
            center={center}
            zoom={zoom}
            addObject={handleAddObject}
          />
        </div>
      </div>
    </div>
  );
};

export default MapContainer;

