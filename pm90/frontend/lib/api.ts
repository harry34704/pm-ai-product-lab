"use client";

import { useEffect, useState } from "react";

import type {
  AnalyticsPayload,
  CommunityOverview,
  DashboardSummary,
  DayDetail,
  DaySummary,
  MentorResponse,
  ResourcePayload,
  SimulationScenario,
  UserSummary,
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";
const TOKEN_KEY = "pm90-token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (typeof window === "undefined") {
    return;
  }
  if (!token) {
    window.localStorage.removeItem(TOKEN_KEY);
    return;
  }
  window.localStorage.setItem(TOKEN_KEY, token);
}

async function request<T>(path: string, init: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(init.headers ?? {});
  headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(payload.detail ?? "Request failed");
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  register: (payload: { email: string; full_name: string; password: string }) =>
    request<{ access_token: string }>("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) =>
    request<{ access_token: string }>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: (token: string) => request<UserSummary>("/auth/me", {}, token),
  dashboard: (token: string) => request<DashboardSummary>("/dashboard/summary", {}, token),
  curriculum: (token: string) => request<DaySummary[]>("/curriculum", {}, token),
  day: (day: string, token: string) => request<DayDetail>(`/curriculum/${day}`, {}, token),
  completeDay: (day: string, payload: { reflection_response: string; challenge_answer: string }, token: string) =>
    request<{ status: string; xp_balance: number; current_level: number; unlocked_badges: string[] }>(
      `/curriculum/${day}/complete`,
      { method: "POST", body: JSON.stringify(payload) },
      token,
    ),
  mentorChat: (payload: { prompt: string; context?: string; mode?: string }, token: string) =>
    request<MentorResponse>("/mentor/chat", { method: "POST", body: JSON.stringify(payload) }, token),
  mentorReviewPrd: (payload: { content: string }, token: string) =>
    request<MentorResponse>("/mentor/review-prd", { method: "POST", body: JSON.stringify(payload) }, token),
  mentorEvaluateChallenge: (payload: { content: string }, token: string) =>
    request<MentorResponse>("/mentor/evaluate-challenge", { method: "POST", body: JSON.stringify(payload) }, token),
  mentorInterview: (payload: { question: string; answer: string }, token: string) =>
    request<MentorResponse>("/mentor/interview", { method: "POST", body: JSON.stringify(payload) }, token),
  simulations: (token: string) => request<SimulationScenario[]>("/simulations", {}, token),
  submitSimulation: (scenarioKey: string, payload: { selected_option: string; rationale: string }, token: string) =>
    request<{ score: number; feedback: string; xp_balance: number }>(
      `/simulations/${scenarioKey}/attempt`,
      { method: "POST", body: JSON.stringify(payload) },
      token,
    ),
  analytics: (token: string) => request<AnalyticsPayload>("/analytics/playground", {}, token),
  artifacts: (token: string) => request<any[]>("/artifacts", {}, token),
  createArtifact: (payload: Record<string, unknown>, token: string) =>
    request<any>("/artifacts", { method: "POST", body: JSON.stringify(payload) }, token),
  generateArtifact: (type: "prd" | "roadmap" | "prioritization", payload: Record<string, unknown>, token: string) =>
    request<any>(`/artifacts/generate/${type}`, { method: "POST", body: JSON.stringify(payload) }, token),
  community: (token: string) => request<CommunityOverview>("/community/overview", {}, token),
  createPost: (payload: { topic: string; body: string }, token: string) =>
    request<any>("/community/posts", { method: "POST", body: JSON.stringify(payload) }, token),
  resources: () => request<ResourcePayload>("/resources"),
  exportArtifact: (artifactId: number, format: "markdown" | "notion" | "pdf", token: string) =>
    fetch(`${API_BASE_URL}/artifacts/${artifactId}/export?format=${format}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export function useSession() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = getStoredToken();
    if (!saved) {
      setLoading(false);
      return;
    }
    setToken(saved);
    api
      .me(saved)
      .then(setUser)
      .catch(() => {
        setStoredToken(null);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveToken = async (nextToken: string) => {
    setStoredToken(nextToken);
    setToken(nextToken);
    const profile = await api.me(nextToken);
    setUser(profile);
  };

  const logout = () => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
  };

  return { token, user, loading, saveToken, logout };
}
