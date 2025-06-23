export default function ActivityLog({ entries = [] }) {
  return (
    <ul className="space-y-2">
      {entries.map((log, i) => (
        <li key={i} className={`text-sm ${log.color}`}>
          • {log.message}
        </li>
      ))}
    </ul>
  );
}
