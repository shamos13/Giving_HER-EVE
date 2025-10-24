import {Routes, Route} from "react-router";
import HomePage from "./pages/HomePage.jsx";
import Donation from "./pages/Donation.jsx"
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

function App() {
  return (
    <>
        <ScrollToTop />
        <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/about" element={<About/>} />
            <Route path="/donate" element={<Donation/>} />
            <Route path="/contact" element={<Contact/>} />
        </Routes>
    </>
  )
}

export default App
