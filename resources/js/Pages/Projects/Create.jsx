import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const formatRupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

export default function ProjectCreate({ leads, products }) {
    const { data, setData, post, processing, errors } = useForm({
        lead_id: '',
        items: [{ product_id: '', negotiated_price: '' }],
    });

    const addItem = () => {
        setData('items', [...data.items, { product_id: '', negotiated_price: '' }]);
    };

    const removeItem = (index) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const items = [...data.items];
        items[index] = { ...items[index], [field]: value };
        // Auto-fill with selling price when product selected
        if (field === 'product_id') {
            const product = products.find(p => p.id == value);
            if (product) items[index].negotiated_price = product.selling_price;
        }
        setData('items', items);
    };

    const getProduct = (id) => products.find(p => p.id == id);

    const isBelowMargin = (item) => {
        const product = getProduct(item.product_id);
        return product && item.negotiated_price && Number(item.negotiated_price) < product.selling_price;
    };

    const hasAnyBelowMargin = data.items.some(isBelowMargin);

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.store'));
    };

    return (
        <AuthenticatedLayout header="Deal Pipeline / Buat Project">
            <Head title="Buat Project" />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Buat Project Baru</h1>
                    <p className="page-subtitle">Konversi lead menjadi deal dengan pemilihan produk</p>
                </div>
                <Link href={route('projects.index')} className="btn-outline">← Kembali</Link>
            </div>

            {hasAnyBelowMargin && (
                <div className="alert-warning fade-in mb-4">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <strong>Harga di bawah harga jual!</strong> Project ini akan berstatus <strong>Waiting Approval</strong> dan memerlukan persetujuan Manager.
                    </div>
                </div>
            )}

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Left: Lead selection */}
                    <div className="lg:col-span-1">
                        <div className="card fade-in">
                            <div className="card-header">
                                <h2 className="card-title">Pilih Lead</h2>
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <label className="form-label">Lead <span className="text-red-500">*</span></label>
                                    <select className={`form-select ${errors.lead_id ? 'error' : ''}`}
                                        value={data.lead_id} onChange={e => setData('lead_id', e.target.value)}>
                                        <option value="">-- Pilih Lead --</option>
                                        {leads.map(lead => (
                                            <option key={lead.id} value={lead.id}>
                                                {lead.name} ({lead.contact})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.lead_id && <div className="form-error">{errors.lead_id}</div>}
                                </div>

                                {data.lead_id && (() => {
                                    const lead = leads.find(l => l.id == data.lead_id);
                                    return lead ? (
                                        <div className="mt-3 p-3 bg-slate-50 rounded-lg text-sm space-y-1.5">
                                            <div className="flex gap-2">
                                                <span className="text-slate-400 w-16 flex-shrink-0">Kontak</span>
                                                <span className="text-slate-700 font-medium">{lead.contact}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-slate-400 w-16 flex-shrink-0">Alamat</span>
                                                <span className="text-slate-700">{lead.address}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-slate-400 w-16 flex-shrink-0">Kebutuhan</span>
                                                <span className="text-slate-700">{lead.needs}</span>
                                            </div>
                                        </div>
                                    ) : null;
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Right: Product items */}
                    <div className="lg:col-span-2">
                        <div className="card fade-in">
                            <div className="card-header">
                                <h2 className="card-title">Produk & Harga Negosiasi</h2>
                                <button type="button" onClick={addItem} className="btn-sm btn-accent">
                                    + Tambah Produk
                                </button>
                            </div>
                            <div className="card-body space-y-4">
                                {data.items.map((item, i) => {
                                    const product = getProduct(item.product_id);
                                    const belowMargin = isBelowMargin(item);

                                    return (
                                        <div key={i} className={`p-4 rounded-xl border transition-all ${
                                            belowMargin ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-slate-50'
                                        }`}>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-slate-600">Produk #{i + 1}</span>
                                                {data.items.length > 1 && (
                                                    <button type="button" onClick={() => removeItem(i)}
                                                        className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="form-group mb-0">
                                                    <label className="form-label">Produk <span className="text-red-500">*</span></label>
                                                    <select className={`form-select ${errors[`items.${i}.product_id`] ? 'error' : ''}`}
                                                        value={item.product_id}
                                                        onChange={e => updateItem(i, 'product_id', e.target.value)}>
                                                        <option value="">-- Pilih Produk --</option>
                                                        {products.map(p => (
                                                            <option key={p.id} value={p.id}>{p.name}</option>
                                                        ))}
                                                    </select>
                                                    {product && (
                                                        <div className="text-xs text-slate-500 mt-1">
                                                            Harga jual: <strong className="text-emerald-600">{formatRupiah(product.selling_price)}</strong>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="form-group mb-0">
                                                    <label className="form-label">
                                                        Harga Negosiasi
                                                        {belowMargin && (
                                                            <span className="ml-2 text-amber-600 text-xs font-normal">
                                                                ⚠ Di bawah harga jual
                                                            </span>
                                                        )}
                                                    </label>
                                                    <input type="number" className={`form-input ${belowMargin ? 'border-amber-400' : ''}`}
                                                        value={item.negotiated_price}
                                                        onChange={e => updateItem(i, 'negotiated_price', e.target.value)}
                                                        placeholder="0" min="0" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Total */}
                                <div className="flex justify-end pt-2">
                                    <div className="bg-slate-800 text-white px-5 py-3 rounded-xl">
                                        <div className="text-xs text-slate-400 mb-1">Total Nilai Deal</div>
                                        <div className="text-xl font-bold">
                                            {formatRupiah(data.items.reduce((sum, it) => sum + (Number(it.negotiated_price) || 0), 0))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 border-t border-slate-200 pt-4">
                                    <button type="submit" disabled={processing} className="btn-primary">
                                        {processing ? 'Menyimpan...' : hasAnyBelowMargin ? '⏳ Ajukan (Butuh Approval)' : '✓ Simpan Project'}
                                    </button>
                                    <Link href={route('projects.index')} className="btn-outline">Batal</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
