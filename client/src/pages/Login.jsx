import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';
import { useAuth } from '../auth';
import { Alert } from '../components';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth(); const navigate = useNavigate();
  const submit = async e => { e.preventDefault(); setBusy(true); setError(''); try { await login(form); navigate('/'); } catch (e) { setError(e.response?.data?.message || 'Login failed'); } finally { setBusy(false); } };
  return <div className="grid min-h-screen bg-slate-950 lg:grid-cols-2">
    <div className="hidden flex-col justify-between bg-[radial-gradient(circle_at_top_left,_#334155,_#020617_60%)] p-14 text-white lg:flex"><Building2 size={42} className="text-brand-500"/><div><p className="mb-3 text-sm font-bold uppercase tracking-[.3em] text-brand-500">Choudhary Construction</p><h1 className="max-w-xl text-5xl font-black leading-tight">Every invoice.<br/>Every site.<br/>Clearly accounted.</h1></div><p className="text-sm text-slate-500">Secure expense and GST operations</p></div>
    <div className="grid place-items-center p-5"><form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl sm:p-10"><h2 className="text-2xl font-black">Welcome back</h2><p className="mb-7 mt-2 text-sm text-slate-500">Sign in to manage construction finances.</p><Alert message={error}/><label className="label">Email</label><input className="field mb-4" type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><label className="label">Password</label><input className="field mb-6" type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button disabled={busy} className="btn-primary w-full">{busy ? 'Signing in...' : 'Sign in'} <ArrowRight size={17}/></button></form></div>
  </div>;
}

