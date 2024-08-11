import { UserImage } from "./image.type";
import { UserPreview } from "./user.type";

export interface Post {
  _id: string;
  user: UserPreview;
  text: string;
  images: UserImage[] | null;
  likes: UserPreview[];
  comments: UserPreview[];
  createdAt: string;
  commentsCount?: number;
}
