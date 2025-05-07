import React, { useState } from 'react';
import axios from 'axios';

const PostForm = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        const uploadRes = await axios.post('http://localhost:8080/api/upload', formData);
        const mediaUrls = uploadRes.data;

        const newPost = { title, content, mediaUrls };
        onAdd(newPost);
        setTitle('');
        setContent('');
        setFiles([]);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                width: '100%',  // Full width
                margin: '40px auto',
                padding: '25px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
                fontFamily: 'Segoe UI, sans-serif',
                border: '2px solid #ddd',  // Adding border
            }}
        >
            <h3
                style={{
                    marginBottom: '20px',
                    fontWeight: '500',
                    fontSize: '20px',
                    color: '#333',
                }}
            >
                Create Post
            </h3>

            <input
                type="text"
                placeholder="Post title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                style={{
                    width: '100%',
                    padding: '5px',
                    marginBottom: '12px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '15px',
                    fontFamily: 'Segoe UI, sans-serif',
                    backgroundColor: '#fff',
                }}
            />

            <textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={e => setContent(e.target.value)}
                required
                rows={4}
                style={{
                    width: '100%',
                    padding: '5px',
                    marginBottom: '12px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '15px',
                    fontFamily: 'Segoe UI, sans-serif',
                    backgroundColor: '#fff',
                    resize: 'vertical',
                }}
            />

            <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={e => setFiles([...e.target.files])}
                style={{
                    marginBottom: '20px',
                    fontFamily: 'Segoe UI, sans-serif',
                }}
            />

            <button
                type="submit"
                style={{
                    padding: '10px 40px',
                    fontSize: '14px',
                    borderRadius: '35px',
                    border: 'none',
                    backgroundColor: '#00c4ff',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    float: 'right',
                }}
                onMouseOver={e => (e.target.style.backgroundColor = '#213e88')}
                onMouseOut={e => (e.target.style.backgroundColor = '#00c4ff')}
            >
                Post
            </button>
        </form>
    );
};

export default PostForm;
