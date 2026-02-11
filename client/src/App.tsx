import { Suspense, lazy, type JSX } from "react"
import { Routes, Route } from "react-router"
import ScrollToTop from "./components/ScrollToTop.jsx"

const HomePage = lazy(() => import("./pages/HomePage.jsx"))
const Donation = lazy(() => import("./pages/Donation.jsx"))
const About = lazy(() => import("./pages/About.jsx"))
const Contact = lazy(() => import("./pages/Contact.jsx"))
const Campaigns = lazy(() => import("./pages/Campaigns.jsx"))
const CampaignDetail = lazy(() => import("./pages/CampaignDetail.jsx"))
const Impact = lazy(() => import("./pages/Impact.jsx"))
const StoryDetail = lazy(() => import("./pages/StoryDetail.jsx"))

const DashboardLayout = lazy(() => import("./pages/dashboard/DashboardLayout"))
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"))
const DonationsPage = lazy(() => import("./pages/dashboard/DonationsPage"))
const ProgramsPage = lazy(() => import("./pages/dashboard/ProgramsPage"))
const ContentPage = lazy(() => import("./pages/dashboard/ContentPage"))
const MessagesPage = lazy(() => import("./pages/dashboard/MessagesPage"))
const AnalyticsPage = lazy(() => import("./pages/dashboard/AnalyticsPage"))
const SettingsPage = lazy(() => import("./pages/dashboard/SettingsPage"))
const DashboardGuide = lazy(() => import("./pages/dashboard/DashboardGuide"))

function RouteFallback(): JSX.Element {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
        <div className="h-5 w-44 rounded bg-slate-200" />
        <div className="mt-4 h-4 w-full rounded bg-slate-100" />
        <div className="mt-2 h-4 w-11/12 rounded bg-slate-100" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="h-24 rounded-xl bg-slate-100" />
          <div className="h-24 rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  )
}

function App(): JSX.Element {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/donate" element={<Donation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/impact/:id" element={<StoryDetail />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/dashboard/*" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="donations" element={<DonationsPage />} />
            <Route path="programs" element={<ProgramsPage />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="guide" element={<DashboardGuide />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
