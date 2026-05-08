import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const formatRupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

export default function ProjectsIndex({ projects, filters }) {
    const { auth } = usePage().props;
    const isManager = auth.user.role === 'manager';
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('projects.index'), { status }, { preserveState: true, replace: true });
    };

    const statusGroups = [
        { key: '', label: 'Semua', count: projects.total },
        { key: 'waiting approval', label: 'Waiting Approval', color: 'text-amber-600' },
        { key: 'approved', label: 'Approved', color: 'text-emerald-600' },
        { key: 'rejected', label: 'Rejected', color: 'text-red-600' },
    ];

    return (
        <AuthenticatedLayout header="Deal Pipeline">
            <Head title="Deal Pipeline" />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Deal Pipeline</h1>
                    <p className="page-subtitle">Kelola proses konversi lead menjadi customer</p>
                </div>
                <Link href={route('projects.create')} className="btn-primary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Buat Project
                </Link>
            </div>

            {/* Status Filter Tabs */}
            <div className="card mb-5">
                <div className="card-body py-3">
                    <form onSubmit={handleFilter} className="flex flex-wrap items-center gap-2">
                        {statusGroups.map(sg => (
                            <button
                                key={sg.key}
                                type="button"
                                onClick={() => { setStatus(sg.key); router.get(route('projects.index'), { status: sg.key }); }}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                    status === sg.key
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {sg.label}
                            </button>
                        ))}
                    </form>
                </div>
            </div>

            <div className="card fade-in">
                <div className="overflow-x-auto">
                    {projects.data.length === 0 ? (
                        <div className="empty-state">
                            <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                            <div className="empty-state-title">Belum ada project</div>
                            <div className="empty-state-sub">Buat project dari lead yang ada</div>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Lead</th>
                                    <th>Produk</th>
                                    <th>Total Nilai</th>
                                    <th>Status</th>
                                    {isManager && <th>Sales</th>}
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.data.map((project, i) => {
                                    const total = project.items?.reduce((sum, it) => sum + it.negotiated_price, 0) || 0;
                                    const hasBelowMargin = project.items?.some(it => it.is_below_margin);

                                    return (
                                        <tr key={project.id}>
                                            <td className="text-slate-400">{projects.from + i}</td>
                                            <td>
                                                <div className="font-medium text-slate-800">{project.lead?.name ?? '-'}</div>
                                                {hasBelowMargin && (
                                                    <span className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        Ada harga di bawah margin
                                                    </span>
                                                )}
                                            </td>
                                            <td className="text-slate-500">
                                                {project.items?.map(it => it.product?.name).join(', ') || '-'}
                                            </td>
                                            <td className="font-semibold text-slate-800">{formatRupiah(total)}</td>
                                            <td><StatusBadge status={project.status} type="project" /></td>
                                            {isManager && <td className="text-slate-500">{project.user?.name ?? '-'}</td>}
                                            <td>
                                                <Link href={route('projects.show', project.id)} className="btn-sm btn-outline">
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
                {projects.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 md:px-6 py-4 border-t border-slate-100">
                        <div className="pagination-info text-sm text-slate-500">
                            Menampilkan {projects.from}–{projects.to} dari {projects.total} project
                        </div>
                        <div className="pagination">
                            {projects.links.map((link, i) => (
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
