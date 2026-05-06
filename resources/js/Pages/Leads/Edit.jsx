import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function LeadEdit({ lead }) {
    const { data, setData, put, processing, errors } = useForm({
        name: lead.name,
        contact: lead.contact,
        address: lead.address,
        needs: lead.needs,
        status: lead.status,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('leads.update', lead.id));
    };

    return (
        <AuthenticatedLayout header="Leads / Edit">
            <Head title="Edit Lead" />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Edit Lead</h1>
                    <p className="page-subtitle">Ubah informasi lead: {lead.name}</p>
                </div>
                <Link href={route('leads.index')} className="btn-outline">← Kembali</Link>
            </div>

            <div className="card max-w-2xl fade-in">
                <div className="card-header">
                    <h2 className="card-title">Informasi Lead</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="form-group">
                            <label className="form-label">Nama <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className={`form-input ${errors.name ? 'error' : ''}`}
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <div className="form-error">{errors.name}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Kontak <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className={`form-input ${errors.contact ? 'error' : ''}`}
                                value={data.contact}
                                onChange={e => setData('contact', e.target.value)}
                            />
                            {errors.contact && <div className="form-error">{errors.contact}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Alamat <span className="text-red-500">*</span></label>
                            <textarea
                                className={`form-textarea ${errors.address ? 'error' : ''}`}
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                rows={3}
                            />
                            {errors.address && <div className="form-error">{errors.address}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Kebutuhan <span className="text-red-500">*</span></label>
                            <textarea
                                className={`form-textarea ${errors.needs ? 'error' : ''}`}
                                value={data.needs}
                                onChange={e => setData('needs', e.target.value)}
                                rows={3}
                            />
                            {errors.needs && <div className="form-error">{errors.needs}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status <span className="text-red-500">*</span></label>
                            <select
                                className={`form-select ${errors.status ? 'error' : ''}`}
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                            >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="negotiation">Negosiasi</option>
                                <option value="converted">Converted</option>
                                <option value="lost">Lost</option>
                            </select>
                            {errors.status && <div className="form-error">{errors.status}</div>}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={processing} className="btn-primary">
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                            <Link href={route('leads.index')} className="btn-outline">Batal</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
