import { useEffect, useState } from 'react';
import api from '../api';
import { Coins, PackageOpen, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Period = '7days' | 'weekly' | '30days';

const PERIOD_LABELS: Record<Period, string> = {
    '7days': 'Harian (7 Hr)',
    'weekly': 'Mingguan (4 Mg)',
    '30days': 'Bulanan (30 Hr)',
};

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_revenue_today: 0,
        total_items_sold: 0,
        out_of_stock_alerts_count: 0,
        transaction_count: 0,
        chart_data: [] as { name: string; revenue: number }[]
    });
    const [period, setPeriod] = useState<Period>('7days');

    const fetchStats = (p: Period) => {
        api.get(`/dashboard/overview?period=${p}`).then(res => {
            setStats(res.data);
        }).catch(err => console.error(err));
    };

    useEffect(() => {
        fetchStats(period);
    }, [period]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center gap-4 text-indigo-600 mb-4">
                        <div className="p-3 bg-indigo-50 rounded-xl">
                            <Coins className="w-6 h-6 outline-none" />
                        </div>
                        <h3 className="font-semibold text-slate-500">Pendapatan Hari Ini</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">Rp {stats.total_revenue_today.toLocaleString('id-ID')}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center gap-4 text-emerald-600 mb-4">
                        <div className="p-3 bg-emerald-50 rounded-xl">
                            <PackageOpen className="w-6 h-6 outline-none" />
                        </div>
                        <h3 className="font-semibold text-slate-500">Item Terjual</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{stats.total_items_sold}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center gap-4 text-rose-600 mb-4">
                        <div className="p-3 bg-rose-50 rounded-xl">
                            <AlertTriangle className="w-6 h-6 outline-none" />
                        </div>
                        <h3 className="font-semibold text-slate-500">Stok Kritis</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{stats.out_of_stock_alerts_count}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center gap-4 text-amber-600 mb-4">
                        <div className="p-3 bg-amber-50 rounded-xl">
                            <TrendingUp className="w-6 h-6 outline-none" />
                        </div>
                        <h3 className="font-semibold text-slate-500">Total Transaksi</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{stats.transaction_count}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Tren Pendapatan</h2>
                    <div className="flex gap-2">
                        {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === p
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                {PERIOD_LABELS[p]}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.chart_data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `Rp${value >= 1000 ? value / 1000 + 'k' : value}`} />
                            <Tooltip
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#1e293b', fontWeight: 'bold' }}
                                formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                                labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                            />
                            <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;


