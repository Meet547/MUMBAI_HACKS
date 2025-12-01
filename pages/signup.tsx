import { API_URL } from '../lib/api-config';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting signup with:', { email, name, company, password: '***' });
    
    fetch('${API_URL}/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, company })
    })
      .then(async (r) => {
        console.log('Response status:', r.status);
        const data = await r.json();
        console.log('Response data:', data);
        return data;
      })
      .then((data) => {
        if (data.success) {
          alert('Account created — you can now log in')
          router.push('/login')
        } else {
          console.error('Signup failed:', data);
          alert(data.error || 'Signup failed')
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
        <h2 className="text-2xl font-bold mb-4">Create account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} type="text" className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company (Optional)</label>
            <input value={company} onChange={e => setCompany(e.target.value)} type="text" className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Create account</button>
          </div>
        </form>
      </div>
    </div>
  );
}
