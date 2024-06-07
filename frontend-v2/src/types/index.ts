/* eslint-disable @typescript-eslint/no-unused-vars */

interface NavBarElement {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface RouterElement {
  path: string;
  element: React.ReactNode;
}

interface IconProp {
  width?: number | string;
  height?: number | string;
  color?: string;
  background?: string;
  borderRadius?: string | number;
}

interface Course {
  id: string;
  name: string;
  enroll: number;
  fee: number;
  link: string;
  rating: number;
  time: number;
  matched_data?: string[];
}

// interface CourseFromAPI {
//   course_name: string;
//   course_enroll: number;
//   course_fee: number;
//   course_link: string;
//   course_rating: number;
//   course_time: number;
// }

interface Career {
  id: string;
  title: string;
}
interface IUser {
  userName: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface IKnowledge {
  id: string;
  knowledge_name: string;
}

interface IProgrammingLanguage {
  id: string;
  programming_language_name: string;
}

interface IPlatform {
  id: string;
  platform_name: string;
}

interface ITool {
  id: string;
  tool_name: string;
}

interface IFramework {
  id: string;
  framework_name: string;
}

interface ICommunity {
  id: string;
  community_name: string;
}

interface ICareerDetail {
  id: string;
  career_title: string;
  knowledge: IKnowledge[];
  programming_language: IProgrammingLanguage[];
  platform: IPlatform[];
  tool: ITool[];
  framework: IFramework[];
  community: ICommunity[];
}

interface IProgram {
  id: string;
  program_name: string;
}
interface ICourseInfo {
  id: string;
  course_name: string;
  course_time: number;
  course_fee: number;
  course_link: string;
  course_rating: number;
  course_enroll: number;

  knowledge: IKnowledge[];
  platform: IPlatform[];
  programming_language: IProgrammingLanguage[];
  tool: ITool[];
  framework: IFramework[];
  program: IProgram[];
}

interface ISearchCourses {
  course_name: string;
  pageIndex: number;
  limit: number;
  website?: string;
  course_time_from?: number;
  course_time_to?: number;
  course_fee_from?: number;
  course_fee_to?: number;
  course_rating_from?: number;
  course_rating_to?: number;
  tool?: string[];
  framework?: string[];
  knowledge?: string[];
  platform?: string[];
  programming_language?: string[];
  career?: string[];
}
