import { UserImage } from "./image.type";

export type NotificationType = "like" | "comment" | "follow";

export interface Notification {
  _id: string;
  from: {
    _id: string;
    username: string;
    profileImage: UserImage;
  };
  to: string;
  type: NotificationType;
  read: boolean;
  post?: any;
  createdAt: string;
}
