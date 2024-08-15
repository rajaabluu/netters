import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../api/config";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import { Post } from "../../../../types/post.type";
import ImageWrapper from "../../../../components/post/image_wrapper";
import moment from "moment";
import { CameraIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import useModal from "../../../../hooks/useModal";
import clsx from "clsx";
import { useAuth } from "../../../../context/auth_context";
import ReactTextareaAutosize from "react-textarea-autosize";
import { User } from "../../../../types/user.type";
import { PhotoIcon } from "@heroicons/react/20/solid";

export default function PostDetailPage() {
  const { id } = useParams();
  const { auth }: { auth: User } = useAuth();
  const navigate = useNavigate();
  const [commenting, setCommenting] = useState(false);
  const { show: isModalFullscreen, toggle: toggleFullScreenModal } = useModal();
  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await api.get(`/post/${id}`);
      if (res.status == 200) return res.data;
    },
  });
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
              className="size-full"
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
        <div className="text-slate-600 text-sm mt-1 py-2 border-b border-slate-300">
          {moment(post.createdAt).format("h:mm • MMMM D YYYY ")}
        </div>
        {/* Comment field */}
        <div
          className={clsx(
            "max-sm:fixed left-0 right-0 bottom-0 max-sm:border-t flex sm:border-b flex-col pt-1.5 border-slate-300 sm:my-4 sm:py-2  sm:items-end",
            isModalFullscreen
              ? "!top-0  bg-white "
              : "items-center mt-3 mb-2 max-sm:px-4 ",
            commenting && " mb-1 "
          )}
        >
          {isModalFullscreen && (
            <>
              <div className="flex sm:hidden gap-3 justify-between py-3 border-b border-b-slate-300 px-4">
                <ArrowLeftIcon
                  className="size-5"
                  onClick={() => toggleFullScreenModal()}
                />
                <div className="font-medium text-sm bg-black text-white rounded-full px-4 py-1">
                  Reply
                </div>
              </div>
              <div className="flex mt-6 gap-3 sm:hidden items-start px-4">
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
              </div>
            </>
          )}
          <div className={clsx("flex w-full items-center sm:py-2")}>
            <ReactTextareaAutosize
              onClick={() => setCommenting(true)}
              className={clsx(
                "max-sm:py-1 resize-none sm:flex-grow pr-2 sm:pr-5 focus:outline-none",
                isModalFullscreen ? "max-sm:hidden" : "flex-grow",
                commenting ? "max-sm:py-2  border-none " : ""
              )}
              placeholder="Post your reply"
            />

            {commenting && !isModalFullscreen ? (
              <div
                className="flex origin-center rotate-45 scale-90 sm:hidden"
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
            <button className="py-1 text-white bg-black rounded-full px-5 max-sm:hidden ms-auto text-sm">
              Post
            </button>
          </div>
          {commenting && (
            <div
              className={clsx(
                "flex w-full  py-2 border-t border-t-slate-300 mt-auto sm:pt-4",
                isModalFullscreen && "px-4"
              )}
            >
              <label htmlFor="images" className="flex gap-3 items-center">
                <PhotoIcon className="size-5 fill-slate-600" />
                <h1 className="text-sm">Add image</h1>
              </label>
              <input type="file" id="images" hidden />
            </div>
          )}
        </div>
        {/* End Comment field */}
      </div>
    </div>
  );
}
