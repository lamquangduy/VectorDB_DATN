import axiosCrawlerInstance from "@crawlerClient/axiosInstance";

const getTasksByTemplateId = async (id: string) => {
  const response = await axiosCrawlerInstance({
    method: "get",
    url: `/task/get_by_template/${id}`,
  });
  return response.data;
};

export default getTasksByTemplateId;
