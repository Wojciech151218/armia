"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { MapObject, MapObjectType } from "@/lib/MapObject";
import { Soldier } from "@/lib/Types";

interface SoldierMenuProps {
  latitude: number;
  longitude: number;
  addObject: (object: MapObject) => void;
  removeObject: (soldierId: Id<"soldiers">) => void;
}

type FormState = {
  firstName: string;
  lastName: string;
  rank: string;
};

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  rank: "",
};

const SoldierMenu = ({ latitude, longitude, addObject, removeObject }: SoldierMenuProps) => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [editingId, setEditingId] = useState<Id<"soldiers"> | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const soldiersData = useQuery(api.soldiers.list);
  const soldiers = soldiersData ?? [];
  const isLoadingSoldiers = soldiersData === undefined;

  const createSoldier = useMutation(api.soldiers.create);
  const updateSoldier = useMutation(api.soldiers.update);
  const removeSoldier = useMutation(api.soldiers.remove);



  const coordinateLabel = useMemo(() => {

    return `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
  }, [latitude, longitude]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
  };

  const handleEdit = (soldier: Doc<"soldiers">) => {
    setForm({
      firstName: soldier.firstName ?? "",
      lastName: soldier.lastName ?? "",
      rank: soldier.rank ?? "",
    });
    setEditingId(soldier._id);
    setStatus(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const rank = form.rank.trim();

    if (!firstName || !lastName) {
      setStatus({
        type: "error",
        message: "First and last name are required.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {

      // Create location if coordinates are available
      if (latitude !== undefined && longitude !== undefined) {
        
      }

      if (editingId) {
        const soldier = await updateSoldier({
          id: editingId,
          firstName,
          lastName,
          rank: rank ?? undefined,
          latitude,
          longitude,
        });
        addObject({
          objectType: MapObjectType.SOLDIER,
          object: soldier as Soldier,
        });
        setStatus({ type: "success", message: "Soldier updated successfully." });
      } else {
        const soldier = await createSoldier({
          firstName,
          lastName,
          rank: rank ?? undefined,
          latitude,
          longitude,
        });
        addObject({
          objectType: MapObjectType.SOLDIER,
          object: soldier as Soldier,
        });

        setStatus({ type: "success", message: "Soldier created successfully." });
      }
      resetForm();
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save the soldier. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: Id<"soldiers">) => {
    setStatus(null);
    try {
      await removeSoldier({ id: id });
      if (editingId === id) {
        resetForm();
      }
      removeObject(id);
      setStatus({ type: "success", message: "Soldier removed from roster." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to delete soldier.",
      });
    }
  };

  const actionLabel = editingId ? "Update soldier" : "Create soldier";

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="rounded-2xl border border-emerald-100/60 bg-gradient-to-br from-emerald-50/70 via-white to-white p-5 shadow-inner dark:border-emerald-500/20 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
        <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">Coordinates</p>
        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="text-2xl font-semibold text-zinc-900 dark:text-white">{coordinateLabel}</p>
          <span
            className="rounded-full px-4 py-1 text-xs font-semibold 
            bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
                
          >
            Ready to deploy
          </span>  
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-zinc-200/70 bg-white/95 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-400">Soldier profile</p>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
              {editingId ? "Edit existing entry" : "Create new entry"}
            </h3>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-medium text-emerald-600 underline-offset-4 transition hover:underline dark:text-emerald-300"
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            First name
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="John"
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base font-normal text-zinc-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-400/40"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Last name
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base font-normal text-zinc-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-400/40"
            />
          </label>
          <label className="sm:col-span-2 flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Rank
            <input
              type="text"
              name="rank"
              value={form.rank}
              onChange={handleChange}
              placeholder="Sergeant"
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base font-normal text-zinc-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-400/40"
            />
            <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">Optional, e.g. Private, Captain.</span>
          </label>
        </div>

        {status && (
          <div
            className={`rounded-xl border px-3 py-2 text-sm ${
              status.type === "error"
                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"
                : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-100"
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : actionLabel}
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/75 dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="flex items-center justify-between border-b border-zinc-200/70 px-5 py-4 dark:border-zinc-800">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-400">Active roster</p>
            <p className="text-lg font-semibold text-zinc-900 dark:text-white">
              {soldiers.length} soldier{soldiers.length === 1 ? "" : "s"}
            </p>
          </div>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-300">Live</span>
        </div>
        <div className="h-full space-y-3 overflow-y-auto px-5 py-4">
          {isLoadingSoldiers ? (
            <div className="space-y-3">
              {[1, 2, 3].map((skeleton) => (
                <div
                  key={skeleton}
                  className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"
                />
              ))}
            </div>
          ) : soldiers.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300/80 bg-white/70 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
              <p>No soldiers in the database yet.</p>
              <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">Use the form above to add the first entry.</p>
            </div>
          ) : (
            soldiers.map((soldier: Doc<"soldiers">) => (
              <article
                key={soldier._id}
                className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-white/90 px-4 py-3 shadow-sm transition hover:border-emerald-100 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {soldier.firstName} {soldier.lastName}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">
                      {soldier.rank ?? "No rank"}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      ID: {soldier._id.slice(-6)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(soldier)}
                    className="rounded-lg border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-500/40 dark:text-emerald-200 dark:hover:bg-emerald-500/10"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(soldier._id)}
                    className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/40 dark:text-red-200 dark:hover:bg-red-500/10"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SoldierMenu;