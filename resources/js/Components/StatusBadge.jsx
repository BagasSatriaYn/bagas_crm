export default function StatusBadge({ status, type = 'lead' }) {
    const leadMap = {
        new:         { label: 'New',        cls: 'badge-new' },
        contacted:   { label: 'Contacted',  cls: 'badge-contacted' },
        negotiation: { label: 'Negosiasi',  cls: 'badge-negotiation' },
        converted:   { label: 'Converted',  cls: 'badge-converted' },
        lost:        { label: 'Lost',        cls: 'badge-lost' },
    };

    const projectMap = {
        'waiting approval': { label: 'Waiting Approval', cls: 'badge-waiting' },
        approved:           { label: 'Approved',         cls: 'badge-approved' },
        rejected:           { label: 'Rejected',         cls: 'badge-rejected' },
    };

    const map = type === 'project' ? projectMap : leadMap;
    const item = map[status] || { label: status, cls: 'badge bg-slate-100 text-slate-600' };

    return <span className={item.cls}>{item.label}</span>;
}
