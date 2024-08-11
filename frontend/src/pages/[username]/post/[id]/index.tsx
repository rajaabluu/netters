import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../../../../api/config";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { Post } from "../../../../types/post.type";
import ImageWrapper from "../../../../components/post/image_wrapper";
import moment from "moment";
import { CameraIcon } from "@heroicons/react/24/outline";

export default function PostDetailPage() {
  const { id } = useParams();
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
        <ArrowLeftIcon className="size-6" />
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
        <div className="py-1 flex flex-col gap-4">
          <p className="sm:text-lg">{post.text}</p>
          {!!post.images && <ImageWrapper images={post.images} />}
        </div>
        <div className="text-slate-800 mt-1 py-2 border-b border-slate-300">
          {moment(post.createdAt).format("h:mm • MMMM D YYYY ")}
        </div>
        {/* Comment field */}
        <div className="max-sm:fixed left-0 right-0 bottom-0 flex my-3 border-b border-slate-400 max-sm:mx-4 sm:my-4 sm:py-2 items-center">
          <input
            type="text"
            className="py-2  flex-grow"
            placeholder="Post your reply"
          />
          <CameraIcon className="size-6 text-slate-500 sm:hidden" />
          <button className="py-1 text-white bg-black rounded-full px-4 max-sm:hidden text-sm">
            Post
          </button>
        </div>
        {/* End Comment field */}
      </div>
    </div>
  );
}
