import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUser, followUser, unfollowUser } from '../api/api';
import { User } from '../types/types';

function Profile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const currentUserId = localStorage.getItem('userId') || 'user1';

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        const response = await getUser(id);
        setUser(response.data);
      }
    };
    fetchUser();
  }, [id]);

  const handleFollow = async () => {
    if (id) {
      await followUser(currentUserId, id);
      const response = await getUser(id);
      setUser(response.data);
    }
  };

  const handleUnfollow = async () => {
    if (id) {
      await unfollowUser(currentUserId, id);
      const response = await getUser(id);
      setUser(response.data);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{user.username}'s Profile</h1>
      <p>Email: {user.email}</p>
      <p>Followers: {user.followers.length}</p>
      <p>Following: {user.following.length}</p>
      {currentUserId !== id && (
        <>
          <button onClick={handleFollow} className="bg-blue-500 text-white p-2 rounded mr-2">Follow</button>
          <button onClick={handleUnfollow} className="bg-red-500 text-white p-2 rounded">Unfollow</button>
        </>
      )}
    </div>
  );
}

export default Profile;