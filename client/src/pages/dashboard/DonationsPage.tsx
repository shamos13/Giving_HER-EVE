import { useEffect, useMemo, useState } from "react"
import { CalendarClock, Download, HandHeart, Search } from "lucide-react"
import { fetchDonations, downloadDonationReport, type DonationDto } from "../../services/api"

function DonationsPage(): JSX.Element {
  const [statusFilter, setStatusFilter] = useState<DonationStatusFilter>("all")
  const [categoryFilter, setCategoryFilter] = useState<DonationCategoryFilter>("all")
  const [query, setQuery] = useState("")
  const [rows, setRows] = useState<DonationRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchDonations()
        if (cancelled) return
        const mapped: DonationRow[] = data.map((d: DonationDto) => ({
          id: String(d.id),
          reference: `GH-${d.id.toString().padStart(6, "0")}`,
          donor: d.donorName ?? "Anonymous donor",
          email: d.donorEmail ?? "",
          amount: Number(d.amount ?? 0),
          category: "Education",
          date: new Date(d.createdAt).toLocaleDateString(),
          status: "Completed",
        }))
        setRows(mapped)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load donations")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredDonations = useMemo(
    () =>
      rows.filter(donation => {
        const matchesStatus = statusFilter === "all" || donation.status === statusFilter
        const matchesCategory = categoryFilter === "all" || donation.category === categoryFilter
        const matchesQuery =
          query.trim().length === 0 ||
          donation.donor.toLowerCase().includes(query.toLowerCase()) ||
          donation.reference.toLowerCase().includes(query.toLowerCase())

        return matchesStatus && matchesCategory && matchesQuery
      }),
    [rows, statusFilter, categoryFilter, query],
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Donations</p>
          <p className="text-lg font-bold text-slate-900">Track gifts and receipts</p>
          {loading && <p className="mt-1 text-xs text-slate-500">Loading latest donations...</p>}
          {error && <p className="mt-1 text-xs text-rose-600">Error: {error}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={async () => {
              try {
                await downloadDonationReport("xlsx")
              } catch (e) {
                // eslint-disable-next-line no-alert
                alert(e instanceof Error ? e.message : "Failed to export report")
              }
            }}
          >
            <Download size={16} />
            Export report
          </button>
          <button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md">
            Add donation
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="md:col-span-2 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Search size={16} className="text-slate-500" />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            placeholder="Search donor or reference"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </div>
        <select
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
          value={statusFilter}
          onChange={event => setStatusFilter(event.target.value as DonationStatusFilter)}
        >
          <option value="all">All status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
        <select
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
          value={categoryFilter}
          onChange={event => setCategoryFilter(event.target.value as DonationCategoryFilter)}
        >
          <option value="all">All categories</option>
          <option value="Education">Education</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Shelter">Shelter</option>
          <option value="Food">Food</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Reference</th>
              <th className="px-4 py-3 font-semibold">Donor</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDonations.map(donation => (
              <tr key={donation.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">{donation.reference}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{donation.donor}</p>
                  <p className="text-xs text-slate-500">{donation.email}</p>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">${donation.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">{donation.category}</span>
                </td>
                <td className="px-4 py-3 text-slate-700">{donation.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      donation.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : donation.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {donation.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                      Details
                    </button>
                    <button className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-slate-800">
                      Receipt
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filteredDonations.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                  No donations found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <HandHeart size={16} className="text-purple-600" />
            <p className="text-sm font-semibold text-slate-900">Status breakdown</p>
          </div>
          <div className="mt-3 space-y-2">
            <StatusRow label="Completed" value="68%" tone="green" />
            <StatusRow label="Pending" value="22%" tone="amber" />
            <StatusRow label="Failed" value="10%" tone="rose" />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarClock size={16} className="text-amber-600" />
            <p className="text-sm font-semibold text-slate-900">Next commitments</p>
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>Corporate matching</span>
              <span className="text-xs font-semibold text-slate-500">Dec 10</span>
            </p>
            <p className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>Foundation grant</span>
              <span className="text-xs font-semibold text-slate-500">Dec 15</span>
            </p>
            <p className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>Year-end appeal</span>
              <span className="text-xs font-semibold text-slate-500">Dec 22</span>
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 p-4 text-white shadow-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Compliance</p>
          <p className="mt-1 text-lg font-bold">Receipts & acknowledgements</p>
          <p className="mt-1 text-sm text-white/85">Send receipts within 24 hours. Add thank-you templates for donors and update for recurring gifts.</p>
          <button className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20">Open templates</button>
        </div>
      </div>
    </div>
  )
}

function StatusRow({ label, value, tone }: StatusRowProps): JSX.Element {
  const toneClass = tone === "green" ? "from-green-500 to-emerald-400" : tone === "amber" ? "from-amber-500 to-yellow-400" : "from-rose-500 to-orange-400"
  return (
    <div>
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
        <p>{label}</p>
        <p>{value}</p>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
        <div className={`h-2 rounded-full bg-gradient-to-r ${toneClass}`} style={{ width: value }} />
      </div>
    </div>
  )
}

export default DonationsPage

interface StatusRowProps {
  label: string
  value: string
  tone: "green" | "amber" | "rose"
}

interface DonationRow {
  id: string
  reference: string
  donor: string
  email: string
  amount: number
  category: "Education" | "Healthcare" | "Shelter" | "Food"
  date: string
  status: "Completed" | "Pending" | "Failed"
}

type DonationStatusFilter = "all" | DonationRow["status"]
type DonationCategoryFilter = "all" | DonationRow["category"]

const donationsData: DonationRow[] = [
  { id: "d1", reference: "GH-2024-8401", donor: "Nora Benson", email: "nora@kindmail.com", amount: 1200, category: "Education", date: "Dec 3", status: "Completed" },
  { id: "d2", reference: "GH-2024-8402", donor: "Ayodele James", email: "ayo@impact.org", amount: 450, category: "Food", date: "Dec 2", status: "Pending" },
  { id: "d3", reference: "GH-2024-8403", donor: "Zara Yemi", email: "zara@aid.io", amount: 980, category: "Healthcare", date: "Dec 1", status: "Completed" },
  { id: "d4", reference: "GH-2024-8404", donor: "Ibrahim Musa", email: "ibrahim@care.ng", amount: 300, category: "Shelter", date: "Nov 30", status: "Failed" },
  { id: "d5", reference: "GH-2024-8405", donor: "Tara Efe", email: "tara@friends.com", amount: 150, category: "Food", date: "Nov 29", status: "Completed" },
]

