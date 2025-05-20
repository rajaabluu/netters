import {
  ArrowLeftIcon,
  CalendarIcon,
  CameraIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
import { User as UserType } from "../../types/user.type";
import { User, userIsFollowing } from "../../components/user/user";
import Modal from "../../components/modal/modal";

const forms = [
  { name: "username", label: "Username" },
  { name: "name", label: "Name" },
  { name: "bio", label: "Bio" },
  { name: "link", label: "Link" },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [inView, setInView] = useState(false);
  const [credentials, setCredentials] = useState<any>({});
  const [type, setType] = useState<"post" | "likes">("post");
  const { toggle: toggleEditModal, show: editModalShow } = useModal();
  const { toggle: toggleFollowersModal, show: followersModalShow } = useModal();
  const { toggle: toggleFollowingModal, show: followingModalShow } = useModal();
  const { username } = useParams();
  const { auth } = useAuth();
  const { follow, following } = useFollow();
  const { update, updating } = useEditProfile();
  const { data: profile, isLoading } = useQuery<UserType>({
    enabled: !!username,
    queryKey: ["profile", username],
    queryFn: async () => {
      const res = await api.get(`/user/${username}/profile`);
      if (res.status == 200) return res.data;
    },
  });

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
      const scrollY = window.scrollY;

      if (scrollY > ScrollT && !inView) {
        setInView(true);
      } else if (scrollY <= ScrollT && inView) {
        setInView(false);
      }
    };

    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [inView]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, id } = e.target;
    setCredentials((c: any) => ({ ...c, [id]: value }));
  };

  useEffect(() => {
    if (!!profile) {
      setCredentials({
        bio: profile.bio || "",
        coverImage: (profile.coverImage as any) || null,
        profileImage: (profile.profileImage as any) || null,
        name: profile.name || "",
        username: profile.username || "",
        link: profile.link || "",
      });
    }
  }, [profile]);

  const getProfileImage = () => {
    return !!credentials.profileImage?.url
      ? credentials.profileImage.url
      : URL.createObjectURL(credentials.profileImage as any);
  };

  const getCoverImage = () => {
    return !!credentials.coverImage?.url
      ? credentials.coverImage.url
      : URL.createObjectURL(credentials.coverImage as any);
  };

  if (isLoading)
    return (
      <div className="h-dvh flex items-center justify-center">
        <Loader className="size-10 invert" />
      </div>
    );

  return (
    <>
      {/* Edit Modal */}

      <Modal show={editModalShow} toggle={toggleEditModal}>
        <div className="max-sm:min-w-[100vw] sm:h-fit top-0 left-0 bottom-0 sm:min-w-[20rem] right-0 bg-white border border-slate-200 sm:rounded-[1rem] max-sm:min-h-dvh sm:w-max sm:max-w-[32rem] sm:max-h-[40rem] overflow-y-scroll">
          <div className="px-6 sm:px-4 py-4 border-b flex gap-4 items-center border-b-slate-300 sticky backdrop-blur top-0 bg-[rgba(255,255,255,0.8)]">
            <ArrowLeftIcon
              onClick={toggleEditModal}
              className="size-6 sm:hidden cursor-pointer"
            />
            <XMarkIcon
              onClick={toggleEditModal}
              className="size-6 max-sm:hidden cursor-pointer"
            />
            <h1 className="font-semibold text-lg">Edit Profile</h1>
            {updating ? (
              <Loader className="size-7 invert ms-auto"></Loader>
            ) : (
              <button
                onClick={() => {
                  update(credentials as any, {
                    onSuccess: async () => {
                      toggleEditModal();
                      await Promise.all([
                        auth.username == username &&
                          queryClient.invalidateQueries({
                            queryKey: ["auth"],
                          }),
                        queryClient.invalidateQueries({
                          queryKey: ["posts", username],
                        }),
                        queryClient.invalidateQueries({
                          queryKey: ["profile", username],
                        }),
                      ]);
                    },
                  });
                }}
                className="bg-black px-4 rounded-full ms-auto py-1.5 text-sm text-white"
              >
                Save
              </button>
            )}
          </div>
          <div
            style={{
              backgroundImage: !!credentials.coverImage
                ? `url(${getCoverImage()})`
                : " ",
            }}
            className="min-h-36 h-36 bg-cover bg-center flex justify-center items-center bg-gray-100 overflow-hidden"
          >
            <label
              htmlFor="coverImage"
              className={clsx(
                "text-sm",
                !!credentials.coverImage ? "text-white" : "text-slate-500 "
              )}
            >
              Add Cover
            </label>
            <input
              type="file"
              id="coverImage"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCredentials((c: any) => ({
                  ...c,
                  coverImage: !!e.target.files && (e.target.files[0] as any),
                }));
              }}
              hidden
            />
          </div>
          <div
            style={{
              backgroundImage: !!credentials.profileImage
                ? `url(${getProfileImage()})`
                : "",
            }}
            className="size-[4.6rem] bg-cover bg-center rounded-full bg-gray-200 ml-4 -mt-[2.5rem] flex items-center justify-center"
          >
            <label htmlFor="profileImage">
              <CameraIcon
                className={clsx(
                  "size-6 ",
                  !!credentials.profileImage ? "fill-white" : "fill-gray-400"
                )}
              />
            </label>
            <input
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCredentials((c: any) => ({
                  ...c,
                  profileImage: !!e.target.files && (e.target.files[0] as any),
                }));
              }}
              type="file"
              hidden
              name=""
              id="profileImage"
            />
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
                          form.name as keyof typeof credentials
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
                          form.name as keyof typeof credentials
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
      </Modal>

      {/* End edit Modal */}
      {/*  Followers Modal */}

      <Modal show={followersModalShow} toggle={toggleFollowersModal}>
        <div className="min-w-[100vw] sm:min-w-[28rem] md:w-[30rem] sm:h-[30rem] sm:overflow-y-scroll right-0 bg-white border border-slate-200 sm:rounded-[1rem] max-sm:min-h-dvh sm:w-max sm:max-w-[32rem] sm:max-h-[40rem] sm:overflow-scroll">
          <div className=" px-4 py-4 border-b flex gap-4 items-center border-b-slate-300 sticky top-0 bg-[rgba(255,255,255,1)]">
            <ArrowLeftIcon
              onClick={toggleFollowersModal}
              className="size-6 sm:hidden cursor-pointer"
            />
            <XMarkIcon
              onClick={toggleFollowersModal}
              className="size-6 max-sm:hidden cursor-pointer"
            />
            <h1 className="font-semibold text-lg">Followers</h1>
          </div>
          <div className="flex flex-col">
            {profile?.followers && profile.followers.length > 0 ? (
              profile?.followers.map((user, i) => {
                return (
                  <User
                    className="!px-4 border-b border-b-slate-300"
                    user={user}
                    key={i}
                  />
                );
              })
            ) : (
              <div className="flex justify-center text-sm text-slate-500 mt-12">
                No Followers
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* End Followers Modal */}

      {/* Following Modal */}

      <Modal show={followingModalShow} toggle={toggleFollowingModal}>
        <>
          <div className="min-w-[100vw] sm:min-w-[28rem] md:min-w-[30rem] sm:h-[30rem] sm:overflow-y-scroll right-0 bg-white border border-slate-200 sm:rounded-[1rem] max-sm:min-h-dvh sm:w-max sm:max-w-[32rem] sm:max-h-[40rem] sm:overflow-scroll">
            <div className="px-4 py-4 border-b flex gap-4 items-center border-b-slate-300 sticky top-0 bg-[rgba(255,255,255,1)]">
              <ArrowLeftIcon
                onClick={toggleFollowingModal}
                className="size-6 sm:hidden cursor-pointer"
              />
              <XMarkIcon
                onClick={toggleFollowingModal}
                className="size-6 max-sm:hidden cursor-pointer"
              />
              <h1 className="font-semibold text-lg">Following</h1>
            </div>
            <div className="flex flex-col">
              {profile?.following && profile.following.length > 0 ? (
                profile?.following.map((user, i) => {
                  return (
                    <User
                      className="!px-4 border-b border-b-slate-300"
                      user={user}
                      key={i}
                    />
                  );
                })
              ) : (
                <div className="flex justify-center text-sm text-slate-500 mt-12">
                  No Following
                </div>
              )}
            </div>
          </div>
        </>
      </Modal>

      {/* End Following Modal */}

      <div className="bg-white flex flex-col">
        <div
          className={clsx(
            "px-4 py-3 left-0 top-0 right-0 sm:left-[4.6rem] xl:left-[21.050rem] max-h-16 sm:max-w-[600px] z-[1000] flex items-center gap-5",
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
            "w-full  bg-gray-300 !min-h-36 max-h-36 sm:!min-h-44 sm:max-h-44 overflow-hidden",
            !inView && "-mt-[3.95rem] "
          )}
        >
          {!!profile?.coverImage && (
            <img
              src={profile?.coverImage.url}
              className="size-full h-36 sm:h-44 object-cover "
              alt=""
            />
          )}
        </div>
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
              <button
                onClick={() => toggleEditModal()}
                className="px-5 py-1.5 h-fit bg-black text-white font-medium rounded-full text-sm "
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <button
              onClick={() => follow({ id: profile?._id })}
              className={clsx(
                "px-5 py-1.5 h-fit  font-medium rounded-full text-sm ms-auto",
                userIsFollowing(auth, profile)
                  ? "bg-white border border-slate-400 text-neutral-700"
                  : "bg-black text-white"
              )}
            >
              {following ? (
                <Loader
                  className={clsx(
                    "size-5",
                    userIsFollowing(auth, profile) && "invert"
                  )}
                />
              ) : userIsFollowing(auth, profile) ? (
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
            <span className="cursor-pointer" onClick={toggleFollowingModal}>
              {profile?.following.length}{" "}
              <span className="text-slate-600 font-normal">Following</span>
            </span>
            <span className="cursor-pointer" onClick={toggleFollowersModal}>
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
                {page?.data.length > 0 ? (
                  page?.data.map((post: any, i: number) => (
                    <Post post={post} key={i} user={auth} />
                  ))
                ) : (
                  <div className="flex mt-16 justify-center max-sm:text-sm text-slate-500">
                    <h1>No Posts</h1>
                  </div>
                )}
              </Fragment>
            ))}
        </div>
      </div>
    </>
  );
}
