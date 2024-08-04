import {
  BookmarkIcon,
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import ImageWrapper from "./image_wrapper";
import moment from "moment";
import Loader from "../loader/loader";
import api from "../../api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, matchPath, useLocation, useParams } from "react-router-dom";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Popover from "../menu/popover";
import { toast } from "sonner";

export default function Post({ post, user }: { post: any; user: any }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const l = useLocation();
  const queryClient = useQueryClient();
  const pathnameMatch = matchPath("/:username", l.pathname);
  const handleLike = async ({ postId }: { postId: string | number }) => {
    const res = await api.post(`/post/${postId}/like`);
    if (res.status == 200) return res.data;
  };
  const handleDelete = async () => {
    try {
      const res = await api.delete(`/post/${post._id}`);
      if (res.status == 200) return res.data;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  const likeMutation = useMutation({
    mutationFn: handleLike,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: async () => {
      pathnameMatch &&
        (await queryClient.invalidateQueries({
          queryKey: ["posts"],
        }));
      await queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast.success("Post Berhasil dihapus");
    },
  });

  const isFollowing = user.following.some((u: any) => u._id == post.user._id);

  return (
    <div className="px-4 border-b border-b-slate-300 flex pt-4 pb-3">
      <div className="w-max">
        <img
          className="min-w-10 min-h-10 size-10 sm:size-11 rounded-full object-cover"
          src={post.user.profileImage ?? "/img/default.png"}
          alt=""
        />
      </div>
      <div className="flex flex-col flex-grow overflow-hidden pl-4 pr-2">
        {/* User name wrapper */}
        <div className="w-full overflow-hidden">
          <div className="w-max flex gap-1.5 items-center">
            <Link to={`/${post.user.username}`} className="flex gap-1.5 ">
              <h1 className="font-medium">{post.user.name}</h1>
              <h6 className="text-slate-500">@{post.user.username}</h6>
            </Link>
            <span>·</span>
            <h5 className="text-sm">{moment(post.createdAt).fromNow()}</h5>
          </div>
        </div>
        {/* end User name wrapper */}
        <p>{post.text}</p>
        {!!post.images && (
          <div className="mt-2">
            <ImageWrapper images={post.images} />
          </div>
        )}
        <div className="mt-4 text-slate-400 flex gap-12 items-center">
          <div className="flex gap-1 items-center">
            <ChatBubbleOvalLeftIcon className="size-[1.15rem] mb-[0.100rem]" />
            <p>{post.commentsCount}</p>
          </div>
          <div className="flex gap-1 items-center">
            {likeMutation.isPending ? (
              <Loader className="size-5 invert" />
            ) : (
              <div onClick={() => likeMutation.mutate({ postId: post._id })}>
                {post.likes.some((like: any) => like._id == user._id) ? (
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

      <div className="flex flex-col justify-between text-slate-400">
        <div className="relative" onClick={() => setMenuOpen((m) => !m)}>
          <EllipsisHorizontalIcon className="size-5 text-slate-600" />
          <Popover open={menuOpen} onClose={() => setMenuOpen(false)}>
            {user._id !== post.user._id ? (
              <div className="w-max">
                {isFollowing ? "Unfollow" : "Follow"} @{post.user.username}
              </div>
            ) : (
              <div
                onClick={() => deleteMutation.mutate()}
                className="flex gap-2 w-max  items-center"
              >
                {deleteMutation.isPending ? (
                  <Loader className="invert size-4" />
                ) : (
                  <>
                    <TrashIcon className="size-4" /> Delete post
                  </>
                )}
              </div>
            )}
          </Popover>
        </div>
        <div className="">
          <BookmarkIcon className="size-5" />
        </div>
      </div>
    </div>
  );
}
