import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react"
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react"
import {
  createAdminTeamMember,
  createAdminStory,
  deleteAdminTeamMember,
  deleteAdminStory,
  fetchAdminTeam,
  fetchAdminStories,
  fetchSettings,
  uploadAdminImage,
  updateAdminTeamMember,
  updateAdminStory,
  updateSettingsSection,
  type OrganizationDto,
  type SponsorDto,
  type StoryDto,
  type TeamMemberDto,
} from "../../services/api"

const CONTENT_TABS = [
  { id: "impact", label: "Impact Stories" },
  { id: "contact", label: "Contact Info" },
  { id: "team", label: "Team" },
  { id: "sponsors", label: "Our Sponsors" },
] as const

type ContentTab = (typeof CONTENT_TABS)[number]["id"]

type ActiveId = string | "new"

type UploadTarget = "storyMain" | "storyGallery" | "sponsor" | "team" | null
type UploadPreviewTarget = Exclude<UploadTarget, null>
type UploadPreviewMap = Partial<Record<UploadPreviewTarget, string>>
type StoryGalleryUploadThumb = {
  id: string
  previewUrl: string
  fileName: string
}

const emptyStory: StoryDto = {
  id: "",
  title: "",
  excerpt: "",
  content: "",
  imageUrl: "",
  galleryImages: [],
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

const emptyTeamMember: TeamMemberDto = {
  id: "",
  name: "",
  role: "",
  photo: "",
}

function statusTone(status?: string) {
  if (!status) return "bg-slate-100 text-slate-600"
  if (status === "Active" || status === "Published") return "bg-emerald-100 text-emerald-700"
  if (status === "Draft") return "bg-amber-100 text-amber-700"
  return "bg-slate-100 text-slate-600"
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

function ImageUploadDropzone({
  placeholder,
  previewUrl,
  previewSize,
  disabled,
  uploading,
  multiple,
  onFilesSelected,
}: {
  placeholder: string
  previewUrl?: string
  previewSize?: "compact" | "main"
  disabled?: boolean
  uploading?: boolean
  multiple?: boolean
  onFilesSelected: (files: FileList | null) => void
}): JSX.Element {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const openFileExplorer = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (disabled) return
    setDragActive(false)
    onFilesSelected(event.dataTransfer.files)
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={openFileExplorer}
      onKeyDown={event => {
        if (disabled) return
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          openFileExplorer()
        }
      }}
      onDragOver={event => {
        event.preventDefault()
        if (!disabled) setDragActive(true)
      }}
      onDragLeave={event => {
        event.preventDefault()
        setDragActive(false)
      }}
      onDrop={handleDrop}
      className={`group mt-2 cursor-pointer rounded-xl border transition ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
          : dragActive
            ? "border-[#6A0DAD] bg-[#F8F1FF] text-[#4B0B7A]"
            : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100"
      } ${previewUrl ? "overflow-hidden" : "border-dashed p-4 text-center text-xs"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={Boolean(multiple)}
        className="hidden"
        onChange={event => {
          onFilesSelected(event.target.files)
          event.target.value = ""
        }}
        disabled={disabled}
      />

      {previewUrl ? (
        <div className={`relative w-full ${previewSize === "main" ? "h-44 sm:h-52" : "h-28"}`}>
          <img src={previewUrl} alt="Upload preview" className="h-full w-full object-cover" />
          <div
            className={`absolute inset-0 flex items-center justify-center transition ${
              uploading ? "bg-slate-900/55 opacity-100" : "bg-slate-900/35 opacity-0 group-hover:opacity-100"
            }`}
          >
            {uploading ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-700">
                <Loader2 size={13} className="animate-spin" />
                Uploading...
              </div>
            ) : (
              <p className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-700">
                Click or drag to replace
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Upload className="mx-auto" size={18} />
          <p>{placeholder}</p>
          {uploading && (
            <p className="inline-flex items-center justify-center gap-1 text-[11px] text-slate-500">
              <Loader2 size={12} className="animate-spin" />
              Uploading...
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function ContentPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<ContentTab>("impact")
  const [stories, setStories] = useState<StoryDto[]>([])
  const [organization, setOrganization] = useState<OrganizationDto>(emptyOrganization)
  const [orgDraft, setOrgDraft] = useState<OrganizationDto>(emptyOrganization)
  const [sponsors, setSponsors] = useState<SponsorDto[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMemberDto[]>([])
  const [activeStoryId, setActiveStoryId] = useState<ActiveId>("new")
  const [activeSponsorId, setActiveSponsorId] = useState<ActiveId>("new")
  const [activeTeamId, setActiveTeamId] = useState<ActiveId>("new")
  const [storyDraft, setStoryDraft] = useState<StoryDto>(emptyStory)
  const [storyGalleryUrlInput, setStoryGalleryUrlInput] = useState("")
  const [sponsorDraft, setSponsorDraft] = useState<SponsorDto>(emptySponsor)
  const [teamDraft, setTeamDraft] = useState<TeamMemberDto>(emptyTeamMember)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingTarget, setUploadingTarget] = useState<UploadTarget>(null)
  const [uploadPreviewUrls, setUploadPreviewUrls] = useState<UploadPreviewMap>({})
  const uploadPreviewUrlsRef = useRef<UploadPreviewMap>({})
  const [storyGalleryUploadThumbs, setStoryGalleryUploadThumbs] = useState<StoryGalleryUploadThumb[]>([])
  const storyGalleryUploadThumbsRef = useRef<StoryGalleryUploadThumb[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const previous = uploadPreviewUrlsRef.current
    const targets: UploadPreviewTarget[] = ["storyMain", "storyGallery", "sponsor", "team"]
    for (const target of targets) {
      const previousUrl = previous[target]
      const nextUrl = uploadPreviewUrls[target]
      if (previousUrl && previousUrl.startsWith("blob:") && previousUrl !== nextUrl) {
        URL.revokeObjectURL(previousUrl)
      }
    }
    uploadPreviewUrlsRef.current = uploadPreviewUrls
  }, [uploadPreviewUrls])

  useEffect(() => {
    return () => {
      const targets: UploadPreviewTarget[] = ["storyMain", "storyGallery", "sponsor", "team"]
      for (const target of targets) {
        const previewUrl = uploadPreviewUrlsRef.current[target]
        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl)
        }
      }
    }
  }, [])

  useEffect(() => {
    storyGalleryUploadThumbsRef.current = storyGalleryUploadThumbs
  }, [storyGalleryUploadThumbs])

  useEffect(() => {
    return () => {
      for (const thumb of storyGalleryUploadThumbsRef.current) {
        if (thumb.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(thumb.previewUrl)
        }
      }
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [storyData, settings, teamData] = await Promise.all([
          fetchAdminStories(),
          fetchSettings(),
          fetchAdminTeam(),
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
        const teamItems = teamData.length > 0 ? teamData : settings?.team?.items ?? []
        setTeamMembers(teamItems)
        if (teamItems.length > 0) {
          setActiveTeamId(teamItems[0].id)
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
      setStoryGalleryUrlInput("")
      return
    }
    const selected = stories.find(item => item.id === activeStoryId)
    if (selected) {
      setStoryDraft({
        ...emptyStory,
        ...selected,
        galleryImages: Array.isArray(selected.galleryImages) ? selected.galleryImages : [],
      })
      setStoryGalleryUrlInput("")
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

  useEffect(() => {
    if (activeTeamId === "new") {
      setTeamDraft({ ...emptyTeamMember })
      return
    }
    const selected = teamMembers.find(item => item.id === activeTeamId)
    if (selected) {
      setTeamDraft({ ...emptyTeamMember, ...selected })
    }
  }, [activeTeamId, teamMembers])

  function handleStoryChange<K extends keyof StoryDto>(key: K, value: StoryDto[K]) {
    setStoryDraft(prev => ({ ...prev, [key]: value }))
  }

  function handleOrgChange<K extends keyof OrganizationDto>(key: K, value: OrganizationDto[K]) {
    setOrgDraft(prev => ({ ...prev, [key]: value }))
  }

  function handleSponsorChange<K extends keyof SponsorDto>(key: K, value: SponsorDto[K]) {
    setSponsorDraft(prev => ({ ...prev, [key]: value }))
  }

  function handleTeamChange<K extends keyof TeamMemberDto>(key: K, value: TeamMemberDto[K]) {
    setTeamDraft(prev => ({ ...prev, [key]: value }))
  }

  function setUploadPreview(target: UploadPreviewTarget, previewUrl?: string) {
    setUploadPreviewUrls(prev => {
      if (!previewUrl) {
        if (!(target in prev)) return prev
        const next = { ...prev }
        delete next[target]
        return next
      }
      return { ...prev, [target]: previewUrl }
    })
  }

  function addStoryGalleryUrl() {
    const nextUrl = storyGalleryUrlInput.trim()
    if (!nextUrl) return
    setStoryDraft(prev => {
      const existing = Array.isArray(prev.galleryImages) ? prev.galleryImages : []
      if (existing.includes(nextUrl)) return prev
      return { ...prev, galleryImages: [...existing, nextUrl] }
    })
    setStoryGalleryUrlInput("")
  }

  function removeStoryGalleryUrl(index: number) {
    setStoryDraft(prev => {
      const existing = Array.isArray(prev.galleryImages) ? prev.galleryImages : []
      return {
        ...prev,
        galleryImages: existing.filter((_, currentIndex) => currentIndex !== index),
      }
    })
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

  async function saveTeamMember() {
    if (!teamDraft.name.trim()) {
      setError("Team member name is required.")
      return
    }
    if (!teamDraft.role.trim()) {
      setError("Team member role is required.")
      return
    }
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const payload: Partial<TeamMemberDto> = {
        name: teamDraft.name.trim(),
        role: teamDraft.role.trim(),
        photo: (teamDraft.photo || "").trim(),
      }

      const saved = activeTeamId === "new" || !teamDraft.id
        ? await createAdminTeamMember(payload)
        : await updateAdminTeamMember(teamDraft.id, payload)

      const persistedItems = await fetchAdminTeam()
      setTeamMembers(persistedItems)
      setActiveTeamId(saved.id)
      setTeamDraft({ ...emptyTeamMember, ...saved })
      setSuccess("Team member saved.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save team member")
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

  async function handleDeleteTeamMember(id: string) {
    const ok = window.confirm("Delete this team member? This cannot be undone.")
    if (!ok) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      await deleteAdminTeamMember(id)
      const persistedItems = await fetchAdminTeam()
      setTeamMembers(persistedItems)
      if (persistedItems.length > 0) {
        setActiveTeamId(persistedItems[0].id)
        setTeamDraft({ ...emptyTeamMember, ...persistedItems[0] })
      } else {
        setActiveTeamId("new")
        setTeamDraft({ ...emptyTeamMember })
      }
      setSuccess("Team member deleted.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete team member")
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(file: File, target: UploadPreviewTarget) {
    setUploadingTarget(target)
    setError(null)
    setSuccess(null)
    try {
      const photo = await uploadAdminImage(file, {
        folder: target === "sponsor" ? "sponsors" : target === "team" ? "team" : "stories",
        title: target === "sponsor"
          ? sponsorDraft.name || undefined
          : target === "team"
            ? teamDraft.name || undefined
            : storyDraft.title || undefined,
      })
      const url = photo.imageUrl
      if (target === "storyMain") {
        setStoryDraft(prev => ({ ...prev, imageUrl: url }))
      } else if (target === "storyGallery") {
        setStoryDraft(prev => {
          const existing = Array.isArray(prev.galleryImages) ? prev.galleryImages : []
          return existing.includes(url) ? prev : { ...prev, galleryImages: [...existing, url] }
        })
      } else if (target === "team") {
        setTeamDraft(prev => ({ ...prev, photo: url }))
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

  async function handleImageUploadWithPreview(file: File, target: UploadPreviewTarget) {
    const localPreviewUrl = URL.createObjectURL(file)
    setUploadPreview(target, localPreviewUrl)
    try {
      await handleImageUpload(file, target)
    } finally {
      setUploadPreview(target)
    }
  }

  async function handleStoryGalleryFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const timestamp = Date.now()
    const queuedUploads = Array.from(files).map((file, index) => ({
      id: `${timestamp}-${index}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      fileName: file.name,
    }))

    setStoryGalleryUploadThumbs(prev => [
      ...prev,
      ...queuedUploads.map(({ id, previewUrl, fileName }) => ({ id, previewUrl, fileName })),
    ])

    for (const queued of queuedUploads) {
      try {
        await handleImageUpload(queued.file, "storyGallery")
      } finally {
        setStoryGalleryUploadThumbs(prev => {
          const current = prev.find(item => item.id === queued.id)
          if (current?.previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(current.previewUrl)
          }
          return prev.filter(item => item.id !== queued.id)
        })
      }
    }
  }

  async function refreshTeamMembersFromDb() {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const dbTeamMembers = await fetchAdminTeam()
      setTeamMembers(dbTeamMembers)
      if (dbTeamMembers.length === 0) {
        setActiveTeamId("new")
        setTeamDraft({ ...emptyTeamMember })
      } else if (activeTeamId === "new") {
        setTeamDraft({ ...emptyTeamMember })
      } else {
        const selected = dbTeamMembers.find(item => item.id === activeTeamId) ?? dbTeamMembers[0]
        setActiveTeamId(selected.id)
        setTeamDraft({ ...emptyTeamMember, ...selected })
      }
      setSuccess("Team preview synced from database.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh team members")
    } finally {
      setSaving(false)
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
                  setStoryDraft(
                    active
                      ? {
                          ...emptyStory,
                          ...active,
                          galleryImages: Array.isArray(active.galleryImages) ? active.galleryImages : [],
                        }
                      : { ...emptyStory },
                  )
                  setStoryGalleryUrlInput("")
                }
                if (activeTab === "contact") {
                  setOrgDraft(organization)
                }
                if (activeTab === "sponsors") {
                  const active = sponsors.find(item => item.id === activeSponsorId)
                  setSponsorDraft(active ? { ...emptySponsor, ...active } : { ...emptySponsor })
                }
                if (activeTab === "team") {
                  const active = teamMembers.find(item => item.id === activeTeamId)
                  setTeamDraft(active ? { ...emptyTeamMember, ...active } : { ...emptyTeamMember })
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
            ) : activeTab === "team" ? (
              <button
                className="rounded-full bg-[#F5C542] px-4 py-2 text-sm font-semibold text-[#3B2500] hover:bg-[#F3B928]"
                onClick={saveTeamMember}
                disabled={saving}
              >
                Save Team Member
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

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Team Members</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{teamMembers.length}</p>
          <p className="text-xs text-slate-500">People listed publicly</p>
          <div className="mt-3 space-y-1 text-xs text-slate-600">
            {teamMembers.slice(0, 4).map(item => (
              <p key={item.id} className="truncate">{item.name}</p>
            ))}
            {teamMembers.length > 4 && <p className="text-slate-400">+{teamMembers.length - 4} more</p>}
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
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Main Card Image URL</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                    value={storyDraft.imageUrl}
                    onChange={event => handleStoryChange("imageUrl", event.target.value)}
                  />
                  <ImageUploadDropzone
                    placeholder="Upload or drag an image"
                    previewUrl={uploadPreviewUrls.storyMain ?? storyDraft.imageUrl}
                    previewSize="main"
                    disabled={uploadingTarget === "storyMain"}
                    uploading={uploadingTarget === "storyMain"}
                    onFilesSelected={files => {
                      const file = files?.[0]
                      if (!file) return
                      void handleImageUploadWithPreview(file, "storyMain")
                    }}
                  />
                </div>

                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <label className="text-xs font-semibold text-slate-700">Story Photo Gallery</label>
                  <div className="flex gap-2">
                    <input
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                      placeholder="Paste gallery image URL"
                      value={storyGalleryUrlInput}
                      onChange={event => setStoryGalleryUrlInput(event.target.value)}
                    />
                    <button
                      type="button"
                      className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                      onClick={addStoryGalleryUrl}
                    >
                      Add
                    </button>
                  </div>
                  <ImageUploadDropzone
                    placeholder="Upload or drag images"
                    multiple
                    disabled={uploadingTarget === "storyGallery"}
                    uploading={uploadingTarget === "storyGallery"}
                    onFilesSelected={files => {
                      void handleStoryGalleryFiles(files)
                    }}
                  />
                  {storyGalleryUploadThumbs.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-500">
                        Uploading {storyGalleryUploadThumbs.length} image{storyGalleryUploadThumbs.length === 1 ? "" : "s"}...
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {storyGalleryUploadThumbs.map(item => (
                          <div
                            key={item.id}
                            className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200 bg-white"
                            title={item.fileName}
                          >
                            <img
                              src={item.previewUrl}
                              alt={item.fileName}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/55 text-white">
                              <Loader2 size={14} className="animate-spin" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(storyDraft.galleryImages ?? []).map((image, index) => (
                      <div key={`${image}-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <img src={image} alt={`Gallery ${index + 1}`} className="h-24 w-full object-cover" />
                        <div className="flex items-center justify-between px-2 py-1.5">
                          <p className="truncate text-[11px] text-slate-500">Image {index + 1}</p>
                          <button
                            type="button"
                            className="text-[11px] font-semibold text-rose-600"
                            onClick={() => removeStoryGalleryUrl(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    {(storyDraft.galleryImages ?? []).length === 0 && (
                      <p className="text-[11px] text-slate-500">No gallery images added yet.</p>
                    )}
                  </div>
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
                {(storyDraft.galleryImages ?? []).length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {(storyDraft.galleryImages ?? []).slice(0, 4).map((image, index) => (
                      <img
                        key={`${image}-${index}`}
                        src={image}
                        alt={`Story gallery preview ${index + 1}`}
                        className="h-14 w-full rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
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

      {activeTab === "team" && (
        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)]">
          <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Team Members</p>
              <button
                className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                onClick={() => setActiveTeamId("new")}
              >
                <Plus size={12} />
                New
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">Select a team member from DB data to edit roles and photos</p>
            <div className="mt-3 space-y-2">
              {teamMembers.map(item => (
                <button
                  key={item.id}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                    activeTeamId === item.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => setActiveTeamId(item.id)}
                >
                  <span className="truncate">{item.name}</span>
                  <span className="truncate text-[10px] opacity-70">{item.role || "Role"}</span>
                </button>
              ))}
              {teamMembers.length === 0 && <p className="text-xs text-slate-500">No team members yet.</p>}
            </div>
          </aside>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Edit Team Member</p>
                <p className="text-xs text-slate-500">Create and manage people shown in the Team section.</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${teamDraft.photo ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                {teamDraft.photo ? "Photo set" : "No photo"}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                  value={teamDraft.name}
                  onChange={event => handleTeamChange("name", event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Role</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                  value={teamDraft.role}
                  onChange={event => handleTeamChange("role", event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Photo URL</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none"
                  value={teamDraft.photo ?? ""}
                  onChange={event => handleTeamChange("photo", event.target.value)}
                />
                <ImageUploadDropzone
                  placeholder="Upload or drag an image"
                  previewUrl={uploadPreviewUrls.team ?? teamDraft.photo}
                  disabled={uploadingTarget === "team"}
                  uploading={uploadingTarget === "team"}
                  onFilesSelected={files => {
                    const file = files?.[0]
                    if (!file) return
                    void handleImageUploadWithPreview(file, "team")
                  }}
                />
              </div>
            </div>

            {teamDraft.id && (
              <div className="mt-4 flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-rose-600 shadow-sm ring-1 ring-rose-200 hover:bg-rose-50"
                  onClick={() => handleDeleteTeamMember(teamDraft.id)}
                  disabled={saving}
                >
                  <Trash2 size={14} />
                  Delete team member
                </button>
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Live Preview: Team Section</p>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                  onClick={refreshTeamMembersFromDb}
                  disabled={saving}
                >
                  <Save size={14} />
                  Sync DB
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                  onClick={() => openPreview("/about")}
                >
                  <ExternalLink size={14} />
                  Preview
                </button>
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                {teamDraft.photo ? (
                  <img src={teamDraft.photo} alt={teamDraft.name || "Team member"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <ImageIcon />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900">{teamDraft.name || "Team member name"}</h3>
                <p className="mt-1 text-sm text-slate-600">{teamDraft.role || "Role title"}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Team Preview Board</p>
              <p className="mt-1 text-[11px] text-slate-500">Loaded from database. Click a card to edit that member.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {teamMembers.map(item => (
                  <button
                    key={`preview-${item.id}`}
                    type="button"
                    className={`overflow-hidden rounded-xl border text-left transition ${
                      activeTeamId === item.id
                        ? "border-slate-900 shadow-md"
                        : "border-slate-200 shadow-sm hover:border-slate-300"
                    }`}
                    onClick={() => setActiveTeamId(item.id)}
                  >
                    <div className="h-28 w-full bg-slate-100">
                      {item.photo ? (
                        <img src={item.photo} alt={item.name || "Team member"} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </div>
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-semibold text-slate-900">{item.name || "Unnamed member"}</p>
                      <p className="truncate text-xs text-slate-600">{item.role || "Role not set"}</p>
                    </div>
                  </button>
                ))}
                {teamMembers.length === 0 && (
                  <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-xs text-slate-500">
                    No team members in the database yet.
                  </p>
                )}
              </div>
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
                <ImageUploadDropzone
                  placeholder="Upload or drag an image"
                  previewUrl={uploadPreviewUrls.sponsor ?? sponsorDraft.icon}
                  disabled={uploadingTarget === "sponsor"}
                  uploading={uploadingTarget === "sponsor"}
                  onFilesSelected={files => {
                    const file = files?.[0]
                    if (!file) return
                    void handleImageUploadWithPreview(file, "sponsor")
                  }}
                />
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
