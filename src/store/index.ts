import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import projectsReducer from './projectsSlice';
import quotationsReducer from './quotationsSlice';
import calloutsReducer from './calloutsSlice';

const rootReducer = combineReducers({
  projects: projectsReducer,
  quotations: quotationsReducer,
  callouts: calloutsReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['projects', 'quotations', 'callouts']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;