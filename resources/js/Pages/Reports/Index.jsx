import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatRupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
});

// ─── Stat Card Component ──────────────────────────────────────────────────────
// (Kita bawa komponen yang sama persis dari Dashboard)
function StatCard({ label, value, icon, from, to, sub }) {
    return (
        <div
            className="relative overflow-hidden rounded-2xl p-5 text-white"
            style={{
                background: `linear-gradient(135deg, ${from}, ${to})`,
                boxShadow: `0 8px 24px ${from}55`,
            }}
        >
            <div
                className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20"
                style={{ background: 'rgba(255,255,255,0.4)' }}
            />
            <div
                className="absolute right-6 top-6 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.2)' }}
            >
                {icon}
            </div>
            <div className="text-3xl font-bold mt-2">{value}</div>
            <div className="text-sm font-medium opacity-85 mt-1">{label}</div>
            {sub && <div className="text-xs opacity-60 mt-0.5">{sub}</div>}
        </div>
    );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function ReportsIndex({ leads, projects, customers, filters }) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [activeTab, setActiveTab] = useState('leads');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('reports.index'), { start_date: startDate, end_date: endDate }, { preserveState: true, replace: true });
    };

    const handleExport = () => {
        window.location.href = route('reports.export') + `?start_date=${startDate}&end_date=${endDate}`;
    };

    const totalRevenue = customers.reduce((sum, c) => sum + c.services?.reduce((s, sv) => s + sv.deal_price, 0), 0);

    const tabs = [
        { key: 'leads', label: 'Leads', count: leads.length },
        { key: 'projects', label: 'Projects', count: projects.length },
        { key: 'customers', label: 'Customers', count: customers.length },
    ];

    return (
        <AuthenticatedLayout header="Laporan">
            <Head title="Laporan" />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Laporan</h1>
                    <p className="page-subtitle">Analisis data penjualan berdasarkan periode</p>
                </div>
                <button onClick={handleExport} className="btn-accent">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export Excel
                </button>
            </div>

            {/* Filter */}
            <div className="card mb-5">
                <div className="card-body py-4">
                    <form onSubmit={handleFilter} className="flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="form-label">Dari Tanggal</label>
                            <input type="date" className="form-input" value={startDate || ''}
                                onChange={e => setStartDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="form-label">Sampai Tanggal</label>
                            <input type="date" className="form-input" value={endDate || ''}
                                onChange={e => setEndDate(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-primary">Tampilkan</button>
                    </form>
                </div>
            </div>

            {/* Summary Cards - Updated with StatCard */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <StatCard
                    label="Total Leads"
                    value={leads.length}
                    from="#3B82F6" to="#1D4ED8" // Blue gradient
                    icon={
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                        </svg>
                    }
                />
                <StatCard
                    label="Total Projects"
                    value={projects.length}
                    from="#8B5CF6" to="#6D28D9" // Violet gradient
                    icon={
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                    }
                />
                <StatCard
                    label="Total Revenue"
                    value={formatRupiah(totalRevenue)}
                    sub={`Dari ${customers.length} Customer Aktif`}
                    from="#10B981" to="#059669" // Emerald gradient
                    icon={
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Tabs & Tables Section */}
            <div className="card fade-in">
                {/* ... (Bagian Tabs dan Tables ini sama persis dengan kode Anda sebelumnya, tidak perlu diubah) ... */}
                <div className="border-b border-slate-200">
                    <div className="flex gap-1 px-4 pt-3">
                        {tabs.map(tab => (
                            <button key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-all ${
                                    activeTab === tab.key
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}>
                                {tab.label}
                                <span className="ml-2 bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-xs">{tab.count}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {/* Leads Tab */}
                    {activeTab === 'leads' && (
                        leads.length === 0 ? (
                            <div className="empty-state"><div className="empty-state-title">Tidak ada data lead pada periode ini</div></div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>#</th><th>Nama</th><th>Kontak</th><th>Status</th><th>Sales</th><th>Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((lead, i) => (
                                        <tr key={lead.id}>
                                            <td className="text-slate-400">{i + 1}</td>
                                            <td className="font-medium text-slate-800">{lead.name}</td>
                                            <td className="text-slate-500">{lead.contact}</td>
                                            <td><StatusBadge status={lead.status} /></td>
                                            <td className="text-slate-500">{lead.user?.name ?? '-'}</td>
                                            <td className="text-slate-500">{formatDate(lead.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    )}

                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        projects.length === 0 ? (
                            <div className="empty-state"><div className="empty-state-title">Tidak ada data project pada periode ini</div></div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>#</th><th>Lead</th><th>Status</th><th>Total Nilai</th><th>Sales</th><th>Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project, i) => {
                                        const total = project.items?.reduce((sum, it) => sum + it.negotiated_price, 0) || 0;
                                        return (
                                            <tr key={project.id}>
                                                <td className="text-slate-400">{i + 1}</td>
                                                <td className="font-medium text-slate-800">{project.lead?.name ?? '-'}</td>
                                                <td><StatusBadge status={project.status} type="project" /></td>
                                                <td className="font-semibold">{formatRupiah(total)}</td>
                                                <td className="text-slate-500">{project.user?.name ?? '-'}</td>
                                                <td className="text-slate-500">{formatDate(project.created_at)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )
                    )}

                    {/* Customers Tab */}
                    {activeTab === 'customers' && (
                        customers.length === 0 ? (
                            <div className="empty-state"><div className="empty-state-title">Tidak ada data customer pada periode ini</div></div>
                        ) : (
                            <>
                                {/* Desktop: Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>#</th><th>Nama Customer</th><th>Layanan</th><th>Revenue</th><th>Sales</th><th>Tanggal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customers.map((customer, i) => {
                                                const rev = customer.services?.reduce((sum, s) => sum + s.deal_price, 0) || 0;
                                                return (
                                                    <tr key={customer.id}>
                                                        <td className="text-slate-400">{i + 1}</td>
                                                        <td className="font-medium text-slate-800">{customer.name}</td>
                                                        <td>
                                                            <div className="flex flex-wrap gap-1">
                                                                {customer.services?.map(s => (
                                                                    <span key={s.id} className="badge bg-blue-100 text-blue-700">{s.product?.name}</span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="font-semibold text-emerald-600">{formatRupiah(rev)}</td>
                                                        <td className="text-slate-500">{customer.user?.name ?? '-'}</td>
                                                        <td className="text-slate-500">{formatDate(customer.created_at)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile: Card List */}
                                <div className="md:hidden divide-y divide-slate-100">
                                    {customers.map((customer, i) => {
                                        const rev = customer.services?.reduce((sum, s) => sum + s.deal_price, 0) || 0;
                                        return (
                                            <div key={customer.id} className="px-4 py-3 space-y-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="text-xs text-slate-400 flex-shrink-0">#{i + 1}</span>
                                                        <span className="font-semibold text-slate-800 truncate">{customer.name}</span>
                                                    </div>
                                                    <span className="font-bold text-emerald-600 text-sm flex-shrink-0">{formatRupiah(rev)}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {customer.services?.length ? (
                                                        customer.services.map(s => (
                                                            <span key={s.id} className="badge bg-blue-100 text-blue-700">{s.product?.name}</span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-slate-400">Tidak ada layanan</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-slate-500">
                                                    <span>Sales: <strong className="text-slate-600">{customer.user?.name ?? '-'}</strong></span>
                                                    <span>{formatDate(customer.created_at)}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}