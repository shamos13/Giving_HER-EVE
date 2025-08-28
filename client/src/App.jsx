import {Routes, Route} from "react-router";
import HomePage from "./pages/HomePage.jsx";
import Donation from "./pages/Donation.jsx"
import About from "./pages/About.jsx";
function App() {


  return (
    <>
        <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/about" element={<About/>} />
            <Route path="/donate" element={<Donation/>} />
        </Routes>
    </>
  )
}

export default App
