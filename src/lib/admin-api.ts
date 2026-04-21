import type { Database } from "@/integrations/supabase/types";

type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
type SongRequest = Database["public"]["Tables"]["song_requests"]["Row"];
type SongRequestStatus = Database["public"]["Enums"]["request_status"];
type HomeCard = Database["public"]["Tables"]["home_cards"]["Row"];

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: "include",
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : { "content-type": "application/json" }),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let message = "Bir hata oluştu.";
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // Ignore non-JSON responses and keep the fallback message.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const adminApi = {
  getSession: () => request<{ authenticated: boolean }>("/api/admin/session"),
  login: (password: string) =>
    request<{ authenticated: boolean }>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
  logout: () =>
    request<{ ok: true }>("/api/admin/logout", {
      method: "POST",
    }),
  getDashboard: () =>
    request<{
      stats: { menu: number; pending: number };
      now: { track_title: string | null; artist: string | null } | null;
    }>("/api/admin/dashboard"),
  listMenu: () => request<MenuItem[]>("/api/admin/menu"),
  createMenuItem: (payload: Partial<MenuItem>) =>
    request<MenuItem>("/api/admin/menu", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateMenuItem: (id: string, payload: Partial<MenuItem>) =>
    request<MenuItem>(`/api/admin/menu/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteMenuItem: (id: string) =>
    request<{ ok: true }>(`/api/admin/menu/${id}`, {
      method: "DELETE",
    }),
  uploadMenuImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ publicUrl: string }>("/api/admin/menu/upload", {
      method: "POST",
      body: formData,
    });
  },
  listSongRequests: () => request<SongRequest[]>("/api/admin/song-requests"),
  updateSongRequestStatus: (id: string, status: SongRequestStatus) =>
    request<SongRequest>(`/api/admin/song-requests/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteSongRequest: (id: string) =>
    request<{ ok: true }>(`/api/admin/song-requests/${id}`, {
      method: "DELETE",
    }),
  getNowPlaying: () =>
    request<{ track_title: string | null; artist: string | null; cover_url: string | null } | null>(
      "/api/admin/now-playing",
    ),
  updateNowPlaying: (payload: {
    track_title: string | null;
    artist: string | null;
    cover_url: string | null;
  }) =>
    request<{ ok: true }>("/api/admin/now-playing", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  listHomeCards: () => request<HomeCard[]>("/api/admin/home-cards"),
  createHomeCard: (payload: Partial<HomeCard>) =>
    request<HomeCard>("/api/admin/home-cards", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateHomeCard: (id: string, payload: Partial<HomeCard>) =>
    request<HomeCard>(`/api/admin/home-cards/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteHomeCard: (id: string) =>
    request<{ ok: true }>(`/api/admin/home-cards/${id}`, {
      method: "DELETE",
    }),
  uploadHomeCardImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ publicUrl: string }>("/api/admin/home-cards/upload", {
      method: "POST",
      body: formData,
    });
  },
};

export type { MenuItem, SongRequest, SongRequestStatus, HomeCard };
