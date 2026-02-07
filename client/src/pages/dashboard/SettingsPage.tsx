import { useEffect, useState } from "react"
import { ShieldCheck, Smartphone, UserCog, CreditCard, Banknote, Users, Bell, Lock, Globe } from "lucide-react"
import { fetchSettings, updateSettingsSection, type SettingsDto } from "../../services/api"

const defaultAdminAlerts = {
  newDonation: false,
  dailySummary: false,
  weeklyReport: false,
  monthlyReport: false,
  campaignMilestones: false,
  failedPayments: false,
}

const defaultDonorEmails = {
  thankYou: false,
  receipt: false,
  campaignUpdates: false,
  completion: false,
}

function SettingsPage(): JSX.Element {
  const [activeSection, setActiveSection] = useState<SettingsSection>("organization")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Organization
  const [orgName, setOrgName] = useState("")
  const [tagline, setTagline] = useState("")
  const [website, setWebsite] = useState("")
  const [orgEmail, setOrgEmail] = useState("")
  const [orgPhone, setOrgPhone] = useState("")
  const [address, setAddress] = useState("")
  const [facebook, setFacebook] = useState("")
  const [instagram, setInstagram] = useState("")
  const [xHandle, setXHandle] = useState("")
  const [about, setAbout] = useState("")

  // Payment methods
  const [mpesaEnabled, setMpesaEnabled] = useState(false)
  const [mpesaShortcode, setMpesaShortcode] = useState("")
  const [mpesaTill, setMpesaTill] = useState("")
  const [mpesaPasskey, setMpesaPasskey] = useState("")
  const [mpesaEnv, setMpesaEnv] = useState<"sandbox" | "production">("sandbox")
  const [mpesaMin, setMpesaMin] = useState("")
  const [mpesaMax, setMpesaMax] = useState("")

  const [paypalEnabled, setPaypalEnabled] = useState(false)
  const [paypalClientId, setPaypalClientId] = useState("")
  const [paypalSecret, setPaypalSecret] = useState("")
  const [paypalEnv, setPaypalEnv] = useState<"sandbox" | "production">("sandbox")
  const [paypalCurrency, setPaypalCurrency] = useState("")

  const [bankEnabled, setBankEnabled] = useState(false)
  const [bankName, setBankName] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [bankInstructions, setBankInstructions] = useState("")

  const [paymentPriority, setPaymentPriority] = useState<string[]>([])

  // Users
  const [showAddUser, setShowAddUser] = useState(false)
  const [adminUsers, setAdminUsers] = useState<SeedUser[]>([])

  // Notifications
  const [adminAlerts, setAdminAlerts] = useState<AdminAlerts>(defaultAdminAlerts)
  const [donorEmails, setDonorEmails] = useState<DonorEmails>(defaultDonorEmails)

  // Security
  const [twoFactor, setTwoFactor] = useState(false)
  const [autoLogoutMinutes, setAutoLogoutMinutes] = useState(30)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [recentSessions, setRecentSessions] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchSettings()
        if (cancelled) return
        hydrateSettings(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load settings")
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

  function hydrateSettings(data: SettingsDto) {
    setOrgName(data.organization?.name ?? "")
    setTagline(data.organization?.tagline ?? "")
    setWebsite(data.organization?.website ?? "")
    setOrgEmail(data.organization?.email ?? "")
    setOrgPhone(data.organization?.phone ?? "")
    setAddress(data.organization?.address ?? "")
    setFacebook(data.organization?.facebook ?? "")
    setInstagram(data.organization?.instagram ?? "")
    setXHandle(data.organization?.xHandle ?? "")
    setAbout(data.organization?.about ?? "")

    setMpesaEnabled(Boolean(data.payments?.mpesa?.enabled))
    setMpesaShortcode(data.payments?.mpesa?.shortcode ?? "")
    setMpesaTill(data.payments?.mpesa?.till ?? "")
    setMpesaPasskey(data.payments?.mpesa?.passkey ?? "")
    setMpesaEnv((data.payments?.mpesa?.environment ?? "sandbox") as "sandbox" | "production")
    setMpesaMin(data.payments?.mpesa?.min ?? "")
    setMpesaMax(data.payments?.mpesa?.max ?? "")

    setPaypalEnabled(Boolean(data.payments?.paypal?.enabled))
    setPaypalClientId(data.payments?.paypal?.clientId ?? "")
    setPaypalSecret(data.payments?.paypal?.secret ?? "")
    setPaypalEnv((data.payments?.paypal?.environment ?? "sandbox") as "sandbox" | "production")
    setPaypalCurrency(data.payments?.paypal?.currency ?? "")

    setBankEnabled(Boolean(data.payments?.bank?.enabled))
    setBankName(data.payments?.bank?.name ?? "")
    setBankAccount(data.payments?.bank?.account ?? "")
    setBankInstructions(data.payments?.bank?.instructions ?? "")

    setPaymentPriority(data.payments?.priority ?? [])

    setAdminUsers(data.adminUsers ?? [])
    setAdminAlerts(data.notifications?.adminAlerts ?? defaultAdminAlerts)
    setDonorEmails(data.notifications?.donorEmails ?? defaultDonorEmails)

    setTwoFactor(Boolean(data.security?.twoFactor))
    setAutoLogoutMinutes(data.security?.autoLogoutMinutes ?? 30)
    setBackupCodes(data.security?.backupCodes ?? [])
    setRecentSessions(data.security?.recentSessions ?? [])
  }

  async function handleSave(section: SettingsSection, payload: unknown) {
    setSaving(true)
    setError(null)
    try {
      await updateSettingsSection(section, payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-500">Settings</p>
        <p className="text-lg font-bold text-slate-900">Control organization, payments, and security</p>
        {loading && <p className="mt-1 text-xs text-slate-500">Loading settings...</p>}
        {error && <p className="mt-1 text-xs text-rose-600">Error: {error}</p>}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Sidebar nav */}
        <aside className="w-full max-w-xs rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
          <nav className="space-y-1 text-sm">
            <SettingsNavItem
              icon={UserCog}
              label="Organization"
              description="Brand, contact, and story"
              active={activeSection === "organization"}
              onClick={() => setActiveSection("organization")}
            />
            <SettingsNavItem
              icon={CreditCard}
              label="Payment methods"
              description="M-Pesa, PayPal, bank"
              active={activeSection === "payments"}
              onClick={() => setActiveSection("payments")}
            />
            <SettingsNavItem
              icon={Users}
              label="Users"
              description="Admins and roles"
              active={activeSection === "users"}
              onClick={() => setActiveSection("users")}
            />
            <SettingsNavItem
              icon={Bell}
              label="Notifications"
              description="Admin alerts and donor emails"
              active={activeSection === "notifications"}
              onClick={() => setActiveSection("notifications")}
            />
            <SettingsNavItem
              icon={ShieldCheck}
              label="Security"
              description="Passwords, 2FA, sessions"
              active={activeSection === "security"}
              onClick={() => setActiveSection("security")}
            />
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeSection === "organization" && (
            <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-purple-600" />
                <p className="text-sm font-semibold text-slate-900">Organization</p>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <InputGroup label="Organization name" value={orgName} onChange={setOrgName} />
                <InputGroup label="Tagline" value={tagline} onChange={setTagline} />
                <InputGroup label="Website" value={website} onChange={setWebsite} />
                <InputGroup label="Email" value={orgEmail} onChange={setOrgEmail} />
                <InputGroup label="Phone" value={orgPhone} onChange={setOrgPhone} />
                <InputGroup label="Address" value={address} onChange={setAddress} />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <InputGroup label="Facebook" value={facebook} onChange={setFacebook} />
                <InputGroup label="Instagram" value={instagram} onChange={setInstagram} />
                <InputGroup label="X (Twitter)" value={xHandle} onChange={setXHandle} />
              </div>
              <div className="mt-4">
                <label className="space-y-1">
                  <p className="text-xs font-semibold text-slate-700">About (max 2000 characters)</p>
                  <textarea
                    maxLength={2000}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    value={about}
                    onChange={event => setAbout(event.target.value)}
                  />
                  <p className="text-xs text-slate-400">
                    {about.length}/2000 characters
                  </p>
                </label>
              </div>
              <button
                className="mt-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md"
                onClick={() =>
                  handleSave("organization", {
                    name: orgName,
                    tagline,
                    website,
                    email: orgEmail,
                    phone: orgPhone,
                    address,
                    facebook,
                    instagram,
                    xHandle,
                    about,
                  })
                }
                disabled={saving}
              >
                Save changes
              </button>
            </section>
          )}

          {activeSection === "payments" && (
            <section className="space-y-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Smartphone size={16} className="text-green-600" />
                    <p className="text-sm font-semibold text-slate-900">M-Pesa</p>
                  </div>
                  <ToggleRow
                    compact
                    label="Enable"
                    description=""
                    checked={mpesaEnabled}
                    onChange={setMpesaEnabled}
                  />
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <InputGroup label="Shortcode" value={mpesaShortcode} onChange={setMpesaShortcode} />
                  <InputGroup label="Till / Paybill" value={mpesaTill} onChange={setMpesaTill} />
                  <InputGroup label="Passkey" value={mpesaPasskey} onChange={setMpesaPasskey} />
                  <label className="space-y-1">
                    <p className="text-xs font-semibold text-slate-700">Environment</p>
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      value={mpesaEnv}
                      onChange={event => setMpesaEnv(event.target.value as "sandbox" | "production")}
                    >
                      <option value="sandbox">Sandbox</option>
                      <option value="production">Production</option>
                    </select>
                  </label>
                  <InputGroup label="Minimum donation amount" value={mpesaMin} onChange={setMpesaMin} />
                  <InputGroup label="Maximum donation amount" value={mpesaMax} onChange={setMpesaMax} />
                </div>
                <button
                  className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                  onClick={() => {
                    // eslint-disable-next-line no-alert
                    alert("M-Pesa connection test will be wired to backend.")
                  }}
                >
                  Test connection
                </button>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-blue-600" />
                    <p className="text-sm font-semibold text-slate-900">PayPal</p>
                  </div>
                  <ToggleRow
                    compact
                    label="Enable"
                    description=""
                    checked={paypalEnabled}
                    onChange={setPaypalEnabled}
                  />
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <InputGroup label="Client ID" value={paypalClientId} onChange={setPaypalClientId} />
                  <InputGroup label="Secret" value={paypalSecret} onChange={setPaypalSecret} />
                  <label className="space-y-1">
                    <p className="text-xs font-semibold text-slate-700">Environment</p>
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      value={paypalEnv}
                      onChange={event => setPaypalEnv(event.target.value as "sandbox" | "production")}
                    >
                      <option value="sandbox">Sandbox</option>
                      <option value="production">Production</option>
                    </select>
                  </label>
                  <InputGroup label="Currency" value={paypalCurrency} onChange={setPaypalCurrency} />
                </div>
                <button
                  className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                  onClick={() => {
                    // eslint-disable-next-line no-alert
                    alert("PayPal connection test will be wired to backend.")
                  }}
                >
                  Test connection
                </button>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Banknote size={16} className="text-emerald-600" />
                    <p className="text-sm font-semibold text-slate-900">Bank transfer</p>
                  </div>
                  <ToggleRow
                    compact
                    label="Enable"
                    description=""
                    checked={bankEnabled}
                    onChange={setBankEnabled}
                  />
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <InputGroup label="Bank name" value={bankName} onChange={setBankName} />
                  <InputGroup label="Account details" value={bankAccount} onChange={setBankAccount} />
                </div>
                <div className="mt-3">
                  <label className="space-y-1">
                    <p className="text-xs font-semibold text-slate-700">Instructions</p>
                    <textarea
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      value={bankInstructions}
                      onChange={event => setBankInstructions(event.target.value)}
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <p className="text-sm font-semibold text-slate-900">Payment priority</p>
                <p className="text-xs text-slate-500">
                  Drag to reorder which methods are shown first on the donation form.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {paymentPriority.map(method => (
                    <span
                      key={method}
                      className="cursor-default rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {method}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Reordering is visual only in this prototype; persistence will be wired to backend.
                </p>
              </div>

              <button
                className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md"
                onClick={() =>
                  handleSave("payments", {
                    mpesa: {
                      enabled: mpesaEnabled,
                      shortcode: mpesaShortcode,
                      till: mpesaTill,
                      passkey: mpesaPasskey,
                      environment: mpesaEnv,
                      min: mpesaMin,
                      max: mpesaMax,
                    },
                    paypal: {
                      enabled: paypalEnabled,
                      clientId: paypalClientId,
                      secret: paypalSecret,
                      environment: paypalEnv,
                      currency: paypalCurrency,
                    },
                    bank: {
                      enabled: bankEnabled,
                      name: bankName,
                      account: bankAccount,
                      instructions: bankInstructions,
                    },
                    priority: paymentPriority,
                  })
                }
                disabled={saving}
              >
                Save payment settings
              </button>
            </section>
          )}

          {activeSection === "users" && (
            <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-purple-600" />
                  <p className="text-sm font-semibold text-slate-900">Users</p>
                </div>
                <button
                  className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                  onClick={() => setShowAddUser(true)}
                >
                  Add admin user
                </button>
              </div>
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-100">
                <table className="min-w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Name</th>
                      <th className="px-3 py-2 font-semibold">Email</th>
                      <th className="px-3 py-2 font-semibold">Role</th>
                      <th className="px-3 py-2 font-semibold">Status</th>
                      <th className="px-3 py-2 font-semibold">Last active</th>
                      <th className="px-3 py-2 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminUsers.map(user => (
                      <tr key={user.email}>
                        <td className="px-3 py-2 text-xs font-semibold text-slate-900">{user.name}</td>
                        <td className="px-3 py-2 text-xs text-slate-600">{user.email}</td>
                        <td className="px-3 py-2 text-xs text-slate-600">{user.role}</td>
                        <td className="px-3 py-2 text-xs">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-slate-600">{user.lastActive}</td>
                        <td className="px-3 py-2 text-right text-xs">
                          <div className="flex justify-end gap-1">
                            <button className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                              Edit
                            </button>
                            <button className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                              Deactivate
                            </button>
                            <button className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-rose-600 shadow-sm ring-1 ring-rose-100 hover:bg-rose-50">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Editing, deactivating, and deleting users will be wired to backend user management.
              </p>

              {showAddUser && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6">
                  <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">Add admin user</p>
                      <button
                        className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                        onClick={() => setShowAddUser(false)}
                      >
                        <ShieldCheck size={14} />
                      </button>
                    </div>
                    <div className="mt-3 space-y-3">
                      <InputGroup label="Full name" value="" onChange={() => {}} />
                      <InputGroup label="Email" value="" onChange={() => {}} />
                      <label className="space-y-1">
                        <p className="text-xs font-semibold text-slate-700">Role</p>
                        <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100">
                          <option>Super Admin</option>
                          <option>Admin</option>
                          <option>Viewer</option>
                        </select>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-600">
                        <input type="checkbox" className="h-3 w-3 rounded border-slate-300" defaultChecked />
                        Send invitation email
                      </label>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                        onClick={() => setShowAddUser(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:shadow-md"
                        onClick={() => {
                          // eslint-disable-next-line no-alert
                          alert("User invitations will be wired to backend.")
                          setShowAddUser(false)
                        }}
                      >
                        Send invitation
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {activeSection === "notifications" && (
            <section className="space-y-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-amber-600" />
                  <p className="text-sm font-semibold text-slate-900">Admin alerts</p>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <ToggleRow
                    label="New donation"
                    description="Alert when a donation is completed or pending review."
                    checked={adminAlerts.newDonation}
                    onChange={checked => setAdminAlerts(prev => ({ ...prev, newDonation: checked }))}
                  />
                  <ToggleRow
                    label="Daily summary"
                    description="Daily digest of donation and program activity."
                    checked={adminAlerts.dailySummary}
                    onChange={checked => setAdminAlerts(prev => ({ ...prev, dailySummary: checked }))}
                  />
                  <ToggleRow
                    label="Weekly report"
                    description="Weekly performance report for leadership."
                    checked={adminAlerts.weeklyReport}
                    onChange={checked => setAdminAlerts(prev => ({ ...prev, weeklyReport: checked }))}
                  />
                  <ToggleRow
                    label="Monthly report"
                    description="Month-end summary for board and partners."
                    checked={adminAlerts.monthlyReport}
                    onChange={checked => setAdminAlerts(prev => ({ ...prev, monthlyReport: checked }))}
                  />
                  <ToggleRow
                    label="Campaign milestones"
                    description="Notify when a campaign hits key milestones."
                    checked={adminAlerts.campaignMilestones}
                    onChange={checked =>
                      setAdminAlerts(prev => ({ ...prev, campaignMilestones: checked }))
                    }
                  />
                  <ToggleRow
                    label="Failed payments"
                    description="Immediate alert when a donation fails."
                    checked={adminAlerts.failedPayments}
                    onChange={checked => setAdminAlerts(prev => ({ ...prev, failedPayments: checked }))}
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center gap-2">
                  <Smartphone size={16} className="text-purple-600" />
                  <p className="text-sm font-semibold text-slate-900">Donor auto-emails</p>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <ToggleRow
                    label="Thank you"
                    description="Send an immediate thank-you email after each donation."
                    checked={donorEmails.thankYou}
                    onChange={checked => setDonorEmails(prev => ({ ...prev, thankYou: checked }))}
                  />
                  <ToggleRow
                    label="Receipt"
                    description="Attach a compliant receipt to every donation."
                    checked={donorEmails.receipt}
                    onChange={checked => setDonorEmails(prev => ({ ...prev, receipt: checked }))}
                  />
                  <ToggleRow
                    label="Campaign updates"
                    description="Periodic updates while a campaign is running."
                    checked={donorEmails.campaignUpdates}
                    onChange={checked =>
                      setDonorEmails(prev => ({ ...prev, campaignUpdates: checked }))
                    }
                  />
                  <ToggleRow
                    label="Completion notification"
                    description="Let donors know when a campaign is complete."
                    checked={donorEmails.completion}
                    onChange={checked => setDonorEmails(prev => ({ ...prev, completion: checked }))}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <span>Email templates</span>
                  <button
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                    onClick={() => {
                      // eslint-disable-next-line no-alert
                      alert("Template editor will open in a dedicated screen.")
                    }}
                  >
                    Open template editor
                  </button>
                </div>
              </div>

              <button
                className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md"
                onClick={() =>
                  handleSave("notifications", {
                    adminAlerts,
                    donorEmails,
                  })
                }
                disabled={saving}
              >
                Save notification settings
              </button>
            </section>
          )}

          {activeSection === "security" && (
            <section className="space-y-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-slate-900" />
                  <p className="text-sm font-semibold text-slate-900">Change password</p>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <PasswordInput label="Current password" />
                  <PasswordInput label="New password" showStrength />
                  <PasswordInput label="Confirm new password" />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Use at least 12 characters with a mix of letters, numbers, and symbols.
                </p>
                <button
                  className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                  onClick={() => {
                    // eslint-disable-next-line no-alert
                    alert("Password change will be wired to backend.")
                  }}
                >
                  Update password
                </button>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-green-600" />
                  <p className="text-sm font-semibold text-slate-900">Two-factor authentication</p>
                </div>
                <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 space-y-1 text-xs text-slate-600">
                    <p>
                      Protect admin sign-in with one-time codes from an authenticator app. Scan the QR
                      code with Google Authenticator, Authy, or a similar app.
                    </p>
                  </div>
                  <ToggleRow
                    compact
                    label="Enable 2FA"
                    description=""
                    checked={twoFactor}
                    onChange={setTwoFactor}
                  />
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-500">
                    QR code placeholder
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">Backup codes</p>
                    <p>
                      Store these one-time backup codes in a safe place. Each code can be used once if
                      you lose access to your authenticator app.
                    </p>
                    <div className="rounded-lg bg-slate-900 p-3 font-mono text-[11px] text-slate-50">
                      {backupCodes.map(code => (
                        <span key={code}>
                          {code}
                          <br />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center gap-2">
                  <Smartphone size={16} className="text-amber-600" />
                  <p className="text-sm font-semibold text-slate-900">Login activity & sessions</p>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="space-y-2 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">Recent sessions</p>
                    <ul className="space-y-1">
                      {recentSessions.map(session => (
                        <li key={session}>{session}</li>
                      ))}
                    </ul>
                    <button
                      className="mt-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                      onClick={() => {
                        // eslint-disable-next-line no-alert
                        alert("Session revocation will be wired to backend.")
                      }}
                    >
                      Log out all sessions
                    </button>
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">Session settings</p>
                    <label className="space-y-1">
                      <p className="text-xs font-semibold text-slate-700">Auto-logout duration (minutes)</p>
                      <input
                        type="number"
                        min={5}
                        max={240}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        value={autoLogoutMinutes}
                        onChange={event => setAutoLogoutMinutes(Number(event.target.value))}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <button
                className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md"
                onClick={() =>
                  handleSave("security", {
                    twoFactor,
                    autoLogoutMinutes,
                    backupCodes,
                    recentSessions,
                  })
                }
                disabled={saving}
              >
                Save security settings
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function SettingsNavItem({ icon: Icon, label, description, active, onClick }: SettingsNavItemProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left ${
        active ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Icon size={16} className={active ? "text-white" : "text-slate-500"} />
      <div>
        <p className="text-xs font-semibold">{label}</p>
        <p className={`text-[11px] ${active ? "text-slate-200" : "text-slate-500"}`}>{description}</p>
      </div>
    </button>
  )
}

function InputGroup({ label, value, onChange }: InputGroupProps): JSX.Element {
  return (
    <label className="space-y-1">
      <p className="text-xs font-semibold text-slate-700">{label}</p>
      <input
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
        value={value}
        onChange={event => onChange(event.target.value)}
      />
    </label>
  )
}

function ToggleRow({ label, description, checked, onChange, compact }: ToggleRowProps): JSX.Element {
  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl border border-slate-100 ${
        compact ? "px-2 py-1.5" : "p-3"
      }`}
    >
      {!compact && (
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
      )}
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={event => onChange?.(event.target.checked)}
        />
        <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-purple-600 peer-checked:after:translate-x-5" />
      </label>
      {compact && !!label && (
        <p className="text-[11px] font-semibold text-slate-700">{label}</p>
      )}
    </div>
  )
}

function PasswordInput({ label, showStrength }: PasswordInputProps): JSX.Element {
  return (
    <label className="space-y-1">
      <p className="text-xs font-semibold text-slate-700">{label}</p>
      <input
        type="password"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
      />
      {showStrength && (
        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
          <div className="h-1.5 flex-1 rounded-full bg-slate-200">
            <div className="h-1.5 w-2/3 rounded-full bg-gradient-to-r from-amber-400 to-emerald-500" />
          </div>
          <span>Strong</span>
        </div>
      )}
    </label>
  )
}

export default SettingsPage

type SettingsSection = "organization" | "payments" | "users" | "notifications" | "security"

interface InputGroupProps {
  label: string
  value: string
  onChange: (value: string) => void
}

interface ToggleRowProps {
  label: string
  description: string
  checked: boolean
  onChange?: (checked: boolean) => void
  compact?: boolean
}

interface PasswordInputProps {
  label: string
  showStrength?: boolean
}

interface SettingsNavItemProps {
  icon: typeof UserCog
  label: string
  description: string
  active: boolean
  onClick: () => void
}

interface AdminAlerts {
  newDonation: boolean
  dailySummary: boolean
  weeklyReport: boolean
  monthlyReport: boolean
  campaignMilestones: boolean
  failedPayments: boolean
}

interface DonorEmails {
  thankYou: boolean
  receipt: boolean
  campaignUpdates: boolean
  completion: boolean
}

interface SeedUser {
  name: string
  email: string
  role: "Super Admin" | "Admin" | "Viewer" | string
  status: "Active" | "Inactive" | string
  lastActive: string
}

