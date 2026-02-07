import { useEffect, useState } from "react"
import { Eye, FileText, Save, Upload } from "lucide-react"
import { fetchContentSections, updateContentSection, type ContentSectionDto } from "../../services/api"

function ContentPage(): JSX.Element {
  const [sections, setSections] = useState<ContentSectionDto[]>([])
  const [activeSectionId, setActiveSectionId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchContentSections()
        if (cancelled) return
        setSections(data)
        if (data.length > 0) {
          setActiveSectionId(prev => (prev ? prev : data[0].id))
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

  const activeSection = sections.find(section => section.id === activeSectionId)

  function updateField(sectionId: string, fieldId: string, value: string) {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId ? { ...field, value } : field,
              ),
            }
          : section,
      ),
    )
  }

  async function saveSection(section: ContentSectionDto, status?: string) {
    setSaving(true)
    setError(null)
    try {
      const updated = await updateContentSection(section.id, {
        fields: section.fields,
        status: status ?? section.status,
      })
      setSections(prev => prev.map(item => (item.id === updated.id ? updated : item)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save section")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Content Management</p>
          <p className="text-lg font-bold text-slate-900">Edit and preview site sections</p>
          {loading && <p className="mt-1 text-xs text-slate-500">Loading content sections...</p>}
          {error && <p className="mt-1 text-xs text-rose-600">Error: {error}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            <Upload size={16} />
            Upload asset
          </button>
          <button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md">
            Publish changes
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm font-semibold text-slate-900">Sections</p>
          <p className="text-xs text-slate-500">Choose which page to update</p>
          <div className="mt-3 space-y-2">
            {sections.map(section => (
              <button
                key={section.id}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold ${
                  activeSectionId === section.id ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
                onClick={() => setActiveSectionId(section.id)}
              >
                <span>{section.name}</span>
                <FileText size={14} />
              </button>
            ))}
          </div>
        </aside>

        <div className="lg:col-span-2 space-y-4">
          {activeSection && (
            <section key={activeSection.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{activeSection.name}</p>
                  <p className="text-xs text-slate-500">{activeSection.description}</p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800">
                  <Eye size={14} />
                  Preview
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {activeSection.fields.map(field => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        rows={field.rows ?? 3}
                        value={field.value}
                        onChange={event => updateField(activeSection.id, field.id, event.target.value)}
                      />
                    ) : (
                      <input
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        value={field.value}
                        onChange={event => updateField(activeSection.id, field.id, event.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                  onClick={() => saveSection(activeSection, "Draft")}
                  disabled={saving}
                >
                  <Save size={14} />
                  Save draft
                </button>
                <button
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md"
                  onClick={() => saveSection(activeSection, "Published")}
                  disabled={saving}
                >
                  Update section
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContentPage

