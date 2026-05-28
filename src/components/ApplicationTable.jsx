import { jobStatuses } from "../data/demoData";

const statusStyles = {
  Applied: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  Interview: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Offer: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Rejected: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  Saved: "bg-neutral-500/10 text-neutral-700 dark:text-neutral-300"
};

export function ApplicationTable({ applications, onUpdate }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-white/10">
      <table className="min-w-full divide-y divide-neutral-200 text-left text-sm dark:divide-white/10">
        <thead className="bg-neutral-50 text-xs uppercase text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
          <tr>
            <th className="px-4 py-3 font-bold">Company</th>
            <th className="px-4 py-3 font-bold">Role</th>
            <th className="px-4 py-3 font-bold">Status</th>
            <th className="px-4 py-3 font-bold">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 bg-white dark:divide-white/10 dark:bg-neutral-950">
          {applications.map((application) => (
            <tr key={application.id}>
              <td className="px-4 py-4 font-bold text-neutral-950 dark:text-white">
                {application.company}
              </td>
              <td className="px-4 py-4 text-neutral-600 dark:text-neutral-300">{application.role}</td>
              <td className="px-4 py-4">
                <select
                  value={application.status}
                  onChange={(event) => onUpdate(application.id, { status: event.target.value })}
                  className={`rounded-full border-0 px-3 py-1.5 text-xs font-bold outline-none ${statusStyles[application.status]}`}
                >
                  {jobStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-4 text-neutral-500 dark:text-neutral-400">{application.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
