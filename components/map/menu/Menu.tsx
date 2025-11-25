import { MapObjectBuilder, MapObjectType } from "@/lib/MapObject";
import SoldierMenu from "./SoldierMenu";

interface MenuProps {
  className?: string;
  mapObject?: MapObjectBuilder;
}

const Menu = ({ className = "", mapObject }: MenuProps) => {
  const menuType = mapObject?.objectType;

  const renderContent = () => {
    if (!menuType) {
      return (
        <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300/70 bg-white/40 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
          <p className="font-medium">Select a location on the map to start.</p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
            Choose an object with the + button, then click on the map to open its contextual menu.
          </p>
        </div>
      );
    }

    if (menuType === MapObjectType.SOLDIER) {
      return (
        <SoldierMenu latitude={mapObject?.latitude} longitude={mapObject?.longitude} />
      );
    }

    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white/70 p-6 text-center text-sm text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400">
        <p className="font-medium capitalize">{menuType} menu is coming soon.</p>
        <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
          We have not built tooling for this object type yet.
        </p>
      </div>
    );
  };

  return (
    <div className={`flex-1 rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900 ${className}`}>
      {renderContent()}
    </div>
  );
};

export default Menu;

