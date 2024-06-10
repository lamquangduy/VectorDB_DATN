import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_CHAT_SERVER_URL || "http://localhost:8000",
});
// export default axiosInstance;

const getChatResponse = async (text: string, history: any[]) => {
  const response = await axiosInstance({
    method: "post",
    url: "/chat/huutai1515225@gmail.com",
    data: {
      chat_id:"",
      text: text,
      history: history,
    },
  });
  return response.data;
};

export const getChatHistory = async () => {
  const response = await axiosInstance({
    method: "get",
    url: "/chat/huutai1515225@gmail.com",
  });

  return response.data;
};

export default getChatResponse;

