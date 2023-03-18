import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../../app/api/apiSlice";

const costsAdapter = createEntityAdapter({
  selectId: (cost) => cost.cost_id,
});

const initialState = costsAdapter.getInitialState();

export const costApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCosts: builder.query({
      query: () => "/cost",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      
      transformResponse: (responseData) => {
       const loadedCosts = responseData.map((cost) => {
          cost.id = cost.cost_id;
          return cost;
          
        });
        return costsAdapter.setAll(initialState, loadedCosts.sort((a, b) => b.id - a.id));
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Cost", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Cost", id })),
          ];
        } else return [{ type: "Cost", id: "LIST" }];
      },
    }),
    addNewCost: builder.mutation({
      query: (initialCostData) => ({
        url: "/cost",
        method: "POST",
        body: {
          ...initialCostData,
        },
      }),
      invalidatesTags: [{ type: "Cost", id: "LIST" }],
    }),
    updateCost: builder.mutation({
      query: (initialCostData) => ({
        url: "/cost",
        method: "PATCH",
        body: {
          ...initialCostData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Cost", id: arg.id }],
    }),
    deleteCost: builder.mutation({
      query: ({ id }) => ({
        url: `/cost`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Cost", id: arg.id }],
    }),
  }),
});

export const {
  useGetCostsQuery,
  useAddNewCostMutation,
  useUpdateCostMutation,
  useDeleteCostMutation,
} = costApiSlice;

// returns the query result object
export const selectCostsResult = costApiSlice.endpoints.getCosts.select();



// creates memoized selector
const selectCostsData = createSelector(
  selectCostsResult,
  (costResult) => costResult.data // normalized state object with ids & entities
);



//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllCosts,
  selectById: selectCostById,
  selectIds: selectCostIds,
  // Pass in a selector that returns the users slice of state
} = costsAdapter.getSelectors(
  (state) => selectCostsData(state) ?? initialState
);

