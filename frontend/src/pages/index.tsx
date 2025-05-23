import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import clsx from "clsx";
import { ChangeEvent, Fragment, useState } from "react";
import api from "../api/config";
import Loader from "../components/loader/loader";
import Post from "../components/post/post";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import ReactTextareaAutosize from "react-textarea-autosize";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useAuth } from "../context/auth_context";
import useModal from "../hooks/useModal";
import { Post as PostType } from "../types/post.type";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function HomePage() {
  const [type, setType] = useState<"all" | "following">("all");
  const { show, toggle } = useModal();
  const [newPost, setNewPost] = useState({
    text: "",
    images: [],
  });
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  const { data: posts, isLoading } = useInfiniteQuery({
    queryKey: ["posts", type],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      try {
        const res = await api.get(`/post?type=${type}&page=${pageParam}`);
        if (res.status == 200) {
          return {
            data: res.data.data,
            nextPage: parseInt(res.data.pagination.nextPage),
          };
        }
      } catch (error) {
        console.log(error);
      }
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    staleTime: 1000 * 60,
  });

  const { mutate: createNewPost, isPending: pendingNewPost } = useMutation({
    mutationFn: async (data: any) => {
      try {
        const res = await api.post("/post", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.status == 200) return res.data;
      } catch (err) {
        throw err;
      }
    },
    onError: (err) => console.log("Error On Create Post:", err),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts", "all"] });
      setNewPost({
        images: [],
        text: "",
      });
      toggle();
      toast.success("Berhasil Membuat Postingan", {
        position: "top-right",
        duration: 1000,
      });
    },
  });

  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: ["posts", type] });
  // }, [type]);

  return (
    <div>
      <div className="flex *:w-1/2 text-center py-4 sm:py-5 text-neutral-600 border-b border-b-slate-300 sticky top-0 *:cursor-pointer max-md:text-sm bg-white z-[10]">
        <span onClick={() => setType("all")}>For You</span>
        <span onClick={() => setType("following")}>Following</span>
        <span
          className={clsx(
            "absolute px-4 sm:px-20 bottom-0 duration-300 ease-in-out transition-all",
            type == "following" && "translate-x-full"
          )}
        >
          <div className="bg-black py-[0.1rem] sm:py-[0.10rem] rounded-full w-full"></div>
        </span>
      </div>

      {/* POST MODAL BUTTON */}
      <div
        onClick={() => toggle()}
        className="fixed z-[9999] right-6 bottom-20 border border-slate-500 sm:hidden bg-black text-white fill-white p-1 rounded-full"
      >
        <PlusIcon className="size-[2.10rem] cursor-pointer" />
      </div>
      {/*END POST MODAL BUTTON */}

      {/* NEW POST MODAL */}

      <div
        className={clsx(
          "max-sm:fixed top-0 left-0 max-sm:h-screen max-sm:w-screen bg-white max-sm:z-[9999] flex flex-col",
          !show && "max-sm:hidden"
        )}
      >
        <div className="flex justify-between px-5 py-4 items-center sm:hidden">
          <XMarkIcon
            onClick={() => toggle()}
            className="size-7 cursor-pointer"
          />
          <button
            disabled={newPost.images.length == 0 && newPost.text.length == 0}
            onClick={() => createNewPost(newPost)}
            className="px-5 font-medium py-1.5 max-sm:text-sm bg-black text-white rounded-full"
          >
            {pendingNewPost ? <Loader className="size-6" /> : "Post"}
          </button>
        </div>
        <div className="flex mt-2 px-4 gap-4 sm:min-h-32 sm:py-3">
          <img
            src={
              !!auth.profileImage ? auth.profileImage.url : "/img/default.png"
            }
            className="min-h-9 max-h-9 min-w-9 max-w-9 sm:min-w-10 sm:max-w-10 sm:max-h-10 sm:min-h-10 object-cover rounded-full"
            alt=""
          />
          <ReactTextareaAutosize
            maxLength={500}
            value={newPost.text}
            onChange={(e) => {
              setNewPost((post) => ({ ...post, text: e.target.value }));
            }}
            placeholder="Whats happened? ..."
            className="w-full focus:outline-none resize-none mt-1"
          ></ReactTextareaAutosize>
        </div>
        {newPost.images.length > 0 && (
          <Swiper
            slidesPerView={"auto"}
            autoplay={false}
            spaceBetween={15}
            className=" gap-4 pl-6 sm:pl-16 pr-8 pb-8 max-sm:pt-12 mySwiper max-w-screen !mx-0"
          >
            {newPost.images.map((image, index) => {
              return (
                <SwiperSlide key={index} className="!w-fit">
                  <div
                    className={clsx(
                      newPost.images.length > 1 ? "w-28" : "w-4/5",
                      "aspect-[9/10] relative max-sm:shadow-md"
                    )}
                  >
                    <div
                      onClick={() =>
                        setNewPost((post) => ({
                          ...post,
                          images: post.images.filter((_, i) => i !== index),
                        }))
                      }
                      className="bg-white border border-slate-300 rounded-full absolute -top-2 -right-2 p-1"
                    >
                      <XMarkIcon className="size-4" />
                    </div>
                    <img
                      className={clsx("object-cover size-full", "rounded-md")}
                      src={URL.createObjectURL(image)}
                      alt=""
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
        <div className="flex gap-2 border-y  text-slate-800 font-medium text-sm items-center border-t-slate-200 max-sm:fixed max-sm:bottom-0 max-sm:w-full py-3  px-4">
          <label htmlFor="file" className="flex gap-2 items-center">
            <PhotoIcon className="size-6" />
            <h1 className="">Add Image</h1>
          </label>
          <button
            disabled={newPost.images.length == 0 && newPost.text.length == 0}
            onClick={() => createNewPost(newPost)}
            className="px-5 cursor-pointer max-sm:hidden disabled:bg-gray-400 disabled:cursor-default ms-auto font-medium py-1.5 bg-black text-white rounded-full"
          >
            {pendingNewPost ? <Loader className="size-5" /> : "Post"}
          </button>
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) {
                setNewPost((post) => ({
                  ...post,
                  images: Array.from(e.target.files as FileList).slice(
                    0,
                    4
                  ) as any,
                }));
              }
            }}
            multiple
            type="file"
            hidden
            id="file"
          />
        </div>
      </div>

      {/* END NEW POST MODAL */}
      {isLoading ? (
        <div className="flex mt-24 justify-center ">
          <Loader className="size-8 invert" />
        </div>
      ) : (
        <div className="max-sm:pb-[4.4rem]">
          {posts?.pages.map((page, index) => (
            <Fragment key={index}>
              {page?.data.length > 0 ? (
                page?.data.map((post: PostType, i: number) => (
                  <Post key={i} post={post} user={auth} />
                ))
              ) : (
                <div className="flex justify-center mt-12 text-sm text-slate-600">
                  <h1>No Posts</h1>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
