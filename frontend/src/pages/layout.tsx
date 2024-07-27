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
import clsx from "clsx";
import { ReactNode, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const [floatingMenu, setfloatingMenu] = useState<boolean>(false);
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
      icon: <HomeIcon className="size-7 sm:size-8 xl:size-7" />,
      activeIcon: <HomeActiveIcon className="size-7 sm:size-8 xl:size-7" />,
      active: location.pathname === "/",
    },
    {
      label: "Search",
      link: "/search",
      icon: <MagnifyingGlassIcon className="size-7 sm:size-8 xl:size-7" />,
      activeIcon: (
        <MagnifyingGlassIcon className="size-7 sm:size-8 xl:size-7" />
      ),
      active: location.pathname.includes("/search"),
    },
    {
      label: "Bookmark",
      link: "/bookmark",
      icon: <BookmarkIcon className="size-7 sm:size-8 xl:size-7" />,
      activeIcon: <BookmarkActiveIcon className="size-7 sm:size-8 xl:size-7" />,
      active: location.pathname.includes("/bookmark"),
    },
    {
      label: "Notification",
      link: "/notification",
      icon: <BellIcon className="size-7 sm:size-8 xl:size-7" />,
      activeIcon: <BellActiveIcon className="size-7 sm:size-8 xl:size-7" />,
      active: location.pathname.includes("/notification"),
    },
    {
      label: "Profile",
      link: "/profile",
      icon: <UserCircleIcon className="size-7 sm:size-8 xl:size-7" />,
      activeIcon: <UserActiveIcon className="size-7 sm:size-8 xl:size-7" />,
      active: location.pathname === "/profile",
    },
  ];

  return (
    <div className="h-screen w-screen sm:flex">
      <div className="fixed z-[999] max-sm:border-t max-sm:border-t-slate-200 bg-white bottom-0 max-md:left-0 max-md:right-0 px-2 py-5 sm:py-8 border-l border-neutral-300 flex gap-4 sm:static sm:flex-col max-xl:items-center sm:w-fit sm:h-full sm:px-6 xl:pr-20 xl:pl-12 ">
        <h1 className="max-xl:hidden text-2xl font-semibold text-neutral-700">
          netters.
        </h1>
        <div className="flex sm:flex-col max-xl:items-center max-sm:justify-evenly w-full sm:gap-10 sm:mt-28">
          {menu.map((m, i) => {
            return (
              <Link
                key={i}
                to={m.link}
                className="xl:flex items-end gap-4 xl:text-lg"
              >
                <span
                  className={clsx(m.active ? "text-black" : "text-neutral-500")}
                >
                  {m.active ? m.activeIcon : m.icon}
                </span>
                <p
                  className={clsx(
                    "hidden xl:block",
                    m.active ? "text-black font-semibold" : " text-neutral-600"
                  )}
                >
                  {m.label}
                </p>
              </Link>
            );
          })}
        </div>
        <div className="max-sm:fixed max-sm:z-[999] max-sm:bg-white top-0 left-0 right-0 py-4 px-6 justify-between border-b border-b-slate-300 sm:border-0 sm:p-0 flex gap-3 mt-auto items-center relative xl:border border-slate-300 xl:px-3 xl:py-2 xl:pr-6 xl:rounded-full">
          <h1 className="font-semibold text-neutral-800 text-xl sm:hidden">
            netters.
          </h1>
          <div className="flex gap-3 items-center">
            <img
              onClick={() => setfloatingMenu((f) => !f)}
              src="https://picsum.photos/seed/picsum/500"
              className="rounded-full size-10 "
              alt=""
            />
            <div className="max-xl:hidden">
              <h1 className="font-medium">Asep Rendang</h1>
              <p className="text-sm -mt-0.5 text-slate-600">@asepzyt</p>
            </div>
          </div>
          {floatingMenu && (
            <div className=" border border-neutral-300 rounded-md shadow-md bg-white absolute max-sm:top-[4.2rem] max-sm:right-6 sm:left-20 sm:bottom-0 flex flex-col">
              <div className="px-4 pt-2 pb-3 min-w-[12rem]">
                <h1 className="text-neutral-800 font-medium text-sm sm:text-base">
                  Asep Rendang
                </h1>
                <p className="text-xs text-[0.85rem] text-neutral-600">
                  @aseptzy6
                </p>
              </div>
              <div className="flex flex-col text-sm *:px-4 cursor-pointer hover:bg-slate-200">
                <span className="py-3 border-t border-slate-200  flex items-center gap-2">
                  <p>
                    Logout from <span>@aseptzy6</span>{" "}
                  </p>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="max-sm:pt-[4.5rem] h-screen overflow-scroll flex-grow border-x border-x-slate-300 sm:max-w-[600px] ">
        <Outlet />
      </div>
    </div>
  );
}
