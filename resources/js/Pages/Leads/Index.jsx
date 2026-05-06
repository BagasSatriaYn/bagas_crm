import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function LeadsIndex({ leads, filters }) {
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('leads.index'), { search, status }, { preserveState: true, replace: true });
    };

    const handleDelete = () => {
        router.delete(route('leads.destroy', deleteId), {
            onFinish: () => setDeleteId(null),
        });
    };

    return (
        <AuthenticatedLayout header="Leads">
            <Head title="Leads" />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Leads</h1>
                    <p className="page-subtitle">Kelola calon customer (lead)</p>
                </div>
                <Link href={route('leads.create')} className="btn-primary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Lead
                </Link>
            </div>

            {/* Filters */}
            <div className="card mb-5">
                <div className="card-body py-4">
                    <form onSubmit={handleFilter} className="flex flex-wrap gap-3 items-end">
                        <div className="flex-1 min-w-48">
                            <label className="form-label">Cari Nama / Kontak</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Cari..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="w-44">
                            <label className="form-label">Status</label>
                            <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="">Semua Status</option>
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="negotiation">Negosiasi</option>
                                <option value="converted">Converted</option>
                                <option value="lost">Lost</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="btn-primary">Filter</button>
                            <button
                                type="button"
                                className="btn-outline"
                                onClick={() => { setSearch(''); setStatus(''); router.get(route('leads.index')); }}
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Table */}
            <div className="card fade-in">
                <div className="overflow-x-auto">
                    {leads.data.length === 0 ? (
                        <div className="empty-state">
                            <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                    d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8z" />
                            </svg>
                            <div className="empty-state-title">Belum ada lead</div>
                            <div className="empty-state-sub">Mulai tambahkan lead baru</div>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama</th>
                                    <th>Kontak</th>
                                    <th>Alamat</th>
                                    <th>Kebutuhan</th>
                                    <th>Status</th>
                                    <th>Sales</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.data.map((lead, i) => (
                                    <tr key={lead.id}>
                                        <td className="text-slate-400">{leads.from + i}</td>
                                        <td className="font-medium text-slate-800">{lead.name}</td>
                                        <td>{lead.contact}</td>
                                        <td className="max-w-48 truncate text-slate-500">{lead.address}</td>
                                        <td className="max-w-48 truncate text-slate-500">{lead.needs}</td>
                                        <td><StatusBadge status={lead.status} /></td>
                                        <td className="text-slate-500">{lead.user?.name ?? '-'}</td>
                                        <td>
                                            <div className="flex items-center gap-1.5">
                                                <Link href={route('leads.edit', lead.id)} className="btn-sm btn-outline">
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(lead.id)}
                                                    className="btn-sm btn-danger"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {leads.last_page > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                        <div className="text-sm text-slate-500">
                            Menampilkan {leads.from}–{leads.to} dari {leads.total} lead
                        </div>
                        <div className="pagination">
                            {leads.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`pagination-btn ${link.active ? 'active' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus Lead?"
                message="Lead ini akan dihapus secara permanen. Aksi ini tidak bisa dibatalkan."
            />
        </AuthenticatedLayout>
    );
}
