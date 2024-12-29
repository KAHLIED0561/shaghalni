"use server";

import { FetchInstance } from "@/lib/fetch";
import type { FetchRequestConfig } from "@/lib/fetch";

const apiInstance = new FetchInstance({
  baseURL: "https://api.shaghalni.sa",
});

type FetchData = {
  endpoint: string;
  config?: FetchRequestConfig;
};

// GET
export const getData = async <T, K = unknown>({ endpoint, config }: FetchData) => {
  const res = await apiInstance.request<T, K>(endpoint, config);
  return res;
};

// POST
export const postData = async <T, K = unknown>({ endpoint, config }: FetchData) => {
  const res = await apiInstance.request<T, K>(endpoint, { method: "POST", ...config });
  return res;
};

// PUT
export const putData = async <T, K = unknown>({ endpoint, config }: FetchData) => {
  const res = await apiInstance.request<T, K>(endpoint, { method: "PUT", ...config });
  return res;
};

// PATCH
export const patchData = async <T, K = unknown>({ endpoint, config }: FetchData) => {
  const res = await apiInstance.request<T, K>(endpoint, { method: "PATCH", ...config });
  return res;
};

// DELETE
export const deleteData = async <T, K = unknown>({ endpoint, config }: FetchData) => {
  const res = await apiInstance.request<T, K>(endpoint, { method: "DELETE", ...config });
  return res;
};
