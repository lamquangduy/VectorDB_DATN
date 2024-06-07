import axiosCrawlerInstance from "@crawlerClient/axiosInstance";

const startTemplate = async (templateId: string) => {
  const response = await axiosCrawlerInstance({
    method: "get",
    url: "/crawl_worker/run/" + templateId,
  });
  return response.data;
};

export default startTemplate;
