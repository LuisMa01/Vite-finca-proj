import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../../app/api/apiSlice";

const actsAdapter = createEntityAdapter({
  selectId: (act) => act.act_id,
});

const initialState = actsAdapter.getInitialState();

export const actApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActs: builder.query({
      query: () => "/act",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      
      transformResponse: (responseData) => {
       const loadedActs = responseData.map((act) => {
          act.id = act.act_id;
          return act;
          
        });
        return actsAdapter.setAll(initialState, loadedActs.sort((a, b) => b.id - a.id));
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Act", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Act", id })),
          ];
        } else return [{ type: "Act", id: "LIST" }];
      },
    }),
    addNewAct: builder.mutation({
      query: (initialActData) => ({
        url: "/act",
        method: "POST",
        body: {
          ...initialActData,
        },
      }),
      invalidatesTags: [{ type: "Act", id: "LIST" }],
    }),
    updateAct: builder.mutation({
      query: (initialActData) => ({
        url: "/act",
        method: "PATCH",
        body: {
          ...initialActData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Act", id: arg.id }],
    }),
    deleteAct: builder.mutation({
      query: ({ id }) => ({
        url: `/act`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Act", id: arg.id }],
    }),
  }),
});

export const {
  useGetActsQuery,
  useAddNewActMutation,
  useUpdateActMutation,
  useDeleteActMutation,
} = actApiSlice;

// returns the query result object
export const selectActsResult = actApiSlice.endpoints.getActs.select();



// creates memoized selector
const selectActsData = createSelector(
  selectActsResult,
  (actResult) => actResult.data // normalized state object with ids & entities
);



//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllActs,
  selectById: selectActById,
  selectIds: selectActIds,
  // Pass in a selector that returns the users slice of state
} = actsAdapter.getSelectors(
  (state) => selectActsData(state) ?? initialState
);

