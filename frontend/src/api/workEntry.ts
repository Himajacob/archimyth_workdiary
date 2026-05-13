import {
  apiRequest,
  apiRequestOrNull,
} from "./http";
import type {
  ApiRecord,
  WorkEntryResponse,
} from "./types";

export async function getWorkEntry(
  token: string,
  siteId: number,
  date: string
) {
  return apiRequestOrNull<WorkEntryResponse>(
    "work-entries",
    {
      fallbackError:
        "Failed to fetch work entry",
      query: {
        date,
        site_id: siteId,
      },
      token,
    }
  );
}

export async function saveWorkEntry(
  token: string,
  payload: unknown
) {
  return apiRequest<ApiRecord>(
    "work-entries/",
    {
      fallbackError:
        "Failed to save work entry",
      json: payload,
      method: "POST",
      token,
    }
  );
}

export async function deleteWorkEntryItem(
  token: string,
  itemId: number
) {
  return apiRequest<ApiRecord>(
    `work-entries/items/${itemId}`,
    {
      fallbackError:
        "Failed to delete item",
      method: "DELETE",
      token,
    }
  );
}

export async function deleteWorkEntry(
  token: string,
  workEntryId: number
) {
  return apiRequest<ApiRecord>(
    `work-entries/${workEntryId}`,
    {
      fallbackError:
        "Failed to delete work entry",
      method: "DELETE",
      token,
    }
  );
}
