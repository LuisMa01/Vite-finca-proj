import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../../app/api/apiSlice";

const comtsAdapter = createEntityAdapter({
  selectId: (comt) => comt.comt_id,
});

const initialState = comtsAdapter.getInitialState();

export const comtApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComts: builder.query({
      query: () => ({
        url: "/comt",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),

      transformResponse: (responseData) => {
        const loadedComts = responseData.map((comt) => {
          comt.id = comt.comt_id;
          return comt;
        });
        return comtsAdapter.setAll(
          initialState,
          loadedComts.sort((a, b) => b.id - a.id)
        );
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Comt", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Comt", id })),
          ];
        } else return [{ type: "Comt", id: "LIST" }];
      },
    }),
    addNewComt: builder.mutation({
      query: (initialComtData) => ({
        url: "/comt",
        method: "POST",
        body: {
          ...initialComtData,
        },
      }),
      invalidatesTags: [{ type: "Comt", id: "LIST" }],
    }),
    updateComt: builder.mutation({
      query: (initialComtData) => ({
        url: "/comt",
        method: "PATCH",
        body: {
          ...initialComtData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Comt", id: arg.id }],
    }),
    deleteComt: builder.mutation({
      query: ({ id }) => ({
        url: `/comt`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Comt", id: arg.id }],
    }),
  }),
});

export const {
  useGetComtsQuery,
  useAddNewComtMutation,
  useUpdateComtMutation,
  useDeleteComtMutation,
} = comtApiSlice;

export const selectComtsResult = comtApiSlice.endpoints.getComts.select();

const selectComtsData = createSelector(
  selectComtsResult,
  (comtResult) => comtResult.data
);

export const {
  selectAll: selectAllComts,
  selectById: selectComtById,
  selectIds: selectComtIds,
} = comtsAdapter.getSelectors(
  (state) => selectComtsData(state) ?? initialState
);
