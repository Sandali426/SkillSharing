import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getPosts,
  createPost,
  deletePost,
  updatePost,
  createComment,
  deleteComment,
  likePost,
  unlikePost,
} from '../api/api';
import { Post } from '../types/types';
import { uploadFile } from '../utils/fileUpload';

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ content: '', media: [''] });
  const [newComment, setNewComment] = useState('');
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [editPostForm, setEditPostForm] = useState({ content: '', media: [''] });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const userId = localStorage.getItem('userId') || 'user1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRes = await getPosts();
        setPosts(postsRes.data);
      } catch (error) {
        console.error('Fetch data error:', error);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(''); // Clear error on file selection
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditFile(e.target.files[0]);
    }
  };

  const handleCreatePost = async () => {
    // Validation: At least one field (content or file) must be filled
    if (!newPost.content.trim() && !selectedFile) {
      setError('Please provide content or select a media file');
      return;
    }

    try {
      let mediaUrl = newPost.media[0];
      if (selectedFile) {
        mediaUrl = await uploadFile(selectedFile);
      }
      await createPost({
        userId,
        content: newPost.content,
        media: [mediaUrl],
        likes: [],
        comments: [],
      });
      const postsRes = await getPosts();
      setPosts(postsRes.data);
      setNewPost({ content: '', media: [''] });
      setSelectedFile(null);
      setError(''); // Clear error on success
    } catch (error) {
      console.error('Create post error:', error);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error('Delete post error:', error);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditPostId(post.id);
    setEditPostForm({ content: post.content, media: post.media });
  };

  const handleUpdatePost = async () => {
    try {
      let mediaUrl = editPostForm.media[0];
      if (editFile) {
        mediaUrl = await uploadFile(editFile);
      }
      await updatePost(editPostId!, { content: editPostForm.content, media: [mediaUrl] });
      const postsRes = await getPosts();
      setPosts(postsRes.data);
      setEditPostId(null);
      setEditPostForm({ content: '', media: [''] });
      setEditFile(null);
    } catch (error) {
      console.error('Update post error:', error);
    }
  };

  const handleCreateComment = async (postId: string) => {
    try {
      await createComment({ postId, userId, content: newComment });
      const postsRes = await getPosts();
      setPosts(postsRes.data);
      setNewComment('');
    } catch (error) {
      console.error('Create comment error:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId, userId);
      const postsRes = await getPosts();
      setPosts(postsRes.data);
    } catch (error) {
      console.error('Delete comment error:', error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId, userId);
      const postsRes = await getPosts();
      setPosts(postsRes.data);
    } catch (error) {
      console.error('Like post error:', error);
    }
  };

  const handleUnlike = async (postId: string) => {
    try {
      await unlikePost(postId, userId);
      const postsRes = await getPosts();
      setPosts(postsRes.data);
    } catch (error) {
      console.error('Unlike post error:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Skill Sharing Platform</h1>
      <div className="nav-links">
        <Link to={`/profile/${userId}`}>Profile</Link>
        <Link to={`/notifications/${userId}`}>Notifications</Link>
        <Link to="/learning-plans">Learning Plans</Link>
        <Link to="/progress-updates">Progress Updates</Link>
      </div>

      {/* Create Post */}
      <div className="card">
        <h2 className="section-title">Create Post</h2>
        <input
          type="text"
          placeholder="What's on your mind?"
          value={newPost.content}
          onChange={(e) => {
            setNewPost({ ...newPost, content: e.target.value });
            setError(''); // Clear error on input change
          }}
          className="input"
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="input"
        />
        {selectedFile && <p className="meta">Selected: {selectedFile.name}</p>}
        <button onClick={handleCreatePost} className="button">
          Post
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      {/* Posts */}
      <h2 className="section-title">Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="card">
          {editPostId === post.id ? (
            <div>
              <input
                type="text"
                placeholder="Content"
                value={editPostForm.content}
                onChange={(e) => setEditPostForm({ ...editPostForm, content: e.target.value })}
                className="input"
              />
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleEditFileChange}
                className="input"
              />
              {editFile && <p className="meta">Selected: {editFile.name}</p>}
              <button onClick={handleUpdatePost} className="button button-green">
                Save
              </button>
              <button onClick={() => setEditPostId(null)} className="button button-gray">
                Cancel
              </button>
            </div>
          ) : (
            <>
              <p className="post-content">{post.content}</p>
              {post.media[0] && (
                <div className="media">
                  {post.media[0].endsWith('.mp4') ? (
                    <video controls src={post.media[0]} className="post-media" />
                  ) : (
                    <img src={post.media[0]} alt="Post media" className="post-media" />
                  )}
                </div>
              )}
              <p className="meta">Likes: {post.likes.length}</p>
              <div className="actions">
                <button onClick={() => handleLike(post.id)} className="action-link">
                  Like
                </button>
                {post.userId === userId && (
                  <>
                    <button onClick={() => handleUnlike(post.id)} className="action-link action-link-red">
                      Unlike
                    </button>
                    <button
                      onClick={() => handleEditPost(post)}
                      className="action-link action-link-yellow"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="action-link action-link-red"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
              <div className="comments">
                <h3 className="comment-title">Comments</h3>
                {post.comments.map((commentId) => (
                  <div key={commentId} className="comment">
                    <p className="meta">Comment ID: {commentId}</p>
                    {post.userId === userId && (
                      <button
                        onClick={() => handleDeleteComment(commentId)}
                        className="action-link action-link-red"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="input"
                />
                <button onClick={() => handleCreateComment(post.id)} className="button">
                  Comment
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Home;