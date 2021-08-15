import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  editIndex: null,
  items: [
    // {
    //   id: 1,
    //   title: 'something that needs to be done',
    //   completed: false,
    // }
  ],
  lastId: 0,
  fetchItemsStatus: 'idle',
};

export const fetchInitialItems = createAsyncThunk(
  'todo/fetchInitialItems', 
  async () => {
    const items = await fetch('https://jsonplaceholder.typicode.com/todos')
      .then((res) => res.json())
      .then((result) => result.slice(0, 10))
    return items;
  }
);


export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push({
        id: ++state.lastId,
        title: action.payload,
        completed: false,
      });
    },
    editItem: (state, action) => {
      let item = state.items.find(({ id }) => id === action.payload.id);
      item.title = action.payload.text;
      state.editIndex = null;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(({ id }) => id !== action.payload);
    },
    removeCompletedItems: (state) => {
      state.items = state.items.filter(({ completed }) => !completed);
    },
    setEditIndex: (state, action) => {
      state.editIndex = action.payload;
    },
    toggleItemCompleted: (state, action) => {
      let item = state.items.find(({ id }) => id === action.payload);
      item.completed = !item.completed;
    },
  },
  extraReducers: {
    [fetchInitialItems.pending]: (state) => {
      state.fetchItemsStatus = 'loading';
    },
    [fetchInitialItems.fulfilled]: (state, action) => {
      state.fetchItemsStatus = 'succeeded';
      console.log(action);
      action.payload.map(({ title, completed }) => state.items.push({
        id: ++state.lastId,
        title,
        completed: !!completed
      }));
    },
    [fetchInitialItems.rejected]: (state, action) => {
      state.fetchItemsStatus = 'failed';
      state.error = action.error.message;
      console.log(state.error);
    }
  }
});

export const {
  addItem, editItem, removeItem,
  removeCompletedItems, setEditIndex, toggleItemCompleted
} = todoSlice.actions;

export const selectEditIndex = (state) => state.todo.editIndex;

export const selectItems = (state) => state.todo.items || [];

export default todoSlice.reducer;