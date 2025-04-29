import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getNotifications } from '../api/api';
import { Notification } from '../types/types';

function Notifications() {
  const { userId } = useParams<{ userId: string }>();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userId) {
        const response = await getNotifications(userId);
        setNotifications(response.data);
      }
    };
    fetchNotifications();
  }, [userId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.map((notification) => (
        <div key={notification.id} className="border p-4 mb-2">
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
}

export default Notifications;