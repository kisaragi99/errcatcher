/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ErrorsCreateData {
  /** @format uuid */
  id: string;
  /** @format uuid */
  project_id: string;
  error_message: string;
  custom_fields?: Record<string, any>;
  /** @format date-time */
  created_at: string;
}

export type ErrorsCreateError = {
  error?: string;
};

export interface ErrorsListData {
  data?: {
    /** @format uuid */
    id: string;
    /** @format uuid */
    project_id: string;
    error_message: string;
    custom_fields?: Record<string, any>;
    /** @format date-time */
    created_at: string;
  }[];
}

export type ErrorsListError = {
  error?: string;
};

export interface HeadApiData {
  data?: {
    /** @format uuid */
    id: string;
    /** @format uuid */
    project_id: string;
    error_message: string;
    custom_fields?: Record<string, any>;
    /** @format date-time */
    created_at: string;
  }[];
}

export type HeadApiError = {
  error?: string;
};

export interface ProjectsCreateData {
  /** @format uuid */
  id?: string;
  name: string;
  description?: string;
  custom_fields?: Record<string, any>;
  /** @format date-time */
  created_at?: string;
}

export type ProjectsCreateError = {
  error?: string;
};

export type ProjectsListData = {
  /** @format uuid */
  id: string;
  name: string;
  description?: string;
  custom_fields?: Record<string, any>;
  /** @format date-time */
  created_at: string;
}[];

export type ProjectsListError = {
  error?: string;
};

export type HeadApi2Data = {
  /** @format uuid */
  id: string;
  name: string;
  description?: string;
  custom_fields?: Record<string, any>;
  /** @format date-time */
  created_at: string;
}[];

export type HeadApi2Error = {
  error?: string;
};

export interface ProjectsDetailData {
  /** @format uuid */
  id?: string;
  name: string;
  description?: string;
  custom_fields?: Record<string, any>;
  /** @format date-time */
  created_at?: string;
}

export type ProjectsDetailError = {
  error?: string;
};

export interface HeadApi3Data {
  /** @format uuid */
  id?: string;
  name: string;
  description?: string;
  custom_fields?: Record<string, any>;
  /** @format date-time */
  created_at?: string;
}

export type HeadApi3Error = {
  error?: string;
};

export interface ProjectsUpdateData {
  /** @format uuid */
  id?: string;
  name: string;
  description?: string;
  custom_fields?: Record<string, any>;
  /** @format date-time */
  created_at?: string;
}

export type ProjectsUpdateError = {
  error?: string;
};

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:3000" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title My API
 * @version 1.0.0
 * @baseUrl http://localhost:3000
 *
 * Swagger JSON generated from Fastify routes
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @name ErrorsCreate
     * @request POST:/api/errors
     */
    errorsCreate: (
      body: {
        /** @format uuid */
        project_id: string;
        /** @maxLength 10000 */
        error_message: string;
        custom_fields?: object;
      },
      params: RequestParams = {},
    ) =>
      this.request<ErrorsCreateData, ErrorsCreateError>({
        path: `/api/errors`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ErrorsList
     * @request GET:/api/errors
     */
    errorsList: (
      query?: {
        /** @format uuid */
        project_id?: string;
        error_message?: string;
        /**
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * @min 1
         * @max 100
         * @default 10
         */
        limit?: number;
        /** @format date-time */
        start_date?: string;
        /** @format date-time */
        end_date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ErrorsListData, ErrorsListError>({
        path: `/api/errors`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name HeadApi
     * @request HEAD:/api/errors
     */
    headApi: (
      query?: {
        /** @format uuid */
        project_id?: string;
        error_message?: string;
        /**
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * @min 1
         * @max 100
         * @default 10
         */
        limit?: number;
        /** @format date-time */
        start_date?: string;
        /** @format date-time */
        end_date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HeadApiData, HeadApiError>({
        path: `/api/errors`,
        method: "HEAD",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ProjectsCreate
     * @request POST:/api/projects
     */
    projectsCreate: (
      body: {
        /** @maxLength 255 */
        name: string;
        /** @maxLength 1000 */
        description?: string;
        custom_fields?: object;
      },
      params: RequestParams = {},
    ) =>
      this.request<ProjectsCreateData, ProjectsCreateError>({
        path: `/api/projects`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ProjectsList
     * @request GET:/api/projects
     */
    projectsList: (
      query?: {
        /** @format uuid */
        id?: string;
        /** @min 1 */
        page?: number;
        /** @min 1 */
        limit?: number;
        /** @format date-time */
        start_date?: string;
        /** @format date-time */
        end_date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ProjectsListData, ProjectsListError>({
        path: `/api/projects`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name HeadApi2
     * @request HEAD:/api/projects
     * @originalName headApi
     * @duplicate
     */
    headApi2: (
      query?: {
        /** @format uuid */
        id?: string;
        /** @min 1 */
        page?: number;
        /** @min 1 */
        limit?: number;
        /** @format date-time */
        start_date?: string;
        /** @format date-time */
        end_date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HeadApi2Data, HeadApi2Error>({
        path: `/api/projects`,
        method: "HEAD",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ProjectsDetail
     * @request GET:/api/projects/{id}
     */
    projectsDetail: (id: string, params: RequestParams = {}) =>
      this.request<ProjectsDetailData, ProjectsDetailError>({
        path: `/api/projects/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name HeadApi3
     * @request HEAD:/api/projects/{id}
     * @originalName headApi
     * @duplicate
     */
    headApi3: (id: string, params: RequestParams = {}) =>
      this.request<HeadApi3Data, HeadApi3Error>({
        path: `/api/projects/${id}`,
        method: "HEAD",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name ProjectsUpdate
     * @request PUT:/api/projects/{id}
     */
    projectsUpdate: (
      id: string,
      body: {
        description: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ProjectsUpdateData, ProjectsUpdateError>({
        path: `/api/projects/${id}`,
        method: "PUT",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
