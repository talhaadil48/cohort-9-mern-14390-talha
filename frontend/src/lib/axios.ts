import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const getUser = () => {
  const access_token = Cookies.get("access_token");
  const refresh_token = Cookies.get("refresh_token");

  return {
    access_token,
    refresh_token,
  };
};

api.interceptors.request.use(
  (config) => {
    const user = getUser();
    const accessToken = user.access_token;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const user = getUser();
    const refreshToken = user.refresh_token;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {
            refreshToken: refreshToken,
          },
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;

        Cookies.set("access_token", accessToken);
        Cookies.set("refresh_token", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("user_role");
        Cookies.remove("user");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;