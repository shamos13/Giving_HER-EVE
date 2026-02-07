import { useEffect, useMemo, useState } from "react"
import { Filter, Mail, Search } from "lucide-react"
import { fetchMessageInsights, fetchMessages, type MessageDto, type MessageInsights } from "../../services/api"

function MessagesPage(): JSX.Element {
  const [statusFilter, setStatusFilter] = useState<MessageStatusFilter>("all")
  const [typeFilter, setTypeFilter] = useState<MessageTypeFilter>("all")
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<MessageDto[]>([])
  const [insights, setInsights] = useState<MessageInsights | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [messagesRes, insightsRes] = await Promise.all([
          fetchMessages(),
          fetchMessageInsights(),
        ])
        if (cancelled) return
        setMessages(messagesRes)
        setInsights(insightsRes)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load messages")
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

  const filteredMessages = useMemo(
    () =>
      messages.filter(message => {
        const matchesStatus = statusFilter === "all" || message.status === statusFilter
        const matchesType = typeFilter === "all" || message.type === typeFilter
        const matchesQuery =
          query.trim().length === 0 ||
          message.name.toLowerCase().includes(query.toLowerCase()) ||
          message.email.toLowerCase().includes(query.toLowerCase())

        return matchesStatus && matchesType && matchesQuery
      }),
    [messages, statusFilter, typeFilter, query],
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Contact Messages</p>
          <p className="text-lg font-bold text-slate-900">Assign, reply, and resolve inquiries</p>
          {loading && <p className="mt-1 text-xs text-slate-500">Loading messages...</p>}
          {error && <p className="mt-1 text-xs text-rose-600">Error: {error}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            <Filter size={16} />
            Quick filters
          </button>
          <button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md">
            New message
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="md:col-span-2 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Search size={16} className="text-slate-500" />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            placeholder="Search by name or email"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </div>
        <select
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
          value={typeFilter}
          onChange={event => setTypeFilter(event.target.value as MessageTypeFilter)}
        >
          <option value="all">All inquiries</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Donation">Donation</option>
          <option value="Partnership">Partnership</option>
          <option value="General">General</option>
        </select>
        <select
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
          value={statusFilter}
          onChange={event => setStatusFilter(event.target.value as MessageStatusFilter)}
        >
          <option value="all">All status</option>
          <option value="New">New</option>
          <option value="In progress">In progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Inquiry</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMessages.map(message => (
              <tr key={message.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{message.name}</p>
                  <p className="text-xs text-slate-500">{message.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    message.type === "Volunteer" ? "bg-purple-100 text-purple-700" : message.type === "Donation" ? "bg-amber-100 text-amber-700" : message.type === "Partnership" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                  }`}>
                    {message.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{message.preview}</td>
                <td className="px-4 py-3 text-slate-700">{new Date(message.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    message.status === "Resolved" ? "bg-green-100 text-green-700" : message.status === "In progress" ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-700"
                  }`}>
                    {message.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                      Reply
                    </button>
                    <button className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-slate-800">
                      Resolve
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filteredMessages.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">
                  No messages found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-purple-600" />
            <p className="text-sm font-semibold text-slate-900">Response SLAs</p>
          </div>
          <div className="mt-3 space-y-2">
            {insights?.sla?.map(row => (
              <SlaRow key={row.label} label={row.label} value={row.value} tone={row.tone} progress={row.progress} />
            ))}
            {!loading && (!insights || insights.sla.length === 0) && (
              <p className="text-xs text-slate-500">No SLA data available.</p>
            )}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm lg:col-span-2">
          <p className="text-sm font-semibold text-slate-900">Assignment tips</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {insights?.tips?.map(tip => (
              <Tip key={tip} text={tip} />
            ))}
            {!loading && (!insights || insights.tips.length === 0) && (
              <p className="text-xs text-slate-500">No tips available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SlaRow({ label, value, tone, progress }: SlaRowProps): JSX.Element {
  const toneClass = tone === "green" ? "from-green-500 to-emerald-400" : tone === "amber" ? "from-amber-500 to-yellow-400" : "from-blue-500 to-cyan-400"
  return (
    <div>
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
        <p>{label}</p>
        <p>{value}</p>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
        <div className={`h-2 rounded-full bg-gradient-to-r ${toneClass}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

function Tip({ text }: TipProps): JSX.Element {
  return <p className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">{text}</p>
}

export default MessagesPage

interface SlaRowProps {
  label: string
  value: string
  tone: "green" | "amber" | "blue"
  progress: number
}

interface TipProps {
  text: string
}

interface MessageRow {
  id: string
  name: string
  email: string
  type: "Volunteer" | "Donation" | "Partnership" | "General" | string
  preview: string
  date: string
  status: "New" | "In progress" | "Resolved" | string
}

type MessageStatusFilter = "all" | MessageRow["status"]
type MessageTypeFilter = "all" | MessageRow["type"]

