import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  BellIcon,
  BookmarkIcon,
  HomeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  BellIcon as BellActiveIcon,
  BookmarkIcon as BookmarkActiveIcon,
  HomeIcon as HomeActiveIcon,
  UserCircleIcon as UserActiveIcon,
} from "@heroicons/react/24/solid";
import { ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const menu: {
    label: string;
    link: string;
    icon: ReactNode;
    activeIcon: ReactNode;
    active?: boolean;
  }[] = [
    {
      label: "Home",
      link: "/",
      icon: <HomeIcon className="size-8 max-md:size-8" />,
      activeIcon: <HomeActiveIcon className="size-8 max-md:size-8" />,
      active: location.pathname === "/",
    },
    {
      label: "Search",
      link: "/search",
      icon: <MagnifyingGlassIcon className="size-8 max-md:size-8" />,
      activeIcon: <MagnifyingGlassIcon className="size-8 max-md:size-8" />,
      active: location.pathname.includes("/search"),
    },
    {
      label: "Bookmark",
      link: "/bookmark",
      icon: <BookmarkIcon className="size-8 max-md:size-8" />,
      activeIcon: <BookmarkActiveIcon className="size-8 max-md:size-8" />,
      active: location.pathname.includes("/bookmark"),
    },
    {
      label: "Notification",
      link: "/notification",
      icon: <BellIcon className="size-8 max-md:size-8" />,
      activeIcon: <BellActiveIcon className="size-8 max-md:size-8" />,
      active: location.pathname.includes("/notification"),
    },
    {
      label: "Profile",
      link: "/profile",
      icon: <UserCircleIcon className="size-8 max-md:size-8" />,
      activeIcon: <UserActiveIcon className="size-8 max-md:size-8" />,
      active: location.pathname === "/profile",
    },
  ];

  return (
    <div className="h-screen w-screen sm:flex">
      <div className="fixed bottom-0 max-md:left-0 max-md:right-0 px-2 py-5 sm:py-8 border border-neutral-200 flex gap-4 sm:static sm:flex-col items-center sm:w-fit sm:h-full sm:px-6">
        <div className="flex sm:flex-col items-center max-sm:justify-evenly w-full sm:gap-8 sm:mt-28">
          {menu.map((m, i) => {
            return (
              <Link key={i} to={m.link}>
                <span className="text-slate-500">
                  {m.active ? m.activeIcon : m.icon}
                </span>
                <p className="hidden">{m.label}</p>
              </Link>
            );
          })}
        </div>
        <div className="max-sm:fixed top-0 left-0 right-0 py-4 px-6 justify-between border-b border-b-slate-300 sm:border-0 sm:p-0 flex gap-3 mt-auto items-center">
          <div className="flex">
            <img
              src="https://picsum.photos/seed/picsum/500"
              className="rounded-full size-10 "
              alt=""
            />
          </div>
          <h1 className="font-semibold text-slate-600 text-xl sm:hidden">
            netters.
          </h1>
        </div>
      </div>
      <div className="max-sm:pt-20 h-screen overflow-scroll">
        <Outlet />
      </div>
    </div>
  );
}
