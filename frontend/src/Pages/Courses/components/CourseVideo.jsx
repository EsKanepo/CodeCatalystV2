const CourseVideo = () => {
  return (
    <div className="content-card">
      <h3 className="card-title">
        <i className="fa-solid fa-video me-2"></i>
        Contoh Video
      </h3>

      <div className="ratio ratio-16x9 mb-3">
        <iframe
          src="https://www.youtube.com/embed/qz0aGYrrlhU"
          title="HTML Tutorial"
          allowFullScreen
        ></iframe>
      </div>

      <p className="text-muted small">
        Tutorial HTML lengkap untuk pemula
      </p>
    </div>
  );
};

export default CourseVideo;
