export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type RequestData = Record<string, unknown> | FormData | null;

export interface FetchInstanceConfig {
  baseURL?: string;
  headers?: Record<string, string>;
}

export interface FetchRequestConfig extends FetchInstanceConfig {
  method?: RequestMethod;
  body?: RequestData;
  queryParams?: Record<string, string>;
  responseType?: "json" | "text" | "blob" | "arrayBuffer" | "formData" | "stream";
}

type SuccessResponse<T> = {
  status: "success";
  code: number;
  response: T;
};

type FailResponse<K = unknown> = {
  status: "fail";
  code: number;
  message: string[];
  fail?: K;
};

// Union type for the possible response outcomes
type ApiResponse<T, K = unknown> = SuccessResponse<T> | FailResponse<K>;

export class FetchInstance {
  private baseURL?: string;
  private headers?: Record<string, string>;

  constructor(config?: FetchInstanceConfig) {
    this.baseURL = config?.baseURL;
    this.headers = config?.headers || {};
  }

  private buildURL(url: string, queryParams?: Record<string, string>): string {
    const params = new URLSearchParams(queryParams).toString();
    return params ? `${url}?${params}` : url;
  }

  public async request<T, K = unknown>(url: string, config: FetchRequestConfig = {}): Promise<ApiResponse<T, K>> {
    const fullURL = this.baseURL ? `${this.baseURL}${url}` : url;
    const { method = "GET", body, queryParams, responseType = "json", headers: requestHeaders } = config;

    const mergedHeaders = {
      "Content-Type": body instanceof FormData ? "multipart/form-data" : "application/json",
      ...this.headers, // Instance-level headers
      ...requestHeaders, // Request-specific headers (can override instance headers)
    };

    try {
      const response = await fetch(this.buildURL(fullURL, queryParams), {
        method,
        headers: mergedHeaders,
        body: body instanceof FormData ? body : JSON.stringify(body),
      });
      const statusCode = response.status;

      if (!response.ok) {
        if (response.status >= 500) throw new Error("Server error");

        const { message, fail } = await response.json();
        return {
          status: "fail",
          code: statusCode,
          message,
          fail,
        } as FailResponse<K>;
      }

      let responseData;
      switch (responseType) {
        case "json":
          responseData = (await response.json()).response;
          break;
        case "text":
          responseData = await response.text();
          break;
        case "blob":
          responseData = await response.blob();
          break;
        case "arrayBuffer":
          responseData = await response.arrayBuffer();
          break;
        case "formData":
          responseData = await response.formData();
          break;
        case "stream":
          responseData = response.body;
          break;
        default:
          responseData = null;
      }

      return {
        status: "success",
        code: statusCode,
        response: responseData,
      } as SuccessResponse<T>;
    } catch (error) {
      let errorMessage = ["Something went wrong"];

      // Narrowing down the 'unknown' type
      if (error instanceof Error) {
        errorMessage = [error.message];
      } else if (typeof error === "string") {
        errorMessage = [error]; // Handle string-based errors (e.g., throw 'error' string)
      }

      return {
        status: "fail",
        code: 500,
        message: errorMessage,
        fail: undefined,
      } as FailResponse<K>;
    }
  }
}
