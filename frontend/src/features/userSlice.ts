import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { fetchEmployeesApi } from '../services/api'; // Import the API call for fetching users

interface User {
  id: string;
  name: string;
  email: string;
  role: string; // Add more fields as needed
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// Initial state for the user slice
const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await fetchEmployeesApi();
      return users;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Slice definition
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export the fetchUsers async thunk
export const selectUserState = (state: RootState) => state.users;

export default userSlice.reducer;
