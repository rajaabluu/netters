import {
  BookmarkIcon,
  ChatBubbleOvalLeftIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import ImageWrapper from "./image_wrapper";
import moment from "moment";
import "moment/dist/locale/id";
import Loader from "../loader/loader";
import api from "../../api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function Post({
  post,

  user,
}: {
  post: any;
  user: any;
}) {
  const queryClient = useQueryClient();
  const likeMutation = useMutation({
    mutationFn: async ({ postId }: { postId: string | number }) => {
      const res = await api.post(`/post/${postId}/like`);
      if (res.status == 200) return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts", "all"] });
      await queryClient.invalidateQueries({ queryKey: ["posts", "following"] });
    },
  });

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
            <h5 className="text-sm">
              {moment(post.createdAt).locale("id").fromNow()}
            </h5>
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
          <div className="ms-auto ">
            <BookmarkIcon className="size-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
