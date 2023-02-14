import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../../app/api/apiSlice";

const datesAdapter = createEntityAdapter({
  selectId: (date) => date.date_id,
});

const initialState = datesAdapter.getInitialState();

export const dateApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDates: builder.query({
      query: () => "/app",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      
      transformResponse: (responseData) => {
       const loadedDates = responseData.map((date) => {
          date.id = date.date_id;
          return date;
          
        });
        return datesAdapter.setAll(initialState, loadedDates.sort((a, b) => b.id - a.id));
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Date", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Date", id })),
          ];
        } else return [{ type: "Date", id: "LIST" }];
      },
    }),
    addNewDate: builder.mutation({
      query: (initialDateData) => ({
        url: "/app",
        method: "POST",
        body: {
          ...initialDateData,
        },
      }),
      invalidatesTags: [{ type: "Date", id: "LIST" }],
    }),
    updateDate: builder.mutation({
      query: (initialDateData) => ({
        url: "/app",
        method: "PATCH",
        body: {
          ...initialDateData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Date", id: arg.id }],
    }),
    deleteDate: builder.mutation({
      query: ({ id }) => ({
        url: `/app`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Date", id: arg.id }],
    }),
  }),
});

export const {
  useGetDatesQuery,
  useAddNewDateMutation,
  useUpdateDateMutation,
  useDeleteDateMutation,
} = dateApiSlice;

// returns the query result object
export const selectDatesResult = dateApiSlice.endpoints.getDates.select();



// creates memoized selector
const selectDatesData = createSelector(
  selectDatesResult,
  (dateResult) => dateResult.data // normalized state object with ids & entities
);



//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllDates,
  selectById: selectDateById,
  selectIds: selectDateIds,
  // Pass in a selector that returns the users slice of state
} = datesAdapter.getSelectors(
  (state) => selectDatesData(state) ?? initialState
);

