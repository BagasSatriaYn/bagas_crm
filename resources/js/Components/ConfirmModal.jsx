import { useEffect } from 'react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Ya, Hapus', confirmClass = 'btn-danger', children }) {
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 text-base">{title}</h3>
                        <p className="text-slate-500 text-sm mt-1">{message}</p>
                        {children}
                    </div>
                </div>

                <div className="flex gap-3 mt-6 justify-end">
                    <button type="button" className="btn-outline" onClick={onClose}>Batal</button>
                    <button type="button" className={confirmClass} onClick={onConfirm}>{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
}
