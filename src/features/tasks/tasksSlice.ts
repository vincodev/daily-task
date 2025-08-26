import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface TasksState {
  items: TaskItem[];
}

const initialState: TasksState = {
  items: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<TaskItem[]>) {
      state.items = action.payload;
    },
    addTask: {
      reducer(state, action: PayloadAction<TaskItem>) {
        state.items.unshift(action.payload);
      },
      prepare(title: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            completed: false,
            createdAt: Date.now(),
          } as TaskItem,
        };
      },
    },
    toggleTask(state, action: PayloadAction<string>) {
      const task = state.items.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    removeTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
});

export const { setTasks, addTask, toggleTask, removeTask } = tasksSlice.actions;
export default tasksSlice.reducer;
