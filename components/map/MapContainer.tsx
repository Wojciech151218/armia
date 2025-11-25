"use client";
import { useState } from "react";
import MapObjectsMap from "./MapObjectsMap";
import Menu from "./menu/Menu";
import { MapObject, MapObjectBuilder } from "@/lib/MapObject";
import { Id } from "@/convex/_generated/dataModel";

interface MapContainerProps {
  objects: MapObject[];
  center?: { lat: number; lng: number };
  zoom?: number;
  title?: string;
}

const MapContainer = ({
  objects : initialObjects,
  center,
  zoom = 10,
  title = "Map View",
}: MapContainerProps) => {
  const [activeObject, setActiveObject] = useState<MapObjectBuilder | undefined>();
  const [objects, setObjects] = useState<MapObject[]>(initialObjects);

  const handleBuildObject = (object: MapObjectBuilder) => {
    setActiveObject(object);
  };
  const handleAddObject = (object: MapObject) => {
    setObjects([...objects, object]);
  };
  const handleRemoveObject = (id: string) => {
    setObjects(objects.filter((o) => o.object._id !== id));
  };
  return (
    <div className="flex h-full gap-4">
      {/* Left Menu */}
      <Menu className="flex-1" 
        mapObject={activeObject} 
        addObject={handleAddObject} 
        removeObject={handleRemoveObject}
      />

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
            buildObject={handleBuildObject}
          />
        </div>
      </div>
    </div>
  );
};

export default MapContainer;

