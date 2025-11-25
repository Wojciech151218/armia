"use client";

import { useState, useRef, useEffect } from "react";
import { Soldier } from "@/lib/Types";

const SoldierIcon = ({object}: {object: Soldier}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded"
        aria-label="Soldier information"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-blue-600"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 rounded-xl border border-zinc-200/70 bg-white/95 p-4 text-sm text-zinc-800 shadow-xl backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-100 z-50">
          <div className="mb-3 border-b border-zinc-200/70 pb-3 dark:border-zinc-700">
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Soldier Information</p>
            <h3 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">
              {object.firstName} {object.lastName}
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Rank</span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                {object.rank ?? "No rank"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">ID</span>
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
                {object._id.slice(-8)}
              </span>
            </div>

            {object.latitude !== undefined && object.longitude !== undefined && (
              <div className="pt-2 border-t border-zinc-200/70 dark:border-zinc-700">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Location</span>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                  {object.latitude.toFixed(4)}°, {object.longitude.toFixed(4)}°
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SoldierIcon;

