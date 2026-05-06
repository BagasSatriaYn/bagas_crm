import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Login — CRM PT. Smart" />

            <div className="min-h-screen auth-bg flex items-center justify-center p-4">
                {/* Decorative circles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
                        style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }} />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-10"
                        style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />
                </div>

                <div className="relative w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                    {/* Menggunakan tag img untuk memanggil gambar dari folder public */}
                    <img 
                        src="/images/smart-logo.png" 
                        alt="Logo PT Smart" 
                        className="w-28 h-auto mx-auto mb-4 object-contain"
                    />
                    <h1 className="text-3xl font-bold text-white">PT. Smart CRM</h1>
                    <p className="text-slate-400 mt-2 text-sm">Internet Service Provider</p>
                </div>

                    {/* Card */}
                    <div className="auth-card">
                        <h2 className="text-xl font-bold text-slate-800 mb-1">Selamat Datang</h2>
                        <p className="text-slate-500 text-sm mb-6">Masuk ke akun CRM Anda</p>

                        {status && (
                            <div className="alert-success mb-4">{status}</div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="email@smart.com"
                                    autoComplete="username"
                                    autoFocus
                                />
                                {errors.email && <div className="form-error">{errors.email}</div>}
                            </div>

                            <div className="form-group">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="form-label mb-0">Password</label>
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="text-xs text-blue-600 hover:text-blue-700">
                                            Lupa password?
                                        </Link>
                                    )}
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                {errors.password && <div className="form-error">{errors.password}</div>}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-300 text-blue-600"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                />
                                <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                                    Ingat saya
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary w-full justify-center py-3 text-base mt-2"
                                style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}
                            >
                                {processing ? (
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : 'Masuk'}
                            </button>
                        </form>

                        <div className="mt-6 pt-5 border-t border-slate-200 text-center">
                            <p className="text-xs text-slate-400">
                                © 2025 PT. Smart ISP — CRM System v1.0
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
