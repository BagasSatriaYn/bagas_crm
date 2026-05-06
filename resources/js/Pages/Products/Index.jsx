import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const formatRupiah = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

export default function ProductsIndex({ products, filters }) {
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('products.index'), { search }, { preserveState: true, replace: true });
    };

    const handleDelete = () => {
        router.delete(route('products.destroy', deleteId), {
            onFinish: () => setDeleteId(null),
        });
    };

    return (
        <AuthenticatedLayout header="Produk">
            <Head title="Produk" />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Master Produk</h1>
                    <p className="page-subtitle">Kelola paket layanan internet</p>
                </div>
                <Link href={route('products.create')} className="btn-primary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Produk
                </Link>
            </div>

            {/* Search */}
            <div className="card mb-5">
                <div className="card-body py-4">
                    <form onSubmit={handleFilter} className="flex flex-wrap gap-3 items-end">
                        <div className="flex-1 min-w-48">
                            <label className="form-label">Cari Produk</label>
                            <input type="text" className="form-input" placeholder="Nama produk..." value={search}
                                onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="btn-primary">Filter</button>
                            <button type="button" className="btn-outline"
                                onClick={() => { setSearch(''); router.get(route('products.index')); }}>Reset</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card fade-in">
                <div className="overflow-x-auto">
                    {products.data.length === 0 ? (
                        <div className="empty-state">
                            <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                    d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                            </svg>
                            <div className="empty-state-title">Belum ada produk</div>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama Produk</th>
                                    <th>HPP</th>
                                    <th>Margin</th>
                                    <th>Harga Jual</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.data.map((product, i) => (
                                    <tr key={product.id}>
                                        <td className="text-slate-400">{products.from + i}</td>
                                        <td className="font-semibold text-slate-800">{product.name}</td>
                                        <td className="text-slate-600">{formatRupiah(product.base_price)}</td>
                                        <td>
                                            <span className="badge bg-blue-100 text-blue-700">{product.margin_percentage}%</span>
                                        </td>
                                        <td className="font-semibold text-emerald-600">{formatRupiah(product.selling_price)}</td>
                                        <td>
                                            <div className="flex items-center gap-1.5">
                                                <Link href={route('products.edit', product.id)} className="btn-sm btn-outline">Edit</Link>
                                                <button onClick={() => setDeleteId(product.id)} className="btn-sm btn-danger">Hapus</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {products.last_page > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                        <div className="text-sm text-slate-500">
                            Menampilkan {products.from}–{products.to} dari {products.total} produk
                        </div>
                        <div className="pagination">
                            {products.links.map((link, i) => (
                                <button key={i} disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`pagination-btn ${link.active ? 'active' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
                title="Hapus Produk?" message="Produk ini akan dihapus permanen." />
        </AuthenticatedLayout>
    );
}
