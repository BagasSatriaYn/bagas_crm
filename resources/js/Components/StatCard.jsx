export default function StatCard({ label, value, icon, gradient, sub }) {
    return (
        <div className={`stat-card ${gradient}`}>
            <div className="stat-card-icon">{icon}</div>
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-label">{label}</div>
            {sub && <div className="text-xs opacity-60 mt-1">{sub}</div>}
        </div>
    );
}
