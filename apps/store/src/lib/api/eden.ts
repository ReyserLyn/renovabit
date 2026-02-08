import { createApiClient } from "@renovabit/api-client";
import { API_URL } from "./client";

export const api = createApiClient(API_URL, { credentials: "include" });
