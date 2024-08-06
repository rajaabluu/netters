import moment from "moment";
import { Notification as NotificationType } from "../../types/notification.type";

const LikeNotification = ({
  notification,
}: {
  notification: NotificationType;
}) => {
  return (
    <div className="flex py-3 px-5 gap-4 border-b border-b-slate-200">
      <div className="size-10 sm:size-11 min-h-10 sm:min-h-11 sm:min-w-11 min-w-10 rounded-full overflow-hidden">
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
          <span className="font-medium text-black">
            {notification.from.username}
          </span>{" "}
          liked your post{""}
          {/* post text */}
          <span className="mr-2">
            {!!notification.post.text && ": " + notification.post.text}{" "}
          </span>
          {/* end post text */}
          <span className=" text-slate-500 whitespace-nowrap">
            {moment(notification.createdAt)
              .startOf("hours")
              .fromNow()
              .replace(/ago/g, "")}
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
const CommentNotification = () => {
  return <div className="flex">Comment Notification</div>;
};
const FollowNotification = ({
  notification,
}: {
  notification: NotificationType;
}) => {
  return (
    <div className="flex py-3 px-5 gap-4 border-b border-b-slate-200">
      <div className="size-10 sm:size-11 min-h-10 sm:min-h-11 sm:min-w-11 min-w-10 rounded-full overflow-hidden">
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
          <span className="font-medium text-black">
            {notification.from.username}
          </span>{" "}
          started following you{" "}
          <span className=" text-slate-500 whitespace-nowrap">
            {moment(notification.createdAt)
              .startOf("hours")
              .fromNow()
              .replace(/ago/g, "")}
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
    comment: <CommentNotification />,
  };

  return n[notification.type];
}
