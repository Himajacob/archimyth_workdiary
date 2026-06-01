import {
  apiRequest,
} from "./http";
import type {
  AuthResponse,
  MessageResponse,
} from "./types";

export async function login(
  email: string,
  password: string,
  rememberMe: boolean = false
) {
  return apiRequest<AuthResponse>(
    "auth/login",
    {
      fallbackError:
        "Login failed",
      json: {
        email,
        password,
        remember_me: rememberMe,
      },
      method: "POST",
    }
  );
}

export async function register(
  token: string,
  password: string
) {
  return apiRequest<MessageResponse>(
    "auth/register",
    {
      fallbackError:
        "Registration failed",
      json: {
        password,
        token,
      },
      method: "POST",
    }
  );
}

export async function forgotPassword(
  email: string
) {
  return apiRequest<MessageResponse>(
    "auth/forgot-password",
    {
      fallbackError:
        "Failed",
      json: {
        email,
      },
      method: "POST",
    }
  );
}

export async function resetPassword(
  token: string,
  password: string
) {
  return apiRequest<MessageResponse>(
    "auth/reset-password",
    {
      fallbackError:
        "Reset failed",
      json: {
        password,
        token,
      },
      method: "POST",
    }
  );
}
