import { useEffect, useState } from 'react';
import { IndianRupee, FileWarning, HardHat, Clock3 } from 'lucide-react';
import { api, date, money } from '../api';
import { Badge, PageTitle } from '../components';

export default function Dashboard() {
  const [data, setData] = useState({ recent: [] });
  useEffect(() => { api.get('/dashboard').then(r => setData(r.data)); }, []);
  const cards = [['Total Supplier Payments', money(data.total_supplier_payments), IndianRupee, 'bg-blue-600'],['Pending GST Bills', data.pending_gst_bills || 0, FileWarning, 'bg-amber-500'],['Site Expenses', money(data.site_expenses), HardHat, 'bg-emerald-600'],['Pending Approvals', data.pending_approvals || 0, Clock3, 'bg-violet-600']];
  return <><PageTitle title="Dashboard" subtitle="A clear view of construction finance operations."/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label,value,Icon,color])=><div className="card p-5" key={label}><div className={`mb-5 grid h-11 w-11 place-items-center rounded-xl text-white ${color}`}><Icon size={20}/></div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-black text-slate-900">{value}</p></div>)}</div><div className="card mt-6 overflow-hidden"><div className="border-b p-5"><h2 className="font-black">Recent site expenses</h2></div>{data.recent.length ? <div className="divide-y">{data.recent.map(x=><div className="flex items-center justify-between gap-4 p-4" key={x.id}><div><p className="font-semibold">{x.name}</p><p className="text-xs text-slate-500">{date(x.created_at)}</p></div><div className="text-right"><p className="mb-1 font-bold">{money(x.amount)}</p><Badge>{x.status}</Badge></div></div>)}</div>:<p className="p-8 text-center text-sm text-slate-500">No activity yet.</p>}</div></>;
}

