import React, { useState } from 'react';

function Register({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setRegistered(true);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    window.location.href = '/login';
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md mt-8">
        <h2 className="text-xl font-bold mb-4">User Registration</h2>
        {message && <div className={registered ? "alert alert-success mb-4" : "alert alert-danger mb-4"}>{message}</div>}
        {!registered && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
              <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded-md" id="name" name="name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
              <input type="email" className="mt-1 p-2 w-full border border-gray-300 rounded-md" id="email" name="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
              <input type="password" className="mt-1 p-2 w-full border border-gray-300 rounded-md" id="password" name="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Register</button>
          </form>
        )}
        <p className="mt-4 text-sm">Already have an account? <a href="#login" className="text-blue-500 hover:underline" onClick={handleLoginClick}>Login here</a></p>
      </div>
    </div>
  );
}

export default Register;
