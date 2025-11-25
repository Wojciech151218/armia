"use client";

import { MapObjectType, MapObject } from "@/lib/MapObject";
import SoldierIcon from "@/components/icons/Soldier";
import VehicleIcon from "@/components/icons/Vehicle";
import LocationIcon from "@/components/icons/Location";
import Base from "@/components/icons/Base";


type ObjectIconType = (object: any) => React.ReactNode;
  
const componentMap : Record<MapObjectType, ObjectIconType> = {
  [MapObjectType.SOLDIER]: SoldierIcon,
  [MapObjectType.VEHICLE]: VehicleIcon,
  [MapObjectType.BASE]: Base,
};

const MapObjectMapper = ({ mapObject }: { mapObject: MapObject }) => {
  const Component = componentMap[mapObject.objectType];
  return Component ? <Component object={mapObject.object} /> : <div>Unknown object type</div>;
};

export default MapObjectMapper;

