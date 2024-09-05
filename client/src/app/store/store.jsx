import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./postsSlice";
import userReducer from "./userSlice";
import commentsReducer from "./commentsSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    storage: storage
}

const userPersistor = persistReducer(persistConfig, userReducer);

export const store = configureStore({
    reducer: {
        postblog: postsReducer,
        user: userPersistor,
        comments: commentsReducer,
    },
});

export const persistor = persistStore(store);