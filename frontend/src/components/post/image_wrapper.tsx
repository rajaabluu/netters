import clsx from "clsx";
import { UserImage } from "../../types/image.type";

export default function ImageWrapper({
  images,
  className,
}: {
  images: UserImage[];
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex rounded-md overflow-hidden",
        (images.length == 1 || images.length == 4) && "mr-6",
        images.length == 3 && "aspect-video",
        images.length == 4 && "aspect-[14/10]",
        className
      )}
    >
      <div
        className={clsx(
          "flex flex-col",
          images.length == 1
            ? "w-full max-w-80 rounded-md overflow-hidden"
            : "w-1/2 border-r-2  border-slate-300"
        )}
      >
        <div
          className={clsx(
            images.length == 4 ? "h-1/2" : "h-full",
            "w-full",
            images.length == 4 && "border-b-2 border-b-slate-300"
          )}
        >
          <img className="size-full object-cover" src={images[0].url} />
        </div>
        {images.length == 4 && (
          <div className={clsx(images.length == 4 ? "h-1/2" : "h-full")}>
            <img className="size-full object-cover" src={images[3].url} />
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex flex-col w-1/2 ">
          <div
            className={clsx(
              images.length >= 3 ? "h-1/2" : "h-full",
              images.length >= 3 && "border-b-2 border-b-slate-300"
            )}
          >
            <img
              src={images[1].url}
              alt=""
              className="size-full object-cover"
            />
          </div>
          {images.length > 2 && (
            <div className={clsx(images.length >= 3 ? "h-1/2" : "h-full")}>
              <img
                src={images[2].url}
                alt=""
                className="size-full object-cover"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
