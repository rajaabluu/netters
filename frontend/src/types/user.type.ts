import { UserImage } from "./image.type";

export interface User {
  _id: string | any;
  name: string;
  username: string;
  followers: UserPreview[];
  following: UserPreview[];
  bio: string;
  link: string;
  createdAt: string;
  coverImage: UserImage;
  profileImage: UserImage;
}

export interface UserPreview {
  _id: string;
  name: string;
  username: string;
  profileImage: UserImage;
}
