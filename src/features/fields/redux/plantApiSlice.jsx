import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../../app/api/apiSlice";

const plantsAdapter = createEntityAdapter({
  selectId: (plant) => plant.plant_id,
});

const initialState = plantsAdapter.getInitialState();

export const plantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlants: builder.query({
      query: () => "/plant",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      
      transformResponse: (responseData) => {
       const loadedPlants = responseData.map((plant) => {
          plant.id = plant.plant_id;
          return plant;
          
        });
        return plantsAdapter.setAll(initialState, loadedPlants.sort((a, b) => b.id - a.id));
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Plant", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Plant", id })),
          ];
        } else return [{ type: "Plant", id: "LIST" }];
      },
    }),
    addNewPlant: builder.mutation({
      query: (initialPlantData) => ({
        url: "/plant",
        method: "POST",
        body: {
          ...initialPlantData,
        },
      }),
      invalidatesTags: [{ type: "Plant", id: "LIST" }],
    }),
    updatePlant: builder.mutation({
      query: (initialPlantData) => ({
        url: "/plant",
        method: "PATCH",
        body: {
          ...initialPlantData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Plant", id: arg.id }],
    }),
    deletePlant: builder.mutation({
      query: ({ id }) => ({
        url: `/plant`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Plant", id: arg.id }],
    }),
  }),
});

export const {
  useGetPlantsQuery,
  useAddNewPlantMutation,
  useUpdatePlantMutation,
  useDeletePlantMutation
} = plantApiSlice;

// returns the query result object
export const selectPlantsResult = plantApiSlice.endpoints.getPlants.select();



// creates memoized selector
const selectPlantsData = createSelector(
  selectPlantsResult,
  (plantResult) => plantResult.data // normalized state object with ids & entities
);



//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllplants,
  selectById: selectplantById,
  selectIds: selectplantIds,
  // Pass in a selector that returns the plant slice of state
} = plantsAdapter.getSelectors(
  (state) => selectPlantsData(state) ?? initialState
);

