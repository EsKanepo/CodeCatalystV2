import CourseItem from "./CourseItem";

const CourseList = ({ courses, progress, isLoading, loadError, onLocked, showAllCourses }) => {
  const handleLockedCourse = (course) => {
    if (onLocked) {
      onLocked(course);
    }
  };

  return (
    <div className="content-card">
      <h3 className="card-title">
        <i className="fa-solid fa-list-ul me-2"></i>
        {showAllCourses ? "Semua Kursus" : "Kursus Utama"}
      </h3>

      {isLoading ? (
        <div className="status-chip">Memuat kursus dari server...</div>
      ) : loadError ? (
        <div className="status-chip status-chip-error">{loadError}</div>
      ) : !courses.length ? (
        <div className="status-chip">Belum ada kursus tersedia.</div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseItem
              key={course.id}
              course={course}
              progress={progress[course.id] || 0}
              onLocked={() => handleLockedCourse(course)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
