import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { BellIcon, BookmarkIcon, HomeIcon } from "@heroicons/react/24/outline";
import {
  BellIcon as BellActiveIcon,
  BookmarkIcon as BookmarkActiveIcon,
  HomeIcon as HomeActiveIcon,
} from "@heroicons/react/24/solid";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function Layout() {
  const menu: {
    label: string;
    link: string;
    icon: ReactNode;
    activeIcon: ReactNode;
  }[] = [
    {
      label: "Home",
      link: "/",
      icon: <HomeIcon className="size-6" />,
      activeIcon: <HomeActiveIcon className="size-6" />,
    },
    {
      label: "Search",
      link: "/search",
      icon: <MagnifyingGlassIcon className="size-6" />,
      activeIcon: <MagnifyingGlassIcon className="size-6" />,
    },
    {
      label: "Notification",
      link: "/search",
      icon: <BellIcon className="size-6" />,
      activeIcon: <BellActiveIcon className="size-6" />,
    },
    {
      label: "Bookmark",
      link: "/bookmark",
      icon: <BookmarkIcon className="size-6" />,
      activeIcon: <BookmarkActiveIcon className="size-6" />,
    },
  ];

  return (
    <div className="w-screen h-screen bg-[#0D1117] flex text-neutral-100">
      <div className="h-full px-6  md:pr-20 pt-16 border-r border-neutral-600 max-w-[480px] flex flex-col gap-6 max-sm:hidden ">
        {menu.map((m) => {
          return (
            <Link to={m.link} className="flex gap-4 items-center">
              <span className="fill-white">{m.icon}</span>
              <p className="max-md:hidden ">{m.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
