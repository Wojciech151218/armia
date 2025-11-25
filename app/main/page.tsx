"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import GoogleMapDisplay from "../../components/map/GoogleMap";

type SoldierStatus = "active" | "inactive" | "reserve";

export default function Home() {
  

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900">
        <h2 className="mb-4 text-2xl font-semibold text-black dark:text-zinc-50 text-center">
          Map View
        </h2>
        <div className="w-[500px] h-[500px] overflow-hidden rounded-lg flex items-center justify-center">
          <GoogleMapDisplay
            center={{ lat: 52.2297, lng: 21.0122 }}
            zoom={10}
          />
        </div>
      </div>
    </div>
  );  
}
