import { Routes, Route } from "react-router"
import type { JSX } from "react"
import HomePage from "./pages/HomePage.jsx"
import Donation from "./pages/Donation.jsx"
import About from "./pages/About.jsx"
import Contact from "./pages/Contact.jsx"
import ScrollToTop from "./components/ScrollToTop.jsx"
import DashboardLayout from "./pages/dashboard/DashboardLayout"
import DashboardHome from "./pages/dashboard/DashboardHome"
import UsersPage from "./pages/dashboard/UsersPage"
import DonationsPage from "./pages/dashboard/DonationsPage"
import ProgramsPage from "./pages/dashboard/ProgramsPage"
import ContentPage from "./pages/dashboard/ContentPage"
import MessagesPage from "./pages/dashboard/MessagesPage"
import AnalyticsPage from "./pages/dashboard/AnalyticsPage"
import SettingsPage from "./pages/dashboard/SettingsPage"

function App(): JSX.Element {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/donate" element={<Donation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="donations" element={<DonationsPage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="content" element={<ContentPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

