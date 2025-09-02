import { apiClient } from "@/app/api-client";
import {
  DeleteFilesResponse,
  DownloadFilesResponse,
  GetAllFilesResponse,
  Params,
  UploadResponse,
} from "./filesType";

export const fileApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    uploadFiles: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: "/api/files/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["files"],
    }),

    getAllFiles: builder.query<GetAllFilesResponse, Params>({
      query: (params) => {
        const { keyword = undefined, pageNumber = 1, pageSize = 10 } = params;
        return {
          url: "/api/files/all",
          method: "GET",
          params: {
            keyword,
            pageNumber,
            pageSize,
          },
        };
      },
      providesTags: ["files"],
    }),

    deleteFiles: builder.mutation<DeleteFilesResponse, string[]>({
      query: (fileIds) => ({
        url: `/api/files/bulk-delete`,
        method: "DELETE",
        body: { fileIds },
      }),
      invalidatesTags: ["files"],
    }),

    downloadFiles: builder.mutation<DownloadFilesResponse, string[]>({
      query: (fileIds) => ({
        url: `/api/files/download`,
        method: "POST",
        body: { fileIds },
      }),
    }),
  }),
});

export const {
  useUploadFilesMutation,
  useGetAllFilesQuery,
  useDeleteFilesMutation,
  useDownloadFilesMutation,
} = fileApi;
