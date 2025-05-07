import React, { useState } from 'react';

const PostList = ({ posts, onDelete, onUpdate }) => {
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');

    const startEditing = (post) => {
        setEditingPostId(post.id);
        setEditedTitle(post.title);
        setEditedContent(post.content);
    };

    const cancelEditing = () => {
        setEditingPostId(null);
        setEditedTitle('');
        setEditedContent('');
    };

    const handleUpdate = async () => {
        try {
            // Validation
            if (!editedTitle.trim() || !editedContent.trim()) {
                alert('Title and content cannot be empty');
                return;
            }

            // Call onUpdate and wait for it to complete
            await onUpdate(editingPostId, {
                title: editedTitle.trim(),
                content: editedContent.trim()
            });

            // Only clear the form if update was successful
            cancelEditing();
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post. Please try again.');
        }
    };

    return (
        <div>
            {posts.map(post => (
                <div
                    key={post.id}
                    style={{
                        width: '105%',
                        marginLeft: '%',
                        border: '1px solid #ccc',
                        marginTop: '1rem',
                        marginBottom: '1rem',
                        padding: '1rem',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    }}

                >
                    {editingPostId === post.id ? (
                        <>
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={e => setEditedTitle(e.target.value)}
                                style={{ width: '100%', padding: '5px', marginBottom: '8px' }}
                            />
                            <textarea
                                value={editedContent}
                                onChange={e => setEditedContent(e.target.value)}
                                rows={3}
                                style={{ width: '100%', padding: '5px', marginBottom: '8px' }}
                            />
                            <div style={{ marginTop: '10px' }}>
                                <button
                                    onClick={handleUpdate}
                                    style={{
                                        padding: '6px 12px',
                                        fontSize: '10px',
                                        marginRight: '8px',
                                        backgroundColor: '#4caf50',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    onClick={cancelEditing}
                                    style={{
                                        padding: '6px 12px',
                                        fontSize: '10px',
                                        backgroundColor: '#9e9e9e',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '25px', color: '#333', margin: 0 }}>{post.title}</h3>
                                <div>
                                    <button
                                        onClick={() => startEditing(post)}
                                        title="Update"
                                        style={{
                                            padding: '6px 12px',
                                            fontSize: '14px',
                                            marginRight: '8px',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ✏️
                                    </button>

                                    <button
                                        onClick={() => onDelete(post.id)}
                                        title="Delete"
                                        style={{
                                            padding: '6px 12px',
                                            fontSize: '14px',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        🗑️
                                    </button>

                                </div>
                            </div>
                            <p>{post.content}</p>
                        </>
                    )}

                    {post.mediaUrls?.map((url, idx) => (
                        url.endsWith('.mp4') ? (
                            <video key={idx} controls style={{ width: '100%', borderRadius: '8px' }}>
                                <source src={`http://localhost:8080/uploads/${url}`} type="video/mp4" />
                            </video>
                        ) : (
                            <img
                                key={idx}
                                src={`http://localhost:8080/uploads/${url}`}
                                alt="Post media"
                                style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }}
                            />
                        )
                    ))}
                </div>
            ))}
        </div>
    );
};

export default PostList;