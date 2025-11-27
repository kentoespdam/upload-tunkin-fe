"use server";

import { getAccessToken } from "@/lib/session";
import { appConfig } from "@/lib/utils";
import type { PageResponse } from "@/tipes/commons";
import type { Tunkin } from "@/tipes/tunkin";

export const fetchTunkin = async (params: string): Promise<PageResponse<Tunkin>> => {
  const search = new URLSearchParams(params);
  const periode = search.get("periode");
  search.delete("periode");
  const token = await getAccessToken();

  const url = `${appConfig.apiUrl}/tunkin/${periode}?${search.toString()}`;
  const req = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await req.json();
  return result.data;
};

export const doUpload = async (formData: FormData) => {
  const res = await fetch("/api/tunkin/upload", {
    method: "POST",
    body: formData,
  });
  return res.json();
};
