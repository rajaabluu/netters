import { ArrowLeftIcon, CalendarIcon } from "@heroicons/react/20/solid";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/config";
import moment from "moment";
import { useAuth } from "../../context/auth_context";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import Post from "../../components/post/post";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [inView, setInView] = useState(false);
  const [type, setType] = useState<"post" | "likes">("post");
  const { username } = useParams();
  const { auth } = useAuth();
  const { data: profile, isLoading } = useQuery({
    enabled: !!username,
    queryKey: ["profile", username],
    queryFn: async () => {
      const res = await api.get(`/user/profile/${username}`);
      if (res.status == 200) return res.data;
    },
  });

  const { data: posts } = useInfiniteQuery({
    initialPageParam: 1,
    enabled: !!type && !!profile,
    queryKey: ["posts", username, type],
    queryFn: async () => {
      const res = await api.get(
        `/post/${profile._id}/user${type == "likes" ? "/likes" : ""}`
      );
      if (res.status == 200) {
        return {
          data: res.data.data,
          nextPage: res.data.pagination.nextPage,
        };
      }
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage,
  });

  useEffect(() => {
    const scrollHandler = () => {
      const ScrollT = window.matchMedia("(max-width: 640px)").matches
        ? 307
        : 340;
      if (window.scrollY > ScrollT) {
        if (!inView) setInView(true);
      } else {
        return setInView(false);
      }
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  if (isLoading) return null;

  return (
    <div className="bg-white flex flex-col">
      <div
        className={clsx(
          "px-4 py-3 left-0 top-0 right-0 sm:left-[5.55rem] max-h-16 sm:max-w-[600px] z-[1000] flex items-center gap-5",
          inView &&
            "fixed bg-[rgba(255,255,255,0.8)] border border-t-0 border-slate-300 backdrop-blur-sm"
        )}
      >
        {/* Back Button */}
        <div
          onClick={() => navigate(-1)}
          className="p-1.5 cursor-pointer bg-neutral-500 w-fit h-fit rounded-full"
        >
          <ArrowLeftIcon className="size-6 invert" />
        </div>
        <div className={clsx(!!!inView && "hidden")}>
          <h1 className="font-semibold ">{profile.username}</h1>
          <p className="text-sm text-neutral-600">
            {profile.followers.length} Followers
          </p>
        </div>
      </div>
      <div
        className={clsx(
          "w-full p-4 bg-gray-300 !min-h-36 sm:!min-h-44",
          !inView && "-mt-[3.95rem] "
        )}
      ></div>
      <div className="flex py-3 px-4 pl-5">
        <div className="size-[4.5rem] border-2  border-white rounded-full overflow-hidden -translate-y-2/3">
          <img
            src={
              !!profile.profileImage
                ? profile.profileImage.url
                : "/img/default.png"
            }
            className="size-full object-cover object-center"
            alt=""
          />
        </div>
        {profile._id == auth._id ? (
          <button className="px-5 py-1.5 h-fit bg-black text-white font-medium rounded-full text-sm ms-auto">
            Edit Profile
          </button>
        ) : (
          <button className="px-5 py-1.5 h-fit bg-black text-white font-medium rounded-full text-sm ms-auto">
            Follow
          </button>
        )}
      </div>
      <div className="px-5 -mt-12 flex flex-col">
        <h1 className="font-bold text-lg">{profile.name}</h1>
        <h6 className="text-sm text-slate-500 -mt-1">@{profile.username}</h6>
        <p className="mt-4 text-slate-600 text-[0.9rem]">
          {profile.bio ?? "No bio yet."}
        </p>
        <div className="flex text-slate-600 mt-1.5 items-center gap-1.5">
          <CalendarIcon className="size-4" />
          <h1 className="text-[0.9rem]">
            Joined on {moment(profile.createdAt).format("LL")}
          </h1>
        </div>

        <div className="flex gap-5 mt-3.5 font-medium text-[0.9rem] items-center">
          <span>
            {profile.following.length}{" "}
            <span className="text-slate-600 font-normal">Following</span>
          </span>
          <span>
            {profile.followers.length}{" "}
            <span className="text-slate-600 font-normal">Followers</span>
          </span>
        </div>
      </div>
      <div className="flex *:w-1/2 mt-8 text-center py-4 sm:py-5 text-neutral-600 border-b border-b-slate-300 sticky top-[3.8rem] *:cursor-pointer max-md:text-sm bg-white z-[10]">
        <span
          onClick={() => {
            setType("post");
          }}
        >
          Post
        </span>
        <span
          onClick={() => {
            setType("likes");
          }}
        >
          Likes
        </span>
        <span
          className={clsx(
            "absolute px-8 sm:px-20 bottom-0 duration-300 ease-in-out transition-all",
            type == "likes" && "translate-x-full"
          )}
        >
          <div className="bg-black py-[0.1rem] sm:py-[0.10rem] rounded-full w-full"></div>
        </span>
      </div>
      <div className="flex flex-col h-[200vh] ">
        {!!posts &&
          posts?.pages.map((page, index) => (
            <Fragment key={index}>
              {page?.data.map((post: any, i: number) => (
                <Post post={post} key={i} user={auth} />
              ))}
            </Fragment>
          ))}
      </div>
    </div>
  );
}
