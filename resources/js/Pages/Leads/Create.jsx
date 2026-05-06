import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function LeadCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        contact: '',
        address: '',
        needs: '',
        status: 'new',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('leads.store'));
    };

    return (
        <AuthenticatedLayout header="Leads / Tambah">
            <Head title="Tambah Lead" />

            <div className="page-header">
                <div>
                    <h1 className="page-title">Tambah Lead</h1>
                    <p className="page-subtitle">Catat calon customer baru</p>
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
                                id="lead-name"
                                type="text"
                                className={`form-input ${errors.name ? 'error' : ''}`}
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Nama calon customer"
                            />
                            {errors.name && <div className="form-error">{errors.name}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Kontak <span className="text-red-500">*</span></label>
                            <input
                                id="lead-contact"
                                type="text"
                                className={`form-input ${errors.contact ? 'error' : ''}`}
                                value={data.contact}
                                onChange={e => setData('contact', e.target.value)}
                                placeholder="No. HP / Email"
                            />
                            {errors.contact && <div className="form-error">{errors.contact}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Alamat <span className="text-red-500">*</span></label>
                            <textarea
                                id="lead-address"
                                className={`form-textarea ${errors.address ? 'error' : ''}`}
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                placeholder="Alamat lengkap"
                                rows={3}
                            />
                            {errors.address && <div className="form-error">{errors.address}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Kebutuhan <span className="text-red-500">*</span></label>
                            <textarea
                                id="lead-needs"
                                className={`form-textarea ${errors.needs ? 'error' : ''}`}
                                value={data.needs}
                                onChange={e => setData('needs', e.target.value)}
                                placeholder="Kebutuhan layanan internet..."
                                rows={3}
                            />
                            {errors.needs && <div className="form-error">{errors.needs}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status <span className="text-red-500">*</span></label>
                            <select
                                id="lead-status"
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
                                {processing ? 'Menyimpan...' : 'Simpan Lead'}
                            </button>
                            <Link href={route('leads.index')} className="btn-outline">Batal</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
