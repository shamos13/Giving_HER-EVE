import { useState } from "react"
import { Eye, FileText, Save, Upload } from "lucide-react"

function ContentPage(): JSX.Element {
  const [activeSection, setActiveSection] = useState("Home")

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Content Management</p>
          <p className="text-lg font-bold text-slate-900">Edit and preview site sections</p>
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
            {contentSections.map(section => (
              <button
                key={section.name}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold ${
                  activeSection === section.name ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
                onClick={() => setActiveSection(section.name)}
              >
                <span>{section.name}</span>
                <FileText size={14} />
              </button>
            ))}
          </div>
        </aside>

        <div className="lg:col-span-2 space-y-4">
          {contentSections
            .filter(section => section.name === activeSection)
            .map(section => (
              <section key={section.name} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{section.name}</p>
                    <p className="text-xs text-slate-500">{section.description}</p>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800">
                    <Eye size={14} />
                    Preview
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {section.fields.map(field => (
                    <div key={field.label} className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">{field.label}</label>
                      {field.type === "textarea" ? (
                        <textarea
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                          rows={field.rows ?? 3}
                          defaultValue={field.value}
                        />
                      ) : (
                        <input
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                          defaultValue={field.value}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                    <Save size={14} />
                    Save draft
                  </button>
                  <button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md">
                    Update section
                  </button>
                </div>
              </section>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ContentPage

interface ContentField {
  label: string
  value: string
  type: "text" | "textarea"
  rows?: number
}

interface ContentSection {
  name: "Home" | "About" | "Success Stories" | "Team"
  description: string
  fields: ContentField[]
}

const contentSections: ContentSection[] = [
  {
    name: "Home",
    description: "Hero headline, subtext, and primary CTA text",
    fields: [
      { label: "Hero headline", value: "Empowering every voice to rise above violence.", type: "text" },
      { label: "Hero supporting text", value: "We connect survivors, communities, and partners to safety, resources, and hope.", type: "textarea", rows: 3 },
      { label: "Primary CTA label", value: "Support our mission", type: "text" },
    ],
  },
  {
    name: "About",
    description: "Story, mission, and impact metrics",
    fields: [
      { label: "Story intro", value: "Giving Her E.v.E is a community-powered movement providing shelter, healthcare, and education.", type: "textarea", rows: 4 },
      { label: "Mission statement", value: "Ensure every woman feels safe, supported, and seen.", type: "text" },
      { label: "Impact highlight", value: "Reached 12,000+ women with emergency care and advocacy.", type: "text" },
    ],
  },
  {
    name: "Success Stories",
    description: "Quotes and featured journeys",
    fields: [
      { label: "Headline", value: "Stories of courage and transformation", type: "text" },
      { label: "Feature summary", value: "Weekly spotlights on women who rebuilt their lives through our programs.", type: "textarea", rows: 3 },
      { label: "CTA label", value: "Read more stories", type: "text" },
    ],
  },
  {
    name: "Team",
    description: "Leadership, advisors, and volunteers",
    fields: [
      { label: "Intro", value: "We are volunteers, advocates, and professionals committed to safe communities.", type: "textarea", rows: 3 },
      { label: "Highlight", value: "Local teams across 12 cities with legal, health, and counseling expertise.", type: "text" },
      { label: "CTA label", value: "Meet our team", type: "text" },
    ],
  },
]

