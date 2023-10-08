import { compose, createStore, applyMiddleware } from 'redux';
// import logger from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { rootReducer } from './root-reducer';
import thunk from 'redux-thunk';
const loggerMiddleware = (store) => (next) => (action) => {
  if (!action.type) {
    return next(action);
  }

  console.log('type: ', action.type);
  console.log('payload: ', action.payload);
  console.log('currentState: ', store.getState());

  next(action);

  console.log('next state: ', store.getState());
};

const middleWares = [thunk, loggerMiddleware];

const composedEnhancers = compose(applyMiddleware(...middleWares));
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'],
}
export const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, undefined, composedEnhancers);
export const persistor = persistStore(store);