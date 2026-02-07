import { useEffect, useState } from "react"
import { ArrowDownRight, ArrowUpRight, Clock3 } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  fetchDashboardOverview,
  fetchDonationAnalytics,
  type DashboardFocus,
  type DashboardMetric,
  type DashboardNextSession,
  type DashboardOperationsUpdate,
  type DashboardDonation,
} from "../../services/api"

function DashboardHome(): JSX.Element {
  const [donationTrend, setDonationTrend] = useState<DonationTrendPoint[]>([])
  const [summary, setSummary] = useState<{ totalAmount: number; totalCount: number } | null>(null)
  const [metrics, setMetrics] = useState<DashboardMetric[]>([])
  const [recentDonations, setRecentDonations] = useState<DashboardDonation[]>([])
  const [volunteerUpdates, setVolunteerUpdates] = useState<DashboardOperationsUpdate[]>([])
  const [focus, setFocus] = useState<DashboardFocus | null>(null)
  const [nextSession, setNextSession] = useState<DashboardNextSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const end = new Date()
    const start = new Date()
    start.setMonth(start.getMonth() - 5)

    const startIso = start.toISOString()
    const endIso = end.toISOString()

    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [analytics, overview] = await Promise.all([
          fetchDonationAnalytics({ start: startIso, end: endIso }),
          fetchDashboardOverview(),
        ])
        if (cancelled) return

        const mappedTrend: DonationTrendPoint[] = analytics.daily.map(point => ({
          month: new Date(point.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          donations: Number(point.total ?? 0) / 1000,
        }))

        setDonationTrend(mappedTrend)
        setSummary({ totalAmount: Number(analytics.totalAmount ?? 0), totalCount: analytics.totalCount ?? 0 })
        setMetrics(overview.metrics ?? [])
        setRecentDonations(overview.recentDonations ?? [])
        setVolunteerUpdates(overview.operationsPulse?.updates ?? [])
        setFocus(overview.focus ?? null)
        setNextSession(overview.operationsPulse?.nextSession ?? null)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard")
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

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map(card => (
          <MetricCard key={card.id} card={card} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Donations overview</p>
              <p className="text-xl font-bold text-slate-900">Last 6 months</p>
              {summary && (
                <p className="mt-1 text-xs text-slate-500">
                  {summary.totalCount} gifts totaling ${summary.totalAmount.toLocaleString()}.
                </p>
              )}
              {loading && <p className="mt-1 text-xs text-slate-400">Refreshing dashboard data...</p>}
              {error && <p className="mt-1 text-xs text-rose-600">Error: {error}</p>}
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              At-a-glance funding momentum
            </span>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={donationTrend} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={value => `$${value}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
                  labelStyle={{ color: "#1e293b", fontWeight: 700 }}
                  formatter={(value: number) => [`$${value}k`, "Donations"]}
                />
                <Line type="monotone" dataKey="donations" stroke="#6A0DAD" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">{focus?.title ?? "Today's focus"}</p>
            <p className="mt-1 text-sm text-slate-700">
              {focus?.body ?? "Add a focus note to highlight daily priorities."}
            </p>
            {focus?.tip && (
              <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                {focus.tip}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Recent donations</p>
          <div className="mt-3 space-y-3">
            {recentDonations.map(item => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-100 text-sm font-semibold text-slate-700 grid place-items-center">
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.donor}</p>
                    <p className="text-xs text-slate-500">{item.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">${item.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{item.date}</p>
                </div>
              </div>
            ))}
            {!loading && recentDonations.length === 0 && (
              <p className="text-xs text-slate-500">No recent donations yet.</p>
            )}
          </div>
          <button className="mt-3 w-full rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Go to full donations view
          </button>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Operations pulse</p>
          <div className="mt-3 space-y-3">
            {volunteerUpdates.map(update => (
              <div key={update.label} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{update.label}</p>
                  <span className={`text-xs font-semibold ${update.delta.includes("+") ? "text-green-600" : "text-amber-600"}`}>
                    {update.delta}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500" style={{ width: `${update.progress}%` }} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{update.caption}</p>
              </div>
            ))}
            {!loading && volunteerUpdates.length === 0 && (
              <p className="text-xs text-slate-500">No operations updates yet.</p>
            )}
          </div>
          {nextSession && (
            <div className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Clock3 size={16} />
                <p className="text-sm font-semibold">{nextSession.title}</p>
              </div>
              <p className="text-xs text-white/80">{nextSession.body}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function MetricCard({ card }: MetricCardProps): JSX.Element {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 hover:-translate-y-0.5 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{card.title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
        </div>
        <div className={`h-12 w-12 rounded-xl grid place-items-center ${card.accent}`}>
          {card.trend === "up" ? <ArrowUpRight className="text-white" /> : <ArrowDownRight className="text-white" />}
        </div>
      </div>
      <p className={`mt-2 text-sm font-semibold ${card.trend === "up" ? "text-green-600" : "text-amber-600"}`}>{card.delta}</p>
      <p className="text-xs text-slate-500">{card.caption}</p>
    </div>
  )
}

export default DashboardHome

interface MetricCardProps {
  card: DashboardMetric
}

interface DonationTrendPoint {
  month: string
  donations: number
}
