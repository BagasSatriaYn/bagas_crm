import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const formatRupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

export default function ProductCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        base_price: '',
        margin_percentage: '',
    });

    const sellingPrice = data.base_price && data.margin_percentage
        ? Math.round(Number(data.base_price) + (Number(data.base_price) * Number(data.margin_percentage) / 100))
        : 0;

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AuthenticatedLayout header="Produk / Tambah">
            <Head title="Tambah Produk" />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Tambah Produk</h1>
                    <p className="page-subtitle">Daftarkan paket layanan internet baru</p>
                </div>
                <Link href={route('products.index')} className="btn-outline">← Kembali</Link>
            </div>

            <div className="card max-w-xl fade-in">
                <div className="card-header">
                    <h2 className="card-title">Informasi Produk</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="form-group">
                            <label className="form-label">Nama Produk <span className="text-red-500">*</span></label>
                            <input type="text" className={`form-input ${errors.name ? 'error' : ''}`}
                                value={data.name} onChange={e => setData('name', e.target.value)}
                                placeholder="Contoh: Paket Internet Bisnis 50Mbps" />
                            {errors.name && <div className="form-error">{errors.name}</div>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">HPP (Harga Pokok) <span className="text-red-500">*</span></label>
                                <input type="number" className={`form-input ${errors.base_price ? 'error' : ''}`}
                                    value={data.base_price} onChange={e => setData('base_price', e.target.value)}
                                    placeholder="0" min="0" />
                                {errors.base_price && <div className="form-error">{errors.base_price}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Margin Sales (%) <span className="text-red-500">*</span></label>
                                <input type="number" className={`form-input ${errors.margin_percentage ? 'error' : ''}`}
                                    value={data.margin_percentage} onChange={e => setData('margin_percentage', e.target.value)}
                                    placeholder="0" min="0" max="100" />
                                {errors.margin_percentage && <div className="form-error">{errors.margin_percentage}</div>}
                            </div>
                        </div>

                        {/* Harga Jual Preview */}
                        <div className="rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Harga Jual (Otomatis)</div>
                                    <div className="text-2xl font-bold text-blue-700 mt-1">{formatRupiah(sellingPrice)}</div>
                                    <div className="text-xs text-blue-500 mt-1">
                                        HPP + ({data.margin_percentage || 0}% × HPP)
                                    </div>
                                </div>
                                <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={processing} className="btn-primary">
                                {processing ? 'Menyimpan...' : 'Simpan Produk'}
                            </button>
                            <Link href={route('products.index')} className="btn-outline">Batal</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
