import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatRupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

export default function CustomerShow({ customer }) {
    const totalRevenue = customer.services?.reduce((sum, s) => sum + s.deal_price, 0) || 0;

    return (
        <AuthenticatedLayout header={`Customer Aktif / ${customer.name}`}>
            <Head title={`Customer - ${customer.name}`} />

            <div className="page-header">
                <div>
                    <h1 className="page-title">{customer.name}</h1>
                    <p className="page-subtitle">Detail customer aktif</p>
                </div>
                <Link href={route('customers.index')} className="btn-outline">← Kembali</Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Customer Info */}
                <div className="card fade-in">
                    <div className="card-header">
                        <h2 className="card-title">Informasi Customer</h2>
                    </div>
                    <div className="card-body">
                        <div className="flex flex-col items-center text-center mb-6 pt-2">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold mb-3">
                                {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="font-bold text-slate-800 text-lg">{customer.name}</div>
                            <div className="text-slate-500 text-sm mt-1">{customer.contact}</div>
                        </div>

                        <div className="divider" />

                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <span className="text-slate-400 text-sm w-20 flex-shrink-0">Alamat</span>
                                <span className="text-slate-700 text-sm">{customer.address}</span>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-slate-400 text-sm w-20 flex-shrink-0">Sales</span>
                                <span className="text-slate-700 text-sm font-medium">{customer.user?.name ?? '-'}</span>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-slate-400 text-sm w-20 flex-shrink-0">Bergabung</span>
                                <span className="text-slate-700 text-sm">
                                    {new Date(customer.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="divider" />

                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-4 text-white text-center">
                            <div className="text-xs opacity-75 mb-1">Total Revenue</div>
                            <div className="text-2xl font-bold">{formatRupiah(totalRevenue)}</div>
                            <div className="text-xs opacity-75 mt-1">{customer.services?.length || 0} layanan aktif</div>
                        </div>
                    </div>
                </div>

                {/* Services */}
                <div className="lg:col-span-2 card fade-in">
                    <div className="card-header">
                        <h2 className="card-title">Layanan Aktif</h2>
                        <span className="badge bg-blue-100 text-blue-700">{customer.services?.length || 0} layanan</span>
                    </div>
                    <div className="overflow-x-auto">
                        {!customer.services?.length ? (
                            <div className="empty-state">
                                <div className="empty-state-title">Belum ada layanan</div>
                            </div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Paket Layanan</th>
                                        <th>Harga Standar</th>
                                        <th>Harga Deal</th>
                                        <th>Selisih</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customer.services.map((service, i) => {
                                        const diff = service.deal_price - (service.product?.selling_price || 0);
                                        return (
                                            <tr key={service.id}>
                                                <td className="text-slate-400">{i + 1}</td>
                                                <td>
                                                    <div className="font-medium text-slate-800">{service.product?.name ?? '-'}</div>
                                                </td>
                                                <td className="text-slate-500">
                                                    {formatRupiah(service.product?.selling_price || 0)}
                                                </td>
                                                <td className="font-semibold text-blue-600">
                                                    {formatRupiah(service.deal_price)}
                                                </td>
                                                <td>
                                                    <span className={diff < 0 ? 'text-red-500 font-medium' : 'text-emerald-600 font-medium'}>
                                                        {diff < 0 ? '-' : '+'}{formatRupiah(Math.abs(diff))}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={3} className="px-4 py-3 text-right font-semibold text-slate-600">Total</td>
                                        <td colSpan={2} className="px-4 py-3 font-bold text-lg text-slate-800">{formatRupiah(totalRevenue)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
