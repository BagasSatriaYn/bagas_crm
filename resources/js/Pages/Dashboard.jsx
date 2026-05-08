import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';
import { Head, Link } from '@inertiajs/react';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
}

function getTodayLabel() {
    return new Date().toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, from, to, sub }) {
    return (
        <div
            className="relative overflow-hidden rounded-2xl p-5 text-white"
            style={{
                background: `linear-gradient(135deg, ${from}, ${to})`,
                boxShadow: `0 8px 24px ${from}55`,
            }}
        >
            {/* Decorative circle */}
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

// ─── Custom Donut Label ───────────────────────────────────────────────────────

const RADIAN = Math.PI / 180;
function CustomDonutLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
    if (percent < 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
            fontSize={11} fontWeight={600}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
}

// ─── Lead Status Config ───────────────────────────────────────────────────────

const LEAD_STATUS_CFG = [
    { key: 'new',         label: 'New',        color: '#06B6D4' },
    { key: 'contacted',   label: 'Contacted',  color: '#8B5CF6' },
    { key: 'negotiation', label: 'Negosiasi',  color: '#F59E0B' },
    { key: 'converted',   label: 'Converted',  color: '#10B981' },
    { key: 'lost',        label: 'Lost',       color: '#EF4444' },
];

const PROJECT_STATUS_CFG = [
    { key: 'waiting approval', label: 'Waiting',  color: '#F59E0B' },
    { key: 'approved',         label: 'Approved', color: '#10B981' },
    { key: 'rejected',         label: 'Rejected', color: '#EF4444' },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-lg text-sm">
            <span className="font-semibold text-slate-800">{payload[0].name}:</span>
            <span className="ml-2 text-slate-600">{payload[0].value}</span>
        </div>
    );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard({
    auth,
    stats,
    recentLeads,
    recentProjects,
    leadStatusBreakdown,
    projectStatusBreakdown,
    conversionRate,
}) {
    // Build donut data
    const donutData = LEAD_STATUS_CFG.map(s => ({
        name: s.label,
        value: leadStatusBreakdown[s.key] || 0,
        color: s.color,
    })).filter(d => d.value > 0);

    // Build bar data
    const barData = PROJECT_STATUS_CFG.map(s => ({
        name: s.label,
        value: projectStatusBreakdown[s.key] || 0,
        color: s.color,
    }));

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard" />

            {/* ── Page Header ─────────────────────────────────── */}
            <div className="mb-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="text-xs font-medium text-blue-500 uppercase tracking-widest mb-1">
                            {getTodayLabel()}
                        </p>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {getGreeting()}, <span className="text-blue-600">{auth.user.name}</span> 
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Berikut ringkasan aktivitas CRM PT. Smart hari ini.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('leads.index')} className="btn btn-primary btn-sm">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Lead
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Stat Cards ──────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Total Leads"
                    value={stats.total_leads}
                    from="#3B82F6" to="#1D4ED8"
                    icon={
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                        </svg>
                    }
                />
                <StatCard
                    label="Deal Pipeline"
                    value={stats.total_projects}
                    from="#8B5CF6" to="#6D28D9"
                    icon={
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                    }
                />
                <StatCard
                    label="Customer Aktif"
                    value={stats.total_customers}
                    from="#10B981" to="#059669"
                    icon={
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 100 8 4 4 0 000-8z" />
                            <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="16 11 18 13 22 9" />
                        </svg>
                    }
                />
                <StatCard
                    label="Waiting Approval"
                    value={stats.waiting_approval}
                    from="#F59E0B" to="#D97706"
                    sub="Project menunggu persetujuan"
                    icon={
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                        </svg>
                    }
                />
            </div>

            {/* ── Conversion Rate Banner ───────────────────────── */}
            <div
                className="rounded-2xl p-5 mb-6 text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A5F)' }}
            >
                {/* Decorative blobs */}
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10"
                    style={{ background: '#3B82F6' }} />
                <div className="absolute right-20 bottom-0 w-24 h-24 rounded-full opacity-10"
                    style={{ background: '#06B6D4' }} />

                <div className="relative flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-blue-300 font-semibold mb-1">
                            KPI Utama
                        </p>
                        <p className="text-base font-bold">Lead Conversion Rate</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Persentase lead yang berhasil di-convert menjadi customer
                        </p>
                    </div>
                    <div className="text-4xl font-extrabold tracking-tight">
                        {conversionRate}
                        <span className="text-2xl text-blue-300">%</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                        <span>0%</span>
                        <span>Target: 100%</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                                width: `${Math.min(conversionRate, 100)}%`,
                                background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
                                boxShadow: '0 0 12px rgba(59,130,246,0.6)',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* ── Charts Row ──────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

                {/* Donut Chart — Lead Status */}
                <div className="card fade-in">
                    <div className="card-header">
                        <h2 className="card-title">Distribusi Status Lead</h2>
                        <Link href={route('leads.index')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                            Lihat semua →
                        </Link>
                    </div>
                    <div className="card-body">
                        {donutData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3" />
                                </svg>
                                <p className="text-sm">Belum ada data lead</p>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div style={{ width: '100%', maxWidth: 220, height: 220 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={donutData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={90}
                                                paddingAngle={3}
                                                dataKey="value"
                                                labelLine={false}
                                                label={CustomDonutLabel}
                                            >
                                                {donutData.map((entry, i) => (
                                                    <Cell key={i} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Legend */}
                                <div className="flex flex-col gap-2 w-full sm:w-auto">
                                    {LEAD_STATUS_CFG.map(s => (
                                        <div key={s.key} className="flex items-center gap-2">
                                            <div
                                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                style={{ background: s.color }}
                                            />
                                            <span className="text-xs text-slate-600 flex-1">{s.label}</span>
                                            <span
                                                className="text-xs font-bold tabular-nums"
                                                style={{ color: s.color }}
                                            >
                                                {leadStatusBreakdown[s.key] || 0}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bar Chart — Project Status */}
                <div className="card fade-in">
                    <div className="card-header">
                        <h2 className="card-title">Pipeline Project</h2>
                        <Link href={route('projects.index')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                            Lihat semua →
                        </Link>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart
                                data={barData}
                                layout="vertical"
                                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                                barCategoryGap="30%"
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                                <XAxis
                                    type="number"
                                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={70}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                                <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
                                    {barData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                        {/* Summary pills */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                            {PROJECT_STATUS_CFG.map(s => (
                                <div
                                    key={s.key}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                                    style={{
                                        background: `${s.color}18`,
                                        color: s.color,
                                    }}
                                >
                                    <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ background: s.color }}
                                    />
                                    {s.label}: {projectStatusBreakdown[s.key] || 0}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Recent Tables Row ────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Recent Leads */}
                <div className="card fade-in">
                    <div className="card-header">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-5 rounded-full bg-blue-500" />
                            <h2 className="card-title">Lead Terbaru</h2>
                        </div>
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
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-5 rounded-full bg-violet-500" />
                            <h2 className="card-title">Project Terbaru</h2>
                        </div>
                        <Link href={route('projects.index')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                            Lihat semua →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        {recentProjects.length === 0 ? (
                            <div className="empty-state">
                                <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                        points="22 12 18 12 15 21 9 3 6 12 2 12" />
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
            </div>
        </AuthenticatedLayout>
    );
}
