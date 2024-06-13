import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_CHAT_SERVER_URL || "http://localhost:8000",
});
// export default axiosInstance;

const getChatResponse = async (user: any, text: string, history: any[], chatId:string) => {
  const response = await axiosInstance({
    method: "post",
    url: `/chat/${user}`,
    data: {
      chat_id:chatId,
      text: text,
      history: history,
    },
  });
  return response.data;
};

export const deleteChat = async (user: any,chatId:string) => {
  const response = await axiosInstance({
    method: "delete",
    url:  `/chat/${user}/${chatId}`,
  });
  return response.status;
};

export const getChatHistory = async (user: any) => {
  const response = await axiosInstance({
    method: "get",
    url: `/chat/${user}`,
  });

  return response.data;
};

export default getChatResponse;

