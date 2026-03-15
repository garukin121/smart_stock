import { useEffect, useState } from 'react';
import api from '../api';
import { ClipboardList } from 'lucide-react';

interface Transaction {
    id: string;
    created_at: string;
    product_name: string;
    kode_sku: string;
    quantity: number;
    unit: string;
    subtotal: number;
}

const Transactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/transactions')
            .then(res => setTransactions(res.data.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <ClipboardList className="w-8 h-8 text-indigo-500" />
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Riwayat Transaksi</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Audit trail seluruh penjualan yang tercatat</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Memuat data...</div>
                ) : transactions.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">Belum ada riwayat transaksi.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                                    <th className="p-4 font-semibold text-sm uppercase tracking-wider">Waktu</th>
                                    <th className="p-4 font-semibold text-sm uppercase tracking-wider">SKU</th>
                                    <th className="p-4 font-semibold text-sm uppercase tracking-wider">Nama Produk</th>
                                    <th className="p-4 font-semibold text-sm uppercase tracking-wider text-right">Qty Terjual</th>
                                    <th className="p-4 font-semibold text-sm uppercase tracking-wider text-right">Subtotal</th>
                                    <th className="p-4 font-semibold text-sm uppercase tracking-wider text-center">Sumber</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t) => (
                                    <tr key={t.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                                        <td className="p-4 text-slate-500 font-mono text-sm whitespace-nowrap">{t.created_at}</td>
                                        <td className="p-4 text-indigo-600 font-semibold text-sm">{t.kode_sku}</td>
                                        <td className="p-4 text-slate-800 font-medium">{t.product_name}</td>
                                        <td className="p-4 text-right text-slate-700">
                                            <span className="font-bold">{t.quantity}</span>
                                            <span className="text-slate-400 text-sm ml-1">{t.unit}</span>
                                        </td>
                                        <td className="p-4 text-right font-bold text-emerald-600">
                                            Rp {t.subtotal.toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full text-xs font-semibold">Bot / Seed</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {transactions.length > 0 && (
                    <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/40 text-sm text-slate-400 text-right">
                        Menampilkan {transactions.length} transaksi terbaru
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
