import { useEffect, useState } from "react"
import { CalendarDays, Edit3, MapPin, Users } from "lucide-react"
import { fetchPrograms, type ProgramDto } from "../../services/api"

function ProgramsPage(): JSX.Element {
  const [programs, setPrograms] = useState<ProgramDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPrograms()
        if (cancelled) return
        setPrograms(data)
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Programs & Services</p>
          <p className="text-lg font-bold text-slate-900">Plan, publish, and monitor programs</p>
          {loading && <p className="mt-1 text-xs text-slate-500">Loading programs...</p>}
          {error && <p className="mt-1 text-xs text-rose-600">Error: {error}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">Add program</button>
          <button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md">Preview site</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {programs.map(program => (
          <article key={program.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 hover:-translate-y-0.5 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{program.category}</p>
                <p className="text-lg font-bold text-slate-900">{program.name}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                program.status === "Active" ? "bg-green-100 text-green-700" : program.status === "Planning" ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-700"
              }`}>
                {program.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{program.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                <CalendarDays size={14} />
                {program.timeline}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                <Users size={14} />
                {program.beneficiaries}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                <MapPin size={14} />
                {program.location}
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <p>Progress</p>
                <p>{program.progress}%</p>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500" style={{ width: `${program.progress}%` }} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                <Edit3 size={14} />
                Edit
              </button>
              <button className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-slate-800">View details</button>
            </div>
          </article>
        ))}
        {!loading && programs.length === 0 && (
          <p className="text-sm text-slate-500">No programs published yet.</p>
        )}
      </div>
    </div>
  )
}

export default ProgramsPage

