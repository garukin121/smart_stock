import { useEffect, useState } from 'react';
import api from '../api';
import { BarChart2 } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell
} from 'recharts';

interface TopProduct {
    id: string;
    name: string;
    kode_sku: string;
    total_revenue: number;
    total_qty: number;
}

interface HourlySale {
    hour: string;
    total_qty: number;
    total_revenue: number;
}

interface ProductOption {
    id: string;
    name: string;
    kode_sku: string;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const Analytics = () => {
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [hourlySales, setHourlySales] = useState<HourlySale[]>([]);
    const [products, setProducts] = useState<ProductOption[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [loading, setLoading] = useState(true);

    // Fetch daftar produk untuk dropdown filter
    useEffect(() => {
        api.get('/products').then(res => {
            setProducts(res.data.data.map((p: any) => ({ id: p.id, name: p.name, kode_sku: p.kode_sku })));
        }).catch(err => console.error(err));
    }, []);

    // Fetch analytics data saat filter berubah
    useEffect(() => {
        setLoading(true);
        const params = selectedProduct ? `?product_id=${selectedProduct}` : '';
        Promise.all([
            api.get(`/analytics/top-products${params}`),
            api.get(`/analytics/hourly-sales${params}`),
        ]).then(([topRes, hourlyRes]) => {
            setTopProducts(topRes.data.data);
            setHourlySales(hourlyRes.data.data);
        }).catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [selectedProduct]);

    const maxRevenue = Math.max(...topProducts.map(p => p.total_revenue), 1);

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <BarChart2 className="w-8 h-8 text-indigo-500" />
                    <h1 className="text-3xl font-bold text-slate-900">Sales Analytics</h1>
                </div>
                {/* Filter per produk */}
                <select
                    value={selectedProduct}
                    onChange={e => setSelectedProduct(e.target.value)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
                >
                    <option value="">Semua Produk</option>
                    {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.kode_sku})</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-20">Memuat data...</div>
            ) : (
                <>
                    {/* Top 5 Best Sellers */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">
                            🏆 {selectedProduct ? 'Statistik Produk Terpilih' : 'Top 5 Produk Terlaris'}
                        </h2>
                        {topProducts.length === 0 ? (
                            <p className="text-slate-400 text-center py-10">Belum ada data transaksi untuk produk ini.</p>
                        ) : (
                            <div className="space-y-4">
                                {topProducts.map((p, idx) => (
                                    <div key={p.kode_sku} className="flex items-center gap-4">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                        >
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <span className="font-semibold text-slate-800">{p.name}</span>
                                                <span className="text-sm text-slate-500">
                                                    Rp {p.total_revenue.toLocaleString('id-ID')} &bull; {p.total_qty} terjual
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full transition-all"
                                                    style={{
                                                        width: `${(p.total_revenue / maxRevenue) * 100}%`,
                                                        backgroundColor: COLORS[idx % COLORS.length]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Hourly Sales Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">
                            ⏰ Distribusi Transaksi per Jam {selectedProduct ? '(Produk Terpilih)' : '(Semua Produk)'}
                        </h2>
                        {hourlySales.every(h => h.total_qty === 0) ? (
                            <p className="text-slate-400 text-center py-10">Belum ada data transaksi.</p>
                        ) : (
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={hourlySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={8} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                        <Tooltip
                                            cursor={{ fill: '#f1f5f9' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: any, name: any) => [
                                                name === 'total_qty' ? `${value} unit` : `Rp ${Number(value).toLocaleString('id-ID')}`,
                                                name === 'total_qty' ? 'Qty Terjual' : 'Pendapatan'
                                            ]}
                                        />
                                        <Bar dataKey="total_qty" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32}>
                                            {hourlySales.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill="#6366f1" fillOpacity={entry.total_qty > 0 ? 1 : 0.3} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Analytics;
