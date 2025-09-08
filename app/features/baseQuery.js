import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://tourism.smartptrm.com/api/v1",
});

export const baseQuery = async (args, api, extraOptions) => {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    // Normalize args if it's a string
    if (typeof args === "string") {
      args = { url: args, headers: {} };
    }

    // Inject token if found
    if (token) {
      args.headers = {
        ...(args.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }

    const result = await rawBaseQuery(args, api, extraOptions);
    return result;
  } catch (error) {
    return {
      error: {
        status: "FETCH_ERROR",
        message: error?.message || "Access token is required",
      },
    };
  }
};
