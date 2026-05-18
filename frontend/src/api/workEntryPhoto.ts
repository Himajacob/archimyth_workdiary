import {
  apiRequest,
} from "./http";
import type {
  ApiRecord,
  GalleryEntryResponse,
} from "./types";

export async function uploadPhoto(
  token: string,
  workEntryItemId: number,
  file: File
) {
  const formData = new FormData();
  formData.append("work_entry_item_id", String(workEntryItemId));
  formData.append("file", file);

  return apiRequest<ApiRecord>(
    "work-entry-photos/",
    {
      body: formData,
      fallbackError:
        "Failed to upload photo",
      method: "POST",
      token,
    }
  );
}

export async function deletePhoto(
  token: string,
  photoId: number
) {
  return apiRequest<ApiRecord>(
    `work-entry-photos/${photoId}`,
    {
      fallbackError:
        "Failed to delete photo",
      method: "DELETE",
      token,
    }
  );
}


export async function getSiteGallery(
  token: string,
  siteId: number
) {
  return apiRequest<
    GalleryEntryResponse[]
  >(
    `work-entry-photos/site/${siteId}`,
    {
      fallbackError:
        "Failed to fetch site gallery",
      token,
    }
  );
}
