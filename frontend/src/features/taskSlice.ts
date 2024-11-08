import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { fetchTasksApi, addTaskApi, updateTaskApi, deleteTaskApi } from '../services/api';
import { ITaskItem } from '../types';

interface TaskState {
  tasks: ITaskItem[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Async thunk for fetching tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await fetchTasksApi();
      return tasks;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

// Async thunk for adding a task
export const addNewTask = createAsyncThunk(
  'tasks/addNewTask',
  async (newTask: ITaskItem, { rejectWithValue }) => {
    try {
      const task = await addTaskApi(newTask);
      return task;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add task');
    }
  }
);

// Async thunk for updating a task
export const updateExistingTask = createAsyncThunk(
  'tasks/updateExistingTask',
  async (updatedTask: ITaskItem, { rejectWithValue }) => {
    try {
      const task = await updateTaskApi(updatedTask);
      return task;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update task');
    }
  }
);

// Async thunk for deleting a task
export const deleteExistingTask = createAsyncThunk(
  'tasks/deleteExistingTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      await deleteTaskApi(taskId);
      return taskId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
    }
  }
);

// Slice definition
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<ITaskItem[]>) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<ITaskItem[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addNewTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewTask.fulfilled, (state, action: PayloadAction<ITaskItem>) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(addNewTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateExistingTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingTask.fulfilled, (state, action: PayloadAction<ITaskItem>) => {
        state.loading = false;
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index >= 0) state.tasks[index] = action.payload;
      })
      .addCase(updateExistingTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteExistingTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteExistingTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTasks } = taskSlice.actions;
export const selectTasksState = (state: RootState) => state.tasks;

export default taskSlice.reducer;
