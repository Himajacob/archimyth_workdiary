import {
  apiRequest,
} from "./http";
import type {
  ApiList,
  ApiRecord,
} from "./types";

export async function inviteUser(
  token: string,
  payload: unknown
) {
  return apiRequest<ApiRecord>(
    "users/invite",
    {
      clearTokenOnUnauthorized:
        true,
      fallbackError:
        "Invite failed",
      json: payload,
      method: "POST",
      token,
    }
  );
}

// -----------------------------------
// Get users
// -----------------------------------

export async function getUsers(
  token: string
) {
  return apiRequest<ApiList>(
    "users",
    {
      clearTokenOnUnauthorized:
        true,
      fallbackError:
        "Failed to fetch users",
      token,
    }
  );
}

// -----------------------------------
// Update user
// -----------------------------------

export async function updateUser(
  token: string,
  userId: number,
  payload: unknown
) {
  return apiRequest<ApiRecord>(
    `users/${userId}`,
    {
      clearTokenOnUnauthorized:
        true,
      fallbackError:
        "Failed to update user",
      json: payload,
      method: "PATCH",
      token,
    }
  );
}

export async function resendInvite(
  token: string,
  userId: number
) {
  return apiRequest<ApiRecord>(
    `users/${userId}/resend-invite`,
    {
      clearTokenOnUnauthorized:
        true,
      fallbackError:
        "Failed to resend invite",
      method: "POST",
      token,
    }
  );
}
