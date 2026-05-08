import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const formatRupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

export default function CustomersIndex({ customers, filters }) {
    const { auth } = usePage().props;
    const isManager = auth.user.role === 'manager';
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('customers.index'), { search }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout header="Customer Aktif">
            <Head title="Customer Aktif" />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Customer Aktif</h1>
                    <p className="page-subtitle">Daftar pelanggan yang sudah berlangganan</p>
                </div>
            </div>

            <div className="card mb-5">
                <div className="card-body py-4">
                    <form onSubmit={handleFilter} className="flex flex-wrap gap-3 items-end">
                        <div className="flex-1 min-w-48">
                            <label className="form-label">Cari Customer</label>
                            <input type="text" className="form-input" placeholder="Nama / kontak..."
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="btn-primary">Filter</button>
                            <button type="button" className="btn-outline"
                                onClick={() => { setSearch(''); router.get(route('customers.index')); }}>Reset</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card fade-in">
                <div className="overflow-x-auto">
                    {customers.data.length === 0 ? (
                        <div className="empty-state">
                            <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                    d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 100 8 4 4 0 000-8z" />
                                <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" points="16 11 18 13 22 9" />
                            </svg>
                            <div className="empty-state-title">Belum ada customer aktif</div>
                            <div className="empty-state-sub">Konversi lead menjadi customer melalui Deal Pipeline</div>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama Customer</th>
                                    <th>Kontak</th>
                                    <th>Layanan</th>
                                    <th>Total Revenue</th>
                                    {isManager && <th>Sales</th>}
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.data.map((customer, i) => {
                                    const totalRevenue = customer.services?.reduce((sum, s) => sum + s.deal_price, 0) || 0;
                                    return (
                                        <tr key={customer.id}>
                                            <td className="text-slate-400">{customers.from + i}</td>
                                            <td>
                                                <div className="font-semibold text-slate-800">{customer.name}</div>
                                            </td>
                                            <td className="text-slate-500">{customer.contact}</td>
                                            <td>
                                                <div className="flex flex-wrap gap-1">
                                                    {customer.services?.map(s => (
                                                        <span key={s.id} className="badge bg-blue-100 text-blue-700 text-xs">
                                                            {s.product?.name ?? 'Produk'}
                                                        </span>
                                                    )) || '-'}
                                                </div>
                                            </td>
                                            <td className="font-semibold text-emerald-600">{formatRupiah(totalRevenue)}</td>
                                            {isManager && <td className="text-slate-500">{customer.user?.name ?? '-'}</td>}
                                            <td>
                                                <Link href={route('customers.show', customer.id)} className="btn-sm btn-outline">
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
                {customers.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 md:px-6 py-4 border-t border-slate-100">
                        <div className="pagination-info text-sm text-slate-500">
                            Menampilkan {customers.from}–{customers.to} dari {customers.total} customer
                        </div>
                        <div className="pagination">
                            {customers.links.map((link, i) => (
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
        </AuthenticatedLayout>
    );
}
