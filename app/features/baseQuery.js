// src/features/baseQuery.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout, setCredentials } from "./authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://tourism.smartptrm.com/api/v1",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

let refreshPromise = null;

export const baseQuery = async (args, api, extraOptions) => {
  if (typeof args === "string") {
    args = { url: args };
  }

  const isAuthEndpoint =
    args.url === "/auth/login" || args.url === "/auth/refresh";

  // ✅ Prefer Redux token, fallback to AsyncStorage
  if (!isAuthEndpoint) {
    const stateToken = api.getState()?.auth?.accessToken;
    const token = stateToken || (await AsyncStorage.getItem("accessToken"));

    if (token) {
      args.headers = {
        ...(args.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }
  }

  let result = await rawBaseQuery(args, api, extraOptions);

  // 🔒 Handle 401 globally
  if (result.error?.status === 401 && !isAuthEndpoint) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        isRefreshing = true;

        try {
          const refreshToken = await AsyncStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("No refresh token");

          const refreshResult = await rawBaseQuery(
            {
              url: "/auth/refresh",
              method: "POST",
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (!refreshResult.data?.accessToken) {
            throw new Error("Refresh failed");
          }

          const newAccessToken = refreshResult.data.accessToken;
          const newRefreshToken =
            refreshResult.data.refreshToken || refreshToken;

          await AsyncStorage.setItem("accessToken", newAccessToken);
          await AsyncStorage.setItem("refreshToken", newRefreshToken);

          api.dispatch(
            setCredentials({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            })
          );

          return newAccessToken;
        } catch (error) {
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
          api.dispatch(logout());
          throw error;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();
    }

    try {
      const newToken = await refreshPromise;
      args.headers = {
        ...args.headers,
        Authorization: `Bearer ${newToken}`,
      };
      result = await rawBaseQuery(args, api, extraOptions);
    } catch {
      return result;
    }
  }

  return result;
};
