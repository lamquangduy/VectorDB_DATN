import axiosCrawlerInstance from "@crawlerClient/axiosInstance";

const getResultsByTaskId = async (id: string) => {
  const response = await axiosCrawlerInstance({
    method: "get",
    url: `/task/${id}/crawl-results`,
  });
  return response.data;
};

export default getResultsByTaskId;
