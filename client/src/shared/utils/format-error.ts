/* eslint-disable */
import { AxiosError } from "axios";

function formatPlainError(rawError: any): string | undefined {
  let error = rawError;

  try {
    error = JSON.parse(rawError);
  } catch {}

  if (!error) return undefined;
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  if (typeof error?.error === "string") {
    return error?.error;
  }
  if (typeof error?.data?.error === "string") {
    return error?.data?.error;
  }
  if (Array.isArray(error) && typeof error?.[0] === "string") {
    return error[0];
  }
  return "Неизвестная ошибка";
}

function formatAxiosError(error: AxiosError) {
  if (error?.isAxiosError && error?.response?.status === 404) {
    const reqUrl = error?.config?.baseURL
      ? `${error.config.baseURL}${error.config.url}`
      : error?.config?.url;
    return `${formatPlainError(error?.message)} (URL: ${reqUrl})`;
  }
  if (error?.isAxiosError && error?.response?.status !== 404) {
    return (
      formatPlainError(error?.response?.data) ||
      formatPlainError(error?.message)
    );
  }
  return formatPlainError(error);
}

export function formatError(error: any): string {
  return formatAxiosError(error) || formatPlainError(error) || "";
}
