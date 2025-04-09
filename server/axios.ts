import axios from 'axios';
let isRefreshing = false;
let refreshSubscribers: Function[] = [];
function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: Function) {
  refreshSubscribers.push(callback);
}

const apiClient = axios.create({
  baseURL: process.env.BASE_URL, 
});

apiClient.interceptors.request.use((config) => {
  const token = "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = 'refresh_token';
        const { data } = await axios.post(`${process.env.BASE_URL}refresh_token`, {
          refresh_token: refreshToken,
        });

        const newToken = data.access_token;
        // store.dispatch("setUser", data);

        onRefreshed(newToken);
        isRefreshing = false;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        isRefreshing = false;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
