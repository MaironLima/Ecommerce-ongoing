import { useStore } from "@/stores/store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const URL = import.meta.env.VITE_API_URL;

type Http = "post" | "get" | "patch" | "delete";

const apiClient = axios.create();

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(`${URL}/auth/refresh`, {}, {
          withCredentials: true
        });
        useStore.getState().setAccessToken(data.accessToken);

        originalRequest.headers.Authorization = data.accessToken;
        return apiClient(originalRequest);

      } catch (refreshError) {
        useStore.getState().setAccessToken("");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

////////////// PRIVATE //////////////

export function usePrivateAPI(
  method: Http,
  endpoint: string,
  data?: Record<string, unknown>,
  options?: import("@tanstack/react-query").UseQueryOptions<
    { response: unknown },
    unknown,
    { response: unknown },
    [Http, string, Record<string, unknown>?]
  >
) {
  const accessToken = useStore.getState().accessToken;

  return useQuery({
    queryKey: [method, endpoint, data],
    queryFn: async () => {
      if (accessToken === "") throw new Error("Without accessToken");
      const response = await apiClient({
        method,
        url: `${URL}${endpoint}`,
        data,
        headers: {
          Authorization: accessToken,
        },
      });
      return { response }
    },
  retry: 1,
  ...options
})
}

////////////// PUBLIC //////////////

export async function publicAPI(
  method: Http,
  endpoint: string,
  data?: Record<string, unknown>
) {
  const response = await axios({
    method,
    url: `${URL}${endpoint}`,
    data,
  });

  return { response }
}

export function usePublicAPI(
  method: Http,
  endpoint: string,
  data?: Record<string, unknown>,
  options?: import("@tanstack/react-query").UseQueryOptions<
    { response: unknown },
    unknown,
    { response: unknown },
    [Http, string, Record<string, unknown>?]
  >
) {
  return useQuery({
    queryKey: [method, endpoint, data],
    queryFn: async () => {
      const response = await axios({
        method,
        url: `${URL}${endpoint}`,
        data,
      });
      return { response }
    },
    retry: 1,
    ...options
  })
}