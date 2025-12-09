import { CalendarDays, Edit3, MapPin, Users } from "lucide-react"

function ProgramsPage(): JSX.Element {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Programs & Services</p>
          <p className="text-lg font-bold text-slate-900">Plan, publish, and monitor programs</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">Add program</button>
          <button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md">Preview site</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {programsData.map(program => (
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
      </div>
    </div>
  )
}

export default ProgramsPage

interface ProgramCard {
  id: string
  name: string
  category: string
  description: string
  timeline: string
  beneficiaries: string
  location: string
  progress: number
  status: "Active" | "Planning" | "Paused"
}

const programsData: ProgramCard[] = [
  {
    id: "p1",
    name: "STEM for Girls",
    category: "Education",
    description: "After-school coding and robotics clubs with mentors and laptops provided.",
    timeline: "Jan - Jun 2025",
    beneficiaries: "240 students",
    location: "Lagos, Abuja",
    progress: 72,
    status: "Active",
  },
  {
    id: "p2",
    name: "Safe Shelters",
    category: "Shelter",
    description: "Renovation of community shelters with safety, nutrition, and counseling support.",
    timeline: "Feb - Aug 2025",
    beneficiaries: "520 families",
    location: "Kano, Kaduna",
    progress: 54,
    status: "Active",
  },
  {
    id: "p3",
    name: "Maternal Health Clinics",
    category: "Healthcare",
    description: "Mobile clinics providing prenatal care, screenings, and health education.",
    timeline: "Mar - Nov 2025",
    beneficiaries: "1,100 mothers",
    location: "Cross River",
    progress: 38,
    status: "Planning",
  },
  {
    id: "p4",
    name: "Volunteer Accelerator",
    category: "Training",
    description: "Upskilling volunteers with safeguarding, communications, and leadership workshops.",
    timeline: "Quarterly",
    beneficiaries: "320 volunteers",
    location: "Hybrid",
    progress: 81,
    status: "Active",
  },
  {
    id: "p5",
    name: "Nutrition Drive",
    category: "Food",
    description: "Weekly meal packs, fresh produce, and nutrition guidance for families in need.",
    timeline: "All year",
    beneficiaries: "2,400 people",
    location: "Nationwide",
    progress: 65,
    status: "Active",
  },
  {
    id: "p6",
    name: "Digital Safety Labs",
    category: "Advocacy",
    description: "Campaigns and workshops on online safety, privacy, and rights for young women.",
    timeline: "May - Sep 2025",
    beneficiaries: "800 participants",
    location: "Online",
    progress: 44,
    status: "Paused",
  },
]

