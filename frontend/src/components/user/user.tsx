import { Link } from "react-router-dom";
import useFollow from "../../hooks/useFollow";
import { User as UserType, UserPreview } from "../../types/user.type";
import Loader from "../loader/loader";
import { useAuth } from "../../context/auth_context";
import clsx from "clsx";

export const userIsFollowing = (auth: any, user: any) =>
  auth.following.some((u: UserType) => u._id == user._id);

export const User = ({
  user,
  className = "",
}: {
  user: UserPreview;
  className?: string;
}) => {
  const { follow, following } = useFollow();
  const { auth } = useAuth();
  return (
    <div className={"flex items-center px-3 py-3 gap-3 " + className}>
      <div className=" rounded-full overflow-hidden size-10 min-h-10 min-w-10">
        <img
          src={!!user.profileImage ? user.profileImage.url : "/img/default.png"}
          alt=""
          className="object-cover size-full"
        />
      </div>
      <Link to={`/${user.username}`}>
        <h1 className="font-semibold">{user.name}</h1>
        <h5 className="text-sm text-slate-600">@{user.username}</h5>
      </Link>
      {following ? (
        <Loader className="size-6 invert ms-auto mr-5" />
      ) : (
        user._id != auth._id && (
          <button
            onClick={() => follow({ id: user._id })}
            className={clsx(
              "px-3 py-1.5 text-sm  rounded-full ms-auto font-medium",
              userIsFollowing(auth, user)
                ? "bg-white text-black border border-slate-300"
                : "bg-black text-white"
            )}
          >
            {userIsFollowing(auth, user) ? "Unfollow" : "Follow"}
          </button>
        )
      )}
    </div>
  );
};
