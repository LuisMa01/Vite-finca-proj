import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../../app/api/apiSlice";

const cropsAdapter = createEntityAdapter({
  selectId: (crop) => crop.crop_id,
});

const initialState = cropsAdapter.getInitialState();

export const cropApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCrops: builder.query({
      query: () => "/crop",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      
      transformResponse: (responseData) => {
       const loadedCrops = responseData.map((crop) => {
          crop.id = crop.crop_id;
          return crop;
          
        });
        return cropsAdapter.setAll(initialState, loadedCrops.sort((a, b) => b.id - a.id));
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Crop", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Crop", id })),
          ];
        } else return [{ type: "Crop", id: "LIST" }];
      },
    }),
    addNewCrop: builder.mutation({
      query: (initialCropData) => ({
        url: "/crop",
        method: "POST",
        body: {
          ...initialCropData,
        },
      }),
      invalidatesTags: [{ type: "Crop", id: "LIST" }],
    }),
    updateCrop: builder.mutation({
      query: (initialCropData) => ({
        url: "/crop",
        method: "PATCH",
        body: {
          ...initialCropData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Crop", id: arg.id }],
    }),
    deleteCrop: builder.mutation({
      query: ({ id }) => ({
        url: `/crop`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Crop", id: arg.id }],
    }),
  }),
});

export const {
  useGetCropsQuery,
  useAddNewCropMutation,
  useUpdateCropMutation,
  useDeleteCropMutation,
} = cropApiSlice;

// returns the query result object
export const selectCropsResult = cropApiSlice.endpoints.getCrops.select();



// creates memoized selector
const selectCropsData = createSelector(
  selectCropsResult,
  (cropResult) => cropResult.data // normalized state object with ids & entities
);



//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllCrops,
  selectById: selectCropById,
  selectIds: selectCropIds,
  // Pass in a selector that returns the users slice of state
} = cropsAdapter.getSelectors(
  (state) => selectCropsData(state) ?? initialState
);

