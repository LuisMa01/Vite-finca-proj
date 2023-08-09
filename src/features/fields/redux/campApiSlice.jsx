import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../../app/api/apiSlice";

const campsAdapter = createEntityAdapter({
  selectId: (camp) => camp.camp_id,
});

const initialState = campsAdapter.getInitialState();

export const campApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCamps: builder.query({
      query: () => ({
        url: "/camp",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),

      transformResponse: (responseData) => {
        const loadedCamps = responseData.map((camp) => {
          camp.id = camp.camp_id;
          return camp;
        });
        return campsAdapter.setAll(
          initialState,
          loadedCamps.sort((a, b) => b.id - a.id)
        );
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Camp", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Camp", id })),
          ];
        } else return [{ type: "Camp", id: "LIST" }];
      },
    }),
    addNewCamp: builder.mutation({
      query: (initialCampData) => ({
        url: "/camp",
        method: "POST",
        body: {
          ...initialCampData,
        },
      }),
      invalidatesTags: [{ type: "Camp", id: "LIST" }],
    }),
    updateCamp: builder.mutation({
      query: (initialCampData) => ({
        url: "/camp",
        method: "PATCH",
        body: {
          ...initialCampData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Camp", id: arg.id }],
    }),
    deleteCamp: builder.mutation({
      query: ({ id }) => ({
        url: `/camp`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Camp", id: arg.id }],
    }),
  }),
});

export const {
  useGetCampsQuery,
  useAddNewCampMutation,
  useUpdateCampMutation,
  useDeleteCampMutation,
} = campApiSlice;

export const selectCampsResult = campApiSlice.endpoints.getCamps.select();

const selectCampsData = createSelector(
  selectCampsResult,
  (campResult) => campResult.data
);

export const {
  selectAll: selectAllCamps,
  selectById: selectCampById,
  selectIds: selectCampIds,
} = campsAdapter.getSelectors(
  (state) => selectCampsData(state) ?? initialState
);
