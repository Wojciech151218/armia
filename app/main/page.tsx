import MapContainer from "@/components/map/MapContainer";
import { api } from "@/convex/_generated/api";
import { MapObjectType } from "@/lib/MapObject";
import { ConvexHttpClient } from "convex/browser";
import type {  Soldier } from "@/lib/Types";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);


export default async function Home() {
  const soldiers = await convex.query(api.soldiers.list);
  const objects = soldiers
    .map((soldier) => ({
      objectType: MapObjectType.SOLDIER,
      object: soldier as Soldier,
    }));


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
