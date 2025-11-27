"use server"

import { createSession } from "@/lib/session";
import { appConfig } from "@/lib/utils";
import type { LoginSchema, LoginToken } from "@/tipes/auth";

export const doLogin = async (formData: LoginSchema) => {
  const data = new FormData();
  data.append("username", formData.username);
  data.append("password", formData.password);
  data.append("client_id", `${appConfig.client_id}`);
  data.append("client_secret", `${appConfig.client_secret}`);
  data.append("grant_type", "password");
  try {
    const login = await fetch(`${appConfig.apiUrl}/token`, {
      method: "POST",
      body: data,
    });

    const result = await login.json();
    if (!login.ok) {
      throw result;
    }

    await createSession(result.data as LoginToken);
    return result;
  } catch (error) {
    return error;
  }
};