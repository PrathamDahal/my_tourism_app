import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const baseQuery = fetchBaseQuery({
  baseUrl: "https://tourism.smartptrm.com/api/v1",
  prepareHeaders: async (headers) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});