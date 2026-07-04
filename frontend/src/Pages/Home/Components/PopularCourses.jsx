import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { usePoints } from "../../../context/PointsContext";
import { api } from "../../../api/client";

const PopularCourses = () => {
  const { user } = useAuth();
  const { isEnrolledInCourse } = usePoints();

  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("unlocked");
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = Boolean(user);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        if (response.data.success) {
          const mappedCourses = response.data.data.map((c) => ({
            ...c,
            path: `/courses/${c.id}`,
            name: c.title,
          }));
          setCourses(mappedCourses);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // 🔥 HANDLE LOCK CLICK
  const handleLockedClick = (courseName) => {
    alert(`Kursus "${courseName}" terkunci. Silakan beli kursus ini atau upgrade ke akun Premium untuk mengakses.`);
  };

  // 🔥 FILTER + AUTH LOGIC
  const filteredCourses = courses.filter((course) => {
    const isEnrolled = isEnrolledInCourse(course.id);
    const isPremiumOrAdmin = user?.role === "premium" || user?.role === "admin";
    const isUnlocked = !course.is_locked || isEnrolled || isPremiumOrAdmin;

    if (filter === "unlocked" && !isUnlocked) return false;
    if (filter === "locked" && isUnlocked) return false;

    return true;
  });

  return (
    <>
      {/* FILTER */}
      <div className="btn-group mb-3">
        <button
          className={`btn btn-sm btn-outline-primary ${
            filter === "unlocked" ? "active" : ""
          }`}
          onClick={() => setFilter("unlocked")}
        >
          Tersedia
        </button>

        <button
          className={`btn btn-sm btn-outline-primary ${
            filter === "locked" ? "active" : ""
          }`}
          onClick={() => setFilter("locked")}
        >
          Terkunci
        </button>

        <button
          className={`btn btn-sm btn-outline-primary ${
            filter === "all" ? "active" : ""
          }`}
          onClick={() => setFilter("all")}
        >
          Semua
        </button>
      </div>

      {/* COURSE LIST */}
      <div className="d-flex gap-3 overflow-auto pb-2">
        {isLoading ? (
          <span>Loading...</span>
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course, i) => {
            const isEnrolled = isEnrolledInCourse(course.id);
            const isPremiumOrAdmin = user?.role === "premium" || user?.role === "admin";
            const isUnlocked = !course.is_locked || isEnrolled || isPremiumOrAdmin;
            
            // Map category to path (matching CourseItem logic)
            const coursePath = `/${course.category === 'js' ? 'javascript' : (course.category === 'vuejs' ? 'vue' : course.category)}`;

            return isUnlocked ? (
              <Link key={i} to={coursePath} className="popular-pill">
                {course.name}
              </Link>
            ) : (
              <button
                key={i}
                className="popular-pill opacity-50 border-0"
                onClick={() => handleLockedClick(course.name)}
              >
                {course.name} 🔒
              </button>
            );
          })
        ) : (
          <span>Tidak ada course</span>
        )}
      </div>

      {!isLoggedIn && (
        <p className="text-muted small mt-2">
          Login untuk membuka course lanjutan
        </p>
      )}
    </>
  );
};

export default PopularCourses;

