import { Delivery, Base, Mission, Vehicle, Enemy, Unit, Soldier } from "./Types";


export enum MapObjectType {
    SOLDIER = "soldier",
    VEHICLE = "vehicle",
    BASE = "base",
   
}
export interface MapObject {
    objectType: MapObjectType;
    object : ( Soldier | Vehicle | Base ) 
}   

export interface MapObjectBuilder {
    longitude: number;
    latitude: number;
    objectType: MapObjectType;
}