

export enum MapObjectType {
    SOLDIER = "soldier",
    VEHICLE = "vehicle",
    LOCATION = "location",
    BASE = "base",
    MISSION = "mission",
    DELIVERY = "delivery",
    ENEMY = "enemy",
}
export interface MapObject {
    objectType: MapObjectType;
    latitude: number;
    longitude: number;
}