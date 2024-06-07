import axiosCrawlerInstance from "@crawlerClient/axiosInstance";

const startTemplates = async (templateIds: string[]) => {
  const listPromise = templateIds.map((id) =>
    axiosCrawlerInstance({
      method: "get",
      url: "/crawl_worker/run/" + id,
    })
  );
  const response = await Promise.all(listPromise);
  return response.map((item) => item.data);
};

export default startTemplates;
