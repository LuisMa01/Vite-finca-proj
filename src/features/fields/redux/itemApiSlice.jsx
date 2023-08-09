import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../../app/api/apiSlice";

const itemsAdapter = createEntityAdapter({
  selectId: (item) => item.item_id,
});

const initialState = itemsAdapter.getInitialState();

export const itemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => ({
        url: "/item",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),

      transformResponse: (responseData) => {
        const loadedItems = responseData.map((item) => {
          item.id = item.item_id;
          return item;
        });
        return itemsAdapter.setAll(
          initialState,
          loadedItems.sort((a, b) => b.id - a.id)
        );
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Item", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Item", id })),
          ];
        } else return [{ type: "Item", id: "LIST" }];
      },
    }),
    addNewItem: builder.mutation({
      query: (initialItemData) => ({
        url: "/item",
        method: "POST",
        body: {
          ...initialItemData,
        },
      }),
      invalidatesTags: [{ type: "Item", id: "LIST" }],
    }),
    updateItem: builder.mutation({
      query: (initialItemData) => ({
        url: "/item",
        method: "PATCH",
        body: {
          ...initialItemData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Item", id: arg.id }],
    }),
    deleteItem: builder.mutation({
      query: ({ id }) => ({
        url: `/item`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Item", id: arg.id }],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useAddNewItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemApiSlice;

export const selectItemsResult = itemApiSlice.endpoints.getItems.select();

const selectItemsData = createSelector(
  selectItemsResult,
  (itemResult) => itemResult.data
);

export const {
  selectAll: selectAllItems,
  selectById: selectItemById,
  selectIds: selectItemIds,
} = itemsAdapter.getSelectors(
  (state) => selectItemsData(state) ?? initialState
);
