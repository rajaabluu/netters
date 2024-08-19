import moment from "moment";
import { Notification as NotificationType } from "../../types/notification.type";
import { useNavigate } from "react-router-dom";
import { getPostUrl } from "../post/post";

const LikeNotification = ({
  notification,
}: {
  notification: NotificationType;
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(getPostUrl(notification.post))}
      className="flex py-3 px-4 gap-3.5 border-b border-b-slate-200 items-center"
    >
      <div className="size-9 min-h-9 min-w-9 sm:size-10  sm:min-h-10 sm:min-w-10 rounded-full overflow-hidden">
        <img
          src={
            !!notification.from.profileImage
              ? notification.from.profileImage.url
              : "/img/default.png"
          }
          className="object-cover size-full"
          alt=""
        />
      </div>
      <div className="flex max-w-[20rem]">
        <h1 className="text-sm text-slate-800">
          <span
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/${notification.from.username}`);
            }}
            className="font-medium text-black  cursor-pointer hover:underline"
          >
            {notification.from.username}
          </span>{" "}
          liked your post{""}
          {/* post text */}
          <span className="mr-2">
            {!!notification.post.text && ": " + notification.post.text}{" "}
          </span>
          {/* end post text */}
          <span className=" text-slate-500 whitespace-nowrap">
            {moment(notification.createdAt).fromNow().replace(/ago/g, "")}
          </span>
        </h1>
      </div>
      {!!notification.post.images && (
        <div className="size-10 sm:size-11 min-w-10 min-h-10   overflow-hidden rounded-md ms-auto">
          <img
            className="size-full object-cover object-center"
            src={notification.post.images[0].url}
            alt=""
          />
        </div>
      )}
    </div>
  );
};
const CommentNotification = ({
  notification,
}: {
  notification: NotificationType;
}) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(getPostUrl(notification.post))}
      className="flex py-3 px-4 gap-3.5 border-b border-b-slate-200 items-center"
    >
      <div className="size-9 min-h-9 min-w-9 sm:size-10  sm:min-h-10 sm:min-w-10 rounded-full overflow-hidden">
        <img
          src={
            !!notification.from.profileImage
              ? notification.from.profileImage.url
              : "/img/default.png"
          }
          className="object-cover size-full"
          alt=""
        />
      </div>
      <div className="flex max-w-[20rem]">
        <h1 className="text-sm text-slate-800">
          <span
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/${notification.from.username}`);
            }}
            className="font-medium text-black  cursor-pointer hover:underline"
          >
            {notification.from.username}
          </span>{" "}
          commented on your post{""}
          {/* post text */}
          <span className="mr-2">
            {!!notification.text && ": " + notification.text}{" "}
          </span>
          {/* end post text */}
          <span className=" text-slate-500 whitespace-nowrap">
            {moment(notification.createdAt).fromNow().replace(/ago/g, "")}
          </span>
        </h1>
      </div>
      {!!notification.post.images && (
        <div className="size-10 sm:size-11 min-w-10 min-h-10   overflow-hidden rounded-md ms-auto">
          <img
            className="size-full object-cover object-center"
            src={notification.post.images[0].url}
            alt=""
          />
        </div>
      )}
    </div>
  );
};
const FollowNotification = ({
  notification,
}: {
  notification: NotificationType;
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex py-3 px-4 gap-3.5 border-b border-b-slate-200 items-center">
      <div className="size-9 min-h-9 min-w-9 sm:size-10  sm:min-h-10 sm:min-w-10 rounded-full overflow-hidden">
        <img
          src={
            !!notification.from.profileImage
              ? notification.from.profileImage.url
              : "/img/default.png"
          }
          className="object-cover size-full"
          alt=""
        />
      </div>
      <div className="flex max-w-[20rem] ">
        <h1 className="text-sm text-slate-800">
          <span
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/${notification.from.username}`);
            }}
            className="font-medium text-black cursor-pointer hover:underline"
          >
            {notification.from.username}
          </span>
          <span className="mr-2"> started following you </span>
          <span className=" text-slate-500 whitespace-nowrap">
            {moment(notification.createdAt).fromNow().replace(/ago/g, "")}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default function Notification({
  notification,
}: {
  notification: NotificationType;
}) {
  const n = {
    follow: <FollowNotification notification={notification} />,
    like: <LikeNotification notification={notification} />,
    comment: <CommentNotification notification={notification} />,
  };

  return n[notification.type];
}
