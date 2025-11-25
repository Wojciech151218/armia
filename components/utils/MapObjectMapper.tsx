"use client";

import { MapObjectType } from "@/lib/MapObject";
import Soldier from "@/components/map-objects/Soldier";
import Vehicle from "@/components/map-objects/Vehicle";
import Location from "@/components/map-objects/Location";
import Base from "@/components/map-objects/Base";
import Mission from "@/components/map-objects/Mission";
import Delivery from "@/components/map-objects/Delivery";
import Enemy from "@/components/map-objects/Enemy";

interface MapObjectMapperProps {
  objectType: MapObjectType;
  [key: string]: any; // Allow additional props to be passed through
}

const componentMap = {
  [MapObjectType.SOLDIER]: Soldier,
  [MapObjectType.VEHICLE]: Vehicle,
  [MapObjectType.LOCATION]: Location,
  [MapObjectType.BASE]: Base,
  [MapObjectType.MISSION]: Mission,
  [MapObjectType.DELIVERY]: Delivery,
  [MapObjectType.ENEMY]: Enemy,
};

const MapObjectMapper = ({ objectType, ...props }: MapObjectMapperProps) => {
  const Component = componentMap[objectType];
  return Component ? <Component {...props} /> : <div>Unknown object type</div>;
};

export default MapObjectMapper;

