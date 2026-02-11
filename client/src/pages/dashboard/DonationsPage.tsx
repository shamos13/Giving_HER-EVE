import { useEffect, useMemo, useState } from "react"
import {
  CalendarClock,
  Download,
  HandHeart,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Copy,
  Mail,
  Info,
  X,
} from "lucide-react"
import { toast } from "react-toastify"
import {
  fetchDonations,
  downloadDonationReport,
  fetchDonationCommitments,
  fetchDonationStatusBreakdown,
  type DonationDto,
  type DonationCommitment,
  type DonationStatusBreakdown,
} from "../../services/api"

function DonationsPage(): JSX.Element {
  const [statusFilter, setStatusFilter] = useState<DonationStatusFilter>("all")
  const [categoryFilter, setCategoryFilter] = useState<DonationCategoryFilter>("all")
  const [query, setQuery] = useState("")
  const [rows, setRows] = useState<DonationRow[]>([])
  const [statusBreakdown, setStatusBreakdown] = useState<DonationStatusBreakdown[]>([])
  const [commitments, setCommitments] = useState<DonationCommitment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [sortBy, setSortBy] = useState<DonationSortKey>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)
  const [selectedDonation, setSelectedDonation] = useState<DonationRow | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(25)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [donationRes, breakdownRes, commitmentsRes] = await Promise.all([
          fetchDonations(),
          fetchDonationStatusBreakdown(),
          fetchDonationCommitments(),
        ])
        if (cancelled) return
        const mapped: DonationRow[] = donationRes.map((d: DonationDto) => ({
          id: String(d.id),
          reference: `GH-${d.id.toString().padStart(6, "0")}`,
          donor: d.donorName ?? "Anonymous donor",
          email: d.donorEmail ?? "",
          amount: Number(d.amount ?? 0),
          category: d.category ?? "General",
          date: new Date(d.createdAt).toLocaleDateString(),
          status: d.status ?? "Completed",
        }))
        setRows(mapped)
        setStatusBreakdown(breakdownRes)
        setCommitments(commitmentsRes)
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

  // 500ms debounce for search
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(query.trim())
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(handle)
  }, [query])

  const filteredDonations = useMemo(
    () =>
      rows.filter(donation => {
        const matchesStatus = statusFilter === "all" || donation.status === statusFilter
        const matchesCategory = categoryFilter === "all" || donation.category === categoryFilter
        const q = debouncedQuery.toLowerCase()
        const matchesQuery =
          q.length === 0 ||
          donation.donor.toLowerCase().includes(q) ||
          donation.email.toLowerCase().includes(q) ||
          donation.reference.toLowerCase().includes(q)

        return matchesStatus && matchesCategory && matchesQuery
      }),
    [rows, statusFilter, categoryFilter, debouncedQuery],
  )

  const sortedDonations = useMemo(() => {
    const data = [...filteredDonations]
    data.sort((a, b) => {
      if (sortBy === "amount") {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
      }
      // default: date
      const da = new Date(a.date).getTime()
      const db = new Date(b.date).getTime()
      return sortDirection === "asc" ? da - db : db - da
    })
    return data
  }, [filteredDonations, sortBy, sortDirection])

  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, categoryFilter, pageSize])

  const totalPages = Math.max(1, Math.ceil(sortedDonations.length / pageSize))
  const paginatedDonations = useMemo(
    () => sortedDonations.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [sortedDonations, currentPage, pageSize],
  )

  const categoryOptions = useMemo(() => {
    const values = Array.from(new Set(rows.map(row => row.category))).filter(Boolean)
    return values.length > 0 ? values : ["General"]
  }, [rows])

  const statusOptions = useMemo(() => {
    const values = Array.from(new Set(rows.map(row => row.status))).filter(Boolean)
    return values.length > 0 ? values : ["Completed", "Pending", "Failed"]
  }, [rows])

  const totalAmount = useMemo(() => rows.reduce((sum, row) => sum + row.amount, 0), [rows])
  const totalCount = useMemo(() => rows.length, [rows])

  function toggleSort(key: DonationSortKey) {
    if (sortBy === key) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(key)
      setSortDirection(key === "date" ? "desc" : "asc")
    }
  }

  function toggleExpand(id: string) {
    setExpandedRowId(prev => (prev === id ? null : id))
  }

  function openDetails(donation: DonationRow) {
    setSelectedDonation(donation)
  }

  function closeDetails() {
    setSelectedDonation(null)
  }

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
                toast.error(e instanceof Error ? e.message : "Failed to export report")
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

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Donations</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">${totalAmount.toLocaleString()}</p>
          <p className="text-xs text-slate-500">All time recorded</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Gifts</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalCount.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Individual donations</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Average Gift</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            ${totalCount > 0 ? Math.round(totalAmount / totalCount).toLocaleString() : 0}
          </p>
          <p className="text-xs text-slate-500">Based on current records</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="md:col-span-2 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Search size={16} className="text-slate-500" />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            placeholder="Search by name, email, reference..."
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
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
          value={categoryFilter}
          onChange={event => setCategoryFilter(event.target.value as DonationCategoryFilter)}
        >
          <option value="all">All categories</option>
          {categoryOptions.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Reference</th>
              <th className="px-4 py-3 font-semibold">Donor</th>
              <th className="px-4 py-3 font-semibold">
                <button
                  type="button"
                  onClick={() => toggleSort("amount")}
                  className="inline-flex items-center gap-1"
                >
                  Amount
                  {sortBy === "amount" && (
                    sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">
                <button
                  type="button"
                  onClick={() => toggleSort("date")}
                  className="inline-flex items-center gap-1"
                >
                  Date
                  {sortBy === "date" && (
                    sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedDonations.map(donation => (
              <>
                <tr
                  key={donation.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => toggleExpand(donation.id)}
                >
                  <td className="px-4 py-3 font-semibold text-slate-900">{donation.reference}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{donation.donor}</p>
                    <p className="text-xs text-slate-500">{donation.email}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">${donation.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      {donation.category}
                    </span>
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
                  <td
                    className="px-4 py-3 text-right"
                    onClick={event => {
                      event.stopPropagation()
                    }}
                  >
                    <div className="flex justify-end gap-2">
                      <button
                        className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                        onClick={() => openDetails(donation)}
                      >
                        Details
                      </button>
                      <button
                        className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                        onClick={() => {
                          toast.info("Receipt download for a single donation will be wired to the backend.")
                        }}
                      >
                        Receipt
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRowId === donation.id && (
                  <tr key={`${donation.id}-expanded`} className="bg-slate-50/80">
                    <td className="px-4 pb-4 pt-0" colSpan={7}>
                      <div className="mt-2 rounded-xl border border-slate-100 bg-white p-4 text-xs text-slate-700 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-slate-500">Donation ID</p>
                            <p className="font-mono text-sm text-slate-900">{donation.id}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500">Reference</p>
                            <p className="font-mono text-sm text-slate-900">{donation.reference}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500">Amount</p>
                            <p className="text-sm font-semibold text-slate-900">
                              ${donation.amount.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500">Status</p>
                            <p className="text-sm font-semibold text-slate-900">{donation.status}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Mail size={14} />
                            <span>{donation.email || "No email on record"}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                              onClick={() => openDetails(donation)}
                            >
                              <Info size={14} />
                              View full details
                            </button>
                            <button
                              className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                              onClick={() => {
                                toast.info("Thank-you email will be sent via backend integration.")
                              }}
                            >
                              <Mail size={14} />
                              Send thank you
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {!loading && sortedDonations.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                  No donations found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {paginatedDonations.map(donation => (
          <button
            key={donation.id}
            type="button"
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm"
            onClick={() => openDetails(donation)}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {donation.reference}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{donation.donor}</p>
                <p className="text-xs text-slate-500">{donation.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">
                  ${donation.amount.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">{donation.date}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                {donation.category}
              </span>
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
            </div>
          </button>
        ))}
        {!loading && sortedDonations.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">
            No donations found for the selected filters.
          </p>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm sm:flex-row">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-800 outline-none"
            value={pageSize}
            onChange={event => setPageSize(Number(event.target.value) as PageSize)}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span>
            Page{" "}
            <span className="font-semibold text-slate-900">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {totalPages}
            </span>
          </span>
          <div className="flex items-center gap-1">
            <button
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 disabled:opacity-40"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 disabled:opacity-40"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <HandHeart size={16} className="text-purple-600" />
            <p className="text-sm font-semibold text-slate-900">Status breakdown</p>
          </div>
          <div className="mt-3 space-y-2">
            {statusBreakdown.map(item => (
              <StatusRow key={item.label} label={item.label} value={item.value} tone={item.tone} />
            ))}
            {!loading && statusBreakdown.length === 0 && (
              <p className="text-xs text-slate-500">No status data available.</p>
            )}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarClock size={16} className="text-amber-600" />
            <p className="text-sm font-semibold text-slate-900">Next commitments</p>
          </div>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {commitments.map(item => (
              <p key={item.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span>{item.label}</span>
                <span className="text-xs font-semibold text-slate-500">
                  {new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </p>
            ))}
            {!loading && commitments.length === 0 && (
              <p className="text-xs text-slate-500">No upcoming commitments.</p>
            )}
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 p-4 text-white shadow-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Compliance</p>
          <p className="mt-1 text-lg font-bold">Receipts & acknowledgements</p>
          <p className="mt-1 text-sm text-white/85">Send receipts within 24 hours. Add thank-you templates for donors and update for recurring gifts.</p>
          <button className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20">Open templates</button>
        </div>
      </div>

      {/* Donation detail modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Donation detail
                </p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {selectedDonation.donor || "Anonymous donor"}
                </p>
                <p className="text-xs text-slate-500">
                  Reference{" "}
                  <span className="font-mono font-semibold text-slate-900">
                    {selectedDonation.reference}
                  </span>
                </p>
              </div>
              <button
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                onClick={closeDetails}
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="space-y-1 rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">Amount</p>
                <p className="text-lg font-semibold text-slate-900">
                  ${selectedDonation.amount.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">Status: {selectedDonation.status}</p>
              </div>
              <div className="space-y-1 rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">Campaign</p>
                <p className="text-sm font-semibold text-slate-900">
                  {selectedDonation.category}
                </p>
                <p className="text-xs text-slate-500">Date: {selectedDonation.date}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-600">Payment reference</span>
                <button
                  className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(selectedDonation.reference)
                      toast.success("Payment reference copied.")
                    } catch {
                      toast.error("Could not copy to clipboard.")
                    }
                  }}
                >
                  <Copy size={12} />
                  Copy
                </button>
              </div>
              <p className="font-mono text-xs text-slate-900">
                {selectedDonation.reference}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Mail size={14} className="text-slate-500" />
                <span>{selectedDonation.email || "No donor email on file"}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-between gap-2">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                onClick={() => {
                  toast.info("Receipt download will be implemented with backend endpoint.")
                }}
              >
                <Download size={14} />
                Download receipt
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:shadow-md"
                onClick={() => {
                  toast.info("Thank-you email sending will be wired to backend.")
                }}
              >
                <HandHeart size={14} />
                Send thank you
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusRow({ label, value, tone }: StatusRowProps): JSX.Element {
  const toneClass = tone === "green" ? "from-green-500 to-emerald-400" : tone === "amber" ? "from-amber-500 to-yellow-400" : "from-rose-500 to-orange-400"
  return (
    <div>
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
        <p>{label}</p>
        <p>{value}%</p>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
        <div className={`h-2 rounded-full bg-gradient-to-r ${toneClass}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default DonationsPage

interface StatusRowProps {
  label: string
  value: number
  tone: "green" | "amber" | "rose" | "blue"
}

interface DonationRow {
  id: string
  reference: string
  donor: string
  email: string
  amount: number
  category: string
  date: string
  status: string
}

type DonationStatusFilter = "all" | DonationRow["status"]
type DonationCategoryFilter = "all" | DonationRow["category"]
type DonationSortKey = "date" | "amount"
type SortDirection = "asc" | "desc"
type PageSize = 25 | 50 | 100
