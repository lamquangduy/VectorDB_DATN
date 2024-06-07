import { Box, Button, Divider, Menu } from "@mui/material";
import { NestedMenuItem } from "mui-nested-menu";
import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LWTitle from "@components/common/LWTitle";
import { useQuery } from "react-query";
// import fetchCareers from "@apolloClient/query/career/getCareers";
import fetchGetCoursesByCareer from "@apolloClient/query/course/getCoursesByCareers";
import CourseLandscapeCard from "@components/cards/courseLandscapeCard";
import fetchSearchCourses from "@apolloClient/query/course/searchCourse";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@redux/hooks";
import { translate } from "@constants/lang";
// import getPopularCoursesBySkills from "@apolloClient/query/course/getCoursesByPopularSkills";

const NestedMenu: React.FC = () => {
  const langState = useAppSelector((state) => state.lang.langKey);
  const navigate = useNavigate();

  // const getPopularCoursesBySkillsQuery = useQuery(
  //   "getPopularCoursesBySkillsQuery",
  //   getPopularCoursesBySkills
  // );
  // React.useEffect(() => {
  // }, [getPopularCoursesBySkillsQuery.data]);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => setAnchorEl(null);

  //TODO: cho lấy danh sách 5 career mới nhất
  //const getCareersForMenuQuery = useQuery("getCareersQuery", fetchCareers);
  const getCareersForMenuQuery = {
    data: [
      { title: "Data Scientist", id: "2" },
      { title: "Data Engineer", id: "2" },
      { title: "Devops Engineer", id: "2" },
      { title: "Software Architect", id: "2" },
      { title: "Frontend Developer", id: "2" },
    ],
  };
  const getTopicsForMenuQuery = {
    data: [
      { title: "Frameworks", id: "2", key: "NodeJS" },
      { title: "Programming language", id: "2", key: "Python" },
      { title: "Tool", id: "2", key: "Docker" },
      { title: "Platform", id: "2", key: "aws" },
      { title: "Knowledge", id: "2", key: "Big Data" },
    ],
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleOpenMenu}
        sx={{
          fontSize: "16px",
          fontWeight: "bold",
          borderWidth: "2px",
          width: 150,
        }}
      >
        {translate("explore", langState)}
        <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        sx={{
          mt: "16px",
          ml: "-100px",
        }}
      >
        {/* Goals section */}
        <Box
          sx={{
            padding: "12px",
            fontWeight: "bold",
            fontSize: "18px",
            fontFamily: "inherit",
          }}
        >
          {translate("goals", langState)}
        </Box>
        {getCareersForMenuQuery.data?.map((item) => (
          <NestedMenuItem
            key={item.title}
            label={item.title}
            parentMenuOpen={open}
            sx={{ width: 300 }}
          >
            <DisplayCoursesMenuItem career={item}></DisplayCoursesMenuItem>
          </NestedMenuItem>
        ))}
        <Box
          sx={{
            padding: "12px 0px",
            fontWeight: "bold",
            fontSize: "18px",
            fontFamily: "inherit",
          }}
        >
          <Button
            onClick={() => {
              navigate("/careers");
            }}
          >
            {translate("moreGoals", langState)}
          </Button>
        </Box>
        {/* end goals section */}

        {/* Topics section */}
        <Box
          sx={{
            padding: "12px",
            fontWeight: "bold",
            fontSize: "18px",
            fontFamily: "inherit",
          }}
        >
          {translate("topics", langState)}
        </Box>
        {getTopicsForMenuQuery.data?.map((item) => (
          <NestedMenuItem
            key={item.title}
            label={item.title}
            parentMenuOpen={open}
            sx={{ width: 300 }}
          >
            <DisplayTopicCoursesMenuItem
              keySearch={item.key}
              topic={item.title}
            ></DisplayTopicCoursesMenuItem>
          </NestedMenuItem>
        ))}
        <Box
          sx={{
            padding: "12px 0px",
            fontWeight: "bold",
            fontSize: "18px",
            fontFamily: "inherit",
          }}
        >
          <Button onClick={() => {}}>
            {translate("moreTopics", langState)}
          </Button>
        </Box>
        {/* end Topics section */}
      </Menu>
    </div>
  );
};

interface DisplayCoursesMenuItemProps {
  career: Career;
}

