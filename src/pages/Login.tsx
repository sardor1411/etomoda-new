import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (profile?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (authData.user) {
      // Check role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();
        
      if (profile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto pt-32 pb-24 px-4">
      <Link to="/" className="inline-flex items-center text-[13px] font-semibold uppercase tracking-widest text-[#86868B] hover:text-[#1D1D1F] mb-12 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Do'konga qaytish
      </Link>
      
      <h1 className="text-4xl font-semibold tracking-tight mb-8 text-[#1D1D1F]">Kirish</h1>
      
      {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-6">
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
          {loading ? 'Jarayonda...' : 'Kirish'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[#86868B]">
        Hisobingiz yo'qmi? <Link to="/register" className="text-[#1D1D1F] underline underline-offset-4">Ro'yxatdan o'tish</Link>
      </p>
    </div>
  );
}
