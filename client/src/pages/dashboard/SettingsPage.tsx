import { useState } from "react"
import { ShieldCheck, Smartphone, UserCog } from "lucide-react"

function SettingsPage(): JSX.Element {
  const [notifications, setNotifications] = useState(true)
  const [twoFactor, setTwoFactor] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(true)

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-500">Settings</p>
        <p className="text-lg font-bold text-slate-900">Control preferences and security</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-2">
            <UserCog size={16} className="text-purple-600" />
            <p className="text-sm font-semibold text-slate-900">Profile</p>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <InputGroup label="Full name" value="Admin User" />
            <InputGroup label="Email" value="admin@givinghereve.org" />
            <InputGroup label="Role" value="Operations Lead" />
            <InputGroup label="Timezone" value="GMT+1 (West Africa)" />
          </div>
          <button className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
            Update profile
          </button>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-600" />
            <p className="text-sm font-semibold text-slate-900">Security</p>
          </div>
          <div className="mt-3 space-y-3">
            <ToggleRow label="Two-factor authentication" description="Protect admin sign-in with OTP codes." checked={twoFactor} onChange={setTwoFactor} />
            <ToggleRow label="Login alerts" description="Notify when a new device signs in." checked={notifications} onChange={setNotifications} />
            <ToggleRow label="Session timeout" description="Auto sign-out after 30 minutes idle." checked />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="text-amber-600" />
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
          </div>
          <div className="mt-3 space-y-3">
            <ToggleRow label="New donations" description="Alert when a donation is completed or pending review." checked={notifications} onChange={setNotifications} />
            <ToggleRow label="Volunteer shifts" description="Reminders for upcoming shifts and trainings." checked={weeklySummary} onChange={setWeeklySummary} />
            <ToggleRow label="Messages & inquiries" description="New contact form submissions and escalations." checked />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm font-semibold text-slate-900">Data exports</p>
          <p className="text-xs text-slate-500">Choose cadence for board and finance exports.</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <SelectGroup label="Donation reports" options={["Weekly", "Monthly", "Quarterly"]} />
            <SelectGroup label="Volunteer reports" options={["Weekly", "Monthly"]} />
            <SelectGroup label="Program updates" options={["Monthly", "Quarterly"]} />
            <SelectGroup label="Message transcripts" options={["Daily", "Weekly"]} />
          </div>
          <button className="mt-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md">
            Save preferences
          </button>
        </section>
      </div>
    </div>
  )
}

function InputGroup({ label, value }: InputGroupProps): JSX.Element {
  return (
    <label className="space-y-1">
      <p className="text-xs font-semibold text-slate-700">{label}</p>
      <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100" defaultValue={value} />
    </label>
  )
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps): JSX.Element {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 p-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={event => onChange?.(event.target.checked)}
        />
        <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-purple-600 peer-checked:after:translate-x-5" />
      </label>
    </div>
  )
}

function SelectGroup({ label, options }: SelectGroupProps): JSX.Element {
  return (
    <label className="space-y-1">
      <p className="text-xs font-semibold text-slate-700">{label}</p>
      <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100">
        {options.map(option => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

export default SettingsPage

interface InputGroupProps {
  label: string
  value: string
}

interface ToggleRowProps {
  label: string
  description: string
  checked: boolean
  onChange?: (checked: boolean) => void
}

interface SelectGroupProps {
  label: string
  options: string[]
}

