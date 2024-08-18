import { Comment } from "./comment.type";
import { UserImage } from "./image.type";
import { UserPreview } from "./user.type";

export interface Post {
  _id: string;
  user: UserPreview;
  text: string;
  images: UserImage[] | null;
  likes: UserPreview[];
  comments: Comment[];
  createdAt: string;
  commentsCount?: number;
}
