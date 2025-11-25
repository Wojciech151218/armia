import MapContainer from "@/components/map/MapContainer";
import { MapObjectType } from "@/lib/MapObject";

export default function Home() {
  const objects = [{
    objectType: MapObjectType.SOLDIER,
    latitude: 52.2297,
    longitude: 21.0122,
  }];

  return (
    <div className="h-[calc(100vh-4rem)] mt-8">
      <MapContainer
        objects={objects}
        center={{ lat: 52.2297, lng: 21.0122 }}
        zoom={10}
      />
    </div>
  );
}
