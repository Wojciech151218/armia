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
    <div className="map-layout">
      <div className="map-layout-menu scrollbar-custom">
        <Menu
          mapObject={activeObject}
          addObject={handleAddObject}
          removeObject={handleRemoveObject}
        />
      </div>

      <div className="map-layout-map">
        <h2 className="map-layout-title">{title}</h2>
        <div className="map-layout-map-inner">
          <MapObjectsMap
            mapObjects={objects}
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

