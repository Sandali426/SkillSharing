export interface User {
    id: string;
    username: string;
    email: string;
    followers: string[];
    following: string[];
  }
  
  export interface Post {
    id: string;
    userId: string;
    content: string;
    media: string[];
    likes: string[];
    comments: string[];
  }
  
  export interface ProgressUpdate {
    id: string;
    userId: string;
    template: string;
    content: string;
  }
  
  export interface LearningPlan {
    id: string;
    userId: string;
    title: string;
    topics: string[];
    timeline: string;
  }
  
  export interface Comment {
    id: string;
    postId: string;
    userId: string;
    content: string;
  }
  
  export interface Notification {
    id: string;
    userId: string;
    message: string;
  }