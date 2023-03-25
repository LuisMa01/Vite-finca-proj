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

// returns the query result object
export const selectCampsResult = campApiSlice.endpoints.getCamps.select();

// creates memoized selector
const selectCampsData = createSelector(
  selectCampsResult,
  (campResult) => campResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllCamps,
  selectById: selectCampById,
  selectIds: selectCampIds,
  // Pass in a selector that returns the users slice of state
} = campsAdapter.getSelectors(
  (state) => selectCampsData(state) ?? initialState
);
