import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const formatRupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

export default function ProductEdit({ product }) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        base_price: product.base_price,
        margin_percentage: product.margin_percentage,
    });

    const sellingPrice = data.base_price && data.margin_percentage
        ? Math.round(Number(data.base_price) + (Number(data.base_price) * Number(data.margin_percentage) / 100))
        : 0;

    const submit = (e) => {
        e.preventDefault();
        put(route('products.update', product.id));
    };

    return (
        <AuthenticatedLayout header="Produk / Edit">
            <Head title="Edit Produk" />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Edit Produk</h1>
                    <p className="page-subtitle">{product.name}</p>
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
                                value={data.name} onChange={e => setData('name', e.target.value)} />
                            {errors.name && <div className="form-error">{errors.name}</div>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">HPP <span className="text-red-500">*</span></label>
                                <input type="number" className={`form-input ${errors.base_price ? 'error' : ''}`}
                                    value={data.base_price} onChange={e => setData('base_price', e.target.value)} min="0" />
                                {errors.base_price && <div className="form-error">{errors.base_price}</div>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Margin (%) <span className="text-red-500">*</span></label>
                                <input type="number" className={`form-input ${errors.margin_percentage ? 'error' : ''}`}
                                    value={data.margin_percentage} onChange={e => setData('margin_percentage', e.target.value)} min="0" max="100" />
                                {errors.margin_percentage && <div className="form-error">{errors.margin_percentage}</div>}
                            </div>
                        </div>

                        <div className="rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-4">
                            <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Harga Jual (Preview)</div>
                            <div className="text-2xl font-bold text-blue-700 mt-1">{formatRupiah(sellingPrice)}</div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={processing} className="btn-primary">
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                            <Link href={route('products.index')} className="btn-outline">Batal</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
