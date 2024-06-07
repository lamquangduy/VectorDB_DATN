import axiosCrawlerInstance from "@crawlerClient/axiosInstance";

const getTemplate = async (pageSize: number, index: number) => {
  const response = await axiosCrawlerInstance({
    method: "get",
    url: "/template/",
    params: {
      index: index,
      page_size: pageSize,
    },
  });
  return response.data;
};

export default getTemplate;
