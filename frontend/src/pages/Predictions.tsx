import { useEffect, useState } from 'react';
import api from '../api';
import { Sparkles } from 'lucide-react';

interface Prediction {
    date: string;
    product_name: string;
    predicted_demand_fuzzy: number;
    actual_sold_on_date: number;
    error_margin_percentage: string;
}

const Predictions = () => {
    const [predictions, setPredictions] = useState<Prediction[]>([]);

    useEffect(() => {
        fetchPredictions();
    }, []);

    const fetchPredictions = async () => {
        try {
            const res = await api.get(`/predictions/evaluasi`);
            setPredictions(res.data.data);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Sparkles className="w-8 h-8 text-indigo-500" />
                <h1 className="text-3xl font-bold text-slate-900">Laporan Tsukamoto</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-indigo-50 text-indigo-800 border-b border-indigo-100">
                            <th className="p-4 font-semibold text-sm uppercase">Tanggal Target</th>
                            <th className="p-4 font-semibold text-sm uppercase">Produk</th>
                            <th className="p-4 font-semibold text-sm uppercase">Prediksi Tsukamoto</th>
                            <th className="p-4 font-semibold text-sm uppercase">Aktual Terjual</th>
                            <th className="p-4 font-semibold text-sm uppercase">Error (MAPE)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {predictions.length === 0 ? (
                            <tr><td colSpan={5} className="p-6 text-center text-slate-500">Belum ada riwayat prediksi scheduler</td></tr>
                        ) : predictions.map((p, idx) => (
                            <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                                <td className="p-4 text-slate-600 font-medium">{p.date}</td>
                                <td className="p-4 font-bold text-slate-800">{p.product_name}</td>
                                <td className="p-4 text-indigo-600 font-bold">{p.predicted_demand_fuzzy.toFixed(0)}</td>
                                <td className="p-4 text-emerald-600 font-bold">{p.actual_sold_on_date}</td>
                                <td className="p-4 text-rose-500">{p.error_margin_percentage}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Predictions;
