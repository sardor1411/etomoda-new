import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft } from 'lucide-react';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      });
      const data = await response.json();
      
      if (!data.success) {
        setError(data.error);
      } else {
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Xatolik yuz berdi');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto pt-32 pb-24 px-4">
      <Link to="/" className="inline-flex items-center text-[13px] font-semibold uppercase tracking-widest text-[#86868B] hover:text-[#1D1D1F] mb-12 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Do'konga qaytish
      </Link>
      
      <h1 className="text-4xl font-semibold tracking-tight mb-8 text-[#1D1D1F]">Ro'yxatdan o'tish</h1>
      
      {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm">{error}</div>}

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-[12px] font-semibold uppercase tracking-widest text-[#86868B]">To'liq ism</Label>
          <Input 
            id="fullName" 
            type="text" 
            required 
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="bg-white border-black/10 rounded-xl h-12 focus:border-black" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[12px] font-semibold uppercase tracking-widest text-[#86868B]">Elektron pochta</Label>
          <Input 
            id="email" 
            type="email" 
            required 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-white border-black/10 rounded-xl h-12 focus:border-black" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[12px] font-semibold uppercase tracking-widest text-[#86868B]">Parol</Label>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="bg-white border-black/10 rounded-xl h-12 focus:border-black" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#1D1D1F] text-white py-5 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Jarayonda...' : 'Ro\'yxatdan o\'tish'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[#86868B]">
        Hisobingiz bormi? <Link to="/login" className="text-[#1D1D1F] underline underline-offset-4">Kirish</Link>
      </p>
    </div>
  );
}
