import axiosCrawlerInstance from "@crawlerClient/axiosInstance";

const deleteTemplate = async (id: string) => {
  const response = await axiosCrawlerInstance({
    method: "delete",
    url: "/template/" + id,
  });
  return response.data;
};

export default deleteTemplate;
