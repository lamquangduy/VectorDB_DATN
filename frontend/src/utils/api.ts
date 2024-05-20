import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_CHAT_SERVER_URL || "http://localhost:8000",
});
// export default axiosInstance;

const getChatResponse = async (text: string) => {
  const response = await axiosInstance({
    method: "post",
    url: "/chat",
    data: {
      text: text,
    },
  });
  return response.data;
};

export default getChatResponse;
