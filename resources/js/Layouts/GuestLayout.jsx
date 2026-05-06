// GuestLayout tidak digunakan lagi, Auth pages sekarang standalone
// Layout ini tetap ada untuk fallback jika ada page lain yang menggunakannya
export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen auth-bg flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }} />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #06B6D4, transparent)' }} />
            </div>
            <div className="relative w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
