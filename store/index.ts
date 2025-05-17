import { commentsReducer } from "@/slices/comments.slice";
import { postsReducer } from "@/slices/posts.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["posts", "comments"],
};

const store = configureStore({
  reducer: {
    posts: persistReducer(persistConfig, postsReducer),
    comments: persistReducer(persistConfig, commentsReducer),
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
