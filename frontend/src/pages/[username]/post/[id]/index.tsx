import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../api/config";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import { Post } from "../../../../types/post.type";
import ImageWrapper from "../../../../components/post/image_wrapper";
import moment from "moment";
import { CameraIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useEffect, useState } from "react";
import useModal from "../../../../hooks/useModal";
import clsx from "clsx";
import { useAuth } from "../../../../context/auth_context";
import ReactTextareaAutosize from "react-textarea-autosize";
import { User } from "../../../../types/user.type";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Swiper, SwiperSlide } from "swiper/react";

export default function PostDetailPage() {
  const { id } = useParams();
  const { auth }: { auth: User } = useAuth();
  const navigate = useNavigate();
  const [commenting, setCommenting] = useState(false);
  const [comment, setComment] = useState({
    images: [],
  });
  const { show: isModalFullscreen, toggle: toggleFullScreenModal } = useModal();
  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await api.get(`/post/${id}`);
      if (res.status == 200) return res.data;
    },
  });
  useEffect(() => {
    console.log(comment);
  }, [comment]);
  useEffect(() => {
    if (comment.images.length > 0 && !isModalFullscreen)
      toggleFullScreenModal();
  }, [comment.images]);
  if (isLoading || !post) return null;
  return (
    <div>
      <div className="flex py-4 px-4 sm:px-6 items-center gap-4 border-b border-slate-300">
        <ArrowLeftIcon onClick={() => navigate(-1)} className="size-6" />
        <h1 className="font-bold text-lg">Post</h1>
      </div>
      <div className="px-4 sm:px-6 flex flex-col py-1 sm:py-2">
        <div className="flex gap-3.5 py-3">
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
          <div>
            <h1 className="font-semibold">{post.user.name}</h1>
            <p className="text-slate-500 text-sm">@{post.user.username}</p>
          </div>
        </div>
        <div className="py-4 text-slate-800 flex flex-col gap-4">
          <p className="sm:text-lg">{post.text}</p>
          {!!post.images && <ImageWrapper images={post.images} />}
        </div>
        <div className="text-slate-600 text-sm max-sm:mt-4 mt-1 py-2 border-b border-slate-300">
          {moment(post.createdAt).format("h:mm • MMMM D YYYY ")}
        </div>
        {/* Comment field */}
        <div
          className={clsx(
            "max-sm:fixed left-0 right-0 bottom-0 max-sm:border-t flex sm:border-b flex-col sm:pt-1.5 border-slate-300 sm:my-4 sm:py-2 sm:items-start bg-white",
            isModalFullscreen
              ? "!top-0  bg-white "
              : "items-center mt-3 max-sm:px-2",
            commenting ? " mb-1 " : "py-2 my-1"
          )}
        >
          {isModalFullscreen && (
            <>
              <div className="flex sm:hidden gap-3 justify-between py-3 border-b border-b-slate-300 px-4">
                <ArrowLeftIcon
                  className="size-5"
                  onClick={() => {
                    toggleFullScreenModal();
                    setComment((c) => ({ ...c, images: [] }));
                  }}
                />
                <div className="font-medium text-sm bg-black text-white rounded-full px-4 py-1">
                  Reply
                </div>
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
          <div
            className={clsx(
              "flex w-full items-center sm:py-2 sm:items-end",
              !commenting && !isModalFullscreen
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
                    !commenting && "sm:block"
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
              onClick={() => setCommenting(true)}
              className={clsx(
                "max-sm:py-1 resize-none sm:flex-grow pr-2 sm:pl-1  sm:pb-2 max-sm:px-0.5 sm:pr-5 focus:outline-none",
                isModalFullscreen ? "max-sm:w-full max-sm:!pt-0" : "flex-grow ",
                commenting && !isModalFullscreen
                  ? "max-sm:py-2 border-none "
                  : ""
              )}
              placeholder="Post your reply"
            />

            {commenting && !isModalFullscreen ? (
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
            <button className="py-1 sm:mb-1 text-white bg-black rounded-full px-5 max-sm:hidden ms-auto text-sm">
              Post
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
                    <SwiperSlide className="!w-fit">
                      <div
                        key={index}
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
                          src={URL.createObjectURL(image)}
                          alt=""
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )
          }
          {commenting && (
            <div
              className={clsx(
                "flex w-full  py-2 border-t border-t-slate-300 mt-auto sm:pt-4",
                isModalFullscreen && "max-sm:px-4"
              )}
            >
              <label htmlFor="images" className="flex gap-3 items-center">
                <PhotoIcon className="size-5 fill-slate-600" />
                <h1 className="text-sm">Add image</h1>
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
      </div>
    </div>
  );
}
