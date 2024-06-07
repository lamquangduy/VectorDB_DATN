interface CourseInfo {
  id: string;
  course_name: string;
  course_time: number;
  course_fee: number;
  course_link: string;
  course_rating: number;
  course_enroll: number;
}

interface ILearningPathInfo {
  f_point: number;
  cost: number;
  time: number;
  total_PR: number;
  nCourses: number;
  redundant_LO: number;
  overlap_LO: number;
  overlap_Level: number;
}

type ILearningPaths = {
  total: number;
  execution_time: number;
  learning_paths: ILearningPath[];
  career_id: Number;
  skills_need: Number[];
  skills_known: Number[];
};

interface ISkill {
  id: string;
  name: string;
  type: "knowledge" | "language" | "tool" | "framework" | "platform";
}

interface ILearningPath {
  free_courses: any[];
  path_courses: any[];
  info: {
    cost: number;
    f_point: number;
    nCourses: number;
    overlap_LO: number;
    overlap_Level: number;
    redundant_LO: number;
    time: number;
  };
}

interface ILearningPathRecommendationProps {
  learningPaths: ILearningPath[];
  careerId: number;
  skillsNeed: number[];
  skillsKnown: number[];
  onConfirmDelete: () => void;
}