const DisplayCoursesMenuItem: React.FC<DisplayCoursesMenuItemProps> = ({
  career,
}): JSX.Element => {
  const getCourseraCoursesByCareerQuery = useQuery(
    ["getCourseraCoursesByCareerQuery", career.title],
    () => fetchGetCoursesByCareer(career.title, "coursera"),
    {
      enabled: career.title != "",
      staleTime: 300000,
    }
  );

  const getUdemyCoursesByCareerQuery = useQuery(
    ["getUdemyCoursesByCareerQuery", career.title],
    () => fetchGetCoursesByCareer(career.title, "udemy"),
    {
      enabled: career.title != "",
      staleTime: 300000,
    }
  );

  return (
    <Box
      sx={{
        width: "1000px",
        height: "800px",
        backgroundColor: "white",
        marginTop: "-4px",
        position: "fixed",
        top: 74,
        border: "1px solid #cecece",
        borderRadius: "4px",
        overflowY: "scroll",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "16px",
        }}
      >
        <Box sx={{ fontSize: "24px", fontWeight: "bold", pl: "16px" }}>
          <LWTitle text={career.title}></LWTitle>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "nowrap",
            gap: "32px",
            padding: "16px",
          }}
        >
          <Box
            sx={{
              width: 500,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Box
              sx={{
                color: "text.primary",
                fontSize: "20px",
                fontWeight: "bolder",
                textAlign: "left",
                pt: "8px",
                height: 36,
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Cousera
            </Box>
            <Divider></Divider>
            {getCourseraCoursesByCareerQuery.data?.map((item, index) => {
              if (item.link.includes("coursera")) {
                return (
                  <CourseLandscapeCard
                    id={item.id}
                    name={item.name}
                    enroll={item.enroll}
                    link={item.link}
                    key={index}
                  ></CourseLandscapeCard>
                );
              }
              return <></>;
            })}
          </Box>
          <Box
            sx={{
              width: 500,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Box
              sx={{
                color: "text.primary",
                fontSize: "20px",
                fontWeight: "bolder",
                textAlign: "left",
                pt: "8px",
                height: 36,
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Udemy
            </Box>
            <Divider></Divider>
            {getUdemyCoursesByCareerQuery.data?.map((item, index) => {
              if (item.link.includes("udemy")) {
                return (
                  <CourseLandscapeCard
                    id={item.id}
                    name={item.name}
                    enroll={item.enroll}
                    link={item.link}
                    key={index}
                  ></CourseLandscapeCard>
                );
              }
              return <></>;
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

interface DisplayTopicCoursesMenuItemProps {
  topic: string;
  keySearch: string;
}

const DisplayTopicCoursesMenuItem: React.FC<
  DisplayTopicCoursesMenuItemProps
> = ({ topic, keySearch }): JSX.Element => {
  const getCourseraCoursesByTopicQuery = useQuery(
    ["getCourseraCoursesByTopicQuery", keySearch],
    () => {
      const filter = {
        course_name: keySearch,
        pageIndex: 1,
        limit: 20,
        website: "coursera",
        // course_time_from: getTimeFromDuration(duration),
        // course_time_to: getTimeToDuration(duration),
        // tool: selectedTool,
        // framework: selectedFrameWork,
        // knowledge: selectedKnowledge,
        // platform: selectedPlatform,
        // programming_language: selectedProgrammingLanguage,
        // career: selectedCareer,
      } as ISearchCourses;

      return fetchSearchCourses(filter);
    },
    {
      enabled: keySearch != "",
      staleTime: 300000,
    }
  );
  const getUdemyCoursesByTopicQuery = useQuery(
    ["getUdemyCoursesByTopicQuery", keySearch],
    () => {
      const filter = {
        course_name: keySearch,
        pageIndex: 1,
        limit: 20,
        website: "udemy",
        // course_time_from: getTimeFromDuration(duration),
        // course_time_to: getTimeToDuration(duration),
        // tool: selectedTool,
        // framework: selectedFrameWork,
        // knowledge: selectedKnowledge,
        // platform: selectedPlatform,
        // programming_language: selectedProgrammingLanguage,
        // career: selectedCareer,
      } as ISearchCourses;

      return fetchSearchCourses(filter);
    },
    {
      enabled: keySearch != "",
      staleTime: 300000,
    }
  );
  return (
    <Box
      sx={{
        width: "1140px",
        height: "800px",
        backgroundColor: "white",
        marginTop: "-4px",
        position: "fixed",
        top: 74,
        border: "1px solid #cecece",
        borderRadius: "4px",
        overflowY: "scroll",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "16px",
        }}
      >
        <Box sx={{ fontSize: "24px", fontWeight: "bold", pl: "16px" }}>
          <LWTitle text={topic}></LWTitle>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "nowrap",
            gap: "32px",
            padding: "16px",
          }}
        >
          <Box
            sx={{
              width: 500,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Box
              sx={{
                color: "text.primary",
                fontSize: "20px",
                fontWeight: "bolder",
                textAlign: "left",
                pt: "8px",
                height: 36,
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Cousera
            </Box>
            <Divider></Divider>
            {getCourseraCoursesByTopicQuery.data?.courses.map((item, index) => {
              if (item.link.includes("coursera")) {
                return (
                  <CourseLandscapeCard
                    id={item.id}
                    name={item.name}
                    enroll={item.enroll}
                    link={item.link}
                    key={index}
                  ></CourseLandscapeCard>
                );
              }
              return <></>;
            })}
          </Box>
          <Box
            sx={{
              width: 500,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Box
              sx={{
                color: "text.primary",
                fontSize: "20px",
                fontWeight: "bolder",
                textAlign: "left",
                pt: "8px",
                height: 36,
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Udemy
            </Box>
            <Divider></Divider>
            {getUdemyCoursesByTopicQuery.data?.courses.map((item, index) => {
              if (item.link.includes("udemy")) {
                return (
                  <CourseLandscapeCard
                    id={item.id}
                    name={item.name}
                    enroll={item.enroll}
                    link={item.link}
                    key={index}
                  ></CourseLandscapeCard>
                );
              }
              return <></>;
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default NestedMenu;
