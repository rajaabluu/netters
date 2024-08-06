import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../../api/config";
import { Fragment, useEffect } from "react";
import Notification from "../../components/notification/notification";
import { Notification as NotificationType } from "../../types/notification.type";

export default function NotificationPage() {
  const { data: notifications, isLoading } = useInfiniteQuery({
    queryKey: ["notifications"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await api.get(`/notification?page=${pageParam}`);
      if (res.status == 200) {
        return {
          data: res.data.data,
          nextPage: res.data.pagination.nextPage ?? undefined,
        };
      }
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage,
  });
  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  return (
    <div>
      <div className="py-4 px-6 border-b border-b-slate-200">
        <h1 className="text-lg font-medium ">Notification</h1>
      </div>
      {isLoading ? null : (
        <div className="flex flex-col">
          {notifications?.pages.map((page, i) => (
            <Fragment key={i}>
              {page?.data.length > 0 ? (
                page?.data.map((notification: NotificationType) => (
                  <>
                    <Notification notification={notification} />
                  </>
                ))
              ) : (
                <h6 className="mx-6 mt-8 text-slate-500">No Notifications</h6>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
