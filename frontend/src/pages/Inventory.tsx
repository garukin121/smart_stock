import React, { useEffect, useState } from 'react';
import api from '../api';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';

interface Product {
    id: string; // Ensure ID is present for edit/delete
    kode_sku: string;
    name: string;
    price: number;
    unit: string;
    current_qty: number;
    min_qty: number;
    status: string;
}

const Inventory = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [formData, setFormData] = useState({
        kode_sku: '',
        name: '',
        price: '',
        unit: '',
        min_stock_alert: '',
        initial_stock: ''
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            // NOTE: Our previous inventory API didn't return ID or price/unit. Let's fetch from /products and join /inventory conceptually, or just use /products. 
            // For MVP, if /inventory lacks it, we'll fetch /products to get full data.
            const res = await api.get(`/products`);
            // Since /products returns the inventory nested in the model
            const formatted = res.data.data.map((p: any) => ({
                id: p.id,
                kode_sku: p.kode_sku,
                name: p.name,
                price: p.price,
                unit: p.unit,
                current_qty: p.inventory ? p.inventory.current_qty : 0,
                min_qty: p.min_stock_alert,
                status: (p.inventory && p.inventory.current_qty > p.min_stock_alert) ? 'Aman' : 'Warning Kosong'
            }));
            setProducts(formatted);
        } catch (e) {
            console.error("Failed to fetch products for inventory", e);
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/products', {
                ...formData,
                price: parseFloat(formData.price),
                min_stock_alert: parseFloat(formData.min_stock_alert),
                initial_stock: parseFloat(formData.initial_stock),
            });
            setShowAddModal(false);
            fetchInventory();
            resetForm();
        } catch (e: any) {
            alert(e.response?.data?.detail || "Gagal membuat produk");
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;
        try {
            await api.put(`/products/${selectedProduct.id}`, {
                ...formData,
                price: parseFloat(formData.price),
                min_stock_alert: parseFloat(formData.min_stock_alert),
                initial_stock: parseFloat(formData.initial_stock),
            });
            setShowEditModal(false);
            fetchInventory();
            resetForm();
        } catch (e: any) {
            alert(e.response?.data?.detail || "Gagal mengupdate produk");
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProduct) return;
        try {
            await api.delete(`/products/${selectedProduct.id}`);
            setShowDeleteModal(false);
            fetchInventory();
        } catch (e: any) {
            alert(e.response?.data?.detail || "Gagal menghapus produk");
        }
    }

    const openEditModal = (p: Product) => {
        setSelectedProduct(p);
        setFormData({
            kode_sku: p.kode_sku,
            name: p.name,
            price: p.price.toString(),
            unit: p.unit,
            min_stock_alert: p.min_qty.toString(),
            initial_stock: p.current_qty.toString()
        });
        setShowEditModal(true);
    }

    const openDeleteModal = (p: Product) => {
        setSelectedProduct(p);
        setShowDeleteModal(true);
    }

    const resetForm = () => {
        setFormData({ kode_sku: '', name: '', price: '', unit: '', min_stock_alert: '', initial_stock: '' });
        setSelectedProduct(null);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">Monitoring Stok Layar</h1>
                <button onClick={() => { resetForm(); setShowAddModal(true) }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm">
                    <Plus className="w-5 h-5" />
                    Tambah Produk
                </button>
            </div>

            {/* Add / Edit Modal */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative mt-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            {showEditModal ? 'Edit Produk' : 'Tambah Produk Baru'}
                        </h2>
                        <form onSubmit={showEditModal ? handleEditSubmit : handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kode SKU</label>
                                <input type="text" required value={formData.kode_sku} onChange={e => setFormData({ ...formData, kode_sku: e.target.value })} className="block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Harga (Rp)</label>
                                    <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Satuan</label>
                                    <input type="text" placeholder="Ikat, Kg..." required value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Batas Aman</label>
                                    <input type="number" required value={formData.min_stock_alert} onChange={e => setFormData({ ...formData, min_stock_alert: e.target.value })} className="block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Stok (Saat ini)</label>
                                    <input type="number" required value={formData.initial_stock} onChange={e => setFormData({ ...formData, initial_stock: e.target.value })} className="block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" />
                                </div>
                            </div>
                            <div className="pt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="px-5 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors">Batal</button>
                                <button type="submit" className="px-5 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium shadow-sm transition-colors">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Hapus Produk?</h2>
                            <p className="text-slate-500 mb-6">Anda yakin ingin menghapus <strong>{selectedProduct?.name}</strong> secara permanen? Data riwayat mungkin akan terdampak.</p>

                            <div className="flex gap-3 w-full">
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors">Batal</button>
                                <button onClick={handleDeleteConfirm} className="flex-1 py-2.5 text-white bg-rose-600 hover:bg-rose-700 rounded-lg font-medium shadow-sm transition-colors">Ya, Hapus</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                            <th className="p-4 font-semibold text-sm uppercase tracking-wider">Kode SKU</th>
                            <th className="p-4 font-semibold text-sm uppercase tracking-wider">Nama Produk</th>
                            <th className="p-4 font-semibold text-sm uppercase tracking-wider">Sisa Stok</th>
                            <th className="p-4 font-semibold text-sm uppercase tracking-wider">Batas Aman</th>
                            <th className="p-4 font-semibold text-sm uppercase tracking-wider">Status</th>
                            <th className="p-4 font-semibold text-sm uppercase tracking-wider text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-slate-500">Belum ada barang terdaftar</td></tr>
                        ) : products.map((p, idx) => (
                            <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 text-slate-600 font-medium">{p.kode_sku}</td>
                                <td className="p-4 font-semibold text-slate-800">{p.name}</td>
                                <td className="p-4 text-slate-700">{p.current_qty} <span className="text-slate-400 text-sm font-normal">{p.unit}</span></td>
                                <td className="p-4 text-slate-400">{p.min_qty}</td>
                                <td className="p-4">
                                    {p.status === 'Aman' ? (
                                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">Aman</span>
                                    ) : (
                                        <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">Kritis</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openEditModal(p)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => openDeleteModal(p)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
