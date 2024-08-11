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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { ReactNode } from "react";
import {
  Link,
  matchPath,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import api from "../api/config";
import { toast } from "sonner";
import { useAuth } from "../context/auth_context";
import useModal from "../hooks/useModal";
import { User as UserType } from "../types/user.type";
import { User } from "../components/user/user";

export default function Layout() {
  const { auth, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { show, toggle } = useModal();
  const queryClient = useQueryClient();

  const { data: suggestedUsers, isLoading: loadingSuggestedUsers } = useQuery({
    queryKey: ["suggested-users"],
    queryFn: async () => {
      const res = await api.get("user/suggested");
      if (res.status == 200) return res.data;
    },
  });

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await api.post("/auth/logout");
        if (res.status == 200) {
          return res.data;
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate("/auth/login");
      toast.success("Logout Success");
    },
  });

  const pages = ["/notification"];
  const hiddenLayoutPages = ["/:username", "/:username/post/:id"];
  const hiddenTopbarPages = ["/notification"];

  const topbarHidden = hiddenTopbarPages.some((s) =>
    location.pathname.includes(s)
  );

  const includePage = pages.some((s) => location.pathname.includes(s));

  const match =
    !includePage &&
    hiddenLayoutPages.some((path) => matchPath(path, location.pathname));

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
      icon: <HomeIcon className="size-7 xl:size-7" />,
      activeIcon: <HomeActiveIcon className="size-7 xl:size-7" />,
      active: location.pathname === "/",
    },
    {
      label: "Search",
      link: "/search",
      icon: <MagnifyingGlassIcon className="size-7 xl:size-7" />,
      activeIcon: <MagnifyingGlassIcon className="size-7 xl:size-7" />,
      active: location.pathname.includes("/search"),
    },
    {
      label: "Bookmark",
      link: "/bookmark",
      icon: <BookmarkIcon className="size-7 xl:size-7" />,
      activeIcon: <BookmarkActiveIcon className="size-7 xl:size-7" />,
      active: location.pathname.includes("/bookmark"),
    },
    {
      label: "Notification",
      link: "/notification",
      icon: <BellIcon className="size-7 xl:size-7" />,
      activeIcon: <BellActiveIcon className="size-7 xl:size-7" />,
      active: location.pathname.includes("/notification"),
    },
    {
      label: "Profile",
      link: "" + auth?.username,
      icon: <UserCircleIcon className="size-7 xl:size-7" />,
      activeIcon: <UserActiveIcon className="size-7  xl:size-7" />,
      active: match as boolean,
    },
  ];

  if (isLoading) return null;

  return (
    <div className="h-screen w-screen sm:flex">
      <div
        id="bar"
        className={clsx(
          "fixed z-[999] max-sm:border-t max-sm:border-t-slate-200 bg-white bottom-0 max-md:left-0 max-md:right-0 px-2 py-5 sm:py-8 border-l border-neutral-300 flex gap-4 sm:fixed sm:border-r sm:border-r-slate-300 sm:flex-col max-xl:items-center sm:w-fit sm:h-full sm:px-4 xl:pr-20 xl:pl-12",
          match && "max-sm:hidden"
        )}
      >
        <h1 className="max-xl:hidden text-2xl font-semibold text-neutral-700">
          netters.
        </h1>
        <div className="flex sm:flex-col max-xl:items-center max-sm:justify-evenly w-full sm:gap-8 sm:mt-4 xl:mt-20">
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
        <div
          className={clsx(
            "max-sm:fixed max-sm:z-[999] max-sm:bg-white top-0 left-0 right-0 py-4 px-6 justify-between border-b border-b-slate-300 sm:border-0 sm:p-0 flex gap-3 mt-auto items-center relative",
            topbarHidden && "max-sm:hidden"
          )}
        >
          <h1 className="font-semibold text-neutral-800 text-xl sm:hidden">
            netters.
          </h1>
          <div
            className="flex gap-3 items-center xl:w-52 cursor-pointer xl:border border-slate-300 xl:px-3 xl:py-2 xl:pr-6 xl:rounded-full"
            onClick={() => toggle()}
          >
            <img
              src={
                !!auth.profileImage ? auth.profileImage.url : "/img/default.png"
              }
              className="rounded-full size-10 object-cover"
              alt=""
            />
            <div className="max-xl:hidden">
              <h1 className="font-medium">{auth.name.split(" ")[0]} </h1>
              <p className="text-sm -mt-0.5 text-slate-600">@{auth.username}</p>
            </div>
          </div>
          {show && (
            <div className="w-max border border-neutral-300 rounded-md shadow-md bg-white absolute max-sm:top-[4.2rem] max-sm:right-6 sm:left-20 sm:bottom-0 xl:bottom-16 xl:left-1 flex flex-col">
              <div className="px-4 pt-2 pb-3 min-w-[12rem]">
                <h1 className="text-neutral-800 font-medium ">{auth.name}</h1>
                <p className="text-sm text-neutral-600">@{auth.username}</p>
              </div>
              <div className="flex flex-col text-sm *:px-4 cursor-pointer hover:bg-slate-200">
                <span
                  onClick={() => logout()}
                  className="py-3 border-t border-slate-200  flex items-center gap-2 "
                >
                  <p className="text-sm">
                    Logout from <span>@{auth.username}</span>{" "}
                  </p>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={clsx(
          " flex h-max flex-grow border-x sm:ml-[4.55rem] xl:ml-[21rem] border-x-slate-300",
          !match && !topbarHidden && "max-sm:pt-[4.5rem]"
        )}
      >
        <div className="min-h-screen sm:w-full sm:max-w-[600px] flex-grow border-r border-r-slate-300">
          <Outlet />
        </div>
        {/* Suggested Users */}
        <div className="max-lg:hidden py-4 px-4 flex-grow sticky top-0 h-fit max-h-screen max-w-[25rem]">
          <div className="flex h-fit flex-col border border-slate-300 rounded-lg px-2 py-2 pb-4">
            <div>
              <h1 className="text-xl mx-3 font-bold py-2 text-slate-800">
                To Follow
              </h1>
            </div>
            {loadingSuggestedUsers
              ? null
              : suggestedUsers.map((user: UserType, i: number) => (
                  <User key={i} user={user} />
                ))}
          </div>
        </div>
        {/* End Suggested Users */}
        {/* TODO : Remove This Component When no one Suggested user */}
      </div>
    </div>
  );
}
