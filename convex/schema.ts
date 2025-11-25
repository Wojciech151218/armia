import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const location = {
  latitude: v.number(),
  longitude: v.number(),

}

export default defineSchema({
  // Units (Jednostka)
  units: defineTable({
    name: v.string(), // Nazwa (required)
    size: v.optional(v.number()), // Rozmiar (optional)
    status: v.string(), // Status (required)
    commanderId: v.optional(v.id("soldiers")), // Soldier who commands this unit
    baseId: v.optional(v.id("bases")), // Base where unit is quartered
  }),

  // Soldiers (Żołnierz)
  soldiers: defineTable({
    firstName: v.string(), // Imię (required)
    lastName: v.string(), // Nazwisko (required)
    rank: v.optional(v.string()), // Ranga (optional)
    unitId: v.optional(v.id("units")), // Unit the soldier belongs to
    ...location,
  }),

  // Armaments (Uzbrojenie)
  armaments: defineTable({
    type: v.string(), // Typ (required)
    quantity: v.number(), // Ilość (required)
    status: v.string(), // Status (required)
    unitId: v.optional(v.id("units")), // Unit that possesses this armament
    soldierId: v.optional(v.id("soldiers")), // Soldier that possesses this armament
  }),

  // Missions (Misja)
  missions: defineTable({
    name: v.string(), // Nazwa (required)
    description: v.optional(v.string()), // Opis (optional)
    start: v.string(), // Start (required) - ISO date string
    end: v.optional(v.string()), // Koniec (optional) - ISO date string
    status: v.string(), // Status (required)
    unitId: v.optional(v.id("units")), // Unit assigned to this mission
    ...location,
  }),

  // Bases (Baza)
  bases: defineTable({
    name: v.string(), // Nazwa (required)
    capacity: v.optional(v.number()), // Pojemność (optional)
    ...location,
  }),

  

  // Vehicles (Pojazd)
  vehicles: defineTable({
    type: v.string(), // Typ (required)
    status: v.string(), // Status (required)
    unitId: v.optional(v.id("units")), // Unit that owns this vehicle
    ...location,
  }),

  // Events (Wydarzenie)
  events: defineTable({
    type: v.optional(v.string()), // Typ (optional)
    description: v.optional(v.string()), // Opis (optional)
    time: v.optional(v.string()), // Czas (optional) - ISO date string
    missionId: v.optional(v.id("missions")), // Mission this event is related to
  }),

  // Deliveries (Dostawa)
  deliveries: defineTable({
    type: v.string(), // Typ (required)
    quantity: v.number(), // Ilość (required)
    status: v.string(), // Status (required)
    senderLocation: v.object(location), // Location of sender
    receiverLocation: v.object(location), // Location of receiver
  }),

  // Enemies (Wróg)
  enemies: defineTable({
    type: v.optional(v.string()), // Typ (optional)
    estimatedStrength: v.optional(v.number()), // OszacowanaSila (optional)
    threatLevel: v.optional(v.string()), // StopieńZagrożenia (optional)
    ...location,
  }),
});

