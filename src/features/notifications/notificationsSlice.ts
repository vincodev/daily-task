import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

export interface AppNotification {
  id: string;
  title: string;
  body?: string;
  createdAt: number;
  read: boolean;
  tag?: string; // used to avoid duplicates per day
}

export interface NotificationsState {
  items: AppNotification[];
}

const initialState: NotificationsState = {
  items: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<AppNotification[]>) {
      state.items = action.payload;
    },
    addNotification: {
      reducer(state, action: PayloadAction<AppNotification>) {
        state.items.unshift(action.payload);
      },
      prepare(title: string, body?: string, tag?: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            body,
            createdAt: Date.now(),
            read: false,
            tag,
          } as AppNotification,
        };
      },
    },
    markAllRead(state) {
      state.items.forEach((n) => (n.read = true));
    },
    markRead(state, action: PayloadAction<string>) {
      const found = state.items.find((n) => n.id === action.payload);
      if (found) found.read = true;
    },
    clearNotifications(state) {
      state.items = [];
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAllRead,
  markRead,
  clearNotifications,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
