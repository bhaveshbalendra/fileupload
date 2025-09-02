import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "../configs/envConfig";
import { RootState } from "./store";

const baseQuery = fetchBaseQuery({
  baseUrl: env.API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const auth = (getState() as RootState).auth;
    if (auth?.accessToken) {
      headers.set("Authorization", `Bearer ${auth.accessToken}`);
    }
    return headers;
  },
});

export const apiClient = createApi({
  reducerPath: "api", // Add API client reducer to root reducer
  baseQuery: baseQuery,
  refetchOnMountOrArgChange: true, // Refetch on mount or arg change
  tagTypes: ["files", "analytics", "apikey"], // Tag types for RTK Query
  endpoints: () => ({}), // Endpoints for RTK Query
});
