import {
  ArrowLeftIcon,
  CalendarIcon,
  CameraIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/config";
import moment from "moment";
import { useAuth } from "../../context/auth_context";
import clsx from "clsx";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import Post from "../../components/post/post";
import useFollow from "../../hooks/useFollow";
import Loader from "../../components/loader/loader";
import useEditProfile from "../../hooks/useEditProfile";
import useModal from "../../hooks/useModal";
import ReactTextareaAutosize from "react-textarea-autosize";
import { User } from "../../types/user.type";

const forms = [
  { name: "username", label: "Username" },
  { name: "name", label: "Name" },
  { name: "bio", label: "Bio" },
  { name: "link", label: "Link" },
];

const defaultCredentials = {
  name: "",
  username: "",
  profileImage: {
    url: "",
  },
  coverImage: {
    url: "",
  },
  bio: "",
  link: "",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [inView, setInView] = useState(false);
  const [credentials, setCredentials] =
    useState<typeof defaultCredentials>(defaultCredentials);
  const [type, setType] = useState<"post" | "likes">("post");
  const { toggle: toggleEditModal, show: editModalShow } = useModal();
  const { username } = useParams();
  const { auth } = useAuth();
  const { data: profile, isLoading } = useQuery<User>({
    enabled: !!username,
    queryKey: ["profile", username],
    queryFn: async () => {
      const res = await api.get(`/user/profile/${username}`);
      if (res.status == 200) return res.data;
    },
  });

  const { follow, following } = useFollow(profile?._id);
  const { update, updating } = useEditProfile();

  const isFollowing: boolean =
    !!profile && profile.followers.some((p: any) => p._id == auth._id);

  const { data: posts } = useInfiniteQuery({
    initialPageParam: 1,
    enabled: !!type && !!profile,
    queryKey: ["posts", username, type],
    queryFn: async () => {
      const res = await api.get(
        `/post/${profile?._id}/user${type == "likes" ? "/likes" : ""}`
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, id } = e.target;
    setCredentials((c) => ({ ...c, [id]: value }));
  };

  useEffect(() => {
    if (!!profile) {
      setCredentials({
        bio: profile.bio || "",
        coverImage: {
          url: profile.coverImage?.url || "",
        },
        profileImage: {
          url: "",
        },
        name: profile.name || "",
        username: profile.username || "",
        link: profile.link || "",
      });
    }
  }, [profile]);

  if (isLoading) return null;

  return (
    <>
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
            <h1 className="font-semibold ">{profile?.username}</h1>
            <p className="text-sm text-neutral-600">
              {profile?.followers.length} Followers
            </p>
          </div>
        </div>
        <div
          className={clsx(
            "w-full  bg-gray-300 !min-h-36 sm:!min-h-44",
            !inView && "-mt-[3.95rem] "
          )}
        ></div>
        <div className="flex py-3 px-4 pl-5">
          <div className="size-[4.6rem] border-2  border-white rounded-full overflow-hidden -mt-[2.6rem]">
            <img
              src={
                !!profile?.profileImage
                  ? profile.profileImage.url
                  : "/img/default.png"
              }
              className="size-full object-cover object-center"
              alt=""
            />
          </div>
          {profile?._id == auth._id ? (
            <div className="relative ms-auto">
              {/* Edit Modal */}
              {editModalShow && (
                <>
                  <div
                    onClick={toggleEditModal}
                    className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.2)] z-[9998]"
                  ></div>
                  <div className="fixed z-[9999] sm:mx-auto sm:my-auto sm:h-fit top-0 left-0 bottom-0 sm:min-w-[20rem] right-0 bg-white border border-slate-200 sm:rounded-[1rem] max-sm:min-h-screen sm:w-max sm:max-w-[32rem] sm:max-h-[40rem] sm:overflow-scroll">
                    <div className="px-6 sm:px-4 py-3 border-b flex gap-4 items-center border-b-slate-300 sticky top-0 bg-[rgba(255,255,255,0.8)]">
                      <ArrowLeftIcon
                        onClick={toggleEditModal}
                        className="size-6 sm:hidden cursor-pointer"
                      />
                      <XMarkIcon
                        onClick={toggleEditModal}
                        className="size-6 max-sm:hidden cursor-pointer"
                      />
                      <h1 className="font-semibold">Edit Profile</h1>
                      <button className="bg-black px-4 rounded-full ms-auto py-1.5 text-sm text-white">
                        Simpan
                      </button>
                    </div>
                    <div className="min-h-36 h-36 flex justify-center items-center bg-gray-100">
                      <label htmlFor="file" className="text-slate-500 text-sm">
                        Tambahkan Banner
                      </label>
                      <input type="file" id="file" hidden />
                    </div>
                    <div className="size-[4.6rem] rounded-full bg-gray-200 ml-4 -mt-[2.5rem] flex items-center justify-center">
                      <CameraIcon className="size-6 fill-gray-400" />
                    </div>
                    <div className="flex flex-wrap items-stretch w-full sm:w-fit px-5 gap-4 mt-8 sm:py-6">
                      {forms.map((form, i) => {
                        return (
                          <div
                            key={i}
                            className="flex flex-col w-full !h-auto flex-grow  "
                          >
                            <label
                              htmlFor={form.name}
                              className=" text-slate-600 text-sm sm:mb-1"
                            >
                              {form.label}
                            </label>
                            {form.name == "bio" ? (
                              <ReactTextareaAutosize
                                onChange={handleChange}
                                id={form.name}
                                value={
                                  credentials[
                                    form.name as keyof typeof defaultCredentials
                                  ] as any
                                }
                                className="resize-none sm:border sm:px-3 sm:py-2 sm:rounded-md  flex-grow min-h-24 focus:outline-none border-b-2 py-0.5 border-slate-300"
                              ></ReactTextareaAutosize>
                            ) : (
                              <input
                                onChange={handleChange}
                                id={form.name}
                                value={
                                  credentials[
                                    form.name as keyof typeof defaultCredentials
                                  ] as any
                                }
                                className="border-b-2 sm:border sm:px-3 sm:rounded-md  sm:py-2 py-1 flex-grow border-slate-300"
                                type="text"
                              ></input>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
              {/* End edit Modal */}
              <button
                onClick={() => toggleEditModal()}
                className="px-5 py-1.5 h-fit bg-black text-white font-medium rounded-full text-sm "
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <button
              onClick={() => follow()}
              className={clsx(
                "px-5 py-1.5 h-fit  font-medium rounded-full text-sm ms-auto",
                isFollowing
                  ? "bg-white border border-slate-400 text-neutral-700"
                  : "bg-black text-white"
              )}
            >
              {following ? (
                <Loader className={clsx("size-5", isFollowing && "invert")} />
              ) : isFollowing ? (
                "Unfollow"
              ) : (
                "Follow"
              )}
            </button>
          )}
        </div>
        <div className="px-5  flex flex-col">
          <h1 className="font-bold text-lg">{profile?.name}</h1>
          <h6 className="text-sm text-slate-500 -mt-1">@{profile?.username}</h6>
          <p className="mt-4 text-slate-600 text-[0.9rem]">
            {profile?.bio ?? "No bio yet."}
          </p>
          <div className="flex text-slate-600 mt-1.5 items-center gap-1.5">
            <CalendarIcon className="size-4" />
            <h1 className="text-[0.9rem]">
              Joined on {moment(profile?.createdAt).format("LL")}
            </h1>
          </div>

          <div className="flex gap-5 mt-3.5 font-medium text-[0.9rem] items-center">
            <span>
              {profile?.following.length}{" "}
              <span className="text-slate-600 font-normal">Following</span>
            </span>
            <span>
              {profile?.followers.length}{" "}
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
        <div className="flex flex-col h-max">
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
    </>
  );
}
