import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_CHAT_SERVER_URL || "http://localhost:8000",
});
// export default axiosInstance;

const getChatResponse = async (text: string, history: any[],chatId:string) => {
  const response = await axiosInstance({
    method: "post",
    url: "/chat/huutai1515225@gmail.com",
    data: {
      chat_id:chatId,
      text: text,
      history: history,
    },
  });
  return response.data;
};

export const deleteChat = async (chatId:string) => {
  const response = await axiosInstance({
    method: "delete",
    url:  `/chat/huutai1515225@gmail.com/${chatId}`,
  });
  return response.status;
};

export const getChatHistory = async () => {
  const response = await axiosInstance({
    method: "get",
    url: "/chat/huutai1515225@gmail.com",
  });

  return response.data;
};

export default getChatResponse;

