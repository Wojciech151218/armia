"use client";

import { MapObjectType } from "@/lib/MapObject";

interface AddButtonProps {
  isOpen: boolean;
  pendingType: MapObjectType | null;
  onToggle: () => void;
  onSelectType: (type: MapObjectType) => void;
  onCancelPlacement: () => void;
}

const mapObjectTypes = Object.values(MapObjectType);

const formatLabel = (type: MapObjectType) =>
  type.charAt(0).toUpperCase() + type.slice(1);

const AddButton = ({
  isOpen,
  pendingType,
  onToggle,
  onSelectType,
  onCancelPlacement,
}: AddButtonProps) => {
  return (
    <div className="pointer-events-none absolute right-4 top-4 z-20 flex flex-col items-end gap-2">
      {pendingType && (
        <div className="pointer-events-auto flex items-center gap-3 rounded-md border border-emerald-200 bg-white/95 px-3 py-2 text-xs text-emerald-800 shadow-md backdrop-blur dark:border-emerald-700 dark:bg-zinc-900/90 dark:text-emerald-200">
          <span>Click on the map to place a {formatLabel(pendingType)}.</span>
          <button
            type="button"
            className="rounded border border-emerald-300 px-2 py-1 text-[11px] font-medium text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-500/50 dark:text-emerald-200 dark:hover:bg-emerald-500/10"
            onClick={onCancelPlacement}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="pointer-events-auto relative">
        <button
          type="button"
          aria-label="Add object"
          aria-expanded={isOpen}
          onClick={onToggle}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-2xl font-bold text-white shadow-lg transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          {isOpen ? "x" : "+"}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-200 bg-white/95 p-3 text-sm text-zinc-800 shadow-xl backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-100">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Map object type
            </p>
            <div className="flex flex-col gap-1">
              {mapObjectTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onSelectType(type)}
                  className="rounded-md px-2 py-1 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-emerald-700 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-emerald-300"
                >
                  {formatLabel(type)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddButton;

