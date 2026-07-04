import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Team from "./Pages/Team/Team";
import Contact from "./Pages/Contact/Contact";
import Courses from "./Pages/Courses/courses";
import HtmlFundamental from "./Pages/HtmlFundamental/Html_Fundamental";
import CssStyling from "./Pages/CssStyling/Css_Styling";
import JavaScript from './Pages/JavaScript/JavaScript';
import Bootstrap from "./Pages/Bootstrap/Bootstrap";
import React from './Pages/React/React';
import FAQ from './Pages/FAQ/FAQ';
import Tutor from "./Pages/Tutor/Tutor";
import Testimonial from "./Pages/Testimonial/Testimonial";
import Schedule from "./Pages/Schedule/Schedule";
import Resource from "./Pages/Resource/Resource";
import ContactSuccess from "./Pages/Contact/ContactSuccess";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";



import "./App.css";

function AppContent() {
  const location = useLocation();
  const hideLayoutRoutes = ["/login", "/register", "/contact-success"];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact-success" element={<ContactSuccess />} />
        <Route path="/courses/detail/:id" element={<CourseDetail />} />
        <Route path="/html" element={<HtmlFundamental />} />
        <Route path="/css" element={<CssStyling />} />
        <Route path="/javascript" element={<JavaScript />} />
        <Route path="/bootstrap" element={<Bootstrap />} />
        <Route path="/react" element={<React />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/resource" element={<Resource />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

console.log(process.env.REACT_APP_FIREBASE_API_KEY);

export default App;

