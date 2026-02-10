import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react"
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  ImageIcon,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react"
import {
  createAdminStory,
  deleteAdminStory,
  fetchAdminStories,
  fetchSettings,
  updateAdminStory,
  updateSettingsSection,
  type OrganizationDto,
  type SponsorDto,
  type StoryDto,
} from "../../services/api"

const CONTENT_TABS = [
  { id: "impact", label: "Impact Stories" },
  { id: "contact", label: "Contact Info" },
  { id: "sponsors", label: "Our Sponsors" },
] as const

type ContentTab = (typeof CONTENT_TABS)[number]["id"]

type ActiveId = string | "new"

type UploadTarget = "story" | "sponsor" | null

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? ""
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? ""
const CLOUDINARY_ENABLED = Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET)

const emptyStory: StoryDto = {
  id: "",
  title: "",
  excerpt: "",
  content: "",
  imageUrl: "",
  status: "Draft",
  campaignId: "",
  area: "",
  date: "",
  location: "",
}

const emptyOrganization: OrganizationDto = {
  name: "",
  tagline: "",
  website: "",
  email: "",
  phone: "",
  address: "",
  facebook: "",
  instagram: "",
  xHandle: "",
  about: "",
}

const emptySponsor: SponsorDto = {
  id: "",
  name: "",
  icon: "",
}

function statusTone(status?: string) {
  if (!status) return "bg-slate-100 text-slate-600"
  if (status === "Active" || status === "Published") return "bg-emerald-100 text-emerald-700"
  if (status === "Draft") return "bg-amber-100 text-amber-700"
  return "bg-slate-100 text-slate-600"
}

async function uploadImage(file: File): Promise<string> {
  if (!CLOUDINARY_ENABLED) {
    throw new Error("Cloudinary upload is not configured.")
  }
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
    method: "POST",
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) {
    const message = data?.error?.message ?? "Image upload failed"
    throw new Error(message)
  }
  return data.secure_url || data.url
}

function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }): JSX.Element {
  const editorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!editorRef.current) return
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ""
    }
  }, [value])

  const emitChange = () => {
    onChange(editorRef.current?.innerHTML ?? "")
  }

  const runCommand = (command: string, commandValue?: string) => (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    document.execCommand(command, false, commandValue)
    emitChange()
  }

  const handleLink = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const url = window.prompt("Enter a URL")
    if (!url) return
    document.execCommand("createLink", false, url)
    emitChange()
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
        <button className="rounded-full border border-slate-200 px-2 py-1 hover:bg-slate-50" onMouseDown={runCommand("bold")}>
          Bold
        </button>
        <button className="rounded-full border border-slate-200 px-2 py-1 hover:bg-slate-50" onMouseDown={runCommand("italic")}>
          Italic
        </button>
        <button className="rounded-full border border-slate-200 px-2 py-1 hover:bg-slate-50" onMouseDown={runCommand("underline")}>
          Underline
        </button>
        <button className="rounded-full border border-slate-200 px-2 py-1 hover:bg-slate-50" onMouseDown={runCommand("insertUnorderedList")}>
          Bullets
        </button>
        <button className="rounded-full border border-slate-200 px-2 py-1 hover:bg-slate-50" onMouseDown={runCommand("insertOrderedList")}>
          Numbered
        </button>
        <button className="rounded-full border border-slate-200 px-2 py-1 hover:bg-slate-50" onMouseDown={runCommand("formatBlock", "blockquote")}>Quote</button>
        <button className="rounded-full border border-slate-200 px-2 py-1 hover:bg-slate-50" onMouseDown={handleLink}>
          Link
        </button>
      </div>
      <div className="relative">
        {!value && (
          <div className="pointer-events-none absolute left-3 top-3 text-xs text-slate-400">
            Write your story content here...
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          onInput={emitChange}
          onBlur={emitChange}
          className="min-h-[200px] rounded-b-xl px-3 py-3 text-sm text-slate-800 outline-none"
        />
      </div>
    </div>
  )
}

function ContentPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<ContentTab>("impact")
  const [stories, setStories] = useState<StoryDto[]>([])
  const [organization, setOrganization] = useState<OrganizationDto>(emptyOrganization)
  const [orgDraft, setOrgDraft] = useState<OrganizationDto>(emptyOrganization)
  const [sponsors, setSponsors] = useState<SponsorDto[]>([])
  const [activeStoryId, setActiveStoryId] = useState<ActiveId>("new")
  const [activeSponsorId, setActiveSponsorId] = useState<ActiveId>("new")
  const [storyDraft, setStoryDraft] = useState<StoryDto>(emptyStory)
  const [sponsorDraft, setSponsorDraft] = useState<SponsorDto>(emptySponsor)
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
        const [storyData, settings] = await Promise.all([
          fetchAdminStories(),
          fetchSettings(),
        ])
        if (cancelled) return
        setStories(storyData)
        if (storyData.length > 0) {
          setActiveStoryId(storyData[0].id)
        }
        if (settings?.organization) {
          setOrganization(settings.organization)
          setOrgDraft(settings.organization)
        }
        const sponsorItems = settings?.sponsors?.items ?? []
        setSponsors(sponsorItems)
        if (sponsorItems.length > 0) {
          setActiveSponsorId(sponsorItems[0].id)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load content")
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
    if (activeStoryId === "new") {
      setStoryDraft({ ...emptyStory })
      return
    }
    const selected = stories.find(item => item.id === activeStoryId)
    if (selected) {
      setStoryDraft({ ...emptyStory, ...selected })
    }
  }, [activeStoryId, stories])

  useEffect(() => {
    if (activeSponsorId === "new") {
      setSponsorDraft({ ...emptySponsor })
      return
    }
    const selected = sponsors.find(item => item.id === activeSponsorId)
    if (selected) {
      setSponsorDraft({ ...emptySponsor, ...selected })
    }
  }, [activeSponsorId, sponsors])

  function handleStoryChange<K extends keyof StoryDto>(key: K, value: StoryDto[K]) {
    setStoryDraft(prev => ({ ...prev, [key]: value }))
  }

  function handleOrgChange<K extends keyof OrganizationDto>(key: K, value: OrganizationDto[K]) {
    setOrgDraft(prev => ({ ...prev, [key]: value }))
  }

  function handleSponsorChange<K extends keyof SponsorDto>(key: K, value: SponsorDto[K]) {
    setSponsorDraft(prev => ({ ...prev, [key]: value }))
  }

  async function saveStory(status: "Draft" | "Published") {
    if (!storyDraft.title.trim()) {
      setError("Story title is required.")
      return
    }
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const payload: Partial<StoryDto> = {
        ...storyDraft,
        status,
      }
      let saved: StoryDto
      if (activeStoryId === "new" || !storyDraft.id) {
        saved = await createAdminStory(payload)
        setStories(prev => [saved, ...prev])
        setActiveStoryId(saved.id)
      } else {
        saved = await updateAdminStory(storyDraft.id, payload)
        setStories(prev => prev.map(item => (item.id === saved.id ? saved : item)))
      }
      setStoryDraft({ ...emptyStory, ...saved })
      setSuccess("Story saved.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save story")
    } finally {
      setSaving(false)
    }
  }

  async function saveOrganization() {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const updated = await updateSettingsSection("organization", orgDraft)
      setOrganization(updated)
      setOrgDraft(updated)
      setSuccess("Contact info updated.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save contact info")
    } finally {
      setSaving(false)
    }
  }

  async function saveSponsor() {
    if (!sponsorDraft.name.trim()) {
      setError("Sponsor name is required.")
      return
    }
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const nextId = sponsorDraft.id || `sponsor-${Date.now()}`
      const nextSponsor: SponsorDto = {
        ...sponsorDraft,
        id: nextId,
      }
      const nextSponsors = activeSponsorId === "new"
        ? [nextSponsor, ...sponsors]
        : sponsors.map(item => (item.id === nextId ? nextSponsor : item))
      const updated = await updateSettingsSection("sponsors", { items: nextSponsors })
      const updatedItems = updated.items ?? nextSponsors
      setSponsors(updatedItems)
      setActiveSponsorId(nextId)
      setSponsorDraft(nextSponsor)
      setSuccess("Sponsor saved.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save sponsor")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteStory(id: string) {
    const ok = window.confirm("Delete this story? This cannot be undone.")
    if (!ok) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      await deleteAdminStory(id)
      setStories(prev => prev.filter(item => item.id !== id))
      setActiveStoryId("new")
      setSuccess("Story deleted.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete story")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteSponsor(id: string) {
    const ok = window.confirm("Delete this sponsor? This cannot be undone.")
    if (!ok) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const nextSponsors = sponsors.filter(item => item.id !== id)
      const updated = await updateSettingsSection("sponsors", { items: nextSponsors })
      setSponsors(updated.items ?? nextSponsors)
      setActiveSponsorId("new")
      setSponsorDraft({ ...emptySponsor })
      setSuccess("Sponsor deleted.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete sponsor")
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(file: File, target: "story" | "sponsor") {
    setUploadingTarget(target)
    setError(null)
    setSuccess(null)
    try {
      const url = await uploadImage(file)
      if (target === "story") {
        setStoryDraft(prev => ({ ...prev, imageUrl: url }))
      } else {
        setSponsorDraft(prev => ({ ...prev, icon: url }))
      }
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

  const storyPreviewPath =
    storyDraft.id && storyDraft.status === "Published" ? `/impact/${storyDraft.id}` : "/impact"

  const sponsorPreviewItems = useMemo(
    () => (activeSponsorId === "new" ? [sponsorDraft, ...sponsors] : sponsors),
    [activeSponsorId, sponsorDraft, sponsors],
  )

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-r from-[#3D0D57] via-[#4E1B6F] to-[#5A1E73] p-4 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-white/70">Giving Her E.V.E Admin</p>
            <p className="text-xl font-semibold">Content Studio</p>
            <p className="text-xs text-white/70">Manage impact stories, contact info, and sponsor highlights</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
              onClick={() => {
                setError(null)
                setSuccess(null)
                if (activeTab === "impact") {
                  const active = stories.find(item => item.id === activeStoryId)
                  setStoryDraft(active ? { ...emptyStory, ...active } : { ...emptyStory })
                }
                if (activeTab === "contact") {
                  setOrgDraft(organization)
                }
                if (activeTab === "sponsors") {
                  const active = sponsors.find(item => item.id === activeSponsorId)
                  setSponsorDraft(active ? { ...emptySponsor, ...active } : { ...emptySponsor })
                }
              }}
            >
              Cancel
            </button>
            {activeTab === "impact" && (
              <button
                className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
                onClick={() => saveStory("Draft")}
                disabled={saving}
              >
                Save as Draft
              </button>
            )}
            {activeTab === "contact" ? (
              <button
                className="rounded-full bg-[#F5C542] px-4 py-2 text-sm font-semibold text-[#3B2500] hover:bg-[#F3B928]"
                onClick={saveOrganization}
                disabled={saving}
              >
                Save Changes
              </button>
            ) : activeTab === "sponsors" ? (
              <button
                className="rounded-full bg-[#F5C542] px-4 py-2 text-sm font-semibold text-[#3B2500] hover:bg-[#F3B928]"
                onClick={saveSponsor}
                disabled={saving}
              >
                Save Sponsor
              </button>
            ) : (
              <button
                className="rounded-full bg-[#F5C542] px-4 py-2 text-sm font-semibold text-[#3B2500] hover:bg-[#F3B928]"
                onClick={() => saveStory("Published")}
                disabled={saving}
              >
                Publish Changes
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CONTENT_TABS.map(tab => (
          <button
            key={tab.id}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.id ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Impact Stories</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stories.length}</p>
          <p className="text-xs text-slate-500">Available items</p>
          <div className="mt-3 space-y-1 text-xs text-slate-600">
            {stories.slice(0, 4).map(item => (
              <p key={item.id} className="truncate">{item.title}</p>
            ))}
            {stories.length > 4 && <p className="text-slate-400">+{stories.length - 4} more</p>}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contact Info</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">3</p>
          <p className="text-xs text-slate-500">Key fields</p>
          <div className="mt-3 space-y-1 text-xs text-slate-600">
            <p className="truncate">{orgDraft.email || "Email"}</p>
            <p className="truncate">{orgDraft.phone || "Phone"}</p>
            <p className="truncate">{orgDraft.address || "Address"}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sponsors</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{sponsors.length}</p>
          <p className="text-xs text-slate-500">Listed partners</p>
          <div className="mt-3 space-y-1 text-xs text-slate-600">
            {sponsors.slice(0, 4).map(item => (
              <p key={item.id} className="truncate">{item.name}</p>
            ))}
            {sponsors.length > 4 && <p className="text-slate-400">+{sponsors.length - 4} more</p>}
          </div>
        </div>
      </div>

      {loading && <p className="text-xs text-slate-500">Loading content workspace...</p>}
      {error && <p className="text-xs text-rose-600">Error: {error}</p>}
      {success && <p className="text-xs text-emerald-600">{success}</p>}

      {activeTab === "impact" && (
        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)]">
          <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Impact Stories</p>
              <button
                className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                onClick={() => setActiveStoryId("new")}
              >
                <Plus size={12} />
                New
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">Select a story to edit</p>
            <div className="mt-3 space-y-2">
              {stories.map(item => (
                <button
                  key={item.id}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                    activeStoryId === item.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => setActiveStoryId(item.id)}
                >
                  <span className="truncate">{item.title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${statusTone(item.status)}`}>{item.status ?? "Draft"}</span>
                </button>
              ))}
              {stories.length === 0 && <p className="text-xs text-slate-500">No stories yet.</p>}
            </div>
          </aside>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Edit Impact Story</p>
                <p className="text-xs text-slate-500">Blog-style story entry with rich formatting.</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(storyDraft.status)}`}>
                {storyDraft.status || "Draft"}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Story Title</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  value={storyDraft.title}
                  onChange={event => handleStoryChange("title", event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Excerpt</label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  rows={2}
                  value={storyDraft.excerpt}
                  onChange={event => handleStoryChange("excerpt", event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Story Content</label>
                <RichTextEditor value={storyDraft.content ?? ""} onChange={value => handleStoryChange("content", value)} />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Impact Area</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                    value={storyDraft.area ?? ""}
                    onChange={event => handleStoryChange("area", event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Location</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                    value={storyDraft.location ?? ""}
                    onChange={event => handleStoryChange("location", event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Date</label>
                  <input
                    type="text"
                    placeholder="Feb 12, 2024"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                    value={storyDraft.date ?? ""}
                    onChange={event => handleStoryChange("date", event.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Associated Campaign ID</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                    value={storyDraft.campaignId ?? ""}
                    onChange={event => handleStoryChange("campaignId", event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Status</label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                    value={storyDraft.status ?? "Draft"}
                    onChange={event => handleStoryChange("status", event.target.value)}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Image URL</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                  value={storyDraft.imageUrl}
                  onChange={event => handleStoryChange("imageUrl", event.target.value)}
                />
                <div className="mt-2 flex flex-col gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                  <Upload className="mx-auto" size={18} />
                  <p>Upload a new story image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={event => {
                      const file = event.target.files?.[0]
                      if (!file) return
                      void handleImageUpload(file, "story")
                    }}
                    disabled={!CLOUDINARY_ENABLED || uploadingTarget === "story"}
                    className="text-xs"
                  />
                  {uploadingTarget === "story" && <p className="text-[11px] text-slate-500">Uploading image...</p>}
                  {!CLOUDINARY_ENABLED && (
                    <p className="text-[11px] text-amber-600">
                      Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to enable uploads.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {storyDraft.id && (
              <div className="mt-4 flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-rose-600 shadow-sm ring-1 ring-rose-200 hover:bg-rose-50"
                  onClick={() => handleDeleteStory(storyDraft.id)}
                  disabled={saving}
                >
                  <Trash2 size={14} />
                  Delete story
                </button>
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Live Preview: Impact Story Card</p>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                onClick={() => openPreview(storyPreviewPath)}
              >
                <ExternalLink size={14} />
                Preview
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                {storyDraft.imageUrl ? (
                  <img src={storyDraft.imageUrl} alt={storyDraft.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <ImageIcon />
                  </div>
                )}
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold text-[#4B0B7A]">
                  {storyDraft.area || "Impact"}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{storyDraft.location || "East Africa"}</span>
                  <span>{storyDraft.date || "Date"}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{storyDraft.title || "Story title"}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {storyDraft.excerpt || "Story excerpt will appear here."}
                </p>
                <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#6A0DAD]">
                  Read full story <Pencil size={14} />
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === "contact" && (
        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)]">
          <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-900">Contact Sections</p>
            <p className="mt-1 text-xs text-slate-500">Update public contact information</p>
            <div className="mt-4 space-y-2">
              {[
                { label: "Organization Profile", icon: FileText },
                { label: "Support Channels", icon: CheckCircle2 },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                  <item.icon size={14} />
                  {item.label}
                </div>
              ))}
            </div>
          </aside>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Edit Contact Information</p>
                <p className="text-xs text-slate-500">These details appear on the Contact page.</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Live</span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Organization Name</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                  value={orgDraft.name}
                  onChange={event => handleOrgChange("name", event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Tagline</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                  value={orgDraft.tagline}
                  onChange={event => handleOrgChange("tagline", event.target.value)}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                    value={orgDraft.email}
                    onChange={event => handleOrgChange("email", event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Phone</label>
                  <input
                    type="tel"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                    value={orgDraft.phone}
                    onChange={event => handleOrgChange("phone", event.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Address</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                  value={orgDraft.address}
                  onChange={event => handleOrgChange("address", event.target.value)}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Website</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                    value={orgDraft.website}
                    onChange={event => handleOrgChange("website", event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">About Summary</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                    value={orgDraft.about}
                    onChange={event => handleOrgChange("about", event.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Facebook</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                    value={orgDraft.facebook}
                    onChange={event => handleOrgChange("facebook", event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Instagram</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                    value={orgDraft.instagram}
                    onChange={event => handleOrgChange("instagram", event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">X (Twitter)</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                    value={orgDraft.xHandle}
                    onChange={event => handleOrgChange("xHandle", event.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Live Preview: Contact Cards</p>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                onClick={() => openPreview("/contact")}
              >
                <ExternalLink size={14} />
                Preview
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { label: "Our location", value: orgDraft.address, icon: FileText },
                { label: "Phone", value: orgDraft.phone, icon: CheckCircle2 },
                { label: "Email", value: orgDraft.email, icon: Save },
              ].map(item => (
                <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <item.icon size={14} />
                    {item.label}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{item.value || "Not provided"}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === "sponsors" && (
        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)]">
          <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Sponsors</p>
              <button
                className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                onClick={() => setActiveSponsorId("new")}
              >
                <Plus size={12} />
                New
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">Select a sponsor to edit</p>
            <div className="mt-3 space-y-2">
              {sponsors.map(item => (
                <button
                  key={item.id}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                    activeSponsorId === item.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => setActiveSponsorId(item.id)}
                >
                  <span className="truncate">{item.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${item.icon ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                    {item.icon ? "Icon" : "Name"}
                  </span>
                </button>
              ))}
              {sponsors.length === 0 && <p className="text-xs text-slate-500">No sponsors yet.</p>}
            </div>
          </aside>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Edit Sponsor</p>
                <p className="text-xs text-slate-500">Add a name and optional icon.</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${sponsorDraft.icon ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                {sponsorDraft.icon ? "Icon set" : "Name only"}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Sponsor Name</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                  value={sponsorDraft.name}
                  onChange={event => handleSponsorChange("name", event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Icon URL (optional)</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                  value={sponsorDraft.icon ?? ""}
                  onChange={event => handleSponsorChange("icon", event.target.value)}
                />
                <div className="mt-2 flex flex-col gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                  <Upload className="mx-auto" size={18} />
                  <p>Upload a sponsor icon</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={event => {
                      const file = event.target.files?.[0]
                      if (!file) return
                      void handleImageUpload(file, "sponsor")
                    }}
                    disabled={!CLOUDINARY_ENABLED || uploadingTarget === "sponsor"}
                    className="text-xs"
                  />
                  {uploadingTarget === "sponsor" && <p className="text-[11px] text-slate-500">Uploading icon...</p>}
                  {!CLOUDINARY_ENABLED && (
                    <p className="text-[11px] text-amber-600">
                      Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to enable uploads.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {sponsorDraft.id && (
              <div className="mt-4 flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-rose-600 shadow-sm ring-1 ring-rose-200 hover:bg-rose-50"
                  onClick={() => handleDeleteSponsor(sponsorDraft.id)}
                  disabled={saving}
                >
                  <Trash2 size={14} />
                  Delete sponsor
                </button>
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Live Preview: Partner Strip</p>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                onClick={() => openPreview("/campaigns")}
              >
                <ExternalLink size={14} />
                Preview
              </button>
            </div>
            <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#7A2BCB] via-[#8F3CD6] to-[#B066EA] p-4 text-white">
              <p className="text-center text-[10px] uppercase tracking-[0.3em] text-white/70">
                Trusted by our supporters
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-white/80 text-sm font-semibold">
                {sponsorPreviewItems.filter(item => item.name || item.icon).map(item => (
                  <span
                    key={item.id || item.name}
                    className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2"
                  >
                    {item.icon && item.name ? (
                      <img src={item.icon} alt={item.name} className="h-5 w-auto" />
                    ) : (
                      <span>{item.name || "Sponsor"}</span>
                    )}
                  </span>
                ))}
                {sponsorPreviewItems.length === 0 && (
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs">
                    Add sponsors to see them here.
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default ContentPage
