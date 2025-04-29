import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

export const createUser = (user: any) => api.post('/users', user);
export const getUsers = () => api.get('/users');
export const getUser = (id: string) => api.get(`/users/${id}`);
export const followUser = (id: string, followId: string) => api.post(`/users/${id}/follow/${followId}`);
export const unfollowUser = (id: string, followId: string) => api.post(`/users/${id}/unfollow/${followId}`);

export const createPost = (post: any) => api.post('/posts', post);
export const getPosts = () => api.get('/posts');
export const getPost = (id: string) => api.get(`/posts/${id}`);
export const updatePost = (id: string, post: any) => api.put(`/posts/${id}`, post);
export const deletePost = (id: string) => api.delete(`/posts/${id}`);

export const createProgressUpdate = (update: any) => api.post('/progress-updates', update);
export const getProgressUpdates = () => api.get('/progress-updates');
export const updateProgressUpdate = (id: string, update: any) => api.put(`/progress-updates/${id}`, update);
export const deleteProgressUpdate = (id: string) => api.delete(`/progress-updates/${id}`);

export const createLearningPlan = (plan: any) => api.post('/learning-plans', plan);
export const getLearningPlans = () => api.get('/learning-plans');
export const updateLearningPlan = (id: string, plan: any) => api.put(`/learning-plans/${id}`, plan);
export const deleteLearningPlan = (id: string) => api.delete(`/learning-plans/${id}`);

export const createComment = (comment: any) => api.post('/comments', comment);
export const deleteComment = (id: string, userId: string) => api.delete(`/comments/${id}/${userId}`);
export const updateComment = (id: string, comment: any) => api.put(`/comments/${id}`, comment);

export const likePost = (postId: string, userId: string) => api.post(`/interactions/like/${postId}/${userId}`);
export const unlikePost = (postId: string, userId: string) => api.post(`/interactions/unlike/${postId}/${userId}`);

export const getNotifications = (userId: string) => api.get(`/notifications/${userId}`);