const axios = require("axios");

const api = axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    if (user) {
      config.headers["x-access-token"] = user.accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default api;