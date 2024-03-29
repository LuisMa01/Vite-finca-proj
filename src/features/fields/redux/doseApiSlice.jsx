import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../../app/api/apiSlice";

const dosesAdapter = createEntityAdapter({
  selectId: (dose) => dose.dose_id,
});

const initialState = dosesAdapter.getInitialState();

export const doseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDoses: builder.query({
      query: () => ({
        url: "/dose",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),

      transformResponse: (responseData) => {
        const loadedDoses = responseData.map((dose) => {
          dose.id = dose.dose_id;
          return dose;
        });
        return dosesAdapter.setAll(
          initialState,
          loadedDoses.sort((a, b) => b.id - a.id)
        );
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Dose", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Dose", id })),
          ];
        } else return [{ type: "Dose", id: "LIST" }];
      },
    }),
    addNewDose: builder.mutation({
      query: (initialDoseData) => ({
        url: "/dose",
        method: "POST",
        body: {
          ...initialDoseData,
        },
      }),
      invalidatesTags: [{ type: "Dose", id: "LIST" }],
    }),
    updateDose: builder.mutation({
      query: (initialDoseData) => ({
        url: "/dose",
        method: "PATCH",
        body: {
          ...initialDoseData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Dose", id: arg.id }],
    }),
    deleteDose: builder.mutation({
      query: ({ id }) => ({
        url: `/dose`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Dose", id: arg.id }],
    }),
  }),
});

export const {
  useGetDosesQuery,
  useAddNewDoseMutation,
  useUpdateDoseMutation,
  useDeleteDoseMutation,
} = doseApiSlice;

export const selectDosesResult = doseApiSlice.endpoints.getDoses.select();

const selectDosesData = createSelector(
  selectDosesResult,
  (doseResult) => doseResult.data
);

export const {
  selectAll: selectAllDoses,
  selectById: selectDoseById,
  selectIds: selectDoseIds,
} = dosesAdapter.getSelectors(
  (state) => selectDosesData(state) ?? initialState
);
