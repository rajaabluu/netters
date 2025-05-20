import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../../api/config";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import { Post } from "../../../../types/post.type";
import ImageWrapper from "../../../../components/post/image_wrapper";
import moment from "moment";
import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline";
import {
  CameraIcon,
  HeartIcon as HeartSolidIcon,
} from "@heroicons/react/24/solid";
import { ChangeEvent, useEffect, useState } from "react";
import useModal from "../../../../hooks/useModal";
import clsx from "clsx";
import { useAuth } from "../../../../context/auth_context";
import ReactTextareaAutosize from "react-textarea-autosize";
import { User, UserPreview } from "../../../../types/user.type";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Swiper, SwiperSlide } from "swiper/react";
import Loader from "../../../../components/loader/loader";
import useLike from "../../../../hooks/useLike";
import { Comment } from "../../../../types/comment.type";

export default function PostDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { auth }: { auth: User } = useAuth();
  const { like, liking } = useLike();
  const navigate = useNavigate();

  const [replying, setReplying] = useState<UserPreview | null>(null);
  const commentDefaultValue = {
    user: auth._id,
    images: [],
    text: "",
  };
  const [comment, setComment] =
    useState<typeof commentDefaultValue>(commentDefaultValue);
  const { show: isModalFullscreen, toggle: toggleFullScreenModal } = useModal();
  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await api.get(`/post/${id}`);
      if (res.status == 200) return res.data;
    },
  });

  const { mutate: postComment, isPending: commentPending } = useMutation({
    mutationFn: async (comment: Comment) => {
      const res = await api.post(`/post/${id}/comment`, comment, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status == 200) return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["post", id] });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      setReplying(null);
      setComment(commentDefaultValue);
      if (isModalFullscreen) toggleFullScreenModal();
    },
  });

  useEffect(() => {
    if (comment.images.length > 0 && !isModalFullscreen)
      toggleFullScreenModal();
  }, [comment.images]);
  if (isLoading || !post)
    return (
      <div className="h-dvh flex items-center justify-center">
        <Loader className="size-10 invert" />
      </div>
    );

  return (
    <div className="h-dvh overflow-y-scroll">
      <div className="flex py-4 sticky top-0 px-4 sm:px-6 items-center bg-white gap-4 border-b border-slate-300">
        <ArrowLeftIcon onClick={() => navigate(-1)} className="size-6" />
        <h1 className="font-bold text-lg">Post</h1>
      </div>
      <div className=" flex flex-col  py-1 sm:py-2 overflow-x-hidden">
        <div className="px-4 sm:px-6 border-b border-b-slate-300">
          <div className="flex gap-3.5 py-3 items-center">
            <div className="size-10 min-h-10 min-w-10 rounded-full overflow-hidden sm:size-11">
              <img
                src={
                  !!post.user.profileImage
                    ? post.user.profileImage.url
                    : "/img/default.png"
                }
                className="size-full object-cover object-center"
                alt=""
              />
            </div>
            <Link to={`/${post.user.username}`} className="hover:*:underline">
              <h1 className="font-semibold">{post.user.name}</h1>
              <p className="text-slate-500 text-sm">@{post.user.username}</p>
            </Link>
          </div>
          <div className="py-4 text-slate-800 flex flex-col gap-4">
            <p className="sm:text-lg">{post.text}</p>
            {!!post.images && post.images.length > 0 && (
              <ImageWrapper images={post.images} />
            )}
          </div>
          <div className="text-slate-600 text-sm max-sm:mt-2 mt-1 py-2 pb-1">
            {moment(post.createdAt).format("HH:mm • MMMM D YYYY ")}
          </div>
          <div className="py-3  text-slate-400 flex gap-12 items-center">
            <div className="flex gap-1 items-center">
              <ChatBubbleOvalLeftIcon className="size-[1.15rem] mb-[0.100rem]" />
              <p>{post.comments.length}</p>
            </div>
            <div className="flex gap-1 items-center">
              {liking ? (
                <Loader className="size-5 invert" />
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    like(post._id, {
                      onSuccess: async () =>
                        await queryClient.invalidateQueries({
                          queryKey: ["post", id],
                        }),
                    });
                  }}
                >
                  {post.likes.some((like: any) => like._id == auth._id) ? (
                    <HeartSolidIcon className="size-5 cursor-pointer fill-black" />
                  ) : (
                    <HeartIcon className="size-5 cursor-pointer" />
                  )}
                </div>
              )}
              <p>{post.likes.length}</p>
            </div>
          </div>
        </div>

        {/* Comment field */}
        <div
          className={clsx(
            "max-sm:fixed left-0 *:px-1 *:sm:px-5 right-0 bottom-0 max-sm:border-t flex sm:border-b flex-col  border-slate-300 sm:my-4 sm:pt-2 sm:items-start bg-white",
            isModalFullscreen
              ? "!top-0  bg-white *:!px-4"
              : "items-center mt-3 max-sm:px-2",
            !!replying ? " pb-1 " : "py-3"
          )}
        >
          {isModalFullscreen && (
            <>
              <div className="flex sm:hidden gap-3 justify-between py-4 border-b border-b-slate-300 !px-4">
                <ArrowLeftIcon
                  className="size-6"
                  onClick={() => {
                    toggleFullScreenModal();
                    setComment((c) => ({ ...c, images: [] }));
                  }}
                />
              </div>
              {/* <div className="flex mt-6 gap-3 sm:hidden items-start px-4">
                <div className="size-9 sm:size-11 min-h-9 min-w-9 rounded-full overflow-hidden">
                  <img
                    src={
                      !!auth.profileImage
                        ? auth.profileImage.url
                        : "/img/default.png"
                    }
                    className="size-full object-cover object-center"
                    alt={auth.name + "pfp"}
                  />
                </div>
                <ReactTextareaAutosize
                  placeholder="Post your reply"
                  className="focus:outline-none text-slate-500 resize-none flex-grow mt-1 "
                ></ReactTextareaAutosize>
              </div> */}
            </>
          )}
          {!!replying && (
            <div
              className={clsx(
                "flex gap-3 items-center text-sm mb-0.5 sm:mb-2 max-sm:pt-3 w-full justify-start",
                isModalFullscreen && "max-sm:px-4 max-sm:!pt-5"
              )}
            >
              <h1 className="text-slate-500">
                replying to{" "}
                <Link
                  to={`/${replying.username}`}
                  className="text-blue-500 hover:underline"
                >
                  @{replying.username}
                </Link>
              </h1>
            </div>
          )}
          <div
            className={clsx(
              "flex w-full items-center sm:pb-5 sm:py-3 sm:items-end",
              !!!replying && !isModalFullscreen
                ? "max-sm:border-b border-slate-300 max-sm:pb-2"
                : "max-sm:pb-0",
              isModalFullscreen &&
                "max-sm:px-4 gap-3 max-sm:py-5 max-sm:!items-start"
            )}
          >
            {
              <div className="h-auto self-start">
                <div
                  className={clsx(
                    "size-9 min-h-9 min-w-9 rounded-full overflow-hidden",
                    !isModalFullscreen && "max-sm:hidden",
                    !!!replying && "sm:block"
                  )}
                >
                  <img
                    src={
                      !!auth.profileImage
                        ? auth.profileImage.url
                        : "/img/default.png"
                    }
                    className="size-full object-cover object-center"
                    alt={auth.name + "pfp"}
                  />
                </div>
              </div>
            }
            <ReactTextareaAutosize
              onChange={(e) =>
                setComment((comment) => ({ ...comment, text: e.target.value }))
              }
              value={comment.text}
              onClick={() => setReplying(post.user)}
              className={clsx(
                "max-sm:py-1 resize-none sm:flex-grow pr-2 sm:pl-3  sm:pb-2 sm:pr-5 focus:outline-none",
                isModalFullscreen ? "max-sm:w-full max-sm:!pt-0" : "flex-grow ",
                !!replying && !isModalFullscreen
                  ? "max-sm:py-2 border-none "
                  : ""
              )}
              placeholder="Post your reply"
            />

            {!!replying && !isModalFullscreen ? (
              <div
                className="flex origin-center rotate-45 scale-90 sm:hidden mt-1"
                onClick={toggleFullScreenModal}
              >
                <ArrowLeftIcon className="size-3.5" />
                <ArrowRightIcon className="size-3.5" />
              </div>
            ) : (
              !isModalFullscreen && (
                <CameraIcon className="size-6 text-slate-500 sm:hidden" />
              )
            )}
            <button
              disabled={comment.text.length == 0 && comment.images.length == 0}
              onClick={() => postComment(comment)}
              className={clsx(
                "py-1 sm:mb-1 text-white disabled:bg-gray-500 bg-black rounded-full px-5 ms-auto text-sm flex justify-center",
                !!replying
                  ? "max-sm:fixed max-sm:bottom-2.5 max-sm:right-2.5 "
                  : "max-sm:hidden",
                isModalFullscreen &&
                  "max-sm:!top-3.5 max-sm:!bottom-auto max-sm:!right-3.5"
              )}
            >
              {commentPending ? <Loader className=" size-5" /> : "Reply"}
            </button>
          </div>
          {
            // Image wrapper
            comment?.images.length > 0 && isModalFullscreen && (
              <Swiper
                spaceBetween={20}
                slidesPerView={"auto"}
                className=" gap-4 pl-6 pr-8 pb-8 sm:pl-0 max-sm:pt-12 sm:pt-8 mySwiper max-w-screen !mx-0"
              >
                {comment.images.map((image, index) => {
                  return (
                    <SwiperSlide key={index} className="!w-fit">
                      <div
                        className={clsx(
                          comment.images.length > 1 ? "w-28" : "w-4/5",
                          "aspect-[9/10] relative max-sm:shadow-md"
                        )}
                      >
                        <div
                          onClick={() =>
                            setComment((comment) => ({
                              ...comment,
                              images: comment.images.filter(
                                (_, i) => i !== index
                              ) as any,
                            }))
                          }
                          className="bg-white border border-slate-300 rounded-full absolute -top-2 -right-2 p-1"
                        >
                          <XMarkIcon className="size-4" />
                        </div>
                        <img
                          className={clsx(
                            "object-cover size-full",
                            "rounded-md"
                          )}
                          src={URL.createObjectURL(image as any)}
                          alt=""
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )
          }
          {!!replying && (
            <div
              className={clsx(
                "flex w-full  py-3 border-t border-t-slate-300 mt-auto sm:py-3 sm:sticky sm:bottom-0 sm:z-[3] bg-white",
                isModalFullscreen && "max-sm:px-4"
              )}
            >
              <label htmlFor="images" className="flex gap-2 items-end">
                <CameraIcon className="size-5 text-slate-600" />
                <h1 className="text-sm text-slate-500 pt-1">Add image</h1>
              </label>
              <input
                multiple
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setComment((c: any) => ({
                    ...c,
                    images: [...(e.target.files as any)],
                  }))
                }
                type="file"
                id="images"
                hidden
              />
            </div>
          )}
        </div>
        {/* End Comment field */}

        {/* Comments */}
        <div className="flex flex-col pb-36 mt-0 sm:-mt-4">
          {post.comments.length > 0 ? (
            post.comments.map((comment, i) => (
              <div
                key={i}
                className="flex gap-3 items-start border-b border-b-slate-200 px-4 sm:px-6 py-3.5 min-w-full"
              >
                <div className="size-9 min-h-9 min-w-9 sm:size-10 rounded-full overflow-hidden flex items-start">
                  <img
                    src={
                      !!comment.user.profileImage
                        ? comment.user.profileImage.url
                        : "/img/default.png"
                    }
                    alt=""
                    className="size-full object-cover object-center"
                  />
                </div>
                <div>
                  <div className="flex gap-2 items-center">
                    <Link
                      to={`/${comment.user.username}`}
                      className="flex gap-1.5 hover:*:underline"
                    >
                      <h1 className="font-semibold">{comment.user.name}</h1>
                      <h3 className=" text-slate-500">
                        @{comment.user.username}
                      </h3>
                    </Link>
                    <span>·</span>
                    <h5 className="text-sm text-slate-500">
                      {moment(comment.createdAt).fromNow().split(" ago")[0]}
                    </h5>
                  </div>
                  <div>
                    <p className="mt-0.5 text-slate-800 pb-4 break-all w-fit">
                      {comment.text}
                    </p>
                    {!!comment.images && comment.images.length > 0 && (
                      <ImageWrapper
                        className="max-sm:-ml-10"
                        images={comment.images}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center py-12 text-sm">
              <h1 className="text-slate-600">No Comments</h1>
            </div>
          )}
        </div>
        {/* End Comments */}
      </div>
    </div>
  );
}
