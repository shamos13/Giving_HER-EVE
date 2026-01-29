import { useMemo, useState } from "react"
import { BadgeCheck, Search, UserRoundX } from "lucide-react"

function UsersPage(): JSX.Element {
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>("all")
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>("all")
  const [query, setQuery] = useState("")

  const filteredUsers = useMemo(
    () =>
      usersData.filter(user => {
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        const matchesStatus = statusFilter === "all" || user.status === statusFilter
        const matchesQuery =
          query.trim().length === 0 ||
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())

        return matchesRole && matchesStatus && matchesQuery
      }),
    [roleFilter, statusFilter, query],
  )

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-500">Users & Volunteers</p>
        <p className="text-lg font-bold text-slate-900">Quick view of key people</p>
        <p className="mt-1 text-xs text-slate-500">
          Keep this page light: search or filter to find someone, then move to a detailed profile view in a future
          iteration.
        </p>
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
          value={roleFilter}
          onChange={event => setRoleFilter(event.target.value as UserRoleFilter)}
        >
          <option value="all">All roles</option>
          <option value="Admin">Admin</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Donor">Donor</option>
        </select>
        <select
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
          value={statusFilter}
          onChange={event => setStatusFilter(event.target.value as UserStatusFilter)}
        >
          <option value="all">All status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 grid place-items-center text-sm font-semibold text-slate-700">
                      {user.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        {user.verified ? (
                          <>
                            <BadgeCheck size={14} className="text-green-600" /> Verified
                          </>
                        ) : (
                          <>
                            <UserRoundX size={14} className="text-amber-600" /> Unverified
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    user.role === "Admin" ? "bg-slate-900 text-white" : user.role === "Volunteer" ? "bg-purple-100 text-purple-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{user.email}</p>
                  <p className="text-xs text-slate-500">{user.phone}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    user.status === "Active" ? "bg-green-100 text-green-700" : user.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-700"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">{user.joined}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                      View
                    </button>
                    <button className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-slate-800">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Intentionally keeping this page light to avoid overwhelming admins.
          Future iterations can add a detailed user profile view instead of extra dashboard cards. */}
    </div>
  )
}

export default UsersPage

interface UserRow {
  id: string
  name: string
  initials: string
  role: "Admin" | "Volunteer" | "Donor"
  email: string
  phone: string
  status: "Active" | "Pending" | "Inactive"
  joined: string
  verified: boolean
}

type UserRoleFilter = "all" | UserRow["role"]
type UserStatusFilter = "all" | UserRow["status"]

const usersData: UserRow[] = [
  { id: "u1", name: "Chidinma Abubakar", initials: "CA", role: "Admin", email: "chidinma@giving.org", phone: "+234 802 111 2222", status: "Active", joined: "Jan 12, 2024", verified: true },
  { id: "u2", name: "Victor Essien", initials: "VE", role: "Volunteer", email: "victor@helpers.com", phone: "+234 703 223 9988", status: "Active", joined: "Mar 28, 2024", verified: true },
  { id: "u3", name: "Halima Yusuf", initials: "HY", role: "Volunteer", email: "halima@impact.org", phone: "+234 809 114 8899", status: "Pending", joined: "Apr 4, 2024", verified: false },
  { id: "u4", name: "Tosin Adebayo", initials: "TA", role: "Donor", email: "tosin@kindmail.com", phone: "+234 701 333 9900", status: "Active", joined: "May 21, 2024", verified: true },
  { id: "u5", name: "Ngozi Owusu", initials: "NO", role: "Volunteer", email: "ngozi@care.ng", phone: "+234 802 884 7777", status: "Inactive", joined: "Nov 2, 2023", verified: false },
]

