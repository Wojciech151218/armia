interface MenuProps {
  className?: string;
}

const Menu = ({ className = "" }: MenuProps) => {
  return (
    <div className={`flex-1 rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900 ${className}`}>
      {/* Menu content - empty for now */}
    </div>
  );
};

export default Menu;

