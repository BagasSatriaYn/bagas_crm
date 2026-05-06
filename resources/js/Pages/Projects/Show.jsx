import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';
import ConfirmModal from '@/Components/ConfirmModal';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const formatRupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

export default function ProjectShow({ project }) {
    const { auth } = usePage().props;
    const isManager = auth.user.role === 'manager';

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showConvertModal, setShowConvertModal] = useState(false);

    const rejectForm = useForm({ reject_reason: '' });

    const totalValue = project.items?.reduce((sum, it) => sum + it.negotiated_price, 0) || 0;
    const hasBelowMargin = project.items?.some(it => it.is_below_margin);

    const handleApprove = () => {
        router.post(route('projects.approve', project.id));
    };

    const handleReject = () => {
        rejectForm.post(route('projects.reject', project.id), {
            onSuccess: () => setShowRejectModal(false),
        });
    };

    const handleConvert = () => {
        router.post(route('projects.convert', project.id), {}, {
            onSuccess: () => setShowConvertModal(false),
        });
    };

    return (
        <AuthenticatedLayout header={`Deal Pipeline / Project #${project.id}`}>
            <Head title={`Project #${project.id}`} />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Detail Project #{project.id}</h1>
                    <p className="page-subtitle">Lead: {project.lead?.name}</p>
                </div>
                <Link href={route('projects.index')} className="btn-outline">← Kembali</Link>
            </div>

            {/* Status Banner */}
            <div className={`rounded-xl p-4 mb-5 border flex items-center gap-4 ${
                project.status === 'approved' ? 'bg-emerald-50 border-emerald-200' :
                project.status === 'rejected' ? 'bg-red-50 border-red-200' :
                'bg-amber-50 border-amber-200'
            }`}>
                <StatusBadge status={project.status} type="project" />
                <div className="text-sm">
                    {project.status === 'waiting approval' && 'Menunggu persetujuan Manager.'}
                    {project.status === 'approved' && 'Project telah disetujui. Dapat dikonversi menjadi customer.'}
                    {project.status === 'rejected' && (
                        <span>Ditolak. Alasan: <strong>{project.reject_reason}</strong></span>
                    )}
                </div>

                {/* Manager Actions */}
                {isManager && project.status === 'waiting approval' && (
                    <div className="ml-auto flex gap-2">
                        <button onClick={handleApprove} className="btn-success btn-sm">✓ Approve</button>
                        <button onClick={() => setShowRejectModal(true)} className="btn-danger btn-sm">✕ Reject</button>
                    </div>
                )}

                {/* Convert to Customer */}
                {project.status === 'approved' && (
                    <div className="ml-auto">
                        <button onClick={() => setShowConvertModal(true)} className="btn-accent btn-sm">
                            → Konversi ke Customer
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Lead Info */}
                <div className="card fade-in">
                    <div className="card-header">
                        <h2 className="card-title">Informasi Lead</h2>
                    </div>
                    <div className="card-body space-y-3">
                        {[
                            { label: 'Nama', value: project.lead?.name },
                            { label: 'Kontak', value: project.lead?.contact },
                            { label: 'Alamat', value: project.lead?.address },
                            { label: 'Kebutuhan', value: project.lead?.needs },
                            { label: 'Sales', value: project.user?.name },
                        ].map(item => (
                            <div key={item.label} className="flex gap-3">
                                <span className="text-slate-400 text-sm w-20 flex-shrink-0">{item.label}</span>
                                <span className="text-slate-700 text-sm font-medium">{item.value || '-'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Items */}
                <div className="lg:col-span-2 card fade-in">
                    <div className="card-header">
                        <h2 className="card-title">Produk & Harga</h2>
                        <div className="text-sm font-semibold text-blue-600">{formatRupiah(totalValue)}</div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Produk</th>
                                    <th>Harga Jual</th>
                                    <th>Harga Negosiasi</th>
                                    <th>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {project.items?.map(item => (
                                    <tr key={item.id}>
                                        <td className="font-medium text-slate-800">{item.product?.name}</td>
                                        <td className="text-slate-500">{formatRupiah(item.product?.selling_price)}</td>
                                        <td className={`font-semibold ${item.is_below_margin ? 'text-amber-600' : 'text-emerald-600'}`}>
                                            {formatRupiah(item.negotiated_price)}
                                        </td>
                                        <td>
                                            {item.is_below_margin ? (
                                                <span className="badge-waiting">Di bawah margin</span>
                                            ) : (
                                                <span className="badge-approved">Normal</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={2} className="px-4 py-3 text-right font-semibold text-slate-600">Total</td>
                                    <td colSpan={2} className="px-4 py-3 font-bold text-lg text-slate-800">{formatRupiah(totalValue)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            <ConfirmModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onConfirm={handleReject}
                title="Tolak Project?"
                message="Berikan alasan penolakan project ini."
                confirmLabel="Tolak Project"
                confirmClass="btn-danger"
            >
                <div className="mt-3">
                    <textarea
                        className="form-textarea w-full mt-2"
                        placeholder="Alasan penolakan..."
                        rows={3}
                        value={rejectForm.data.reject_reason}
                        onChange={e => rejectForm.setData('reject_reason', e.target.value)}
                    />
                    {rejectForm.errors.reject_reason && (
                        <div className="form-error">{rejectForm.errors.reject_reason}</div>
                    )}
                </div>
            </ConfirmModal>

            {/* Convert Modal */}
            <ConfirmModal
                isOpen={showConvertModal}
                onClose={() => setShowConvertModal(false)}
                onConfirm={handleConvert}
                title="Konversi ke Customer?"
                message={`Lead "${project.lead?.name}" akan dikonversi menjadi customer aktif beserta layanan yang dipilih.`}
                confirmLabel="Ya, Konversi"
                confirmClass="btn-accent"
            />
        </AuthenticatedLayout>
    );
}
