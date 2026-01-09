// Services/registerApiSlice.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../features/baseQuery";

export const registerApiSlice = createApi({
  reducerPath: "registerApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => {
        const hasImages = userData.images;
        
        if (hasImages) {
          // Create FormData for multipart/form-data upload
          const formData = new FormData();
          
          // Get file extension from uri or fileName
          const asset = userData.images;
          const uriParts = asset.uri.split('.');
          const fileType = uriParts[uriParts.length - 1];
          
          // Append the image file with proper structure for React Native
          formData.append("images", {
            uri: asset.uri,
            type: `image/${fileType}`,
            name: asset.fileName || `profile_${Date.now()}.${fileType}`,
          });

          // Append all other fields
          Object.keys(userData).forEach((key) => {
            if (key !== "images" && userData[key] !== null && userData[key] !== undefined) {
              formData.append(key, userData[key]);
            }
          });

          return {
            url: "/auth/signup",
            method: "POST",
            body: formData,
            // FormData will automatically set Content-Type with boundary
          };
        } else {
          // Send as regular JSON if no images
          const { images, ...restData } = userData;
          return {
            url: "/auth/signup",
            method: "POST",
            body: restData,
            headers: { "Content-Type": "application/json" },
          };
        }
      },
      invalidatesTags: ["User"],
    }),
  }),
});

// Export the hook
export const { useRegisterUserMutation } = registerApiSlice;

// Also export the reducer and middleware for store configuration
export default registerApiSlice;