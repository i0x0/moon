import { BsPlus } from "react-icons/bs";
import { DiAptana } from "react-icons/di";
import { BiBuildingHouse } from "react-icons/bi";
import Link from "next/link";
import React, { SetStateAction, useEffect, useState } from "react";
import { httpClient } from "../utils"
import icons from "../components/icons"
import useSWR from 'swr'
import serverIdAtom from "./atoms";
import { useAtom } from "jotai";

interface ChatsSingle {
  img: string;
  name: string;
  color: string;
  id: string;
}
type Chats = ChatsSingle[]

//@ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

//const Sidebar = () => {
//  return (
//    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-gray-900 shadow-lg">
//      <SidebarIcon icon={<BiBuildingHouse size="28" />} />
//      <SidebarIcon icon={<BsPlus size="32" />} />
//      <Link href="/settings">
//        <a>
//          <SidebarIcon icon={<DiAptana size="28" />} />
//        </a>
//      </Link>
//    </div>
//  );
//};

const SidebarIcon: React.FC<{ icon: JSX.Element, text?: string, id: string | null }> = ({ icon, text = "lua is trash", id }) => {

  const [, setId] = useAtom(serverIdAtom)

  return (
    <div className="sidebar-icon group transition-transform" onClick={id ? setId(id) : undefined}>
      {icon}

      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  )
};

const Sidebar = () => {
  const { data } = useSWR<{ data: Chats }>('/api/user/chats', fetcher)

  if (!data) return <EmptySidebar />


  console.log(data)
  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-gray-900 shadow-lg">
      <React.Fragment>
        {data.data.length !== 0 ? data.data.map((dat, i) => {
          return (<SidebarIcon icon={icons[dat.img]} text={dat.name} key={i} id={dat.id} />)
        }) : (<SidebarIcon icon={icons["cancel"]} text={"No servers"} id={null} />)}
        {/*< SidebarIcon icon={icons[data[0].img]} />*/}
      </React.Fragment>
    </div>
  )
}

const EmptySidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-gray-900 shadow-lg"></div>
  )
}

export default Sidebar;
