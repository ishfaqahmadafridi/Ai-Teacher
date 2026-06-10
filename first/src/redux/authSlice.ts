import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthState } from '../types/auth.types';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Async thunk using the Axios client (apiClient) which has the interceptors
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; token: string }, { rejectWithValue }) => {
    try {
      // Example call to endpoint (uncomment and modify as per real backend API)
      // const response = await apiClient.post('/auth/login', credentials);
      // return response.data;
      
      // Simulate successful API call for demonstration:
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        user: { id: '1', name: 'Demo Teacher', email: credentials.email },
        token: credentials.token,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Something went wrong';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
