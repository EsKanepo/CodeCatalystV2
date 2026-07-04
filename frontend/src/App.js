import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { PointsProvider } from "./context/PointsContext";
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
import NodeJS from "./Pages/NodeJS/NodeJS";
import Vue from "./Pages/Vue/Vue";
import TypeScript from "./Pages/TypeScript/TypeScript";
import Git from "./Pages/Git/Git";
import Docker from "./Pages/Docker/Docker";
import FAQ from './Pages/FAQ/FAQ';
import Tutor from "./Pages/Tutor/Tutor";
import Testimonial from "./Pages/Testimonial/Testimonial";
import Schedule from "./Pages/Schedule/Schedule";
import Resource from "./Pages/Resource/Resource";
import ContactSuccess from "./Pages/Contact/ContactSuccess";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Profile from "./Pages/Profile/Profile";
import Topup from "./Pages/Topup/Topup";
import CourseDetail from "./Pages/CourseDetail/CourseDetail";
import AdminWorkbench from "./Pages/AdminWorkbench/AdminWorkbench";


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
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminWorkbench />} />
        <Route path="/topup" element={<Topup />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/contact-success" element={<ContactSuccess />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/category/:category" element={<Courses />} />
        <Route path="/html" element={<HtmlFundamental />} />
        <Route path="/css" element={<CssStyling />} />
        <Route path="/javascript" element={<JavaScript />} />
        <Route path="/bootstrap" element={<Bootstrap />} />
        <Route path="/react" element={<React />} />
        <Route path="/nodejs" element={<NodeJS />} />
        <Route path="/vue" element={<Vue />} />
        <Route path="/typescript" element={<TypeScript />} />
        <Route path="/git" element={<Git />} />
        <Route path="/docker" element={<Docker />} />
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
        <PointsProvider>
          <AppContent />
        </PointsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
