import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseFilter = ({ selectedCategory, setSelectedCategory, showAllCourses, setShowAllCourses }) => {
  const navigate = useNavigate();
  
  const categories = ["Semua", "html", "css", "js", "bootstrap", "react", "nodejs", "vue", "typescript", "git", "docker"];
  
  const categoryLabels = {
    "Semua": "Semua Kursus",
    "html": "HTML",
    "css": "CSS", 
    "js": "JavaScript",
    "bootstrap": "Bootstrap",
    "react": "React",
    "nodejs": "Node.js",
    "vue": "Vue.js",
    "typescript": "TypeScript",
    "git": "Git & GitHub",
    "docker": "Docker"
  };

  const categoryRoutes = {
    "html": "/html",
    "css": "/css",
    "js": "/javascript",
    "bootstrap": "/bootstrap",
    "react": "/react",
    "nodejs": "/nodejs",
    "vue": "/vue",
    "typescript": "/typescript",
    "git": "/git",
    "docker": "/docker"
  };

  const handleCategoryClick = (category) => {
    if (category === "Semua") {
      navigate("/courses");
    } else {
      navigate(`/courses/category/${category}`);
    }
  };

  return (
    <div className="course-filter">
      <div className="filter-section">
        <h5>Kategori</h5>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(category);
                handleCategoryClick(category);
              }}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h5>Tampilkan</h5>
        <div className="view-toggle">
          <button
            className={`view-btn ${!showAllCourses ? 'active' : ''}`}
            onClick={() => {
              setShowAllCourses(false);
              setSelectedCategory("Semua");
              navigate("/courses");
            }}
          >
            Kursus Utama
          </button>
          <button
            className={`view-btn ${showAllCourses ? 'active' : ''}`}
            onClick={() => {
              setShowAllCourses(true);
              setSelectedCategory("Semua");
              navigate("/courses");
            }}
          >
            Semua Kursus
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseFilter;
