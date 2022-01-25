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

export interface Request {
  _id?: string;
  bookName: string;
  bookType: "Book" | "Audiobook";
  isbn?: string;
  author: string;
  requestedDateTime: string;
  requestedBy: string;
  assignedTo?: string;
  authorised?: boolean;
  price?: number;
  status?: string;
}

export type Requests = Request[];

export interface CreateRequest {
  bookName: string;
  bookType: "Book" | "Audiobook";
  isbn?: string;
  author: string;
}

export interface UpdateRequest {
  bookName?: string;
  bookType?: "Book" | "Audiobook";
  isbn?: string;
  author?: string;
  assignedTo?: string;
  authorised?: boolean;
  price?: number;
  status?: string;
  statusMessage?: string;
}

export interface Status {
  _id?: string;
  requestId: string;
  status:
    | "Pending Review"
    | "In Review"
    | "Additional Information Required"
    | "Additional Information Supplied"
    | "Awaiting Approval"
    | "Purchased"
    | "Denied";
  message?: string;
  date: string;
  updatedBy?: string;
}

export type Statuses = Status[];

export interface UpdateStatus {
  status:
    | "Pending Review"
    | "In Review"
    | "Additional Information Required"
    | "Awaiting Approval"
    | "Purchased"
    | "Denied";
  message?: string;
}

export interface User {
  _id?: string;
  username?: string;
  email?: string;
  role?: "Client" | "Employee" | "Authoriser";
}

export type Users = User[];

export interface SignUpDetails {
  email?: string;
  username?: string;
  password?: string;
}

export interface CreateUser {
  email?: string;
  username?: string;
  password?: string;
  role?: string;
}

export interface SignInDetails {
  email?: string;
  password?: string;
}

export interface UpdateRole {
  role?: string;
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, ResponseType } from "axios";

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
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "//localhost:3000" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  private mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.instance.defaults.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      formData.append(
        key,
        property instanceof Blob
          ? property
          : typeof property === "object" && property !== null
          ? JSON.stringify(property)
          : `${property}`,
      );
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
    const responseFormat = (format && this.format) || void 0;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      requestParams.headers.common = { Accept: "*/*" };
      requestParams.headers.post = {};
      requestParams.headers.put = {};

      body = this.createFormData(body as Record<string, unknown>);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title ReadBooks Online API
 * @version 1.0.0
 * @baseUrl //localhost:3000
 *
 * This API is used for the ReadBooks Online website, this has been made as a part for the Applications and Frameworks module.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  bookRequest = {
    /**
     * No description
     *
     * @tags Requests
     * @name BookRequestList
     * @summary Get all requests in the system. Requires authentication with any role
     * @request GET:/bookRequest
     * @secure
     */
    bookRequestList: (
      query?: {
        bookName?: string;
        bookType?: "Book" | "Audiobook";
        isbn?: string;
        author?: string;
        requestedDateTime?: string;
        requestedBy?: string;
        assignedTo?: string;
        status?: string;
        price?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Requests, string>({
        path: `/bookRequest`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Requests
     * @name BookRequestCreate
     * @summary Creates a new request. Requires authentication with any role
     * @request POST:/bookRequest
     * @secure
     */
    bookRequestCreate: (request: CreateRequest, params: RequestParams = {}) =>
      this.request<void, string>({
        path: `/bookRequest`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Requests
     * @name BookRequestDetail
     * @summary Get all requests by user ID. Requires authentication with any role
     * @request GET:/bookRequest/{id}
     * @secure
     */
    bookRequestDetail: (id: string, params: RequestParams = {}) =>
      this.request<Requests, string>({
        path: `/bookRequest/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Requests
     * @name BookRequestUpdate
     * @summary Updates a request by an ID in the system. Requires authentication with any role
     * @request PUT:/bookRequest/{id}
     * @secure
     */
    bookRequestUpdate: (id: string, request: UpdateRequest, params: RequestParams = {}) =>
      this.request<void, string>({
        path: `/bookRequest/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Requests
     * @name BookRequestDelete
     * @summary Deletes a requests by an ID in the system. Requires authentication with any role
     * @request DELETE:/bookRequest/{id}
     * @secure
     */
    bookRequestDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, string>({
        path: `/bookRequest/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Requests
     * @name StatusUpdate
     * @summary Update the status of a request. Requires authentication with an Employee role
     * @request PUT:/bookRequest/{id}/status
     * @secure
     */
    statusUpdate: (id: string, status: UpdateStatus, params: RequestParams = {}) =>
      this.request<void, string>({
        path: `/bookRequest/${id}/status`,
        method: "PUT",
        body: status,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags Users
     * @name SignInCreate
     * @summary Authenticate the user using a cookie.
     * @request POST:/user/sign-in
     * @secure
     */
    signInCreate: (SignInDetails: SignInDetails, params: RequestParams = {}) =>
      this.request<void, string>({
        path: `/user/sign-in`,
        method: "POST",
        body: SignInDetails,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name SignUpCreate
     * @summary Sign a new user up to the system.
     * @request POST:/user/sign-up
     * @secure
     */
    signUpCreate: (SignUpDetails: SignUpDetails, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user/sign-up`,
        method: "POST",
        body: SignUpDetails,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name SignOutCreate
     * @summary Delete the authentication token from the cookie.
     * @request POST:/user/sign-out
     * @secure
     */
    signOutCreate: (params: RequestParams = {}) =>
      this.request<void, string>({
        path: `/user/sign-out`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserList
     * @summary Get all users in the system. Requires authentication with an Authoriser role.
     * @request GET:/user
     * @secure
     */
    userList: (params: RequestParams = {}) =>
      this.request<Users, string>({
        path: `/user`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserCreate
     * @summary Create a user in the system. Requires authentication with any Authoriser role.
     * @request POST:/user
     * @secure
     */
    userCreate: (params: RequestParams = {}) =>
      this.request<User, string>({
        path: `/user`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserDetail
     * @summary Get a user in the system using their id. Requires authentication with any Authoriser role.
     * @request GET:/user/{id}
     * @secure
     */
    userDetail: (id: string, params: RequestParams = {}) =>
      this.request<User, string>({
        path: `/user/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserUpdate
     * @summary Updates a users role in the system. Requires authentication with Authoriser role
     * @request PUT:/user/{id}
     * @secure
     */
    userUpdate: (id: string, Role: UpdateRole, params: RequestParams = {}) =>
      this.request<User, string>({
        path: `/user/${id}`,
        method: "PUT",
        body: Role,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserDelete
     * @summary Delete a user in the system. Requires authentication with Authoriser role
     * @request DELETE:/user/{id}
     * @secure
     */
    userDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, string>({
        path: `/user/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
