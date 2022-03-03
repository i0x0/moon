import { BsPlus} from 'react-icons/bs';
import { DiAptana } from "react-icons/di";
import {BiBuildingHouse} from "react-icons/bi"
const SideBar = () => {
    return (
        <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-gray-900 shadow-lg">

        <SideBarIcon icon={<BiBuildingHouse size="28" />} />
        <SideBarIcon icon={<BsPlus size="32" />} />
        <SideBarIcon icon={<DiAptana size="28" />} />
      </div>
    );
  };


  const SideBarIcon = ({ icon, text = 'Lua Rocks! 💡' }) => (
    <div className="sidebar-icon group">
      {icon}
      
      <span class="sidebar-tooltip group-hover:scale-100">
          {text}
      </span>
    </div>
  );

export default SideBar;
