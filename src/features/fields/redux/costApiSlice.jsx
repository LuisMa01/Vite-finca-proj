import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../../app/api/apiSlice";

const costsAdapter = createEntityAdapter({
  selectId: (cost) => cost.cost_id,
});

const initialState = costsAdapter.getInitialState();

export const costApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCosts: builder.query({
      query: () => ({
        url: "/cost",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),

      transformResponse: (responseData) => {
        const loadedCosts = responseData.map((cost) => {
          cost.id = cost.cost_id;
          return cost;
        });
        return costsAdapter.setAll(
          initialState,
          loadedCosts.sort((a, b) => b.id - a.id)
        );
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

export const selectCostsResult = costApiSlice.endpoints.getCosts.select();

const selectCostsData = createSelector(
  selectCostsResult,
  (costResult) => costResult.data
);

export const {
  selectAll: selectAllCosts,
  selectById: selectCostById,
  selectIds: selectCostIds,
} = costsAdapter.getSelectors(
  (state) => selectCostsData(state) ?? initialState
);
