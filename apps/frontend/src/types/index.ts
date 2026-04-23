export type User = {
  id: string;
  nickname: string;
  displayName: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  message: string;
};

export type Miniblog = {
  id: string;
  content: string;
  authorId: string;
  authorNickname: string;
  authorDisplayName: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  createdAt: string;
  likesCount?: number;
  isLiked?: boolean;
};

export type Like = {
  id: string;
  userId: string;
  miniblogId: string;
};

export type RegisterInput = {
  nickname: string;
  password: string;
  displayName: string;
};

export type LoginInput = {
  nickname: string;
  password: string;
};

export type CreateMiniblogInput = {
  content: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
};
