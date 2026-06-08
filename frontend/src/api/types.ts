export type ApiRecord =
  Record<string, unknown>;

export type ApiList =
  ApiRecord[];

export type AuthResponse =
  ApiRecord & {
    access_token: string;
  };

export type MessageResponse =
  ApiRecord & {
    detail?: string;
    message?: string;
  };

export type WorkEntryItemResponse =
  ApiRecord & {
    photos?: ApiList;
  };

export type WorkEntryResponse =
  ApiRecord & {
    id?: number;
    items: WorkEntryItemResponse[];
    updated_by_name?: string | null;
  };

export type GalleryEntryResponse =
  ApiRecord & {
    entry_date: string;
    photos: ApiList;
  };
