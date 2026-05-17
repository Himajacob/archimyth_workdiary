import {
  apiRequest,
} from "./http";
import type {
  ApiList,
  ApiRecord,
} from "./types";

export async function getMe(token: string) {
  return apiRequest<{
    id: number;
    first_name: string;
    last_name: string | null;
    email: string;
    role: string;
  }>("users/me", {
    fallbackError: "Failed to fetch profile",
    token,
  });
}

export async function updateMe(
  token: string,
  payload: { first_name: string; last_name?: string }
) {
  return apiRequest<{
    message: string;
    access_token: string;
    first_name: string;
    last_name: string | null;
  }>("users/me", {
    fallbackError: "Failed to update profile",
    json: payload,
    method: "PATCH",
    token,
  });
}

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
