import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { usePoints } from "../../context/PointsContext";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isEnrolledInCourse } = usePoints();

  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        const courseData = res.data.data;

        // Check if course is locked and user is not enrolled (premium/admin have bypass)
        const isPremiumOrAdmin = user?.role === "premium" || user?.role === "admin";
        if (courseData.is_locked && !isEnrolledInCourse(id) && !isPremiumOrAdmin) {
          alert("Course ini premium! Kamu perlu membeli course ini terlebih dahulu.");
          navigate("/courses");
          return;
        }

        // Redirect to the actual category page if access is granted
        const categoryPath = `/${courseData.category === 'js' ? 'javascript' : (courseData.category === 'vuejs' ? 'vue' : courseData.category)}`;
        navigate(categoryPath);
        
        setCourse(courseData);
      } catch (err) {
        console.log("ERROR:", err.response);

        if (err.response?.status === 401) {
          alert("Login dulu!");
          navigate("/login");
        } else if (err.response?.status === 403) {
          alert("Course ini premium! Kamu perlu membeli course ini terlebih dahulu.");
          navigate("/courses");
        }
      }
    };

    fetchCourse();
  }, [id, isEnrolledInCourse, navigate, user]);

  if (!course) return <div className="p-5 text-center">Loading access...</div>;

  return null;
};

export default CourseDetail;