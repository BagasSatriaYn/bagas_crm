import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navItems = [
    {
        section: 'Menu Utama',
        items: [
            {
                name: 'Dashboard',
                href: 'dashboard',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
                        <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                ),
            },
            {
                name: 'Leads',
                href: 'leads.index',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                    </svg>
                ),
            },
            {
                name: 'Deal Pipeline',
                href: 'projects.index',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                ),
            },
            {
                name: 'Customer Aktif',
                href: 'customers.index',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                        <polyline points="16 11 18 13 22 9" />
                    </svg>
                ),
            },
        ],
    },
    {
        section: 'Master Data',
        items: [
            {
                name: 'Produk',
                href: 'products.index',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                ),
            },
        ],
    },
    {
        section: 'Laporan',
        items: [
            {
                name: 'Reports',
                href: 'reports.index',
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                ),
            },
        ],
    },
];

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    const flash = usePage().props.flash || {};

    return (
        <div className="min-h-screen flex">
            {/* Overlay mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`sidebar${mobileOpen ? ' open' : ''}`}
            >
                {/* Logo */}
                <div className="sidebar-logo">
                    <img
                        src="/images/logo-ptsmart2.png"
                        alt="Logo Mini PT Smart"
                        className="w-14 h-auto object-contain"
                    />
                    <div>
                        <div className="sidebar-logo-text">PT. Smart</div>
                        <div className="sidebar-logo-sub">CRM System</div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map((section) => (
                        <div key={section.section} className="mb-4">
                            <div className="sidebar-section-label mt-2">{section.section}</div>
                            {section.items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={route(item.href)}
                                    className={`sidebar-link ${route().current(item.href.replace('.index', '.*')) ? 'active' : ''}`}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <span className="w-4.5 h-4.5">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    {/* <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                            <div className={`text-xs ${user.role === 'manager' ? 'badge-manager' : 'badge-sales'} mt-0.5 inline-flex`}>
                                {user.role === 'manager' ? 'Manager' : 'Sales'}
                            </div>
                        </div>
                    </div> */}
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                        style={{ color: 'var(--sidebar-text)' }}
                        onMouseOver={e => e.currentTarget.style.color = '#fff'}
                        onMouseOut={e => e.currentTarget.style.color = 'var(--sidebar-text)'}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="main-content flex-1">
                {/* Topbar */}
                <header className="topbar">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 flex-shrink-0"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Buka menu"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {header && (
                            <div className="text-sm text-slate-500 truncate">
                                {header}
                            </div>
                        )}
                    </div>

                    {/* Right topbar */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            {/* Avatar Profil */}
                            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            
                            {/* Detail Nama & Role */}
                            <div className="hidden sm:flex flex-col items-start justify-center">
                                <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate leading-tight">
                                    {user.name}
                                </span>
                                {/* Badge Role */}
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 mt-0.5 rounded uppercase tracking-wider border border-blue-100">
                                    {user.role || 'Staff'}
                                </span>
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Flash Messages */}
                {(flash.success || flash.error) && (
                    <div className="px-4 md:px-6 pt-4">
                        {flash.success && (
                            <div className="alert-success fade-in">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {flash.success}
                            </div>
                        )}
                        {flash.error && (
                            <div className="alert-error fade-in">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {flash.error}
                            </div>
                        )}
                    </div>
                )}

                {/* Page Content */}
                <main className="page-container">
                    {children}
                </main>
            </div>
        </div>
    );
}
