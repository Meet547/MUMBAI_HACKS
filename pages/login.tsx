import { API_URL } from './api-config';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting login with:', { email, password: '***' });
    
    fetch('${API_URL}/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(async (r) => {
        console.log('Response status:', r.status);
        const data = await r.json();
        console.log('Response data:', data);
        return data;
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem('auth_token', data.token)
          localStorage.setItem('user_email', email)
          router.push('/')
        } else {
          console.error('Login failed:', data);
          alert(data.error || 'Login failed')
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        alert('Network error - is the backend running on port 3000?')
      })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Log in</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Log in</button>
          </div>
        </form>
      </div>
    </div>
  );
}
