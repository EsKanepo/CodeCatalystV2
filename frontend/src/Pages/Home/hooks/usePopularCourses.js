import { useState } from "react";
import { courses } from "../data/courses";

export const usePopularCourses = () => {
  const [query, setQuery] = useState("");

  const filtered = courses.filter((course) =>
    course.name.toLowerCase().includes(query.toLowerCase())
  );

  return { query, setQuery, filtered };
};
