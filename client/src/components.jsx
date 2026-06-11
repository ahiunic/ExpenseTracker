import { Menu, X, LayoutDashboard, ReceiptText, HardHat, Users, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './auth';

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const links = [
    ['/', 'Dashboard', LayoutDashboard, ['admin','accounts','supervisor']],
    ['/suppliers', 'Supplier Payments', ReceiptText, ['admin','accounts']],
    ['/expenses', 'Site Expenses', HardHat, ['admin','accounts','supervisor']],
    ['/users', 'Users', Users, ['admin']]
  ];
  return <div className="min-h-screen lg:flex">
    {open && <button className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" onClick={() => setOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-950 p-5 text-white transition-transform lg:static ${open ? '' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="mb-9 flex items-center justify-between">
        <div><p className="text-lg font-black tracking-tight">CHOUDHARY</p><p className="text-xs font-semibold uppercase tracking-[.22em] text-brand-500">Construction</p></div>
        <button className="lg:hidden" onClick={() => setOpen(false)}><X /></button>
      </div>
      <nav className="space-y-1">
        {links.filter(x => x[3].includes(user.role)).map(([to,label,Icon]) =>
          <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({isActive}) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive ? 'bg-brand-500 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}><Icon size={19}/>{label}</NavLink>
        )}
      </nav>
      <div className="mt-auto border-t border-slate-800 pt-4">
        <p className="font-semibold">{user.name}</p><p className="mb-3 text-xs capitalize text-slate-400">{user.role}</p>
        <button onClick={logout} className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white"><LogOut size={16}/> Sign out</button>
      </div>
    </aside>
    <main className="min-w-0 flex-1">
      <header className="flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:px-8">
        <button className="mr-3 lg:hidden" onClick={() => setOpen(true)}><Menu /></button>
        <p className="text-sm text-slate-500">Expense & GST Management</p>
      </header>
      <div className="p-4 lg:p-8">{children}</div>
    </main>
  </div>;
}

export const Badge = ({ children }) => {
  const tone = children === 'Approved' || children === 'GST Uploaded' ? 'bg-emerald-50 text-emerald-700' : children === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700';
  return <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>{children}</span>;
};
export const PageTitle = ({ title, subtitle, action }) => <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-black text-slate-900">{title}</h1><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>{action}</div>;
export const Empty = () => <div className="p-10 text-center text-sm text-slate-500">No records found.</div>;
export const Pagination = ({ info, setPage }) => info && <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500"><span>Page {info.page} of {info.pages || 1} · {info.total} records</span><div className="flex gap-1"><button className="btn-secondary !p-2" disabled={info.page <= 1} onClick={() => setPage(info.page - 1)}><ChevronLeft size={16}/></button><button className="btn-secondary !p-2" disabled={info.page >= info.pages} onClick={() => setPage(info.page + 1)}><ChevronRight size={16}/></button></div></div>;
export const Modal = ({ title, onClose, children }) => <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/60 p-4"><div className="card my-4 w-full max-w-2xl"><div className="flex items-center justify-between border-b p-5"><h2 className="text-lg font-black">{title}</h2><button onClick={onClose}><X size={20}/></button></div>{children}</div></div>;
export const Alert = ({ message }) => message && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{message}</div>;

