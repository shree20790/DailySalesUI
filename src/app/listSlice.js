import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchData = createAsyncThunk("list/fetchData", async () => {
  const response = await new Promise((resolve) =>
    setTimeout(() => resolve(["Item 1", "Item 2", "Item 3"]), 2000)
  );
  return response;
});

const listSlice = createSlice({
  name: "list",
  initialState: {
    data: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      });
  },
});

export default listSlice.reducer;
