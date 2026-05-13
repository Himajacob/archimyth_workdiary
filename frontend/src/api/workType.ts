import {
  apiRequest,
} from "./http";
import type {
  ApiList,
  ApiRecord,
} from "./types";

export async function getWorkTypes(
  token: string,
  showInactive: boolean = false
) {
  return apiRequest<ApiList>(
    "work-types/",
    {
      fallbackError:
        "Failed to fetch work types",
      query: {
        show_inactive:
          showInactive,
      },
      token,
    }
  );
}

export async function createWorkType(
  token: string,
  payload: unknown
) {
  return apiRequest<ApiRecord>(
    "work-types/",
    {
      fallbackError:
        "Failed to create work type",
      json: payload,
      method: "POST",
      token,
    }
  );
}

export async function activateWorkType(
  token: string,
  workTypeId: number
) {
  return apiRequest<ApiRecord>(
    `work-types/${workTypeId}/activate`,
    {
      fallbackError:
        "Failed to activate work type",
      method: "PATCH",
      token,
    }
  );
}

export async function deactivateWorkType(
  token: string,
  workTypeId: number
) {
  return apiRequest<ApiRecord>(
    `work-types/${workTypeId}/deactivate`,
    {
      fallbackError:
        "Failed to deactivate work type",
      method: "PATCH",
      token,
    }
  );
}
