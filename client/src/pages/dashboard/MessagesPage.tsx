import { useMemo, useState } from "react"
import { Filter, Mail, Search } from "lucide-react"

function MessagesPage(): JSX.Element {
  const [statusFilter, setStatusFilter] = useState<MessageStatusFilter>("all")
  const [typeFilter, setTypeFilter] = useState<MessageTypeFilter>("all")
  const [query, setQuery] = useState("")

  const filteredMessages = useMemo(
    () =>
      messagesData.filter(message => {
        const matchesStatus = statusFilter === "all" || message.status === statusFilter
        const matchesType = typeFilter === "all" || message.type === typeFilter
        const matchesQuery =
          query.trim().length === 0 ||
          message.name.toLowerCase().includes(query.toLowerCase()) ||
          message.email.toLowerCase().includes(query.toLowerCase())

        return matchesStatus && matchesType && matchesQuery
      }),
    [statusFilter, typeFilter, query],
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Contact Messages</p>
          <p className="text-lg font-bold text-slate-900">Assign, reply, and resolve inquiries</p>
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
                <td className="px-4 py-3 text-slate-700">{message.date}</td>
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
            <SlaRow label="Volunteer inquiries" value="2.1h avg" tone="green" />
            <SlaRow label="Donation receipts" value="1.4h avg" tone="amber" />
            <SlaRow label="Partnership requests" value="4.3h avg" tone="blue" />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm lg:col-span-2">
          <p className="text-sm font-semibold text-slate-900">Assignment tips</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Tip text="Auto-assign donation questions to finance admins for faster receipts." />
            <Tip text="Volunteer inquiries should include shift availability and preferred location." />
            <Tip text="Tag partnership leads with source (email, site form, referral) for follow-up." />
            <Tip text="Resolve messages with a final note and add knowledge base links when possible." />
          </div>
        </div>
      </div>
    </div>
  )
}

function SlaRow({ label, value, tone }: SlaRowProps): JSX.Element {
  const toneClass = tone === "green" ? "from-green-500 to-emerald-400" : tone === "amber" ? "from-amber-500 to-yellow-400" : "from-blue-500 to-cyan-400"
  return (
    <div>
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
        <p>{label}</p>
        <p>{value}</p>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
        <div className={`h-2 rounded-full bg-gradient-to-r ${toneClass}`} style={{ width: "70%" }} />
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
}

interface TipProps {
  text: string
}

interface MessageRow {
  id: string
  name: string
  email: string
  type: "Volunteer" | "Donation" | "Partnership" | "General"
  preview: string
  date: string
  status: "New" | "In progress" | "Resolved"
}

type MessageStatusFilter = "all" | MessageRow["status"]
type MessageTypeFilter = "all" | MessageRow["type"]

const messagesData: MessageRow[] = [
  { id: "m1", name: "Adaeze Chukwu", email: "ada@helper.com", type: "Volunteer", preview: "Available weekends, interested in the shelter program...", date: "Dec 2", status: "New" },
  { id: "m2", name: "Grace Daniels", email: "grace@foundation.org", type: "Donation", preview: "Please confirm our November wire receipt...", date: "Dec 1", status: "In progress" },
  { id: "m3", name: "Leo Adebisi", email: "leo@partners.io", type: "Partnership", preview: "Can we co-host the January awareness event?", date: "Dec 1", status: "Resolved" },
  { id: "m4", name: "Sarah Bello", email: "sarah@community.ng", type: "General", preview: "Requesting brochures for our community center...", date: "Nov 30", status: "New" },
]

