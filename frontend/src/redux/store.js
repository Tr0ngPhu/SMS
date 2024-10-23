import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import classReducer from "./classSlice";
import studentReducer from "./studentSlice";
import scoreReducer from "./scoreSlice"
import subjectReducer from "./subjectSlice"
import semesterReducer from "./semesterSlice"
import facultyReducer from "./facultySlice"
import majorReducer from "./majorSlice"
import curriculumReducer from "./curriculumSlice"
import courseReducer from "./courseSlice"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  classes: classReducer,
  students: studentReducer,
  scores: scoreReducer,
  subjects: subjectReducer,
  semesters: semesterReducer,
  faculties: facultyReducer,
  majors: majorReducer,
  curriculums: curriculumReducer,
  courses: courseReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
