import React, { useState } from 'react';

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // If login is successful, call the onLogin function
        onLogin();
      } else {
        // If login fails, display error message
        setMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md mt-8">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {message && <div className="text-red-500 mb-4">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" className="mt-1 p-2 w-full border border-gray-300 rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" name="password" className="mt-1 p-2 w-full border border-gray-300 rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Login</button>
          <p className="mt-4 text-sm">Don't have an account? <a href="#register" className="text-blue-500 hover:underline" onClick={onRegister}>Register here</a></p>
        </form>
      </div>
    </div>
  );
}

export default Login;
