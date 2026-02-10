import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, Mail, MessageSquare, Search, Send } from "lucide-react"
import { fetchMessageInsights, fetchMessages, type MessageDto, type MessageInsights } from "../../services/api"

function MessagesPage(): JSX.Element {
  const [statusFilter, setStatusFilter] = useState<MessageStatusFilter>("all")
  const [typeFilter, setTypeFilter] = useState<MessageTypeFilter>("all")
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<MessageDto[]>([])
  const [insights, setInsights] = useState<MessageInsights | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
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
        if (messagesRes.length > 0) {
          setSelectedId(messagesRes[0].id)
        }
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

  useEffect(() => {
    if (filteredMessages.length === 0) {
      setSelectedId(null)
      return
    }
    if (!selectedId || !filteredMessages.some(message => message.id === selectedId)) {
      setSelectedId(filteredMessages[0].id)
    }
  }, [filteredMessages, selectedId])

  const selectedMessage = filteredMessages.find(message => message.id === selectedId) ?? null

  function handleReply() {
    if (!selectedMessage) return
    if (!replyText.trim()) {
      // eslint-disable-next-line no-alert
      alert("Write a reply before sending.")
      return
    }
    // eslint-disable-next-line no-alert
    alert(`Reply sent to ${selectedMessage.email}.`)
    setReplyText("")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Helpdesk Inbox</p>
          <p className="text-lg font-bold text-slate-900">Read, reply, and resolve supporter messages</p>
          {loading && <p className="mt-1 text-xs text-slate-500">Loading messages...</p>}
          {error && <p className="mt-1 text-xs text-rose-600">Error: {error}</p>}
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

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Inbox</p>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {filteredMessages.length} messages
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {filteredMessages.map(message => (
              <button
                key={message.id}
                className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                  selectedId === message.id
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200"
                }`}
                onClick={() => setSelectedId(message.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`font-semibold ${selectedId === message.id ? "text-white" : "text-slate-900"}`}>
                      {message.name}
                    </p>
                    <p className={`text-xs ${selectedId === message.id ? "text-white/70" : "text-slate-500"}`}>
                      {message.email}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    message.status === "Resolved"
                      ? "bg-emerald-100 text-emerald-700"
                      : message.status === "In progress"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-200 text-slate-700"
                  }`}>
                    {message.status}
                  </span>
                </div>
                <p className={`mt-2 text-xs ${selectedId === message.id ? "text-white/70" : "text-slate-500"}`}>
                  {message.preview}
                </p>
                <div className={`mt-2 flex items-center gap-2 text-[10px] uppercase tracking-wide ${
                  selectedId === message.id ? "text-white/60" : "text-slate-400"
                }`}>
                  <span>{message.type}</span>
                  <span>•</span>
                  <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
            {!loading && filteredMessages.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">
                No messages found for the selected filters.
              </p>
            )}
          </div>
        </aside>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          {selectedMessage ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Conversation</p>
                  <p className="text-lg font-bold text-slate-900">{selectedMessage.name}</p>
                  <p className="text-xs text-slate-500">{selectedMessage.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedMessage.type === "Volunteer"
                      ? "bg-purple-100 text-purple-700"
                      : selectedMessage.type === "Donation"
                        ? "bg-amber-100 text-amber-700"
                        : selectedMessage.type === "Partnership"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                  }`}>
                    {selectedMessage.type}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedMessage.status === "Resolved"
                      ? "bg-emerald-100 text-emerald-700"
                      : selectedMessage.status === "In progress"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-200 text-slate-700"
                  }`}>
                    {selectedMessage.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <MessageSquare size={14} />
                  Message
                </div>
                <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">
                  {selectedMessage.message || selectedMessage.preview}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Received {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <label className="text-sm font-semibold text-slate-900">Reply</label>
                <textarea
                  className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  placeholder="Write a response to the supporter..."
                  value={replyText}
                  onChange={event => setReplyText(event.target.value)}
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                    onClick={handleReply}
                  >
                    <Send size={14} />
                    Send reply
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700"
                    onClick={() => {
                      // eslint-disable-next-line no-alert
                      alert("Resolve action will be wired to the backend.")
                    }}
                  >
                    <CheckCircle2 size={14} />
                    Mark resolved
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="grid h-full place-items-center text-sm text-slate-500">
              Select a message to read and reply.
            </div>
          )}
        </section>
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
