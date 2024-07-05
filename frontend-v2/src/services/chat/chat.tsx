import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_APP_CHAT_SERVER_URL || "http://localhost:8000/chat",
});
// export default axiosInstance;

const getChatResponse = async (
  user: any,
  text: string,
  history: any[],
  chatId: string,
  signal: any
) => {
  const response = await axiosInstance({
    method: "post",
    url: `/${user}`,
    data: {
      chat_id: chatId,
      text: text,
      history: history,
    },
    signal: signal,
  });
  return response.data;
};
export const getChatRole = async (user: any) => {
  const response = await axiosInstance({
    method: "get",
    url: `/chat-role/${user}`,
  });
  return response.data[0].role;
};

export const deleteChat = async (user: any, chatId: string) => {
  const response = await axiosInstance({
    method: "delete",
    url: `/${user}/${chatId}`,
  });
  return response.status;
};

export const getChatHistory = async (user: any) => {
  const response = await axiosInstance({
    method: "get",
    url: `/${user}`,
  });

  return response.data;
};

export const getDocuments = async () => {
  const response = await axiosInstance({
    method: "get",
    url: "/collection/list",
  });

  return response.data;
};

export const getCurrentDocument = async () => {
  const response = await axiosInstance({
    method: "get",
    url: "/collection/current",
  });

  return response.data;
};

export const deleteDocument = async (documentName: string) => {
  const response = await axiosInstance({
    method: "delete",
    url: `/collection/delete?index_name=${documentName}`,
  });
  return response.status;
};

export const changeCurrentDocument = async (value: string) => {
  const response = await axiosInstance({
    method: "post",
    url: `/collection/change_current?index_name=${value}`,
  });
  return response.data;
};
export const addDocument = async (value: string) => {
  const response = await axiosInstance({
    method: "post",
    url: `/collection/create-new?index_name=${value}`,
  });
  return response.data;
};

export default getChatResponse;
