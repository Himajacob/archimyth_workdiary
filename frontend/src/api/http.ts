import {
  logout,
} from "../utils/auth";

type QueryValue =
  string | number | boolean;

type ApiRequestOptions = Omit<
  RequestInit,
  "body" | "headers"
> & {
  body?: BodyInit | null;
  clearTokenOnUnauthorized?: boolean;
  fallbackError: string;
  headers?: HeadersInit;
  json?: unknown;
  query?: Record<
    string,
    QueryValue | null | undefined
  >;
  token?: string;
  unauthorizedMessage?: string;
};

const DEFAULT_API_BASE_URL =
  "http://localhost:8000";

const configuredApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL
    ?.trim() ||
  DEFAULT_API_BASE_URL;

export const API_BASE_URL =
  configuredApiBaseUrl.replace(
    /\/+$/,
    ""
  );

function buildApiUrl(
  path: string,
  query?: ApiRequestOptions["query"]
) {

  const url = new URL(
    path.replace(/^\//, ""),
    `${API_BASE_URL}/`
  );

  if (query) {

    Object.entries(query).forEach(
      ([key, value]) => {

        if (
          value === undefined ||
          value === null
        ) {
          return;
        }

        url.searchParams.set(
          key,
          String(value)
        );
      }
    );
  }

  return url.toString();
}

async function parseResponseBody(
  response: Response
) {

  if (response.status === 204) {
    return null;
  }

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  if (
    contentType.includes(
      "application/json"
    )
  ) {
    return response.json();
  }

  const text =
    await response.text();

  return text || null;
}

function getErrorMessage(
  payload: unknown,
  fallbackError: string
) {

  if (
    typeof payload === "string" &&
    payload.trim()
  ) {
    return payload;
  }

  if (
    payload &&
    typeof payload === "object"
  ) {

    const detail =
      "detail" in payload
        ? payload.detail
        : null;

    if (
      typeof detail === "string" &&
      detail.trim()
    ) {
      return detail;
    }

    const message =
      "message" in payload
        ? payload.message
        : null;

    if (
      typeof message === "string" &&
      message.trim()
    ) {
      return message;
    }
  }

  return fallbackError;
}

async function sendRequest(
  path: string,
  options: ApiRequestOptions
) {

  const {
    body,
    clearTokenOnUnauthorized,
    headers,
    json,
    query,
    token,
    unauthorizedMessage =
      "Session expired. Please login again.",
    ...requestInit
  } = options;

  const requestHeaders =
    new Headers(headers);

  if (token) {
    requestHeaders.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  let requestBody = body;

  const shouldClearTokenOnUnauthorized =
    clearTokenOnUnauthorized ??
    Boolean(token);

  if (json !== undefined) {

    requestHeaders.set(
      "Content-Type",
      "application/json"
    );

    requestBody = JSON.stringify(
      json
    );
  }

  const response = await fetch(
    buildApiUrl(path, query),
    {
      ...requestInit,
      body: requestBody,
      headers: requestHeaders,
    }
  );

  if (
    response.status === 401 &&
    shouldClearTokenOnUnauthorized
  ) {

    logout();

    throw new Error(
      unauthorizedMessage
    );
  }

  return response;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions
) {

  const response =
    await sendRequest(
      path,
      options
    );

  const payload =
    await parseResponseBody(
      response
    );

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        payload,
        options.fallbackError
      )
    );
  }

  return payload as T;
}

export async function apiRequestOrNull<T>(
  path: string,
  options: ApiRequestOptions
) {

  const response =
    await sendRequest(
      path,
      options
    );

  if (response.status === 404) {
    return null;
  }

  const payload =
    await parseResponseBody(
      response
    );

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        payload,
        options.fallbackError
      )
    );
  }

  return payload as T;
}
