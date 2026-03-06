import type { AxiosError } from "axios";

export function errorHandler(someError: Error){

    const errorData = (someError as AxiosError)?.response?.data;
    if (typeof errorData === "string") {
      return errorData;
    }
    return typeof errorData === "object" && errorData !== null && "error" in errorData
      ? (errorData as { error?: string }).error
      : (typeof errorData === "object" && errorData !== null && "message" in errorData
        ? (errorData as { message?: string }).message
        : (someError as AxiosError)?.message);
}
