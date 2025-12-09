import { useMemo, useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router"
import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  Bell,
  CalendarClock,
  FileText,
  HandHeart,
  LayoutDashboard,
  Mail,
  Menu,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react"

function DashboardLayout(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { pathname } = useLocation()
  const activePage = useMemo(() => navItems.find(item => pathname.startsWith(item.path)), [pathname])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-white grid place-items-center font-semibold">
                E
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Admin Console</p>
                <p className="text-lg font-bold text-slate-900">Giving Her E.v.E</p>
              </div>
            </div>
            <button className="lg:hidden rounded-full p-2 text-slate-500 hover:bg-slate-100" onClick={() => setIsSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <nav className="mt-6 space-y-1 px-4 pb-6">
            {navItems.map(item => (
              <SidebarLink key={item.path} item={item} onNavigate={() => setIsSidebarOpen(false)} />
            ))}
            <div className="mt-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-5 text-white shadow-lg">
              <p className="text-sm font-semibold">Need help?</p>
              <p className="mt-1 text-sm opacity-90">Check quick tips for managing donations, programs, and messages efficiently.</p>
              <button className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20">View guide</button>
            </div>
          </nav>
        </aside>

        <div className="flex-1 lg:ml-72">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <button className="rounded-full p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setIsSidebarOpen(true)}>
                  <Menu size={20} />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Dashboard</p>
                  <p className="text-lg font-semibold text-slate-900">{activePage?.label ?? "Overview"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                  <Search size={16} className="text-slate-500" />
                  <input className="bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Search dashboard" />
                </div>
                <button className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100">
                  <Bell size={18} />
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-pink-500" />
                </button>
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white grid place-items-center font-semibold">
                    A
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900">Admin</p>
                    <p className="text-xs text-slate-500">Operations Lead</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 md:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

function SidebarLink({ item, onNavigate }: SidebarLinkProps): JSX.Element {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-slate-100 ${
          isActive ? "bg-slate-900 text-white shadow-sm" : "text-slate-700"
        }`
      }
      onClick={onNavigate}
      end={item.path === "/dashboard"}
    >
      <item.icon size={18} />
      <span>{item.label}</span>
    </NavLink>
  )
}

export default DashboardLayout

interface SidebarLinkProps {
  item: DashboardNavItem
  onNavigate: () => void
}

interface DashboardNavItem {
  label: string
  path: string
  icon: LucideIcon
}

const navItems: DashboardNavItem[] = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { label: "Users & Volunteers", path: "/dashboard/users", icon: Users },
  { label: "Donations", path: "/dashboard/donations", icon: HandHeart },
  { label: "Programs & Services", path: "/dashboard/programs", icon: CalendarClock },
  { label: "Content Management", path: "/dashboard/content", icon: FileText },
  { label: "Messages", path: "/dashboard/messages", icon: Mail },
  { label: "Analytics & Reports", path: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", path: "/dashboard/settings", icon: Settings },
]

