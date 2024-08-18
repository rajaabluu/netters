import { UserImage } from "./image.type";
import { UserPreview } from "./user.type";

export interface Comment {
  user: UserPreview;
  images: UserImage[];
  text: string;
  createdAt?: string;
}
