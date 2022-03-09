import { BsPlus } from "react-icons/bs";
import { DiAptana } from "react-icons/di";
import { BiBuildingHouse } from "react-icons/bi";
const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-gray-900 shadow-lg">
      <SidebarIcon icon={<BiBuildingHouse size="28" />} />
      <SidebarIcon icon={<BsPlus size="32" />} />
      <SidebarIcon icon={<DiAptana size="28" />} />
    </div>
  );
};

const SidebarIcon: React.FC<{ icon: JSX.Element, text?: string }> = ({ icon, text = "lua is trash" }) => (
  <div className="sidebar-icon group">
    {icon}

    <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
  </div>
);

export default Sidebar;
