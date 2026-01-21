
// lib/api/waitlist.ts
import { apiFetch } from "./client";

export type WaitlistResponse = { ok: boolean };

export async function submitWaitlist(email: string) {
  return apiFetch<WaitlistResponse>("/api/waitlist", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}


