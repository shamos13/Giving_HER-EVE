import { useEffect, useMemo, useState } from "react"
import {
  ExternalLink,
  ImageIcon,
  Plus,
  Trash2,
  Upload,
} from "lucide-react"
import {
  createAdminCampaign,
  deleteAdminCampaign,
  fetchAdminCampaigns,
  uploadAdminImage,
  updateAdminCampaign,
  type CampaignDto,
} from "../../services/api"

type ActiveId = string | "new"

type UploadTarget = "campaign" | null

const emptyCampaign: CampaignDto = {
  id: "",
  slug: "",
  label: "",
  title: "",
  shortDescription: "",
  description: "",
  image: "",
  raised: 0,
  goal: 0,
  location: "",
  category: "",
  status: "Draft",
  startDate: "",
  endDate: "",
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")

function statusTone(status?: string) {
  if (!status) return "bg-slate-100 text-slate-600"
  if (status === "Active") return "bg-emerald-100 text-emerald-700"
  if (status === "Draft") return "bg-amber-100 text-amber-700"
  return "bg-slate-100 text-slate-600"
}

function ProgramsPage(): JSX.Element {
  const [campaigns, setCampaigns] = useState<CampaignDto[]>([])
  const [activeCampaignId, setActiveCampaignId] = useState<ActiveId>("new")
  const [campaignDraft, setCampaignDraft] = useState<CampaignDto>(emptyCampaign)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingTarget, setUploadingTarget] = useState<UploadTarget>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchAdminCampaigns()
        if (cancelled) return
        setCampaigns(data)
        if (data.length > 0) {
          setActiveCampaignId(data[0].id)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load programs")
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

  useEffect(() => {
    if (activeCampaignId === "new") {
      setCampaignDraft({ ...emptyCampaign })
      return
    }
    const selected = campaigns.find(item => item.id === activeCampaignId)
    if (selected) {
      setCampaignDraft({ ...emptyCampaign, ...selected })
    }
  }, [activeCampaignId, campaigns])

  function handleCampaignChange<K extends keyof CampaignDto>(key: K, value: CampaignDto[K]) {
    setCampaignDraft(prev => ({ ...prev, [key]: value }))
  }

  async function saveCampaign(status: "Draft" | "Active") {
    if (!campaignDraft.title.trim()) {
      setError("Program title is required.")
      return
    }
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const payload: Partial<CampaignDto> = {
        ...campaignDraft,
        status,
        slug: campaignDraft.slug?.trim() ? campaignDraft.slug : slugify(campaignDraft.title),
      }
      let saved: CampaignDto
      if (activeCampaignId === "new" || !campaignDraft.id) {
        saved = await createAdminCampaign(payload)
        setCampaigns(prev => [saved, ...prev])
        setActiveCampaignId(saved.id)
      } else {
        saved = await updateAdminCampaign(campaignDraft.id, payload)
        setCampaigns(prev => prev.map(item => (item.id === saved.id ? saved : item)))
      }
      setCampaignDraft({ ...emptyCampaign, ...saved })
      setSuccess("Program saved.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save program")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteCampaign(id: string) {
    const ok = window.confirm("Delete this program? This cannot be undone.")
    if (!ok) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      await deleteAdminCampaign(id)
      setCampaigns(prev => prev.filter(item => item.id !== id))
      setActiveCampaignId("new")
      setSuccess("Program deleted.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete program")
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(file: File) {
    setUploadingTarget("campaign")
    setError(null)
    setSuccess(null)
    try {
      const photo = await uploadAdminImage(file, {
        folder: "campaigns",
        title: campaignDraft.title || undefined,
      })
      setCampaignDraft(prev => ({ ...prev, image: photo.imageUrl }))
      setSuccess("Image uploaded.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setUploadingTarget(null)
    }
  }

  function openPreview(path: string) {
    const target = `${window.location.origin}${path}`
    window.open(target, "_blank", "noopener,noreferrer")
  }

  const campaignProgress = useMemo(() => {
    const goal = Number(campaignDraft.goal || 0)
    const raised = Number(campaignDraft.raised || 0)
    return goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0
  }, [campaignDraft.goal, campaignDraft.raised])

  const campaignPreviewPath =
    campaignDraft.id && campaignDraft.status !== "Draft" ? `/campaigns/${campaignDraft.id}` : "/campaigns"

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Programs & Services</p>
          <p className="text-lg font-bold text-slate-900">Manage programs that appear on the campaigns page</p>
          {loading && <p className="mt-1 text-xs text-slate-500">Loading programs...</p>}
          {error && <p className="mt-1 text-xs text-rose-600">Error: {error}</p>}
          {success && <p className="mt-1 text-xs text-emerald-600">{success}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={() => {
              setError(null)
              setSuccess(null)
              const active = campaigns.find(item => item.id === activeCampaignId)
              setCampaignDraft(active ? { ...emptyCampaign, ...active } : { ...emptyCampaign })
            }}
          >
            Cancel
          </button>
          <button
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={() => saveCampaign("Draft")}
            disabled={saving}
          >
            Save Draft
          </button>
          <button
            className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md"
            onClick={() => saveCampaign("Active")}
            disabled={saving}
          >
            Publish Program
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)]">
        <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Programs</p>
            <button
              className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
              onClick={() => setActiveCampaignId("new")}
            >
              <Plus size={12} />
              New
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">Select a program to edit</p>
          <div className="mt-3 space-y-2">
            {campaigns.map(item => (
              <button
                key={item.id}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                  activeCampaignId === item.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
                onClick={() => setActiveCampaignId(item.id)}
              >
                <span className="truncate">{item.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${statusTone(item.status)}`}>{item.status ?? "Draft"}</span>
              </button>
            ))}
            {!loading && campaigns.length === 0 && <p className="text-xs text-slate-500">No programs yet.</p>}
          </div>
        </aside>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Edit Program Content</p>
              <p className="text-xs text-slate-500">Update the campaign listing with rich details and imagery.</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(campaignDraft.status)}`}>
              {campaignDraft.status || "Draft"}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Program Title</label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                value={campaignDraft.title}
                onChange={event => handleCampaignChange("title", event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Short Description</label>
              <textarea
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                rows={2}
                value={campaignDraft.shortDescription}
                onChange={event => handleCampaignChange("shortDescription", event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Description</label>
              <textarea
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                rows={4}
                value={campaignDraft.description}
                onChange={event => handleCampaignChange("description", event.target.value)}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Category</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  value={campaignDraft.category}
                  onChange={event => handleCampaignChange("category", event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Location</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  value={campaignDraft.location}
                  onChange={event => handleCampaignChange("location", event.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Goal Amount (USD)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  value={campaignDraft.goal}
                  onChange={event => handleCampaignChange("goal", Number(event.target.value || 0))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Raised So Far (USD)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  value={campaignDraft.raised}
                  onChange={event => handleCampaignChange("raised", Number(event.target.value || 0))}
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Label</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  value={campaignDraft.label ?? ""}
                  onChange={event => handleCampaignChange("label", event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Slug</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  value={campaignDraft.slug ?? ""}
                  onChange={event => handleCampaignChange("slug", event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Status</label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                  value={campaignDraft.status ?? "Draft"}
                  onChange={event => handleCampaignChange("status", event.target.value)}
                >
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Start Date</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                  value={campaignDraft.startDate ?? ""}
                  onChange={event => handleCampaignChange("startDate", event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">End Date</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                  value={campaignDraft.endDate ?? ""}
                  onChange={event => handleCampaignChange("endDate", event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Image URL</label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                value={campaignDraft.image}
                onChange={event => handleCampaignChange("image", event.target.value)}
              />
              <div className="mt-2 flex flex-col gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                <Upload className="mx-auto" size={18} />
                <p>Upload a new program image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={event => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    void handleImageUpload(file)
                  }}
                  disabled={uploadingTarget === "campaign"}
                  className="text-xs"
                />
                {uploadingTarget === "campaign" && <p className="text-[11px] text-slate-500">Uploading image...</p>}
              </div>
            </div>
          </div>

          {campaignDraft.id && (
            <div className="mt-4 flex items-center gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-rose-600 shadow-sm ring-1 ring-rose-200 hover:bg-rose-50"
                onClick={() => handleDeleteCampaign(campaignDraft.id)}
                disabled={saving}
              >
                <Trash2 size={14} />
                Delete program
              </button>
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Live Preview: Campaign Card</p>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
              onClick={() => openPreview(campaignPreviewPath)}
            >
              <ExternalLink size={14} />
              Preview
            </button>
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-slate-100">
              {campaignDraft.image ? (
                <img src={campaignDraft.image} alt={campaignDraft.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <ImageIcon />
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{campaignDraft.category || "Program"}</p>
              <h3 className="mt-2 text-lg font-semibold text-[#4B0B7A]">{campaignDraft.title || "Program title"}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {campaignDraft.shortDescription || "Short description of the program."}
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{formatCurrency(Number(campaignDraft.raised || 0))} raised</span>
                  <span>{formatCurrency(Number(campaignDraft.goal || 0))} goal</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#5E1B77] to-[#7F19E6]"
                    style={{ width: `${campaignProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">{campaignProgress}% funded</p>
              </div>
              <button className="mt-4 w-full rounded-full bg-[#F5C542] px-4 py-2 text-sm font-semibold text-[#3B2500]">
                Donate Now
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProgramsPage
