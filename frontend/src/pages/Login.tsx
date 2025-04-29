import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api/api';

function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = { username, email, followers: [], following: [] };
      const response = await createUser(user);
      localStorage.setItem('userId', response.data.id);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">
        Login
      </button>
    </div>
  );
}

export default Login;