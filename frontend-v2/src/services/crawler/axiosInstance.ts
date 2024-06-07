import axios from "axios";

const axiosCrawlerInstance = axios.create({
  baseURL:
    import.meta.env.VITE_APP_CRAWLER_SERVER_URL ||
    "http://localhost:8080/crawler",
});
export default axiosCrawlerInstance;
