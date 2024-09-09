export interface Comment {
  id: string;
  postId: string; // To link the comment with a post
  username: string;
  date: Date;
  content: string;
  images: { url: string; type: string }[]; // Array for image URLs and types
  videos: { url: string; type: string }[]; // Array for video URLs and types
  documents: { url: string; type: string; name: string }[]; // Array for document URLs, types, and names
  likesCount: number;
  likedBy: string[];
  isHidden: boolean;
  replies: Comment[]; // For nested comments
}

export interface Post {
  id: string;
  username: string;
  date: Date;
  content: string;
  images: { url: string; type: string }[];
  videos: { url: string; type: string }[];
  documents: { url: string; type: string; name: string }[];
  likesCount: number;
  commentsCount: number;
  likedBy: string[];
  role: string[]; // Changed to an array of roles
  comments: Comment[];
}
export interface Reply {
    id: string;
    postId: string;
    commentId: string;
    username: string;
    date: string;
    content: string;
    images: string[];
    videos: string[];
    documents: string[];
    isHidden: boolean;
    likesCount: number;
    likedBy: string[];
    replies: Reply[]; // Nested replies if needed
}
