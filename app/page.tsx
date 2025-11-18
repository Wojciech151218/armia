"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useState } from "react";

type SoldierStatus = "active" | "inactive" | "reserve";

export default function Home() {
  const soldiers = useQuery(api.soldiers.list);
  const createSoldier = useMutation(api.soldiers.create);
  const updateSoldier = useMutation(api.soldiers.update);
  const deleteSoldier = useMutation(api.soldiers.remove);

  const [formData, setFormData] = useState({
    name: "",
    rank: "",
    unit: "",
    status: "active" as SoldierStatus,
  });
  const [editingId, setEditingId] = useState<Id<"soldiers"> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!formData.name.trim() || !formData.rank.trim() || !formData.unit.trim()) {
        throw new Error("All fields are required");
      }

      await createSoldier({
        name: formData.name,
        rank: formData.rank,
        unit: formData.unit,
        status: formData.status,
      });

      setFormData({ name: "", rank: "", unit: "", status: "active" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create soldier");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: Id<"soldiers">) => {
    setError(null);
    setIsLoading(true);

    try {
      const soldier = soldiers?.find((s) => s._id === id);
      if (!soldier) {
        throw new Error("Soldier not found");
      }

      await updateSoldier({
        id,
        name: formData.name || soldier.name,
        rank: formData.rank || soldier.rank,
        unit: formData.unit || soldier.unit,
        status: formData.status || soldier.status,
      });

      setEditingId(null);
      setFormData({ name: "", rank: "", unit: "", status: "active" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update soldier");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: Id<"soldiers">) => {
    if (!confirm("Are you sure you want to delete this soldier?")) {
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await deleteSoldier({ id });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete soldier");
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (soldier: {
    _id: Id<"soldiers">;
    name: string;
    rank: string;
    unit: string;
    status: SoldierStatus;
  }) => {
    setEditingId(soldier._id);
    setFormData({
      name: soldier.name,
      rank: soldier.rank,
      unit: soldier.unit,
      status: soldier.status,
    });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", rank: "", unit: "", status: "active" });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4 dark:bg-black">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-black dark:text-zinc-50">
          Army Soldiers Management
        </h1>

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 border border-red-400 text-red-700 px-4 py-3 dark:bg-red-900/20 dark:border-red-500 dark:text-red-400">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Create/Edit Form */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900">
          <h2 className="mb-4 text-2xl font-semibold text-black dark:text-zinc-50">
            {editingId ? "Edit Soldier" : "Add New Soldier"}
          </h2>
          <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleCreate} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-black dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="rank" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rank
              </label>
              <input
                type="text"
                id="rank"
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-black dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Unit
              </label>
              <input
                type="text"
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-black dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as SoldierStatus })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-black dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
                disabled={isLoading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="reserve">Reserve</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={isLoading}
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400 dark:bg-zinc-700 dark:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Soldiers List */}
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900">
          <h2 className="mb-4 text-2xl font-semibold text-black dark:text-zinc-50">
            Soldiers List
          </h2>
          {soldiers === undefined ? (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          ) : soldiers.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No soldiers found. Add one above!</p>
          ) : (
            <div className="space-y-4">
              {soldiers.map((soldier) => (
                <div
                  key={soldier._id}
                  className="rounded-md border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                        {soldier.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Rank:</span> {soldier.rank}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Unit:</span> {soldier.unit}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Status:</span>{" "}
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                            soldier.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : soldier.status === "inactive"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {soldier.status.charAt(0).toUpperCase() + soldier.status.slice(1)}
                        </span>
                      </p>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <button
                        onClick={() => startEdit(soldier)}
                        disabled={isLoading || editingId === soldier._id}
                        className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(soldier._id)}
                        disabled={isLoading}
                        className="rounded-md bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
