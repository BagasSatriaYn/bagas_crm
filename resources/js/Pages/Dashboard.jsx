import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/StatCard';
import StatusBadge from '@/Components/StatusBadge';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats, recentLeads, recentProjects, leadStatusBreakdown }) {
    const formatRupiah = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Selamat datang di CRM PT. Smart ISP</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Leads"
                    value={stats.total_leads}
                    gradient="bg-gradient-to-br from-blue-500 to-blue-700"
                    icon={
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                                d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                        </svg>
                    }
                />
                <StatCard
                    label="Total Projects"
                    value={stats.total_projects}
                    gradient="bg-gradient-to-br from-violet-500 to-violet-700"
                    icon={
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                    }
                />
                <StatCard
                    label="Customer Aktif"
                    value={stats.total_customers}
                    gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
                    icon={
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                                d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 100 8 4 4 0 000-8z" />
                            <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" points="16 11 18 13 22 9" />
                        </svg>
                    }
                />
                <StatCard
                    label="Waiting Approval"
                    value={stats.waiting_approval}
                    gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                    sub="Project menunggu persetujuan"
                    icon={
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6v6l4 2" />
                        </svg>
                    }
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Recent Leads */}
                <div className="card fade-in">
                    <div className="card-header">
                        <h2 className="card-title">Lead Terbaru</h2>
                        <Link href={route('leads.index')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                            Lihat semua →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        {recentLeads.length === 0 ? (
                            <div className="empty-state">
                                <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8z" />
                                </svg>
                                <div className="empty-state-title">Belum ada lead</div>
                            </div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Kontak</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentLeads.map(lead => (
                                        <tr key={lead.id}>
                                            <td className="font-medium text-slate-800">{lead.name}</td>
                                            <td className="text-slate-500">{lead.contact}</td>
                                            <td><StatusBadge status={lead.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Recent Projects */}
                <div className="card fade-in">
                    <div className="card-header">
                        <h2 className="card-title">Project Terbaru</h2>
                        <Link href={route('projects.index')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                            Lihat semua →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        {recentProjects.length === 0 ? (
                            <div className="empty-state">
                                <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                                <div className="empty-state-title">Belum ada project</div>
                            </div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Lead</th>
                                        <th>Status</th>
                                        <th>Sales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentProjects.map(project => (
                                        <tr key={project.id}>
                                            <td className="font-medium text-slate-800">{project.lead?.name ?? '-'}</td>
                                            <td><StatusBadge status={project.status} type="project" /></td>
                                            <td className="text-slate-500">{project.user?.name ?? '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Lead Status Breakdown */}
                <div className="card fade-in lg:col-span-2">
                    <div className="card-header">
                        <h2 className="card-title">Distribusi Status Lead</h2>
                    </div>
                    <div className="card-body">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            {[
                                { key: 'new', label: 'New', color: 'bg-cyan-500' },
                                { key: 'contacted', label: 'Contacted', color: 'bg-violet-500' },
                                { key: 'negotiation', label: 'Negosiasi', color: 'bg-amber-500' },
                                { key: 'converted', label: 'Converted', color: 'bg-emerald-500' },
                                { key: 'lost', label: 'Lost', color: 'bg-red-500' },
                            ].map(s => (
                                <div key={s.key} className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className={`w-3 h-3 rounded-full ${s.color} mx-auto mb-2`} />
                                    <div className="text-2xl font-bold text-slate-800">
                                        {leadStatusBreakdown[s.key] || 0}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
