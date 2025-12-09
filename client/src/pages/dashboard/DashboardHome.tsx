import { ArrowDownRight, ArrowUpRight, Clock3, MessageSquare, Shield } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

function DashboardHome(): JSX.Element {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(card => (
          <MetricCard key={card.title} card={card} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Donation Trends</p>
              <p className="text-xl font-bold text-slate-900">Last 6 months</p>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">+12.4% vs last period</span>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={donationTrendData} margin={{ left: -10, right: 10 }}>
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
            <p className="text-sm font-semibold text-slate-500">Latest contact messages</p>
            <div className="mt-3 space-y-3">
              {latestMessages.map(message => (
                <div key={message.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white grid place-items-center font-semibold">
                    {message.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{message.name}</p>
                    <p className="text-xs text-slate-500">{message.type}</p>
                    <p className="mt-1 text-sm text-slate-700">{message.preview}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${message.status === "New" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {message.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">Open messages</button>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 p-4 text-white shadow-md">
            <div className="flex items-center gap-3">
              <Shield size={18} />
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Operational tips</p>
            </div>
            <p className="mt-2 text-lg font-bold">Keep volunteers engaged</p>
            <p className="mt-1 text-sm text-white/85">Send weekly updates, celebrate milestones, and respond to new inquiries within 24 hours.</p>
            <button className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20">View playbook</button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="md:col-span-1 xl:col-span-2 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">Recent donations</p>
            <button className="text-xs font-semibold text-purple-600 hover:text-purple-500">View all</button>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 font-semibold">Donor</th>
                  <th className="px-3 py-2 font-semibold">Amount</th>
                  <th className="px-3 py-2 font-semibold">Category</th>
                  <th className="px-3 py-2 font-semibold">Date</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentDonations.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 text-sm font-semibold text-slate-700 grid place-items-center">
                          {item.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{item.donor}</p>
                          <p className="text-xs text-slate-500">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-900">${item.amount.toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">{item.category}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{item.date}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "Completed" ? "bg-green-100 text-green-700" : item.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-700"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Volunteer pulse</p>
          <div className="mt-3 space-y-3">
            {volunteerUpdates.map(update => (
              <div key={update.label} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{update.label}</p>
                  <span className={`text-xs font-semibold ${update.delta.includes("+") ? "text-green-600" : "text-amber-600"}`}>{update.delta}</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500" style={{ width: update.progress }} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{update.caption}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Clock3 size={16} />
              <p className="text-sm font-semibold">Upcoming: Volunteer briefing</p>
            </div>
            <p className="text-xs text-white/80">Thursday, 4:00 PM • Zoom</p>
          </div>
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
  card: MetricCardData
}

interface MetricCardData {
  title: string
  value: string
  delta: string
  caption: string
  trend: "up" | "down"
  accent: string
}

interface DonationTrendPoint {
  month: string
  donations: number
}

interface DonationRow {
  id: string
  donor: string
  initials: string
  email: string
  amount: number
  category: string
  date: string
  status: "Completed" | "Pending" | "Failed"
}

interface LatestMessage {
  id: string
  name: string
  initials: string
  type: string
  preview: string
  status: "New" | "In progress"
}

interface VolunteerUpdate {
  label: string
  progress: string
  delta: string
  caption: string
}

const metricCards: MetricCardData[] = [
  { title: "Total Users", value: "4,820", delta: "+8.2% vs last month", caption: "Active across all programs", trend: "up", accent: "bg-gradient-to-br from-purple-600 to-pink-500 text-white" },
  { title: "Donations", value: "$182,400", delta: "+12.4% vs last period", caption: "Average gift $110", trend: "up", accent: "bg-gradient-to-br from-amber-500 to-yellow-400 text-white" },
  { title: "Volunteers", value: "1,126", delta: "+4.1% new signups", caption: "Engaged weekly", trend: "up", accent: "bg-gradient-to-br from-slate-900 to-slate-700 text-white" },
  { title: "Open Messages", value: "38", delta: "-6.3% response time", caption: "Average reply in 2.1h", trend: "down", accent: "bg-gradient-to-br from-blue-500 to-cyan-400 text-white" },
]

const donationTrendData: DonationTrendPoint[] = [
  { month: "Jul", donations: 22 },
  { month: "Aug", donations: 25 },
  { month: "Sep", donations: 27 },
  { month: "Oct", donations: 30 },
  { month: "Nov", donations: 29 },
  { month: "Dec", donations: 33 },
]

const recentDonations: DonationRow[] = [
  { id: "d1", donor: "Amara Keita", initials: "AK", email: "amara@kindmail.com", amount: 500, category: "Education", date: "Dec 2", status: "Completed" },
  { id: "d2", donor: "Daniel Ikor", initials: "DI", email: "daniel@focus.org", amount: 320, category: "Healthcare", date: "Dec 1", status: "Pending" },
  { id: "d3", donor: "Lara Obeng", initials: "LO", email: "lara@impact.io", amount: 900, category: "Shelter", date: "Nov 30", status: "Completed" },
  { id: "d4", donor: "Robin Ade", initials: "RA", email: "robin@ade.com", amount: 150, category: "Food", date: "Nov 30", status: "Completed" },
]

const latestMessages: LatestMessage[] = [
  { id: "m1", name: "Serena Okafor", initials: "SO", type: "Volunteer inquiry", preview: "Happy to assist with the holiday drive next week...", status: "New" },
  { id: "m2", name: "Marco Ibeh", initials: "MI", type: "Donation follow-up", preview: "Please confirm the receipt for our foundation gift...", status: "In progress" },
  { id: "m3", name: "Hawa Mensah", initials: "HM", type: "Program request", preview: "We want to schedule the workshop for January...", status: "New" },
]

const volunteerUpdates: VolunteerUpdate[] = [
  { label: "Background checks", progress: "72%", delta: "+6% this week", caption: "18 volunteers pending verification" },
  { label: "Shift coverage", progress: "64%", delta: "-3% coverage gap", caption: "Add 6 volunteers to weekend shifts" },
  { label: "Training completion", progress: "81%", delta: "+4% completion", caption: "Send reminder to new cohort" },
]

