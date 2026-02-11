import { useEffect, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  HandHeart,
  Megaphone,
  Pencil,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react"
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
  type DashboardMetric,
  type DashboardOperationsUpdate,
  type DashboardDonation,
} from "../../services/api"

function DashboardHome(): JSX.Element {
  const [donationTrend, setDonationTrend] = useState<DonationTrendPoint[]>([])
  const [summary, setSummary] = useState<{ totalAmount: number; totalCount: number } | null>(null)
  const [metrics, setMetrics] = useState<DashboardMetric[]>([])
  const [recentDonations, setRecentDonations] = useState<DashboardDonation[]>([])
  const [volunteerUpdates, setVolunteerUpdates] = useState<DashboardOperationsUpdate[]>([])
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

        const baseTrend: Array<Omit<DonationTrendPoint, "average">> = analytics.daily.map(point => ({
          month: new Date(point.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          donations: Number(point.total ?? 0) / 1000,
        }))

        const smoothedTrend: DonationTrendPoint[] = baseTrend.map((point, index, items) => {
          const neighbors = [items[index - 1]?.donations, point.donations, items[index + 1]?.donations].filter(
            (value): value is number => typeof value === "number",
          )
          const average = neighbors.reduce((sum, value) => sum + value, 0) / neighbors.length
          return {
            ...point,
            average: Number(average.toFixed(2)),
          }
        })

        setDonationTrend(smoothedTrend)
        setSummary({ totalAmount: Number(analytics.totalAmount ?? 0), totalCount: analytics.totalCount ?? 0 })
        setMetrics(overview.metrics ?? [])
        setRecentDonations(overview.recentDonations ?? [])
        setVolunteerUpdates(overview.operationsPulse?.updates ?? [])
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

  const performancePalette = ["bg-purple-600", "bg-amber-400", "bg-fuchsia-500", "bg-emerald-500"]
  const performanceFallback: PerformanceItem[] = [
    { id: "education", label: "Education Initiative", progress: 75, tone: performancePalette[0] },
    { id: "health", label: "Health & Wellness", progress: 60, tone: performancePalette[1] },
    { id: "empowerment", label: "E.V.E. Empowerment", progress: 45, tone: performancePalette[2] },
    { id: "shelter", label: "Shelter Support", progress: 30, tone: performancePalette[3] },
  ]

  const performanceItems: PerformanceItem[] = volunteerUpdates.length
    ? volunteerUpdates.slice(0, 4).map((update, index) => ({
        id: `${update.label}-${index}`,
        label: update.label,
        progress: Math.min(100, Math.max(0, Math.round(update.progress))),
        tone: performancePalette[index % performancePalette.length],
      }))
    : performanceFallback

  const donationActivities: ActivityItem[] = recentDonations.slice(0, 2).map(item => ({
    id: item.id,
    title: `New donation of $${item.amount.toLocaleString()} by ${item.donor || "Anonymous"}`,
    time: item.date,
    icon: HandHeart,
    tone: "bg-amber-100 text-amber-700",
  }))

  const defaultActivities: ActivityItem[] = [
    {
      id: "content-edit",
      title: 'Jane D. edited "Home Page"',
      time: "2 hours ago",
      icon: Pencil,
      tone: "bg-rose-100 text-rose-700",
    },
    {
      id: "campaign-update",
      title: 'Campaign "Health & Wellness" updated',
      time: "3 hours ago",
      icon: Megaphone,
      tone: "bg-purple-100 text-purple-700",
    },
    {
      id: "volunteer-approved",
      title: "Volunteer application approved for Sarah K.",
      time: "5 hours ago",
      icon: UserCheck,
      tone: "bg-emerald-100 text-emerald-700",
    },
  ]

  const activityItems = [...donationActivities, ...defaultActivities].slice(0, 4)

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-slate-900">Quick Stats</p>
            <p className="text-sm text-slate-500">Overview of today's admin snapshot.</p>
          </div>
          <button className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300">
            Monthly Snapshot
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map(card => (
            <MetricCard key={card.id} card={card} />
          ))}
          {!loading && metrics.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
              No stats available yet.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1.1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-500">Donation Trends</p>
              <p className="text-lg font-bold text-slate-900">Over the last 6 months</p>
              {summary && (
                <p className="mt-1 text-xs text-slate-500">
                  {summary.totalCount} gifts totaling ${summary.totalAmount.toLocaleString()}.
                </p>
              )}
              {loading && <p className="mt-1 text-xs text-slate-400">Refreshing dashboard data...</p>}
              {error && <p className="mt-1 text-xs text-rose-600">Error: {error}</p>}
            </div>
            <button className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300">
              Yearly Report
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-600" />
              Donations
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Rolling avg
            </span>
          </div>
          <div className="mt-4 h-64">
            {donationTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donationTrend} margin={{ left: -10, right: 10, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={value => `$${value}k`} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                    }}
                    labelStyle={{ color: "#1e293b", fontWeight: 700 }}
                    formatter={(value: number, name: string) => [
                      `$${value}k`,
                      name === "donations" ? "Donations" : "Rolling avg",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="donations"
                    stroke="#6A0DAD"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line type="monotone" dataKey="average" stroke="#FBBF24" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center text-sm text-slate-400">
                {loading ? "Loading chart..." : "No donation trend data yet."}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Campaign Performance</p>
          <p className="text-lg font-bold text-slate-900">Campaigns progress</p>
          <div className="mt-4 space-y-4">
            {performanceItems.map(item => (
              <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="min-w-[160px] flex-1">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                      <span>{item.label}</span>
                      <span className="text-slate-500">{item.progress}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                      <div className={`h-2 rounded-full ${item.tone}`} style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                  <button className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-amber-300">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Recent Activity</p>
          <p className="text-lg font-bold text-slate-900">Latest updates</p>
          <div className="mt-4 space-y-4">
            {activityItems.map(item => (
              <div key={item.id} className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-full ${item.tone} grid place-items-center`}>
                  <item.icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const metricStyles: Record<string, MetricStyle> = {
  totalUsers: { icon: Users, iconBg: "bg-purple-100 text-purple-600", ring: "border-purple-200" },
  donations: { icon: HandHeart, iconBg: "bg-amber-100 text-amber-600", ring: "border-purple-200" },
  volunteers: { icon: UserPlus, iconBg: "bg-emerald-100 text-emerald-600", ring: "border-purple-200" },
  openMessages: { icon: Mail, iconBg: "bg-sky-100 text-sky-600", ring: "border-purple-200" },
}

const metricFallback: MetricStyle = {
  icon: BarChart3,
  iconBg: "bg-slate-100 text-slate-600",
  ring: "border-slate-200",
}

function MetricCard({ card }: MetricCardProps): JSX.Element {
  const metricStyle = metricStyles[card.id] ?? metricFallback
  const TrendIcon = card.trend === "up" ? ArrowUpRight : ArrowDownRight

  return (
    <div className={`rounded-2xl border ${metricStyle.ring} bg-white p-4 shadow-sm`}>
      <div className="flex items-center gap-3">
        <div className={`h-12 w-12 rounded-full ${metricStyle.iconBg} grid place-items-center`}>
          <metricStyle.icon size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-600">{card.title}</p>
          <p className="text-2xl font-bold text-slate-900">{card.value}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className={`flex items-center gap-1 font-semibold ${card.trend === "up" ? "text-emerald-600" : "text-amber-600"}`}>
          <TrendIcon size={14} />
          {card.delta}
        </span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-500">{card.caption}</span>
      </div>
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
  average: number
}

interface PerformanceItem {
  id: string
  label: string
  progress: number
  tone: string
}

interface ActivityItem {
  id: string
  title: string
  time: string
  icon: LucideIcon
  tone: string
}

interface MetricStyle {
  icon: LucideIcon
  iconBg: string
  ring: string
}
