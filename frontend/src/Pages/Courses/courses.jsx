import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { courseData, allCourses } from "./courseData";
import CourseList from "./components/CourseList";
import CourseVideo from "./components/CourseVideo";
import CoursesCTA from "./components/Coursescta";
import CoursePagination from "./components/CoursePagination";
import CourseFilter from "./components/CourseFilter";
import "./courses.css";

const Courses = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const { category: urlCategory } = useParams();

  const [courses] = useState(courseData);
  const [isLoading] = useState(false);
  const [loadError] = useState("");

  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory ? (urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1) === "Semua" ? "Semua" : urlCategory) : "Semua");
  const [showAllCourses, setShowAllCourses] = useState(false);

  // Update URL when category changes
  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    setCurrentPage(1);
    if (newCategory === "Semua") {
      navigate("/courses");
    } else {
      navigate(`/courses/${newCategory}`);
    }
  };

  // Update category from URL on mount
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
      setCurrentPage(1);
    }
  }, [urlCategory]);
  
  const itemsPerPage = 6;
  const displayCourses = showAllCourses ? allCourses : courses;
  
  // Filter courses by category
  const filteredCourses = selectedCategory === "Semua" 
    ? displayCourses 
    : displayCourses.filter(course => course.category === selectedCategory);
  
  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

    const handleLocked = (course) => {
      // This function is no longer needed as CourseItem handles the coin purchase flow
      // Keeping it for compatibility, but CourseItem's handlePurchase handles the logic
    };

    
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>
            <i className="fa-solid fa-graduation-cap me-2"></i>
            Daftar Kursus
          </h1>
          <p className="lead">Pilih kursus untuk mempercepat belajarmu</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <CourseFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            showAllCourses={showAllCourses}
            setShowAllCourses={setShowAllCourses}
          />

          <div className="row g-4">
            <div className="col-lg-8">
              <CourseList
                courses={paginatedCourses}
                progress={{}}
                isLoggedIn={Boolean(token)}
                isLoading={isLoading}
                loadError={loadError}
                onLocked={handleLocked}
                showAllCourses={showAllCourses}
              />
              
              <CoursePagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>

            <div className="col-lg-4">
              <CourseVideo />
              {!user && (
                <div className="mt-4">
                  <CoursesCTA />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Courses;

