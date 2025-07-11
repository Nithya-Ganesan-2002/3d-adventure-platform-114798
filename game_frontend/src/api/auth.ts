import { api } from "./client";

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

// PUBLIC_INTERFACE
export async function register(credentials: UserCredentials): Promise<AuthResponse> {
  // Adjust endpoint path to match backend
  const response = await api.post<AuthResponse>("/auth/register", credentials);
  return response.data;
}

// PUBLIC_INTERFACE
export async function login(credentials: UserCredentials): Promise<AuthResponse> {
  // Adjust endpoint path to match backend
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data;
}
