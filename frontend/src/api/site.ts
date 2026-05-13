import {
  apiRequest,
} from "./http";
import type {
  ApiList,
  ApiRecord,
} from "./types";

export async function getSites(
  token: string,
  showInactive: boolean = false
) {
  return apiRequest<ApiList>(
    "sites/",
    {
      fallbackError:
        "Failed to fetch sites",
      query: {
        show_inactive:
          showInactive,
      },
      token,
    }
  );
}

export async function createSite(
  token: string,
  payload: unknown
) {
  return apiRequest<ApiRecord>(
    "sites/",
    {
      fallbackError:
        "Failed to create site",
      json: payload,
      method: "POST",
      token,
    }
  );
}

export async function updateSite(
  token: string,
  siteId: number,
  payload: unknown
) {
  return apiRequest<ApiRecord>(
    `sites/${siteId}`,
    {
      fallbackError:
        "Failed to update site",
      json: payload,
      method: "PATCH",
      token,
    }
  );
}

export async function getSitesByClient(
  token: string,
  clientId: number,
  showInactive: boolean = false
) {
  return apiRequest<ApiList>(
    `sites/client/${clientId}`,
    {
      fallbackError:
        "Failed to fetch client sites",
      query: {
        show_inactive:
          showInactive,
      },
      token,
    }
  );
}
