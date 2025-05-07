import React from 'react';

const PostItem = ({ post, onDelete }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p>{post.text}</p>
            <button onClick={() => onDelete(post.id)}>Delete</button>
        </div>
    );
};

export default PostItem;
