export interface PostDto {
  id: number;
  slug: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  featured: boolean;
  readTime: string;
  publishedAt: string;
  likeCount?: number;
  commentCount?: number;
}

export interface CreatePostDto {
  slug: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  featured?: boolean;
  readTime: string;
}

export interface UpdatePostDto {
  title?: string;
  summary?: string;
  body?: string;
  tags?: string[];
  featured?: boolean;
  readTime?: string;
}

export interface CommentDto {
  id: number;
  postId: number;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface CreateCommentDto {
  authorName: string;
  authorEmail: string;
  body: string;
}

export interface LikesResponseDto {
  count: number;
  liked: boolean;
}

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
}
