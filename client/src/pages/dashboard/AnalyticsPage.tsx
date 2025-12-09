import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

function AnalyticsPage(): JSX.Element {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-500">Analytics & Reports</p>
        <p className="text-lg font-bold text-slate-900">Trends across donations, reach, and volunteers</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Donation performance</p>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">+14.2% QoQ</span>
          </div>
          <div className="mt-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={donationPerformance}>
                <defs>
                  <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6A0DAD" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6A0DAD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={value => `$${value}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#6A0DAD" strokeWidth={3} fillOpacity={1} fill="url(#donationGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Program reach</p>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Year to date</span>
          </div>
          <div className="mt-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programReach} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="program" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="women" stackId="reach" fill="#6A0DAD" radius={[8, 8, 0, 0]} />
                <Bar dataKey="families" stackId="reach" fill="#F036DC" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm font-semibold text-slate-900">Volunteer growth</p>
          <div className="mt-3 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volunteerGrowth}>
                <defs>
                  <linearGradient id="volunteerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#volunteerGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">Include new onboarding cohort and returning volunteers.</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm font-semibold text-slate-900">Channel mix</p>
          <div className="mt-3 space-y-3">
            {channelMix.map(channel => (
              <div key={channel.label} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{channel.label}</p>
                  <p className="text-xs font-semibold text-slate-500">{channel.value}</p>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500" style={{ width: channel.value }} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{channel.caption}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 p-4 text-white shadow-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Reports</p>
          <p className="mt-1 text-lg font-bold">Export insights</p>
          <p className="mt-1 text-sm text-white/85">Download donation trends, volunteer growth, and program reach as PDF or CSV for board reporting.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20">Export PDF</button>
            <button className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20">Export CSV</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage

interface DonationPerformance {
  month: string
  amount: number
}

interface ProgramReach {
  program: string
  women: number
  families: number
}

interface VolunteerGrowthPoint {
  month: string
  count: number
}

interface ChannelSlice {
  label: string
  value: string
  caption: string
}

const donationPerformance: DonationPerformance[] = [
  { month: "Jul", amount: 42 },
  { month: "Aug", amount: 45 },
  { month: "Sep", amount: 48 },
  { month: "Oct", amount: 53 },
  { month: "Nov", amount: 51 },
  { month: "Dec", amount: 57 },
]

const programReach: ProgramReach[] = [
  { program: "Education", women: 420, families: 130 },
  { program: "Shelter", women: 360, families: 210 },
  { program: "Healthcare", women: 280, families: 160 },
  { program: "Food", women: 520, families: 240 },
]

const volunteerGrowth: VolunteerGrowthPoint[] = [
  { month: "Jul", count: 780 },
  { month: "Aug", count: 820 },
  { month: "Sep", count: 860 },
  { month: "Oct", count: 910 },
  { month: "Nov", count: 950 },
  { month: "Dec", count: 1020 },
]

const channelMix: ChannelSlice[] = [
  { label: "Website", value: "46%", caption: "Inbound via forms and newsletter" },
  { label: "Partnerships", value: "28%", caption: "NGO and corporate partners" },
  { label: "Events", value: "18%", caption: "Workshops and community drives" },
  { label: "Referrals", value: "8%", caption: "Alumni and advocates" },
]

