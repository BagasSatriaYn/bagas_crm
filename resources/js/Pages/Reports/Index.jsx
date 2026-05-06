import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const formatRupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
});

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
                            <input type="date" className="form-input" value={startDate}
                                onChange={e => setStartDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="form-label">Sampai Tanggal</label>
                            <input type="date" className="form-input" value={endDate}
                                onChange={e => setEndDate(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-primary">Tampilkan</button>
                    </form>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <div className="card p-5">
                    <div className="text-3xl font-bold text-blue-600">{leads.length}</div>
                    <div className="text-sm text-slate-500 mt-1">Total Leads</div>
                </div>
                <div className="card p-5">
                    <div className="text-3xl font-bold text-violet-600">{projects.length}</div>
                    <div className="text-sm text-slate-500 mt-1">Total Projects</div>
                </div>
                <div className="card p-5">
                    <div className="text-xl font-bold text-emerald-600">{formatRupiah(totalRevenue)}</div>
                    <div className="text-sm text-slate-500 mt-1">Total Revenue ({customers.length} customer)</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="card fade-in">
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
                        )
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
