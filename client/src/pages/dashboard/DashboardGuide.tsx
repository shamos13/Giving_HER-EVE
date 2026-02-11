import { Link } from "react-router"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  FileText,
  HandHeart,
  LayoutDashboard,
  Mail,
  Settings,
  ShieldCheck,
} from "lucide-react"

function DashboardGuide(): JSX.Element {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Admin Guide</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">How to use this dashboard effectively</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Use this page as your operating checklist. Start with overview metrics, process incoming work, then validate updates
          on the public website before ending your session.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <QuickLink to="/dashboard" label="Go to Overview" />
          <QuickLink to="/dashboard/donations" label="Review Donations" />
          <QuickLink to="/dashboard/messages" label="Check Messages" />
          <QuickLink to="/" label="Open Main Site" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Recommended daily workflow</h2>
        <ol className="mt-4 space-y-3 text-sm text-slate-700">
          <li className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <span className="font-semibold text-slate-900">1. Start with Overview:</span> confirm donation trend, key metrics, and
            recent activity are healthy.
          </li>
          <li className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <span className="font-semibold text-slate-900">2. Process Donations:</span> verify new entries, statuses, and source data.
          </li>
          <li className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <span className="font-semibold text-slate-900">3. Handle Messages:</span> prioritize urgent requests and mark resolved
            conversations.
          </li>
          <li className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <span className="font-semibold text-slate-900">4. Update Content:</span> only publish once copy, media, and links are
            verified.
          </li>
          <li className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <span className="font-semibold text-slate-900">5. Validate live pages:</span> use the sidebar “View Main Site” button to
            confirm changes on the public website.
          </li>
        </ol>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">What each section is for</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sectionGuides.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-center gap-2 text-slate-900">
                <item.icon size={18} />
                <p className="font-semibold">{item.title}</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-800">
          <ShieldCheck size={18} />
          <h2 className="text-lg font-semibold">Before you publish or log out</h2>
        </div>
        <ul className="mt-3 space-y-2 text-sm text-emerald-900">
          <li>Confirm all required fields are complete and statuses are correct.</li>
          <li>Preview images and verify they load successfully.</li>
          <li>Open the public site and validate the final result on desktop and mobile widths.</li>
          <li>Resolve or flag any open messages that need follow-up.</li>
        </ul>
      </section>
    </div>
  )
}

function QuickLink({ to, label }: QuickLinkProps): JSX.Element {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
    >
      <span>{label}</span>
      <ArrowRight size={14} />
    </Link>
  )
}

export default DashboardGuide

interface QuickLinkProps {
  to: string
  label: string
}

interface SectionGuide {
  title: string
  description: string
  path: string
  icon: LucideIcon
}

const sectionGuides: SectionGuide[] = [
  {
    title: "Overview",
    description: "Track high-level metrics and recent activity before deeper actions.",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Donations",
    description: "Review donation records, analytics, and reporting consistency.",
    path: "/dashboard/donations",
    icon: HandHeart,
  },
  {
    title: "Programs & Services",
    description: "Monitor progress and operational updates for active programs.",
    path: "/dashboard/programs",
    icon: CalendarClock,
  },
  {
    title: "Content Management",
    description: "Update campaigns, stories, and media shown on the public site.",
    path: "/dashboard/content",
    icon: FileText,
  },
  {
    title: "Messages",
    description: "Triage inbound communication and maintain response quality.",
    path: "/dashboard/messages",
    icon: Mail,
  },
  {
    title: "Analytics & Reports",
    description: "Measure trends and export reporting for stakeholders.",
    path: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    description: "Adjust operational preferences and admin-level configuration.",
    path: "/dashboard/settings",
    icon: Settings,
  },
]
