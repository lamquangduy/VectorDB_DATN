import axiosCrawlerInstance from "@crawlerClient/axiosInstance";

const saveResult = async (params: {
  task_id: String;
  result_id: String;
  data: any;
}) => {
  const { task_id, result_id, data } = params;

  const response = await axiosCrawlerInstance({
    method: "post",
    url: `/task/${task_id}/save-result/${result_id}`,
    data: data,
  });
  return response.data;
};

export default saveResult;
