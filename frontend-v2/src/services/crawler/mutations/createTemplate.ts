import axiosCrawlerInstance from "@crawlerClient/axiosInstance";

const createTemplate = async (data: any) => {
  const response = await axiosCrawlerInstance({
    method: "post",
    url: "/template/",
    data: data,
  });
  return response.data;
};

export default createTemplate;
