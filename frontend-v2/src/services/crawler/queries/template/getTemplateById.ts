import axiosCrawlerInstance from "@crawlerClient/axiosInstance";

const getTemplateById = async (id: string) => {
  const response = await axiosCrawlerInstance({
    method: "get",
    url: "/template/" + id,
  });
  return response.data;
};

export default getTemplateById;
