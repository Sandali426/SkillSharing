import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const getPosts = () => axios.get(`${BASE_URL}/posts`);
export const createPost = (post) => axios.post(`${BASE_URL}/posts`, post);
export const deletePost = (id) => axios.delete(`${BASE_URL}/posts/${id}`);
