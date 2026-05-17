import {
  apiRequest,
} from "./http";
import type {
  ApiList,
  ApiRecord,
} from "./types";

export async function getClients(
  token: string,
  showInactive: boolean = false
) {
  return apiRequest<ApiList>(
    "clients/",
    {
      fallbackError:
        "Failed to fetch clients",
      query: {
        show_inactive:
          showInactive,
      },
      token,
    }
  );
}

export async function createClient(
  token: string,
  payload: unknown
) {
  return apiRequest<ApiRecord>(
    "clients/",
    {
      fallbackError:
        "Failed to create client",
      json: payload,
      method: "POST",
      token,
    }
  );
}

export async function getClient(
  token: string,
  clientId: number
) {
  return apiRequest<ApiRecord>(
    `clients/${clientId}`,
    {
      fallbackError: "Failed to fetch client",
      token,
    }
  );
}

export async function updateClient(
  token: string,
  clientId: number,
  payload: unknown
) {
  return apiRequest<ApiRecord>(
    `clients/${clientId}`,
    {
      fallbackError:
        "Failed to update client",
      json: payload,
      method: "PATCH",
      token,
    }
  );
}
